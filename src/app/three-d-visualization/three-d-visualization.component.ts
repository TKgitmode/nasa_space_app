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
    // Ajustar `lastTime` para el cálculo correcto del tiempo pausado
    this.lastTime = Date.now();
  }

  createScene(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 50;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
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

    // Definir una lista con los nombres de archivos GLB
    const asteroidFiles = ['assets/asteroid1.glb', 'assets/asteroid2.glb', 'assets/asteroid3.glb', 'assets/asteroid4.glb'];

    // Seleccionar un archivo aleatorio
    const randomAsteroidFile = asteroidFiles[Math.floor(Math.random() * asteroidFiles.length)];

    // Cargar el archivo GLB seleccionado aleatoriamente
    loader.load(randomAsteroidFile, (gltf) => {
      this.asteroidModel = gltf.scene;
      this.asteroidModel.scale.set(1, 1, 1);
      this.updateComets(); // Actualizar los cometas con el nuevo modelo
    }, undefined, (error) => {
      console.error('Error loading asteroid model:', error);
    });
  }

  updateComets(): void {
    // Eliminar cometas existentes
    this.comets.forEach(comet => {
      this.scene.remove(comet.object);
      this.scene.remove(comet.orbit);
    });
    this.comets = [];

    // Crear nuevos cometas basados en los datos
    this.data.forEach((cometData, index) => this.createComet(cometData, index));
  }

  createComet(cometData: NasaObject, index: number): void {
    const e = parseFloat(cometData.e);
    const a = parseFloat(cometData.q_au_1) / (1 - e); // Calculamos el semi-eje mayor
    const incl = THREE.MathUtils.degToRad(parseFloat(cometData.i_deg));
    const node = THREE.MathUtils.degToRad(parseFloat(cometData.node_deg));
    const period = parseFloat(cometData.p_yr);

    // Crear la curva orbital del cometa (elipse)
    const curve = new THREE.EllipseCurve(
      0, 0, // Centro
      a, a * Math.sqrt(1 - e * e), // Radios de la elipse
      0, 2 * Math.PI, // Rango de ángulos
      false, 0
    );

    // Crear la geometría de la órbita
    const points = curve.getPoints(100);
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true });
    const orbit = new THREE.Line(orbitGeometry, orbitMaterial);

    // Aplicar rotación de la órbita
    orbit.rotation.x = incl;
    orbit.rotation.z = node;

    // Crear el modelo 3D del cometa clonando el asteroide cargado
    const cometObject = this.asteroidModel.clone();
    cometObject.scale.multiplyScalar(0.05 + Math.random() * 0.05);

    // Posición inicial aleatoria a lo largo de la curva
    const initialT = Math.random();
    const position = curve.getPoint(initialT);
    cometObject.position.set(position.x, position.y, 0);

    // Aplicar la rotación de la órbita al objeto
    cometObject.position.applyEuler(orbit.rotation);

    // Asignar una rotación inicial aleatoria en su propio eje
    cometObject.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

    // Añadir la órbita y el cometa a la escena
    this.scene.add(orbit);
    this.scene.add(cometObject);

    // Guardar los datos del cometa
    this.comets.push({
      object: cometObject,
      orbit: orbit,
      curve: curve,
      period: period,
      name: cometData.object
    });
  }


  animate(): void {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    const currentTime = Date.now();

    // Actualizar el tiempo solo si la animación está en estado de "play"
    if (this.animationStatus === 'play') {
      this.elapsedTime += (currentTime - this.lastTime) * 0.00001; // Incrementar el tiempo acumulado
    }

    this.lastTime = currentTime; // Actualizar `lastTime` a cada frame

    if (this.earth) {
      // Acelerar la rotación de la tierra con animationSpeed
      this.earth.rotation.y += 0.001 * this.animationSpeed;
    }

    this.comets.forEach((comet) => {
      // Usar `elapsedTime` en lugar de `Date.now()` para el cálculo del tiempo de traslación
      const t = (this.elapsedTime / comet.period) % 1;

      // Obtener la nueva posición del cometa a lo largo de la curva
      const position = comet.curve.getPoint(t);

      // Aplicar la nueva posición
      comet.object.position.set(position.x, position.y, 0);
      comet.object.position.applyEuler(comet.orbit.rotation);

      // Ajustar la rotación del cometa con base en la velocidad de animación
      comet.object.rotation.y += 0.01 * this.animationSpeed;
    });

    // Renderizar la escena con las nuevas posiciones
    this.renderer.render(this.scene, this.camera);
  }


  onClick(event: MouseEvent): void {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      const cometIndex = this.comets.findIndex(comet =>
        comet.object === clickedObject || this.isDescendant(clickedObject, comet.object)
      );

      if (cometIndex !== -1) {
        this.showInfo = true;
        this.info = `Objeto: ${this.comets[cometIndex].name}`;
      }
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
