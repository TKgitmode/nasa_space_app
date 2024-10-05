// Importar dependencias
import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

@Component({
  selector: 'app-three-d-visualization',
  templateUrl: './three-d-visualization.component.html',
  styleUrls: ['./three-d-visualization.component.css']
})
export class ThreeDVisualizationComponent implements OnInit {
  
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private comet!: THREE.Mesh;
  
  constructor() { }

  ngOnInit(): void {
    this.createScene();
  }

  createScene(): void {
    // Parámetros del cometa
    const e = 0.682526943; // Excentricidad
    const a = (0.986192006 + 5.23) / 2; // Semi-eje mayor (promedio de perihelio y afelio)
    const inclination = THREE.MathUtils.degToRad(4.894555854); // Inclinación en radianes
    const longNode = THREE.MathUtils.degToRad(295.9854497); // Longitud del nodo ascendente

    // Crear la escena
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Renderizador
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // Añadir una luz ambiental
    const ambientLight = new THREE.AmbientLight(0x404040, 2); // Luz blanca suave
    this.scene.add(ambientLight);

    // Cargar el modelo de la Tierra
    const loader = new GLTFLoader();
    loader.load('assets/earth.glb', (gltf) => {
      const earth = gltf.scene;
      earth.scale.set(1, 1, 1); // Ajustar el tamaño si es necesario
      this.scene.add(earth);

      // Configurar la posición de la cámara
      this.camera.position.z = 10;

      // Iniciar la animación una vez cargado el modelo
      this.animate();
    }, undefined, (error) => {
      console.error(error);
    });

    // Control de órbita
    const controls = new OrbitControls(this.camera, this.renderer.domElement);

    // Crear la órbita elíptica del cometa
    const curve = new THREE.EllipseCurve(
      0, 0,            // Centro de la órbita (la Tierra)
      a * (1 - e),      // Semi-eje mayor multiplicado por (1 - excentricidad)
      a,                // Semi-eje menor
      0, 2 * Math.PI,   // Ángulo de inicio y fin
      false,            // No sentido contrario
      0                 // Rotación
    );

    const points = curve.getPoints(100); // Obtener puntos de la curva para la órbita
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);

    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const orbit = new THREE.Line(orbitGeometry, orbitMaterial);

    // Aplicar transformaciones a la órbita
    orbit.rotation.x = inclination;  // Inclinar la órbita
    orbit.rotation.z = longNode;     // Rotar para nodo ascendente
    this.scene.add(orbit);

    // Crear el cometa (como una pequeña esfera)
    const cometGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const cometMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Rojo para el cometa
    this.comet = new THREE.Mesh(cometGeometry, cometMaterial);
    this.scene.add(this.comet);
  }

  animate(): void {
    requestAnimationFrame(() => this.animate());

    // Mover el cometa a lo largo de la curva
    const t = (performance.now() * 0.001) % (Math.PI * 2); // Normalizar el tiempo
    const cometPos = new THREE.EllipseCurve(
      0, 0, 
      0.986192006 * (1 - 0.682526943), 
      0.986192006, 
      0, 2 * Math.PI, 
      false, 
      0
    ).getPoint(t);
    this.comet.position.set(cometPos.x, cometPos.y, 0);

    this.renderer.render(this.scene, this.camera);
  }
}
