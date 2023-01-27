import * as THREE from 'three';
// import threeOrbitControls from 'three-orbit-controls';
import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vertex.glsl';
import t from './img/poetry.jpg';
import dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
  SVGRenderer,
  SVGObject,
} from 'three/examples/jsm/renderers/SVGRenderer';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Text } from 'troika-three-text';

export default class Sketch {
  constructor() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    //// --> 3. important element - scene
    this.scene = new THREE.Scene();
    //// --> 1. important element - renderer
    // -- default renderer - SVG
    // this.renderer = new SVGRenderer();
    // this.renderer.setQuality('low');
    // -- webGL renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xeeeee, 0);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    // insert renderer to DOM
    this.container = document.getElementById('container');
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.container.appendChild(this.renderer.domElement);

    //// --> 2. Important element - camera
    // const fov = 75;
    // const aspect = this.width / this.eight; // the canvas default
    // const near = 0.1;
    // const far = 5;
    // this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    // orthographic camera
    this.frustumSize = 1;
    this.aspect = window.offsetWidth / window.offsetHeight;
    this.camera = new THREE.OrthographicCamera(
      this.frustumSize / -2,
      this.frustumSize / 2,
      this.frustumSize / 2,
      this.frustumSize / -2,
      -1000,
      1000,
    );

    this.camera.position.set(0, 0, 2);

    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // background
    // slateblue
    this.scene.background = new THREE.Color(0x9966ff);

    // add light
    this.light = new THREE.PointLight();
    this.light.position.set(5, 5, 5);

    this.paused = false;
    this.time = 0;

    //---------------------------------------------------
    // method goes here
    this.settings();
    this.addObject();
    this.resize();
    this.render();
    this.setupResize();
  }

  settings() {
    // let that = this;
    this.settings = {
      progress: 0,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, 'progress', 0, 1, 0.01);
  }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    this.material.uniforms.resolution.value.x = this.width;
    this.material.uniforms.resolution.value.y = this.height;
    this.material.uniforms.resolution.value.z = 1;
    this.material.uniforms.resolution.value.w = 1;

    this.camera.updateProjectionMatrix();
  }

  addObject() {
    // add texture -- get rid of the border around the image
    let tt = new THREE.TextureLoader().load(t);
    tt.magFilter = THREE.NearestFilter;
    tt.minFilter = THREE.NearestFilter;
    // ------------------------------------------

    // load font -- three font
    const ttfLoader = new TTFLoader();

    ttfLoader.load(
      'three/examples/fonts/helvetiker_regular.typeface.json ',
      (json) => {
        const font = new FontLoader(json);

        this.textGeo = new TextGeometry('yeah', {
          font: font,
          size: 200,
          height: 50,
          curveSegments: 12,
        });

        this.textMaterial = new THREE.MeshPhongMaterial({
          color: 0xff0000,
          side: THREE.DoubleSide,
        });

        this.textMesh = new THREE.Mesh(this.textGeo, this.textMaterial);
        this.textMesh.position.set(0, 0, 0);
      },
    );

    // load font -- three font

    //// material
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable',
      },

      uniforms: {
        time: { type: 'f', value: 0 },
        texture1: { type: 't', value: tt },
        resolution: { type: 'v4', value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1),
        },
        progress: { type: 'f', value: 0 },
      },

      vertexShader: vertex,
      fragmentShader: fragment,
      side: THREE.DoubleSide,
    });
    ////--------------------------------------

    //// geometry
    this.geometry1 = new THREE.PlaneGeometry(
      1, // width along the X axis -- default = 1
      1, // height along the Y axis -- default = 1
      1, // widthSegments (optional) -- default = 1
      // heightSegments (optional) -- default = 1
    );
    ////--------------------------------------

    this.plane = new THREE.Mesh(this.geometry1, this.material);
    // this.plane.position.x = 0.5;
    this.scene.add(this.plane, this.light);
    this.scene.add(this.textMesh);
  }

  // tabEvents() {
  //   document.addEventListener('visibilitychange', () => {
  //     if (document.hidden) {
  //       this.stop();
  //     } else {
  //       this.play();
  //     }
  //   });
  // }

  stop() {
    this.paused = false;
  }

  play() {
    this.paused = true;
  }

  // animation goes here
  render() {
    if (this.paused) return;
    // this.time += 0.05;
    // this.mesh.rotation.x += 0.01;
    // this.mesh.rotation.y += 0.02;
    // this.mesh.rotation.z += (Math.sin(0.5)*00)*0.01;
    // Update the rendering:
    this.material.uniforms.time.value = this.time;
    this.material.uniforms.progress.value = this.settings.progress;
    window.requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}
