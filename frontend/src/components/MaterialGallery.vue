<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Columns2,
  Heart,
  Plus,
  X,
  ZoomIn,
  ZoomOut,
} from "@lucide/vue";
import { galleryCategories, showroomGallery } from "../data/showroomGallery";
import RollingText from "./RollingText.vue";
import { trapDialogFocus } from "../utils/dialogFocus";

const category = ref("全部");
const limit = ref(12);
const favoriteIds = ref([]);
const compareIds = ref([]);
const message = ref("");
const dialog = ref(null);
const selected = ref(null);
const mode = ref("preview");
const zoomed = ref(false);
const split = ref(50);
let previousOverflow;
const filtered = computed(() =>
  showroomGallery.filter(
    (item) => category.value === "全部" || item.category === category.value,
  ),
);
const visibleItems = computed(() => filtered.value.slice(0, limit.value));
const compareItems = computed(() =>
  compareIds.value
    .map((id) => showroomGallery.find((item) => item.id === id))
    .filter(Boolean),
);

function readCategory() {
  const value = new URLSearchParams(window.location.search).get("material");
  category.value = galleryCategories.includes(value) ? value : "全部";
  limit.value = 12;
}

function selectCategory(value) {
  category.value = value;
  limit.value = 12;
  const url = new URL(window.location.href);
  if (value === "全部") url.searchParams.delete("material");
  else url.searchParams.set("material", value);
  window.history.pushState(null, "", url);
}

function toggleFavorite(item) {
  favoriteIds.value = favoriteIds.value.includes(item.id)
    ? favoriteIds.value.filter((id) => id !== item.id)
    : [...favoriteIds.value, item.id];
  message.value = favoriteIds.value.includes(item.id)
    ? `${item.name}已收藏`
    : `已取消收藏${item.name}`;
  try {
    localStorage.setItem(
      "tile-store-material-favorites",
      JSON.stringify(favoriteIds.value),
    );
  } catch {
    message.value = "当前浏览器不能保存收藏，关闭页面后不会保留";
  }
}

function toggleCompare(item) {
  message.value = "";
  if (compareIds.value.includes(item.id))
    compareIds.value = compareIds.value.filter((id) => id !== item.id);
  else if (compareIds.value.length < 2)
    compareIds.value = [...compareIds.value, item.id];
  else message.value = "已选两张图片，请先取消一张再添加";
}

async function openPreview(item) {
  selected.value = item;
  mode.value = "preview";
  zoomed.value = false;
  await nextTick();
  openDialog();
}

async function openComparison() {
  if (compareItems.value.length !== 2) return;
  mode.value = "compare";
  split.value = 50;
  await nextTick();
  openDialog();
}

function openDialog() {
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  dialog.value.showModal();
}

function closeDialog() {
  dialog.value?.close();
}
function onClose() {
  document.body.style.overflow = previousOverflow || "";
}

function movePreview(step) {
  const index = filtered.value.findIndex(
    (item) => item.id === selected.value?.id,
  );
  selected.value =
    filtered.value[
      (index + step + filtered.value.length) % filtered.value.length
    ];
  zoomed.value = false;
}

function handleDialogKey(event) {
  trapDialogFocus(event);
  if (mode.value !== "preview" || !selected.value) return;
  if (event.key === "ArrowRight") {
    event.preventDefault();
    movePreview(1);
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    movePreview(-1);
  }
}

function handleBackdrop(event) {
  if (event.target !== dialog.value) return;
  const rect = dialog.value.getBoundingClientRect();
  if (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  )
    closeDialog();
}

onMounted(() => {
  readCategory();
  window.addEventListener("popstate", readCategory);
  try {
    const saved = JSON.parse(
      localStorage.getItem("tile-store-material-favorites") || "[]",
    );
    favoriteIds.value = Array.isArray(saved)
      ? saved.filter((id) => showroomGallery.some((item) => item.id === id))
      : [];
  } catch {
    favoriteIds.value = [];
  }
});
onUnmounted(() => {
  window.removeEventListener("popstate", readCategory);
  if (dialog.value?.open) onClose();
});
</script>

<template>
  <section
    id="gallery"
    class="gallery-section section-space"
    aria-labelledby="gallery-title"
  >
    <div class="gallery-heading">
      <div>
        <h2 id="gallery-title">有些喜欢<br />要靠近一点才知道</h2>
        <p>从木纹的温润，到石纹的层次<br />让真实照片帮你找到自己的方向</p>
      </div>
      <span class="gallery-total">{{ showroomGallery.length }} 张现场照片</span>
    </div>
    <div class="gallery-filter-row">
      <div class="gallery-filters" role="group" aria-label="照片分类">
        <button
          v-for="item in galleryCategories"
          :key="item"
          type="button"
          :class="{ active: category === item }"
          :aria-pressed="category === item"
          @click="selectCategory(item)"
        >
          {{ item === "全部" ? "全部看样" : item }}
        </button>
      </div>
      <span>{{ filtered.length }} 张</span>
    </div>
    <div
      class="gallery-grid"
      :style="{
        '--gallery-end-span': 3 - (visibleItems.length % 3),
        '--gallery-tablet-span': visibleItems.length % 2 ? 2 : 1,
      }"
    >
      <article v-for="item in visibleItems" :key="item.id" class="gallery-card">
        <button
          class="gallery-image-button"
          type="button"
          :aria-label="`放大${item.name}`"
          @click="openPreview(item)"
        >
          <img
            :src="item.image"
            :alt="item.alt"
            loading="lazy"
            width="720"
            height="960"
          /><span class="gallery-zoom-hint" aria-hidden="true"
            ><ZoomIn :size="22"
          /></span>
        </button>
        <div class="gallery-caption">
          <div>
            <h3>{{ item.name }}</h3>
            <p>{{ item.category }}</p>
          </div>
          <div class="gallery-card-actions">
            <button
              class="icon-button"
              type="button"
              :class="{ selected: favoriteIds.includes(item.id) }"
              :title="favoriteIds.includes(item.id) ? '取消收藏' : '收藏照片'"
              :aria-label="`${favoriteIds.includes(item.id) ? '取消收藏' : '收藏'}${item.name}`"
              :aria-pressed="favoriteIds.includes(item.id)"
              @click="toggleFavorite(item)"
            >
              <Heart
                :size="18"
                :fill="favoriteIds.includes(item.id) ? 'currentColor' : 'none'"
              /></button
            ><button
              class="icon-button"
              type="button"
              :title="compareIds.includes(item.id) ? '取消对比' : '加入对比'"
              :aria-label="`${compareIds.includes(item.id) ? '取消对比' : '对比'}${item.name}`"
              :aria-pressed="compareIds.includes(item.id)"
              :class="{ selected: compareIds.includes(item.id) }"
              @click="toggleCompare(item)"
            >
              <Check v-if="compareIds.includes(item.id)" :size="18" /><Columns2
                v-else
                :size="18"
              />
            </button>
          </div>
        </div>
      </article>
    </div>
    <div class="gallery-bottom">
      <p class="gallery-note">
        现场照片仅作搭配参考，颜色、纹理与规格请以实物为准
      </p>
      <button
        v-if="limit < filtered.length"
        class="glass-button roll-control"
        type="button"
        @click="limit += 12"
      >
        <RollingText text="查看更多照片" /><Plus :size="18" />
      </button>
    </div>
    <p class="gallery-feedback" role="status">{{ message }}</p>
    <div v-if="compareItems.length" class="gallery-compare-bar">
      <div class="compare-picked">
        <span v-for="item in compareItems" :key="item.id"
          ><img :src="item.image" :alt="item.name" /><button
            class="icon-button"
            type="button"
            :aria-label="`取消对比${item.name}`"
            @click="toggleCompare(item)"
          >
            <X :size="14" /></button
        ></span>
      </div>
      <p>
        {{ compareItems.length === 2 ? "两张已选好" : "再选一张，看看不同" }}
      </p>
      <button
        class="primary-button"
        type="button"
        :disabled="compareItems.length !== 2"
        @click="openComparison"
      >
        开始对比<Columns2 :size="18" />
      </button>
    </div>
    <dialog
      ref="dialog"
      class="material-dialog"
      aria-label="材质照片预览与对比"
      @close="onClose"
      @click="handleBackdrop"
      @keydown="handleDialogKey"
    >
      <div class="material-dialog-heading">
        <span>{{ mode === "compare" ? "材质对比" : selected?.name }}</span>
        <div>
          <button
            v-if="mode === 'preview'"
            class="icon-button"
            type="button"
            :title="zoomed ? '还原尺寸' : '放大细节'"
            :aria-label="zoomed ? '还原图片尺寸' : '放大图片细节'"
            @click="zoomed = !zoomed"
          >
            <ZoomOut v-if="zoomed" :size="20" /><ZoomIn
              v-else
              :size="20"
            /></button
          ><button
            class="icon-button"
            type="button"
            aria-label="关闭图片预览"
            title="关闭"
            autofocus
            @click="closeDialog"
          >
            <X :size="22" />
          </button>
        </div>
      </div>
      <template v-if="mode === 'preview' && selected"
        ><div class="material-preview" :class="{ zoomed }">
          <img :src="selected.original" :alt="selected.alt" />
        </div>
        <div class="material-dialog-caption">
          <div>
            <h3>{{ selected.name }}</h3>
            <p>{{ selected.description }}</p>
          </div>
          <div>
            <button
              class="icon-button"
              type="button"
              title="上一张"
              aria-label="上一张照片"
              @click="movePreview(-1)"
            >
              <ArrowLeft :size="22" /></button
            ><button
              class="icon-button"
              type="button"
              title="下一张"
              aria-label="下一张照片"
              @click="movePreview(1)"
            >
              <ArrowRight :size="22" />
            </button>
          </div></div
      ></template>
      <template v-else-if="compareItems.length === 2"
        ><div class="material-comparison">
          <img :src="compareItems[0].image" :alt="compareItems[0].alt" /><img
            class="comparison-front"
            :src="compareItems[1].image"
            :alt="compareItems[1].alt"
            :style="{ clipPath: `inset(0 ${100 - split}% 0 0)` }"
          /><span
            class="comparison-divider"
            :style="{ left: `${split}%` }"
            aria-hidden="true"
          ></span>
        </div>
        <label class="comparison-range"
          >{{ compareItems[1].name
          }}<input
            v-model.number="split"
            aria-label="调整两张照片的对比位置"
            type="range"
            min="0"
            max="100"
            step="1"
          />{{ compareItems[0].name }}</label
        >
        <p class="gallery-note">
          不同照片的光线与拍摄角度不同，对比仅作视觉参考
        </p></template
      >
    </dialog>
  </section>
</template>
