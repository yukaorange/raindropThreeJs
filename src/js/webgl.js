import { gsap } from "gsap";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import vertexShader from "./shader/vertex.glsl";
import fragmentShader from "./shader/fragment.glsl";
import * as dat from "lil-gui";

/**
 *2022/12/15
 *雨のやつ
 */

export function webgl() {
  webGLcreate();
  async function webGLcreate() {
    // Scene
    const scene = new THREE.Scene();

    // debugger
    const gui = new dat.GUI({ width: 300 });

    // Canvas
    const canvas = document.querySelector(".webgl");

    // sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Camera
    const fov = 60;
    const fovRad = (fov / 2) * (Math.PI / 180);
    const dist = sizes.height / 2 / Math.tan(fovRad);
    const camera = new THREE.PerspectiveCamera(
      fov,
      sizes.width / sizes.height,
      0.1,
      10000
    );
    camera.position.z = dist;
    scene.add(camera);

    // Controls
    // const controls = new OrbitControls(camera, canvas);
    // controls.enableDamping = true;

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // resize
    window.addEventListener("resize", () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
    });

    // mosuewheel
    // window.addEventListener("wheel", onMouseWheel);
    // let y = 0;
    // let position = 0;
    // function onMouseWheel(event) {
    //   y = event.deltaY * 0.07;
    // }

    // mousemove
    // const mouse = new THREE.Vector2();
    // window.addEventListener("mousemove", (event) => {
    //   mouse.x = (event.clientX / sizes.width) * 2 - 1;
    //   mouse.y = -(event.clientY / sizes.height) * 2 + 1;
    // });

    // imageArray
    const imageArray = [];
    imageArray.push("./images/life.jpg");

    // 画像ローダー
    async function textureLoader(url) {
      const texLoader = new THREE.TextureLoader();
      const texture = await texLoader.loadAsync(url);
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.MirroredRepeatWrapping;
      return texture;
    }

    //メッシュ作成関数
    async function createMesh(img) {
      const geometry = new THREE.PlaneGeometry(
        sizes.width,
        sizes.height,
        100,
        100
      );
      const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        side: THREE.DoubleSide,
        uniforms: {
          uTime: {
            value: 0,
          },
          uProgress: {
            value: 0,
          },
          uTexture: {
            value: await textureLoader(img),
          },
        },
      });

      const mesh = new THREE.Mesh(geometry, material);

      return mesh;
    }

    //乱数生成関数
    // const getRandomInt = (min, max) => {
    //   const int = Math.floor(Math.random() * (max + 1 - min)) + min;
    //   return int;
    // };

    //時間取得
    const clock = new THREE.Clock();

    //raycaster
    // const raycaster = new THREE.Raycaster();

    //生成 & アニメーション開始
    const meshArray = [];
    await init();
    async function init() {
      const mesh = await createMesh(imageArray[0]);
      scene.add(mesh);
      meshArray.push(mesh);
      animate();
    }
    //loopアニメーション
    function animate() {
      const elapsedTime = clock.getElapsedTime();
      meshArray.forEach((mesh) => {
        mesh.material.uniforms.uTime.value = elapsedTime;
        // console.log(mesh.material.uniforms.uTime.value);
      });
      renderer.render(scene, camera);
      window.requestAnimationFrame(animate);
      // controls.update();
    }
  }
}
