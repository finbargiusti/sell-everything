import './style.scss';

import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

import interact from 'interactjs';

const renderers: { composer?: any; renderer?: any; pixelpass?: any } = {};

const canvas = document.getElementById('object') as HTMLCanvasElement;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  70,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  2000
);

let object_group: THREE.Group;

const slowDown = 0.0003;
const baseSpeed = 0.01;

let speed = 0.1;

const init = async () => {
  const objloader = new GLTFLoader();

  const ambientlight = new THREE.AmbientLight(0x77b2db, 4);

  const sunLight = new THREE.PointLight(0xffffff, 10);
  sunLight.position.set(30, 30, 30);

  scene.add(sunLight);

  scene.add(ambientlight);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    logarithmicDepthBuffer: true,
    antialias: true,
    alpha: true,
  });

  renderer.setPixelRatio(window.devicePixelRatio);

  const renderpass = new RenderPass(scene, camera);
  const composer = new EffectComposer(renderer);

  composer.addPass(renderpass);

  renderers.composer = composer;
  renderers.renderer = renderer;

  camera.position.x = 1;
  camera.position.y = 0;

  camera.lookAt(0, 0, 0);

  const objects = [
    '/media/headscan-crop.glb'
  ];

  return new Promise<void>((resolve) => {
    objloader.load(
      objects[0],
      (site) => {
        object_group = site.scene;
        scene.add(object_group);
        setInterval(() => {
          requestAnimationFrame(() => {
            if (speed > baseSpeed)
              speed = Math.max(baseSpeed, speed - slowDown);
            if (speed < baseSpeed)
              speed = Math.min(baseSpeed, speed + slowDown);
            object_group.rotateY(speed);
            renderers.composer.render();
          });
        }, 1000 / 30);
        resolve();
      },
      undefined,
      (err) => {
        console.error(err);
        return;
      }
    );
  });
};

init().then(() => {
  canvas.classList.remove('unloaded');
});

window.addEventListener(
  'resize',
  () => {
    requestAnimationFrame(() => {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    });
  },
  false
);

let clicked = false;
let timeClicked = 0;

const OBJECT_SPEED_FACTOR = 1200;
const OBJECT_MOVE_FACTOR = 1900;

let speedSum = 0;

interact(canvas).draggable({
  listeners: {
    start() {
      clicked = true;
      speed = 0;
      speedSum = 0;
      timeClicked = Date.now();
    },
    move(event) {
      let diff = event.dx;
      if (!diff) return;
      if (clicked) {
        speedSum += diff / OBJECT_SPEED_FACTOR;
        scene.rotateY(diff / OBJECT_MOVE_FACTOR);
      }
    },
    end() {
      canvas.style.cursor = 'grab';
      if (clicked) {
        clicked = false;
        timeClicked = Date.now() - timeClicked;
        speed = speedSum / (timeClicked / 50);
        if (Math.abs(speed) < slowDown) speed = slowDown;
      }
    },
  },
});

// this prevents clicks on mobile
// canvas.addEventListener('touchend', (event) => {
//   if (event.cancellable) {
//     event.preventDefault();
//   }
// });
