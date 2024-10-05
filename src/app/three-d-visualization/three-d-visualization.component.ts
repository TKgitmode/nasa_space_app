import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { HttpClient } from '@angular/common/http';

interface Comet {
  object: THREE.Mesh;
  orbit: THREE.Line;
  curve: THREE.EllipseCurve;
  period: number;
}

@Component({
  selector: 'app-three-d-visualization',
  templateUrl: './three-d-visualization.component.html',
  styleUrls: ['./three-d-visualization.component.css']
})
export class ThreeDVisualizationComponent implements OnInit {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private earth!: THREE.Object3D;
  private comets: Comet[] = [];
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  public showInfo: boolean = false; // Controlar la visibilidad de la tabla
  public info: string = ''; // Almacenar la información

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.createScene();
    this.loadCometsData();
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
      this.earth.scale.set(0.1, 0.1, 0.1);
      this.scene.add(this.earth);
    }, undefined, (error) => {
      console.error(error);
    });

    new OrbitControls(this.camera, this.renderer.domElement);

    window.addEventListener('click', (event) => this.onClick(event));
  }

  loadCometsData(): void {
    this.http.get<any[]>('https://data.nasa.gov/resource/b67r-rgxc.json').subscribe(
      (data) => {
        data.forEach((cometData, index) => this.createComet(cometData, index));
        this.animate();
      },
      (error) => console.error('Error fetching comet data:', error)
    );
  }

  createComet(cometData: any, index: number): void {
    const e = parseFloat(cometData.e) || 0.5; // Excentricidad
    const a = parseFloat(cometData.a) || 2; // Semi-eje mayor
    const incl = THREE.MathUtils.degToRad(parseFloat(cometData.i) || 0); // Inclinación
    const node = THREE.MathUtils.degToRad(parseFloat(cometData.node) || 0); // Longitud del nodo ascendente
    const period = parseFloat(cometData.period) || 1; // Período orbital

    const curve = new THREE.EllipseCurve(
      0, 0,
      a * (1 - e), a,
      0, 2 * Math.PI,
      false,
      0
    );

    const points = curve.getPoints(100);
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true });
    const orbit = new THREE.Line(orbitGeometry, orbitMaterial);

    orbit.rotation.x = incl;
    orbit.rotation.z = node;

    const cometGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const cometMaterial = new THREE.MeshPhongMaterial({ color: this.getRandomColor() });
    const cometObject = new THREE.Mesh(cometGeometry, cometMaterial);

    this.scene.add(orbit);
    this.scene.add(cometObject);

    this.comets.push({ object: cometObject, orbit: orbit, curve: curve, period: period });
  }

  getRandomColor(): number {
    return Math.random() * 0xffffff;
  }

  animate(): void {
    requestAnimationFrame(() => this.animate());

    if (this.earth) {
      this.earth.rotation.y += 0.01;
    }

    const time = Date.now() * 0.001;
    this.comets.forEach((comet, index) => {
      const t = (time / comet.period) % 1;
      const position = comet.curve.getPoint(t);
      comet.object.position.set(position.x, position.y, 0);
      comet.object.position.applyEuler(comet.orbit.rotation);
    });

    this.renderer.render(this.scene, this.camera);
  }

  onClick(event: MouseEvent): void {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.comets.map(c => c.object));

    if (intersects.length > 0) {
      const index = this.comets.findIndex(c => c.object === intersects[0].object);
      alert(`Cometa clickeado: ${index}`);
    }
  }
}