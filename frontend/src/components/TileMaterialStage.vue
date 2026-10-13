<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import {
  ACESFilmicToneMapping,
  BoxGeometry,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  SRGBColorSpace,
  TextureLoader,
  WebGLRenderer,
} from "three";

const canvasRef = ref(null);
const fallbackRef = ref(null);

const slabs = [
  {
    image: "/tiles/materials/mist-grey.webp",
    width: 2.6,
    height: 3.55,
    x: -2.3,
    y: -0.08,
    z: -0.45,
    rotation: -0.2,
  },
  {
    image: "/tiles/materials/pale-stone.webp",
    width: 3.1,
    height: 4.3,
    x: 0,
    y: 0.03,
    z: 0.38,
    rotation: 0.05,
  },
  {
    image: "/tiles/materials/wood-grain.webp",
    width: 2.55,
    height: 3.5,
    x: 2.35,
    y: -0.06,
    z: -0.4,
    rotation: 0.22,
  },
];

let renderer;
let scene;
let camera;
let stage;
let observer;
let visibilityObserver;
let animationFrame;
let isStageVisible = false;
let pointerX = 0;
let pointerY = 0;
let targetX = 0;
let targetY = 0;
let reducedMotion;
let startedAt = 0;
const textureLoader = new TextureLoader();
const textures = [];

function loadTileTexture(path) {
  return new Promise((resolve, reject) => {
    textureLoader.load(path, resolve, undefined, reject);
  });
}

async function buildStage() {
  const textureResults = await Promise.allSettled(
    slabs.map((slab) => loadTileTexture(slab.image)),
  );
  if (!canvasRef.value || !renderer) return;

  const usableTextures = textureResults.map((result) =>
    result.status === "fulfilled" ? result.value : null,
  );
  if (usableTextures.every((texture) => !texture)) {
    fallbackRef.value?.classList.add("visible");
    return;
  }

  usableTextures.forEach((texture) => {
    if (!texture) return;
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    textures.push(texture);
  });

  scene = new Scene();
  scene.background = new Color("#121719");
  camera = new PerspectiveCamera(34, 1, 0.1, 60);
  camera.position.set(0, 0.1, 12.8);
  stage = new Group();
  scene.add(stage);

  const room = new Group();
  stage.add(room);

  slabs.forEach((slab, index) => {
    const texture = usableTextures[index];
    if (!texture) return;
    const edgeMaterial = new MeshStandardMaterial({
      color: "#333a3b",
      roughness: 0.32,
      metalness: 0.08,
    });
    const faceMaterial = new MeshStandardMaterial({
      map: texture,
      roughness: 0.3,
      metalness: 0.02,
    });
    const backMaterial = new MeshStandardMaterial({
      color: "#1d2223",
      roughness: 0.5,
    });
    const geometry = new BoxGeometry(slab.width, slab.height, 0.14);
    const mesh = new Mesh(geometry, [
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      faceMaterial,
      backMaterial,
    ]);
    mesh.position.set(slab.x, slab.y, slab.z);
    mesh.rotation.set(0.02, slab.rotation, index === 1 ? -0.01 : 0.015);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.baseY = slab.y;
    mesh.userData.phase = index * 0.9;
    room.add(mesh);
  });

  const floor = new Mesh(
    new PlaneGeometry(200, 200),
    new MeshStandardMaterial({
      color: "#15191a",
      roughness: 0.74,
      metalness: 0.12,
    }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -2.4;
  floor.position.z = -1.5;
  floor.receiveShadow = true;
  room.add(floor);

  scene.add(new HemisphereLight("#dce6e6", "#24201c", 2.1));

  const keyLight = new DirectionalLight("#fff1d9", 3.2);
  keyLight.position.set(-4, 7, 8);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.left = -7;
  keyLight.shadow.camera.right = 7;
  keyLight.shadow.camera.top = 7;
  keyLight.shadow.camera.bottom = -7;
  scene.add(keyLight);

  const rimLight = new PointLight("#b9d8e0", 22, 14, 2);
  rimLight.position.set(5, 2.8, -2.3);
  scene.add(rimLight);

  resizeStage();
  fallbackRef.value?.classList.add("ready");
  startAnimation();
}

function resizeStage() {
  const canvas = canvasRef.value;
  if (!canvas || !renderer || !camera) return;
  const bounds = canvas.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return;
  renderer.setPixelRatio(
    Math.min(
      window.devicePixelRatio || 1,
      window.innerWidth < 700 ? 1.15 : 1.5,
    ),
  );
  renderer.setSize(bounds.width, bounds.height, false);
  camera.aspect = bounds.width / bounds.height;
  // Fit the complete 8.5-unit arrangement, including narrow phone canvases.
  camera.position.z = Math.max(
    12.8,
    4.8 / (Math.tan((34 * Math.PI) / 360) * camera.aspect),
  );
  camera.updateProjectionMatrix();
  renderScene();
}

function renderScene() {
  if (renderer && scene && camera) renderer.render(scene, camera);
}

function stopAnimation() {
  if (animationFrame) window.cancelAnimationFrame(animationFrame);
  animationFrame = undefined;
}

function resetStageMotion() {
  if (!stage) return;
  stage.rotation.set(0, 0, 0);
  stage.children[0]?.children.forEach((object) => {
    if (object.isMesh && object.geometry.type === "BoxGeometry")
      object.position.y = object.userData.baseY;
  });
  renderScene();
}

function startAnimation() {
  if (
    !isStageVisible ||
    document.hidden ||
    !renderer ||
    !scene ||
    !camera ||
    !stage
  )
    return;
  if (reducedMotion?.matches) {
    stopAnimation();
    resetStageMotion();
    return;
  }
  if (!animationFrame) {
    startedAt = performance.now();
    animationFrame = window.requestAnimationFrame(animate);
  }
}

function animate(now) {
  animationFrame = undefined;
  if (
    !isStageVisible ||
    document.hidden ||
    !renderer ||
    !scene ||
    !camera ||
    !stage
  )
    return;
  const elapsed = (now - startedAt) / 1000;
  const calm = reducedMotion?.matches;
  targetX = calm ? 0 : pointerX * 0.09;
  targetY = calm ? 0 : pointerY * 0.055;
  stage.rotation.y +=
    (targetX +
      (calm ? 0 : Math.sin(elapsed * 0.25) * 0.025) -
      stage.rotation.y) *
    0.025;
  stage.rotation.x += (targetY - stage.rotation.x) * 0.025;

  stage.children[0]?.children.forEach((object) => {
    if (!object.isMesh || object.geometry.type !== "BoxGeometry") return;
    object.position.y =
      object.userData.baseY +
      (calm ? 0 : Math.sin(elapsed * 0.7 + object.userData.phase) * 0.035);
  });

  renderScene();
  animationFrame = window.requestAnimationFrame(animate);
}

function handlePointerMove(event) {
  const bounds = canvasRef.value?.getBoundingClientRect();
  if (!bounds || reducedMotion?.matches) return;
  pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
  pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
}

function handlePointerLeave() {
  pointerX = 0;
  pointerY = 0;
}

function handlePageVisibilityChange() {
  if (document.hidden) stopAnimation();
  else startAnimation();
}

function handleMotionPreferenceChange() {
  if (reducedMotion?.matches) {
    stopAnimation();
    resetStageMotion();
  } else {
    startAnimation();
  }
}

onMounted(async () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  try {
    renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "low-power",
    });
  } catch {
    fallbackRef.value?.classList.add("visible");
    return;
  }

  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = window.innerWidth >= 700;
  renderer.shadowMap.type = PCFSoftShadowMap;
  canvas.addEventListener("pointermove", handlePointerMove);
  canvas.addEventListener("pointerleave", handlePointerLeave);
  observer = new ResizeObserver(resizeStage);
  observer.observe(canvas);
  visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      isStageVisible = entry.isIntersecting;
      if (isStageVisible) startAnimation();
      else stopAnimation();
    },
    { threshold: 0.01 },
  );
  visibilityObserver.observe(canvas);
  document.addEventListener("visibilitychange", handlePageVisibilityChange);
  reducedMotion.addEventListener?.("change", handleMotionPreferenceChange);
  await buildStage();
});

onUnmounted(() => {
  stopAnimation();
  observer?.disconnect();
  visibilityObserver?.disconnect();
  document.removeEventListener("visibilitychange", handlePageVisibilityChange);
  reducedMotion?.removeEventListener?.("change", handleMotionPreferenceChange);
  canvasRef.value?.removeEventListener("pointermove", handlePointerMove);
  canvasRef.value?.removeEventListener("pointerleave", handlePointerLeave);
  textures.forEach((texture) => texture.dispose());
  scene?.traverse((object) => {
    if (object.geometry) object.geometry.dispose();
    if (Array.isArray(object.material))
      object.material.forEach((material) => material.dispose());
    else object.material?.dispose();
  });
  renderer?.dispose();
});
</script>

<template>
  <div
    class="tile-material-stage"
    role="img"
    aria-label="三块真实瓷砖纹理在展厅灯光下呈立体陈列，可移动指针观察不同角度"
  >
    <canvas ref="canvasRef" aria-hidden="true"></canvas>
    <div ref="fallbackRef" class="stage-fallback" aria-hidden="true">
      <img v-for="slab in slabs" :key="slab.image" :src="slab.image" alt="" />
    </div>
  </div>
</template>
