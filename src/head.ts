import './style.scss';

import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

let renderLoop;

const init = async () => {
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

  // TODO: change this back to root
  const objects = [
    '/media/headscan-crop.glb'
  ];

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


  return new Promise<void>((resolve) => {
    objloader.load(
      objects[0],
      (site) => {
        object_group = site.scene;
        scene.add(object_group);
        renderLoop = setInterval(() => {
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

const loadIfLight = () => {
  const isLight = document.body.classList.contains('light');
  if (isLight) {
    init().then(() => {});
  } else {
    // destroy three and renderLoop if they are initialized
    if (renderLoop) {
      clearInterval(renderLoop);
      renderLoop = undefined;
    }

    const canvas = document.getElementById('object') as HTMLCanvasElement;
    if (canvas) {
      const gl = canvas.getContext('webgl');
      if (gl) {
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      }
    }
  }
}

window.addEventListener('load', () => {
  loadIfLight();
  document.getElementById('colorscheme-changer')?.addEventListener('click', loadIfLight);
});

