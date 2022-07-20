import './styles/main.css';
import GUI from 'lil-gui';
import * as THREE from 'three';
import { createFontMesh } from './createFontMesh';
import { Scene } from './Scene';

const textureLoader = new THREE.TextureLoader();
const matcaps = {
  Clay: textureLoader.load('/textures/matcaps/1.png'),
  'Rough Metal': textureLoader.load('/textures/matcaps/2.png'),
  'Shiny Metal': textureLoader.load('/textures/matcaps/3.png'),
  'Rough Copper': textureLoader.load('/textures/matcaps/4.png'),
  'Shiny Copper': textureLoader.load('/textures/matcaps/5.png'),
  Taffy: textureLoader.load('/textures/matcaps/6.png'),
  Slime: textureLoader.load('/textures/matcaps/7.png'),
  Chromatic: textureLoader.load('/textures/matcaps/8.png'),
};

// Set up canvas
const $canvas = document.createElement('canvas') as HTMLCanvasElement;
$canvas.setAttribute('class', 'webgl');
document.body.appendChild($canvas);

// Double click to fullscreen
window.addEventListener('dblclick', () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
});

// Create Floating Text
const createText = async (
  text: string,
  material: THREE.MeshMatcapMaterial,
): Promise<THREE.Mesh> => {
  const font = await createFontMesh(
    text,
    '/fonts/helvetiker_regular.typeface.json',
    material,
  );
  return font;
};

const createShapes = (
  count: number,
  spawnRadius: number,
  material: THREE.MeshMatcapMaterial,
): THREE.Group => {
  const spawnDiameter = spawnRadius * 2;
  const geometry = new THREE.TorusGeometry(0.5, 0.2, 64, 128);

  const group = new THREE.Group();

  for (let i = 0; i < count; i++) {
    const scale = Math.random();
    const offsetx = Math.random() * spawnDiameter;
    const offsety = Math.random() * spawnDiameter;
    const offsetz = Math.random() * spawnDiameter;
    const torus = new THREE.Mesh(geometry, material);
    torus.scale.set(scale, scale, scale);
    torus.position.x = offsetx - spawnRadius;
    torus.position.y = offsety - spawnRadius;
    torus.position.z = offsetz - spawnRadius;
    torus.rotateX(Math.random() * Math.PI);
    torus.rotateY(Math.random() * Math.PI);
    torus.rotateZ(Math.random() * Math.PI);
    group.add(torus);
  }

  return group;
};

const main = async () => {
  const scene = new Scene($canvas);
  const state = {
    rotation: 16,
    count: 50,
    radius: 10,
    spin: true,
    text: 'Hello World!',
  };

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  const pointLight = new THREE.PointLight(0xffffff, 0.5);
  pointLight.position.x = 2;
  pointLight.position.y = 3;
  pointLight.position.z = 4;

  // Text
  const fontMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcaps.Clay,
    transparent: true,
  });
  let font = await createText(state.text, fontMaterial);
  const guiFont = scene.gui.addFolder('Text Object');
  const guiFontMaterial = guiFont.addFolder('Font Material');
  const guiFontText = guiFont.addFolder('Font Text');

  const updateText = async () => {
    scene.remove(font);
    font = await createText(state.text, fontMaterial);
    scene.add(font);
  };

  guiFontMaterial.add(fontMaterial, 'opacity', 0, 1, 0.01);
  guiFontMaterial.add(fontMaterial, 'matcap', matcaps);
  guiFontMaterial.add(fontMaterial, 'visible');
  guiFontText.add(state, 'text');
  guiFont.add({ 'Update Text': updateText }, 'Update Text');

  // Objects
  const objectMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcaps.Slime,
    transparent: true,
  });
  let donuts = createShapes(state.count, state.radius, objectMaterial);
  const guiDonuts = scene.gui.addFolder('Donuts');
  const guiDonutsMaterial = guiDonuts.addFolder('Donuts Material');
  guiDonutsMaterial.add(objectMaterial, 'opacity', 0, 1, 0.01);
  guiDonutsMaterial.add(objectMaterial, 'matcap', matcaps);
  guiDonutsMaterial.add(objectMaterial, 'visible');
  const updateObjects = () => {
    scene.remove(donuts);
    donuts = createShapes(state.count, state.radius, objectMaterial);
    scene.add(donuts);
  };

  scene.add(font);
  scene.add(donuts);
  scene.add(ambientLight, pointLight);

  const guiDonutsMovement = guiDonuts.addFolder('Donuts Movement');
  guiDonutsMovement.add(state, 'rotation', -16, 16, 0.5);
  guiDonutsMovement.add(state, 'count', 1, 50000, 1);
  guiDonutsMovement.add(state, 'radius', 0.5, 250, 0.5);
  guiDonutsMovement.add(state, 'spin');
  guiDonuts.add({ 'Update Donuts': updateObjects }, 'Update Donuts');

  scene.loop((clock: THREE.Clock) => {
    if (state.spin) {
      const t = clock.getElapsedTime();
      donuts.rotation.y = t / state.rotation;
    }
  });
};

main();
