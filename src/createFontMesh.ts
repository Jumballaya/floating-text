import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import * as THREE from 'three';

const fontLoader = new FontLoader();

export const createFontMesh = (
  text: string,
  fontPath: string,
  material: THREE.Material,
): Promise<THREE.Mesh> =>
  new Promise((res, rej) => {
    fontLoader.load(fontPath, (font) => {
      const geometry = new TextGeometry(text, {
        font,
        size: 0.5,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
      });
      geometry.center();
      res(new THREE.Mesh(geometry, material));
    });
  });
