<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import {
  ArrowRight,
  Menu,
  Pause,
  Play,
  ShoppingBag,
  UserRound,
  X,
} from "@lucide/vue";
import RollingText from "./RollingText.vue";

defineProps({
  cartCount: { type: Number, default: 0 },
  loggedIn: Boolean,
  userPhone: { type: String, default: "" },
});
const emit = defineEmits(["login", "bag"]);
const video = ref(null);
const menuOpen = ref(false);
const playing = ref(false);
const links = [
  { href: "#collection", text: "精选瓷砖" },
  { href: "#gallery", text: "材质图集" },
  { href: "#assistant", text: "选砖助手" },
  { href: "#faq", text: "选砖指南" },
];
let observer;
let motion;
let manuallyPaused = false;
let visible = true;

function syncPlayback() {
  if (!video.value) return;
  if (!visible || document.hidden || motion?.matches || manuallyPaused)
    video.value.pause();
  else video.value.play().catch(() => {});
}

function togglePlayback() {
  manuallyPaused = !video.value.paused;
  if (manuallyPaused) video.value.pause();
  else video.value.play().catch(() => {});
}

function closeMenu(event) {
  if (event.key === "Escape") menuOpen.value = false;
}

onMounted(() => {
  motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  motion.addEventListener("change", syncPlayback);
  document.addEventListener("visibilitychange", syncPlayback);
  window.addEventListener("keydown", closeMenu);
  observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncPlayback();
  });
  observer.observe(video.value);
  syncPlayback();
});

onUnmounted(() => {
  observer?.disconnect();
  motion?.removeEventListener("change", syncPlayback);
  document.removeEventListener("visibilitychange", syncPlayback);
  window.removeEventListener("keydown", closeMenu);
});
</script>

<template>
  <section id="top" class="showroom-hero" aria-labelledby="hero-title">
    <video
      ref="video"
      class="showroom-hero-video"
      src="/videos/showroom-08.mp4"
      poster="/videos/posters/showroom-08.jpg"
      autoplay
      loop
      muted
      playsinline
      aria-label="真实瓷砖展厅长廊"
      @play="playing = true"
      @pause="playing = false"
    ></video>
    <div class="showroom-hero-shade" aria-hidden="true"></div>
    <header class="showroom-header">
      <a
        class="showroom-wordmark roll-control"
        href="#top"
        aria-label="Tile Store 瓷砖生活馆首页"
        ><RollingText text="Tile Store"
      /></a>
      <nav class="showroom-nav" aria-label="主导航">
        <a
          v-for="link in links"
          :key="link.href"
          class="roll-control"
          :href="link.href"
          ><RollingText :text="link.text"
        /></a>
      </nav>
      <div class="showroom-header-actions">
        <button
          class="showroom-login roll-control"
          type="button"
          :aria-label="loggedIn ? '退出当前登录' : '登录或注册'"
          @click="emit('login')"
        >
          <UserRound class="mobile-only" :size="19" /><span class="desktop-only"
            ><RollingText :text="loggedIn ? userPhone : '登录'"
          /></span>
        </button>
        <button
          class="showroom-bag roll-control"
          type="button"
          aria-label="打开购物袋"
          @click="emit('bag')"
        >
          <ShoppingBag :size="18" /><span class="desktop-only"
            ><RollingText text="购物袋" /></span
          ><b v-if="cartCount">{{ cartCount }}</b>
        </button>
        <button
          class="icon-button mobile-only"
          type="button"
          :aria-label="menuOpen ? '关闭导航' : '打开导航'"
          :aria-expanded="menuOpen"
          aria-controls="mobile-nav"
          @click="menuOpen = !menuOpen"
        >
          <X v-if="menuOpen" :size="22" /><Menu v-else :size="22" />
        </button>
      </div>
      <nav
        v-if="menuOpen"
        id="mobile-nav"
        class="showroom-mobile-nav"
        aria-label="移动端导航"
      >
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          @click="menuOpen = false"
          >{{ link.text }}<ArrowRight :size="18"
        /></a>
      </nav>
    </header>
    <div class="showroom-hero-copy">
      <p class="showroom-hero-pill">真实瓷砖，现场看样</p>
      <h1 id="hero-title">瓷砖生活馆<br /><span>Tile Store</span></h1>
      <p class="showroom-hero-description">
        看清纹理、光泽与铺贴效果<br />选一块真正适合家的瓷砖
      </p>
      <div class="showroom-hero-actions">
        <a class="primary-button roll-control" href="#collection"
          ><RollingText text="探索精选瓷砖" /><ArrowRight :size="18"
        /></a>
        <a class="glass-button roll-control" href="#gallery"
          ><RollingText text="走进材质图集" /><ArrowRight :size="18"
        /></a>
      </div>
    </div>
    <button
      class="hero-playback icon-button"
      type="button"
      :title="playing ? '暂停背景视频' : '播放背景视频'"
      :aria-label="playing ? '暂停背景视频' : '播放背景视频'"
      @click="togglePlayback"
    >
      <Pause v-if="playing" :size="18" /><Play v-else :size="18" />
    </button>
  </section>
</template>
