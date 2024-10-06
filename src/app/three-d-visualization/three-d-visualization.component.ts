import { Component, OnInit, Input, SimpleChanges, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { HttpClient } from '@angular/common/http';
import { Comet } from '../interfaces/Comet.interface';
import { NasaObject } from '../interfaces/NasaObject.interface';

@Component({
  selector: 'app-three-d-visualization',
  templateUrl: './three-d-visualization.component.html',
  styleUrls: ['./three-d-visualization.component.css']
})
export class ThreeDVisualizationComponent implements OnInit, OnDestroy {
  @Input() data: NasaObject[] = [];
  @Input() animationStatus: string = 'play';

  animationSpeed: number = this.animationStatus == 'play' ? 1 : 0;

  private elapsedTime: number = 0;
  private lastTime: number = 0;

  public displayDialog: boolean = false;
  public selectedCometName: string = '';
  public selectedCometDetails: {
    speed: string;
    period: string;
    eccentricity: string;
    inclination: string;
  } = {
    speed: '',
    period: '',
    eccentricity: '',
    inclination: ''
  };


  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private earth!: THREE.Object3D;
  private comets: Comet[] = [];
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  public showInfo: boolean = false;
  public info: string = '';
  private asteroidModel!: THREE.Object3D;
  private animationFrameId: number | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.createScene();
    this.loadAsteroidModel();

    this.lastTime = Date.now();
    this.animate();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && !changes['data'].firstChange && this.asteroidModel) {
      this.updateComets();
    }
    if (changes['animationStatus']) {
      this.updateAnimationSpeed();
    }
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    // Limpiar la escena y liberar recursos
    this.scene.clear();
    this.renderer.dispose();
  }

  updateAnimationSpeed(): void {
    this.animationSpeed = this.animationStatus === 'play' ? 1 : 0;
    this.lastTime = Date.now();
  }

  createScene(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 50;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x5336d1);
    document.body.appendChild(this.renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040, 3);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5).normalize();
    this.scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load('assets/earth.glb', (gltf) => {
      this.earth = gltf.scene;
      this.earth.scale.set(0.05, 0.05, 0.05);
      this.scene.add(this.earth);
    }, undefined, (error) => {
      console.error(error);
    });

    new OrbitControls(this.camera, this.renderer.domElement);

    window.addEventListener('click', (event) => this.onClick(event));
  }

  loadAsteroidModel(): void {
    const loader = new GLTFLoader();

    const asteroidFiles = ['assets/asteroid1.glb', 'assets/asteroid2.glb', 'assets/asteroid3.glb', 'assets/asteroid4.glb'];

    const randomAsteroidFile = asteroidFiles[Math.floor(Math.random() * asteroidFiles.length)];

    loader.load(randomAsteroidFile, (gltf) => {
      this.asteroidModel = gltf.scene;
      this.asteroidModel.scale.set(1, 1, 1);
      this.updateComets(); // Actualizar los cometas con el nuevo modelo
    }, undefined, (error) => {
      console.error('Error loading asteroid model:', error);
    });
  }

  updateComets(): void {
    this.comets.forEach(comet => {
      this.scene.remove(comet.object);
      this.scene.remove(comet.orbit);
    });
    this.comets = [];

    this.data.forEach((cometData, index) => this.createComet(cometData, index));
  }

  createComet(cometData: NasaObject, index: number): void {
    const e = parseFloat(cometData.e);
    const a = parseFloat(cometData.q_au_1) / (1 - e);
    const incl = THREE.MathUtils.degToRad(parseFloat(cometData.i_deg));
    const node = THREE.MathUtils.degToRad(parseFloat(cometData.node_deg));
    const period = parseFloat(cometData.p_yr);

    const curve = new THREE.EllipseCurve(
      0, 0, // Centro
      a, a * Math.sqrt(1 - e * e),
      0, 2 * Math.PI,
      false, 0
    );

    const points = curve.getPoints(100);
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true });
    const orbit = new THREE.Line(orbitGeometry, orbitMaterial);

    orbit.rotation.x = incl;
    orbit.rotation.z = node;

    const cometObject = this.asteroidModel.clone();
    cometObject.scale.multiplyScalar(0.01 + Math.random() * 0.01);

    const totalComets = this.data.length;
    const basePosition = index / totalComets;
    const randomOffset = Math.random();
    const initialT = (basePosition + randomOffset) % 1;
    const position = curve.getPoint(initialT);
    cometObject.position.set(position.x, position.y, 0);

    cometObject.position.applyEuler(orbit.rotation);

    cometObject.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

    this.scene.add(orbit);
    this.scene.add(cometObject);

    this.comets.push({
      object: cometObject,
      orbit: orbit,
      curve: curve,
      period: period,
      name: cometData.object,
      initialT: initialT
    });
  }

  animate(): void {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    const currentTime = Date.now();

    if (this.animationStatus === 'play') {
      this.elapsedTime += (currentTime - this.lastTime) * 0.00001;
    }

    this.lastTime = currentTime;

    if (this.earth) {
      this.earth.rotation.y += 0.001 * this.animationSpeed;
    }

    this.comets.forEach((comet) => {
      const t = (this.elapsedTime / comet.period + comet.initialT) % 1;
      const position = comet.curve.getPoint(t);

      comet.object.position.set(position.x, position.y, 0);
      comet.object.position.applyEuler(comet.orbit.rotation);

      comet.object.rotation.y += 0.01 * this.animationSpeed;
    });

    this.renderer.render(this.scene, this.camera);
  }


  onClick(event: MouseEvent): void {
    const rect = this.renderer.domElement.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.mouse.x = (x / rect.width) * 2 - 1;
    this.mouse.y = - (y / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const cometObjects = this.comets.map(comet => comet.object);

    const intersects = this.raycaster.intersectObjects(cometObjects, true);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      const clickedComet = this.comets.find(comet =>
        comet.object === clickedObject || this.isDescendant(clickedObject, comet.object)
      );

      if (clickedComet) {
        this.selectedCometName = clickedComet.name;

        const cometData = this.data.find(data => data.object === clickedComet.name);
        if (cometData) {
          this.selectedCometDetails.speed = cometData.e;
          this.selectedCometDetails.period = cometData.p_yr;
          this.selectedCometDetails.eccentricity = cometData.e;
          this.selectedCometDetails.inclination = cometData.i_deg;
        }

        this.displayDialog = true;
      }
    } else {
      console.log('No se detectó clic en ningún cometa');
    }
  }

  isDescendant(child: THREE.Object3D, parent: THREE.Object3D): boolean {
    let current: THREE.Object3D | null = child;
    while (current) {
      if (current === parent) {
        return true;
      }
      current = current.parent;
    }
    return false;
  }
}
