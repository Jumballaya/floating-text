import GUI from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class Scene {
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private controls: OrbitControls;
  private clock = new THREE.Clock();
  public gui = new GUI();

  private sizes = { width: window.innerWidth, height: window.innerHeight };

  constructor(private $canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene();
    const fov = 75;
    const aspect = this.sizes.width / this.sizes.height;
    this.camera = new THREE.PerspectiveCamera(fov, aspect);
    this.scene.add(this.camera);
    this.camera.position.z = 3;
    this.renderer = new THREE.WebGLRenderer({ canvas: this.$canvas });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.controls = new OrbitControls(this.camera, this.$canvas);
    this.controls.enableDamping = true;

    const guiControls = this.gui.addFolder('Controls');
    guiControls.add(this.controls, 'enableDamping');
    guiControls.add(this.controls, 'enabled');
    guiControls.add(
      { 'Go Fullscreen': this.goFullscreen.bind(this) },
      'Go Fullscreen',
    );

    window.addEventListener('resize', () => {
      this.sizes.width = window.innerWidth;
      this.sizes.height = window.innerHeight;

      this.camera.aspect = this.sizes.width / this.sizes.height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(this.sizes.width, this.sizes.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }

  public update() {
    this.controls.update();
  }

  public loop(update: (clock: THREE.Clock) => void) {
    update(this.clock);
    this.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.loop(update));
  }

  public add(...objects: THREE.Object3D<THREE.Event>[]) {
    this.scene.add(...objects);
  }

  public remove(...objects: THREE.Object3D<THREE.Event>[]) {
    this.scene.remove(...objects);
  }

  public goFullscreen() {
    if (!document.fullscreenElement) {
      this.$canvas.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
}
