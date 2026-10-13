<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { ArrowLeft, ArrowRight, Maximize, Pause, Play } from "@lucide/vue";

const props = defineProps({ slides: { type: Array, required: true } });
const current = ref(0);
const video = ref(null);
const playing = ref(false);
const videoError = ref("");
const slide = computed(() => props.slides[current.value]);
let motion;
let observer;
let visible = false;
let autoPlay = true;

function syncPlayback() {
  if (!video.value) return;
  if (!visible || document.hidden || !autoPlay || motion?.matches)
    video.value.pause();
  else video.value.play().catch(() => {});
}

function selectSlide(index) {
  current.value = (index + props.slides.length) % props.slides.length;
}

function togglePlayback() {
  autoPlay = video.value.paused;
  if (autoPlay) video.value.play().catch(() => {});
  else video.value.pause();
}

function onEnded() {
  if (autoPlay) selectSlide(current.value + 1);
}

async function fullscreen() {
  try {
    await video.value?.requestFullscreen();
  } catch {
    videoError.value = "当前浏览器不支持全屏，可以继续在这里观看";
  }
}

watch(current, async () => {
  videoError.value = "";
  await nextTick();
  video.value?.load();
  syncPlayback();
});

onMounted(() => {
  motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  motion.addEventListener("change", syncPlayback);
  document.addEventListener("visibilitychange", syncPlayback);
  observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    },
    { threshold: 0.2 },
  );
  observer.observe(video.value);
});
onUnmounted(() => {
  observer?.disconnect();
  motion?.removeEventListener("change", syncPlayback);
  document.removeEventListener("visibilitychange", syncPlayback);
});
</script>

<template>
  <section
    id="showroom-films"
    class="showroom-films"
    aria-labelledby="films-title"
  >
    <div class="film-heading">
      <h2 id="films-title">把现场<br />带到你眼前</h2>
      <p>
        从一片砖的近景，到一条完整的展厅动线<br />不同光线里，看看材质的真实表现
      </p>
      <div class="film-slide-title" aria-live="polite">
        <span
          >{{ String(current + 1).padStart(2, "0") }} /
          {{ props.slides.length }}</span
        >
        <h3>{{ slide.name }}</h3>
        <p>{{ slide.spec }}</p>
      </div>
    </div>
    <div class="film-media">
      <div class="film-player">
        <video
          ref="video"
          :src="slide.video"
          :poster="slide.poster"
          :aria-label="slide.alt"
          muted
          playsinline
          preload="metadata"
          @play="playing = true"
          @pause="playing = false"
          @ended="onEnded"
          @error="videoError = '视频暂时无法播放，请切换另一段影像'"
        ></video>
      </div>
      <div class="film-controls">
        <div>
          <button
            class="icon-button"
            type="button"
            title="上一段"
            aria-label="上一段视频"
            @click="selectSlide(current - 1)"
          >
            <ArrowLeft :size="19" /></button
          ><button
            class="icon-button"
            type="button"
            :title="playing ? '暂停' : '播放'"
            :aria-label="playing ? '暂停展厅视频' : '播放展厅视频'"
            @click="togglePlayback"
          >
            <Pause v-if="playing" :size="19" /><Play
              v-else
              :size="19"
            /></button
          ><button
            class="icon-button"
            type="button"
            title="下一段"
            aria-label="下一段视频"
            @click="selectSlide(current + 1)"
          >
            <ArrowRight :size="19" />
          </button>
        </div>
        <button
          class="icon-button"
          type="button"
          title="全屏观看"
          aria-label="全屏观看展厅视频"
          @click="fullscreen"
        >
          <Maximize :size="19" />
        </button>
      </div>
      <div class="film-thumbnails" aria-label="选择展厅影像">
        <button
          v-for="(item, index) in slides"
          :key="item.video"
          type="button"
          :aria-label="`查看${item.name}`"
          :aria-pressed="index === current"
          :class="{ active: index === current }"
          @click="selectSlide(index)"
        >
          <img :src="item.poster" :alt="item.alt" loading="lazy" /><span>{{
            String(index + 1).padStart(2, "0")
          }}</span>
        </button>
      </div>
      <p v-if="videoError" class="form-message" role="status">
        {{ videoError }}
      </p>
    </div>
  </section>
</template>
