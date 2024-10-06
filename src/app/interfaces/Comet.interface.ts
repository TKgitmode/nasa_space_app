import * as THREE from 'three';

export interface Comet {
  object: THREE.Object3D;
  orbit: THREE.Line;
  curve: THREE.EllipseCurve;
  period: number;
  name: string;
  initialT: number;
  nameLabel: THREE.Sprite;
}
