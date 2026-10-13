<script setup>
import {
  computed,
  defineAsyncComponent,
  onMounted,
  onUnmounted,
  ref,
} from "vue";
import ProductDetailModal from "./components/ProductDetailModal.vue";
import TileAssistant from "./components/TileAssistant.vue";
import TileCalculator from "./components/TileCalculator.vue";
import TileShowroomHero from "./components/TileShowroomHero.vue";
import MaterialGallery from "./components/MaterialGallery.vue";
import ShowroomReel from "./components/ShowroomReel.vue";
import RollingText from "./components/RollingText.vue";
import ModalSurface from "./components/ModalSurface.vue";
import { ArrowRight, Plus, Minus, X } from "@lucide/vue";
const TileMaterialStage = defineAsyncComponent(
  () => import("./components/TileMaterialStage.vue"),
);

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/$/,
  "",
);
const ASSISTANT_API_BASE_URL = (
  import.meta.env.VITE_ASSISTANT_API_URL || "/assistant-api"
).replace(/\/$/, "");
const apiUrl = (path) => `${API_BASE_URL}${path}`;

const tileImages = {
  mist: "/tiles/materials/mist-grey.webp",
  cream: "/tiles/materials/pale-stone.webp",
  terracotta: "/tiles/materials/wood-grain.webp",
  blueGrey: "/tiles/catalog/516ff1495a194af0486a4b67227478db.jpg",
  marble: "/tiles/materials/dark-surface.webp",
};
const tileImageByName = {
  雾灰石纹: tileImages.mist,
  奶油白微水泥: tileImages.cream,
  墨岩黑大板: tileImages.marble,
  原木浅棕: tileImages.terracotta,
};
const fallbackProducts = [
  {
    id: 1,
    name: "雾灰石纹",
    category: "floor",
    price: 128,
    unit: "㎡",
    specification: "MAT-042 · 600×1200mm",
    imageUrl: tileImages.mist,
  },
  {
    id: 2,
    name: "奶油白微水泥",
    category: "wall",
    price: 156,
    unit: "㎡",
    specification: "WAL-018 · 750×1500mm",
    imageUrl: tileImages.cream,
  },
  {
    id: 3,
    name: "墨岩黑大板",
    category: "slab",
    price: 298,
    unit: "㎡",
    specification: "SLB-007 · 900×1800mm",
    imageUrl: tileImages.marble,
  },
  {
    id: 4,
    name: "原木浅棕",
    category: "floor",
    price: 96,
    unit: "㎡",
    specification: "WD-031 · 200×1200mm",
    imageUrl: tileImages.terracotta,
  },
];
const carouselSlides = [
  {
    name: "展厅全景",
    spec: "真实动线 · 现场看样",
    label: "01 / 全景",
    video: "/videos/showroom-01.mp4",
    poster: "/videos/posters/showroom-01.jpg",
    alt: "瓷砖展厅全景视频",
  },
  {
    name: "浅色大板",
    spec: "墙面陈列 · 光泽观察",
    label: "02 / 大板",
    video: "/videos/showroom-02.mp4",
    poster: "/videos/posters/showroom-02.jpg",
    alt: "浅色大板瓷砖展厅视频",
  },
  {
    name: "柔光砖面",
    spec: "现场灯光 · 近距离看样",
    label: "03 / 柔光",
    video: "/videos/showroom-03.mp4",
    poster: "/videos/posters/showroom-03.jpg",
    alt: "柔光瓷砖样板墙视频",
  },
  {
    name: "规格对照",
    spec: "多种尺寸 · 展厅陈列",
    label: "04 / 规格",
    video: "/videos/showroom-04.mp4",
    poster: "/videos/posters/showroom-04.jpg",
    alt: "多规格瓷砖样板视频",
  },
  {
    name: "石纹近看",
    spec: "纹理细节 · 触感想象",
    label: "05 / 石纹",
    video: "/videos/showroom-05.mp4",
    poster: "/videos/posters/showroom-05.jpg",
    alt: "石纹瓷砖近距离视频",
  },
  {
    name: "墙地搭配",
    spec: "不同铺贴 · 空间参考",
    label: "06 / 搭配",
    video: "/videos/showroom-06.mp4",
    poster: "/videos/posters/showroom-06.jpg",
    alt: "墙地瓷砖搭配展厅视频",
  },
  {
    name: "材质长廊",
    spec: "样板墙 · 连续浏览",
    label: "07 / 长廊",
    video: "/videos/showroom-07.mp4",
    poster: "/videos/posters/showroom-07.jpg",
    alt: "瓷砖材质长廊视频",
  },
  {
    name: "完整展厅",
    spec: "一镜到底 · 现场光线",
    label: "08 / 现场",
    video: "/videos/showroom-08.mp4",
    poster: "/videos/posters/showroom-08.jpg",
    alt: "瓷砖展厅完整动线视频",
  },
];
const brandHighlights = [
  {
    label: "品牌资料",
    value: "欧莱克瓷砖 · 岩板",
    note: "专注高档瓷砖与岩板产品",
  },
  { label: "成立时间", value: "2003", note: "资料显示的品牌起点" },
  { label: "生产基地", value: "广东佛山", note: "中国陶瓷产业重要产区" },
  {
    label: "品牌主张",
    value: "时尚搭配 · 好而不贵",
    note: "让质感和日常预算都被照顾",
  },
];
const productSeries = [
  {
    name: "江山白玉",
    tag: "纯平超耐磨",
    description: "以浅色天然石材肌理为灵感，适合客厅、厨房和大面积通铺。",
    sizes: "800×800 · 600×1200 · 750×1500",
    image: tileImages.cream,
  },
  {
    name: "翡翠山河",
    tag: "900 大板",
    description: "用量子喷墨复刻山河脉络，适合需要开阔视觉和连续纹理的空间。",
    sizes: "900×1800",
    image: tileImages.marble,
  },
  {
    name: "超平金刚釉",
    tag: "平整耐磨",
    description: "镜面精抛与金刚釉工艺，强调平整、耐磨和更清晰的纹理表现。",
    sizes: "800×800 · 800×1350 · 750×1500",
    image: tileImages.mist,
  },
  {
    name: "纯平超耐磨时尚款",
    tag: "多规格应用",
    description: "从小规格到大板都能找到对应尺寸，方便做地面、墙面和整屋延伸。",
    sizes: "800×800 · 600×1200 · 750×1500 · 900×1800",
    image: tileImages.terracotta,
  },
];

const categoryLabels = { floor: "地面砖", wall: "墙面砖", slab: "岩板" };
const categories = [
  { value: "全部", label: "全部瓷砖" },
  { value: "floor", label: "地面砖" },
  { value: "wall", label: "墙面砖" },
  { value: "slab", label: "岩板大板" },
];

const products = ref([]);
const loading = ref(true);
const activeCategory = ref("全部");
const searchQuery = ref("");
const sortOption = ref("featured");
const isDemoMode = ref(false);
const connectionMessage = ref("");
const cart = ref([]);
const cartOpen = ref(false);
const cartMessage = ref("");
const orderMessage = ref("");
const orderForm = ref({
  receiverName: "",
  receiverPhone: "",
  shippingAddress: "",
  paymentMethod: "WECHAT_PAY",
});

const loginOpen = ref(false);
const isLoggedIn = ref(false);
const loggedInPhone = ref("");
const loginForm = ref({ phone: "", code: "" });
const codeSent = ref(false);
const countdown = ref(0);
const loginMessage = ref("");
const selectedProduct = ref(null);
const detailOpen = ref(false);
let countdownTimer;
let chapterObserver;

const filteredProducts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  const list = products.value
    .filter(
      (product) =>
        activeCategory.value === "全部" ||
        product.category === activeCategory.value,
    )
    .filter(
      (product) =>
        !query ||
        `${product.name} ${product.specification || ""}`
          .toLowerCase()
          .includes(query),
    );
  return [...list].sort((first, second) => {
    if (sortOption.value === "price-asc")
      return Number(first.price) - Number(second.price);
    if (sortOption.value === "price-desc")
      return Number(second.price) - Number(first.price);
    return Number(second.id) - Number(first.id);
  });
});
const cartTotal = computed(() =>
  cart.value.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  ),
);
const cartCount = computed(() =>
  cart.value.reduce((sum, item) => sum + item.quantity, 0),
);
const userPhone = computed(() => {
  const phone = loggedInPhone.value;
  return phone ? `${phone.slice(0, 3)}****${phone.slice(-4)}` : "";
});

function normalizeProducts(list) {
  return list.map((product) => ({
    ...product,
    imageUrl:
      product.imageUrl || tileImageByName[product.name] || tileImages.mist,
  }));
}

function categoryLabel(category) {
  return categoryLabels[category] || "精选瓷砖";
}

function readDemoCart() {
  try {
    cart.value = JSON.parse(localStorage.getItem("tile-store-cart") || "[]");
  } catch {
    cart.value = [];
  }
}

function saveDemoCart() {
  localStorage.setItem("tile-store-cart", JSON.stringify(cart.value));
}

async function loadCart() {
  if (isDemoMode.value) {
    readDemoCart();
    return;
  }
  try {
    const response = await fetch(apiUrl("/api/cart?cartKey=demo-user"));
    if (!response.ok) throw new Error("购物车读取失败");
    cart.value = await response.json();
  } catch {
    isDemoMode.value = true;
    readDemoCart();
  }
}

async function addToCart(product) {
  cartMessage.value = "";
  try {
    if (isDemoMode.value) {
      const existing = cart.value.find(
        (item) => item.product.id === product.id,
      );
      if (existing) existing.quantity += 1;
      else cart.value.push({ id: `demo-${product.id}`, product, quantity: 1 });
      saveDemoCart();
    } else {
      const response = await fetch(apiUrl("/api/cart?cartKey=demo-user"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      if (!response.ok) throw new Error("购物车服务不可用");
      await loadCart();
    }
    cartMessage.value = `${product.name} 已加入购物袋`;
    cartOpen.value = true;
  } catch {
    cartMessage.value = "暂时没能加入购物袋，请稍后再试";
  }
}

async function changeQuantity(item, quantity) {
  if (quantity < 1) {
    cart.value = cart.value.filter((line) => line.id !== item.id);
    if (isDemoMode.value) saveDemoCart();
    else
      await fetch(apiUrl(`/api/cart/${item.product.id}?cartKey=demo-user`), {
        method: "DELETE",
      });
    return;
  }
  if (isDemoMode.value) {
    item.quantity = quantity;
    saveDemoCart();
    return;
  }
  const response = await fetch(
    apiUrl(`/api/cart/${item.product.id}?cartKey=demo-user`),
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    },
  );
  if (response.ok) await loadCart();
}

async function createOrder() {
  orderMessage.value = "";
  if (isDemoMode.value) {
    orderMessage.value =
      "当前为订单演示，未提交真实订单，也不会扣款；已保留购物袋";
    return;
  }
  const response = await fetch(apiUrl("/api/orders?cartKey=demo-user"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderForm.value),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    orderMessage.value = data.message || "创建订单失败，请检查填写内容";
    return;
  }
  orderMessage.value = `订单 ${data.orderNumber} 已创建，应付 ${Number(data.totalAmount).toFixed(2)} 元`;
  await loadCart();
}

function sendCode() {
  loginMessage.value = "";
  if (!/^1\d{10}$/.test(loginForm.value.phone)) {
    loginMessage.value = "请输入正确的手机号";
    return;
  }
  codeSent.value = true;
  countdown.value = 60;
  loginMessage.value = "当前为登录演示，不会发送短信；可输入任意 6 位数字体验";
  window.clearInterval(countdownTimer);
  countdownTimer = window.setInterval(() => {
    countdown.value -= 1;
    if (countdown.value <= 0) window.clearInterval(countdownTimer);
  }, 1000);
}

function submitLogin() {
  loginMessage.value = "";
  if (!/^1\d{10}$/.test(loginForm.value.phone)) {
    loginMessage.value = "请输入正确的手机号";
    return;
  }
  if (!codeSent.value) {
    loginMessage.value = "请先获取验证码";
    return;
  }
  if (!/^\d{6}$/.test(loginForm.value.code)) {
    loginMessage.value = "请输入 6 位验证码";
    return;
  }
  localStorage.setItem("tile-store-phone", loginForm.value.phone);
  loggedInPhone.value = loginForm.value.phone;
  isLoggedIn.value = true;
  loginOpen.value = false;
  loginMessage.value = "";
}

function logout() {
  localStorage.removeItem("tile-store-phone");
  loggedInPhone.value = "";
  isLoggedIn.value = false;
}

function openLogin() {
  loginMessage.value = "";
  loginOpen.value = true;
}

function openProduct(product) {
  selectedProduct.value = product;
  detailOpen.value = true;
}

function closeProduct() {
  detailOpen.value = false;
  selectedProduct.value = null;
}

function addProductFromDetail(product) {
  closeProduct();
  addToCart(product);
}

function handleGlobalKeydown(event) {
  if (event.key !== "Escape") return;
  if (detailOpen.value) closeProduct();
  else if (cartOpen.value) cartOpen.value = false;
  else if (loginOpen.value) loginOpen.value = false;
}

function observeSpatialChapters() {
  if (!("IntersectionObserver" in window)) {
    document
      .querySelectorAll(".spatial-chapter")
      .forEach((section) => section.classList.add("is-in-view"));
    return;
  }

  chapterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in-view");
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
  );

  document
    .querySelectorAll(".spatial-chapter")
    .forEach((section) => chapterObserver.observe(section));
}

function tiltProductCard(event) {
  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    window.innerWidth < 768
  )
    return;
  const card = event.currentTarget;
  const bounds = card.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width;
  const y = (event.clientY - bounds.top) / bounds.height;
  card.style.setProperty("--tilt-x", `${(0.5 - y) * 5}deg`);
  card.style.setProperty("--tilt-y", `${(x - 0.5) * 7}deg`);
  card.style.setProperty("--light-x", `${x * 100}%`);
  card.style.setProperty("--light-y", `${y * 100}%`);
}

function resetProductCard(event) {
  event.currentTarget.style.setProperty("--tilt-x", "0deg");
  event.currentTarget.style.setProperty("--tilt-y", "0deg");
  event.currentTarget.style.setProperty("--light-x", "50%");
  event.currentTarget.style.setProperty("--light-y", "30%");
}

onMounted(async () => {
  window.addEventListener("keydown", handleGlobalKeydown);
  observeSpatialChapters();
  loggedInPhone.value = localStorage.getItem("tile-store-phone") || "";
  isLoggedIn.value = Boolean(loggedInPhone.value);
  try {
    const response = await fetch(apiUrl("/api/products"));
    if (!response.ok) throw new Error("商品读取失败");
    products.value = normalizeProducts(await response.json());
  } catch {
    products.value = fallbackProducts;
    isDemoMode.value = true;
    connectionMessage.value =
      "当前为看样预览，价格为示例，实际报价请以确认后的商品资料为准";
  } finally {
    await loadCart();
    loading.value = false;
  }
});

onUnmounted(() => {
  window.clearInterval(countdownTimer);
  window.removeEventListener("keydown", handleGlobalKeydown);
  chapterObserver?.disconnect();
});
</script>

<template>
  <main class="site-shell">
    <TileShowroomHero
      :cart-count="cartCount"
      :logged-in="isLoggedIn"
      :user-phone="userPhone"
      @login="isLoggedIn ? logout() : openLogin()"
      @bag="cartOpen = true"
    />

    <section class="promise-strip" aria-label="选砖体验">
      <a href="#gallery"
        ><strong>看真实纹理</strong><span>展厅现场与材质近景</span
        ><ArrowRight :size="20"
      /></a>
      <a href="#assistant"
        ><strong>找到适合的款式</strong><span>按空间、色调和预算挑选</span
        ><ArrowRight :size="20"
      /></a>
      <a href="#calculator"
        ><strong>心里有个数</strong><span>先估用量，再确认规格</span
        ><ArrowRight :size="20"
      /></a>
    </section>

    <MaterialGallery />
    <ShowroomReel :slides="carouselSlides" />

    <section
      id="material-atlas"
      class="material-experience section-space"
      aria-labelledby="material-title"
    >
      <div class="experience-copy">
        <h2 id="material-title">光落下来<br />纹理就有了层次</h2>
        <p>
          一片砖的颜色和光泽，会随着观察角度改变。看过照片，再在自然光下确认实物。
        </p>
        <a class="secondary-link roll-control" href="#gallery"
          ><RollingText text="回到材质图集" /><ArrowRight :size="18"
        /></a>
      </div>
      <div class="experience-stage"><TileMaterialStage /></div>
    </section>

    <section
      id="product-series"
      class="product-series section-space"
      aria-labelledby="series-title"
    >
      <div class="series-heading">
        <h2 id="series-title">从一块样片<br />找到整屋方向</h2>
        <p>先看纹理与规格，再结合采光和家具，找到舒服的搭配</p>
        <p class="gallery-note">
          系列信息参考品牌资料，配图仅作材质搭配参考，非对应型号实拍
        </p>
      </div>
      <div class="series-list">
        <article
          v-for="series in productSeries"
          :key="series.name"
          class="series-row"
        >
          <div class="series-image">
            <img
              :src="series.image"
              :alt="`${series.name}系列搭配参考照片，非商品实拍`"
              loading="lazy"
              width="720"
              height="960"
            />
          </div>
          <div class="series-copy">
            <h3>{{ series.name }}</h3>
            <span>{{ series.tag }}</span>
            <p>{{ series.description }}</p>
            <small>{{ series.sizes }}</small
            ><a class="secondary-link roll-control" href="#collection"
              ><RollingText text="查看精选款式" /><ArrowRight :size="18"
            /></a>
          </div>
        </article>
      </div>
    </section>

    <section id="collection" class="collection-section section-space">
      <div class="section-heading">
        <h2>把喜欢的样子带回家</h2>
        <p>找到喜欢的色调，再慢慢比较规格与预算</p>
      </div>
      <p v-if="connectionMessage" class="connection-message" role="status">
        {{ connectionMessage }}
      </p>
      <p class="gallery-note">
        本地配图仅作材质参考，型号花色与实际价格以实物资料为准
      </p>
      <div class="catalog-tools">
        <label class="catalog-search"
          ><span class="sr-only">搜索瓷砖</span
          ><input
            v-model.trim="searchQuery"
            type="search"
            placeholder="搜索名称或规格" /></label
        ><label class="catalog-sort"
          ><span class="sr-only">排序方式</span
          ><select v-model="sortOption">
            <option value="featured">推荐排序</option>
            <option value="price-asc">价格从低到高</option>
            <option value="price-desc">价格从高到低</option>
          </select></label
        >
      </div>
      <div class="category-tabs" role="group" aria-label="瓷砖分类">
        <button
          v-for="category in categories"
          :key="category.value"
          type="button"
          :aria-pressed="activeCategory === category.value"
          :class="{ active: activeCategory === category.value }"
          @click="activeCategory = category.value"
        >
          {{ category.label }}
        </button>
      </div>
      <p v-if="loading" class="state" role="status">正在为你准备精选款式</p>
      <div v-else class="product-grid">
        <article
          v-for="product in filteredProducts"
          :key="product.id"
          class="product-card"
          @pointermove="tiltProductCard"
          @pointerleave="resetProductCard"
        >
          <div class="product-image-wrap">
            <button
              class="product-preview"
              type="button"
              :aria-label="`查看${product.name}详情`"
              @click="openProduct(product)"
            >
              <img
                :src="product.imageUrl"
                :alt="`${product.name}搭配参考照片`"
                loading="lazy"
                width="720"
                height="960"
              /></button
            ><button
              class="quick-add icon-button"
              type="button"
              :aria-label="`加入${product.name}`"
              title="加入购物袋"
              @click="addToCart(product)"
            >
              <Plus :size="22" />
            </button>
          </div>
          <button
            class="product-info product-info-button"
            type="button"
            @click="openProduct(product)"
          >
            <div>
              <span class="product-category">{{
                categoryLabel(product.category)
              }}</span>
              <h3>{{ product.name }}</h3>
              <p>{{ product.specification }}</p>
            </div>
            <strong
              >¥{{ Number(product.price).toFixed(0)
              }}<small>/{{ product.unit }}</small></strong
            >
          </button>
          <button
            class="card-add roll-control"
            type="button"
            @click="addToCart(product)"
          >
            <RollingText text="加入购物袋" /><ArrowRight :size="18" />
          </button>
        </article>
      </div>
      <p v-if="!loading && !filteredProducts.length" class="state">
        没有找到合适的款式，可以换个关键词或分类
      </p>
      <p v-if="cartMessage" class="inline-message" role="status">
        {{ cartMessage }}
      </p>
    </section>

    <section id="inspiration" class="inspiration-section section-space">
      <div class="inspiration-image">
        <img
          src="/tiles/gallery/d5583051777a291a7ee183ca12506d31.webp"
          alt="几何花砖墙面在真实展厅中的空间效果"
          loading="lazy"
          width="720"
          height="960"
        />
      </div>
      <div class="inspiration-copy">
        <h2>让一点图案<br />成为空间的表情</h2>
        <p>
          大面积保持安静，小面积留给喜欢的图案。玄关、角落与墙面，都可以从一块花砖开始。
        </p>
        <a class="secondary-link roll-control" href="#gallery"
          ><RollingText text="寻找搭配灵感" /><ArrowRight :size="18"
        /></a>
      </div>
    </section>

    <section id="assistant" class="assistant-wrap section-space">
      <TileAssistant
        :products="products"
        :api-base-url="ASSISTANT_API_BASE_URL"
        @select-product="openProduct"
      />
    </section>
    <section id="calculator" class="calculator-wrap section-space">
      <TileCalculator :products="products" />
    </section>

    <section
      id="brand-profile"
      class="brand-profile section-space"
      aria-labelledby="brand-profile-title"
    >
      <div class="brand-profile-heading">
        <h2 id="brand-profile-title">好看的背后<br />还有值得了解的细节</h2>
        <p>了解系列、规格与产地，选砖时多一份依据</p>
      </div>
      <div class="brand-highlight-list">
        <div
          v-for="item in brandHighlights"
          :key="item.label"
          class="brand-highlight"
        >
          <span>{{ item.label }}</span
          ><strong>{{ item.value }}</strong
          ><small>{{ item.note }}</small>
        </div>
      </div>
    </section>

    <section id="service" class="service-section section-space">
      <div class="section-heading">
        <h2>从喜欢，到铺进日常</h2>
        <p>先找到方向，再确认细节</p>
      </div>
      <div class="service-list">
        <div>
          <h3>按空间挑选</h3>
          <p>厨房、卫生间、客厅，先明确使用位置，再比较花色、规格与表面工艺</p>
        </div>
        <div>
          <h3>在家里的光线下看样</h3>
          <p>
            把样片放在自己的墙面和家具旁，最终颜色与大面积铺贴效果以实物为准
          </p>
        </div>
        <div>
          <h3>确认用量与批次</h3>
          <p>结合施工测量留足损耗，同一空间尽量一次确认同批次瓷砖</p>
        </div>
      </div>
    </section>

    <section
      id="faq"
      class="faq-section section-space"
      aria-labelledby="faq-title"
    >
      <div class="section-heading">
        <h2 id="faq-title">选砖前，把疑问问清楚</h2>
        <p>把关键判断留在购买之前，选得更安心</p>
      </div>
      <div class="faq-list">
        <details>
          <summary>
            瓷砖为什么要多买一些<Plus class="faq-expand" :size="20" /><Minus
              class="faq-collapse"
              :size="20"
            />
          </summary>
          <p>
            铺贴时需要考虑裁切、损耗和后期维修留样。你可以先用上方用量估算器计算，再让施工人员结合现场尺寸确认。
          </p>
        </details>
        <details>
          <summary>
            不同批次会有色差吗<Plus class="faq-expand" :size="20" /><Minus
              class="faq-collapse"
              :size="20"
            />
          </summary>
          <p>
            纹理和生产批次可能存在轻微差异。建议同一空间一次确认足量，并保留少量余砖作为日后维修备用。
          </p>
        </details>
        <details>
          <summary>
            图片颜色和实物一样吗<Plus class="faq-expand" :size="20" /><Minus
              class="faq-collapse"
              :size="20"
            />
          </summary>
          <p>
            拍摄光线、显示屏与观察角度都会影响照片。图集适合找方向，颜色、光泽和规格最终请以实物为准。
          </p>
        </details>
        <details>
          <summary>
            选砖助手会替我下单吗<Plus class="faq-expand" :size="20" /><Minus
              class="faq-collapse"
              :size="20"
            />
          </summary>
          <p>
            不会。助手只提供筛选建议，商品价格、购物袋和订单提交仍由网站流程完成。目前登录与支付为演示功能，不会发送真实验证码或扣款。
          </p>
        </details>
      </div>
    </section>

    <footer class="site-footer">
      <a href="#top">Tile Store <span>瓷砖生活馆</span></a>
      <p>把家的质感铺在每一寸日常</p>
      <a href="#top">回到顶部<ArrowRight :size="18" /></a>
    </footer>

    <ModalSurface :open="cartOpen" label="购物袋" @close="cartOpen = false"
      ><aside class="cart-drawer">
        <div class="drawer-heading">
          <h2>
            购物袋 <small>{{ cartCount }} 件</small>
          </h2>
          <button
            class="close-button icon-button"
            type="button"
            aria-label="关闭购物袋"
            @click="cartOpen = false"
          >
            <X :size="22" />
          </button>
        </div>
        <p v-if="!cart.length" class="drawer-empty">
          还没有喜欢的款式<br />先去逛逛精选瓷砖
        </p>
        <div v-for="item in cart" :key="item.id" class="drawer-line">
          <img
            :src="item.product.imageUrl"
            :alt="item.product.name"
            width="72"
            height="88"
          />
          <div>
            <h3>{{ item.product.name }}</h3>
            <p>
              ¥{{ Number(item.product.price).toFixed(0) }} /
              {{ item.product.unit }}
            </p>
            <div class="stepper">
              <button
                type="button"
                aria-label="减少数量"
                @click="changeQuantity(item, item.quantity - 1)"
              >
                <Minus :size="14" /></button
              ><b>{{ item.quantity }}</b
              ><button
                type="button"
                aria-label="增加数量"
                @click="changeQuantity(item, item.quantity + 1)"
              >
                <Plus :size="14" />
              </button>
            </div>
          </div>
          <strong
            >¥{{
              (Number(item.product.price) * item.quantity).toFixed(0)
            }}</strong
          >
        </div>
        <div v-if="cart.length" class="drawer-bottom">
          <div>
            <span>合计</span><strong>¥{{ cartTotal.toFixed(0) }}</strong>
          </div>
          <form @submit.prevent="createOrder">
            <label
              >收货人<input
                v-model.trim="orderForm.receiverName"
                required
                placeholder="请输入姓名"
                autocomplete="name" /></label
            ><label
              >联系电话<input
                v-model.trim="orderForm.receiverPhone"
                type="tel"
                required
                pattern="1[0-9]{10}"
                placeholder="请输入手机号"
                autocomplete="tel" /></label
            ><label
              >收货地址<input
                v-model.trim="orderForm.shippingAddress"
                required
                placeholder="请输入详细地址"
                autocomplete="street-address" /></label
            ><button class="primary-button" type="submit">
              提交订单<ArrowRight :size="18" />
            </button>
          </form>
          <p class="auth-note">当前支付未开通，不会扣款</p>
          <p v-if="orderMessage" class="inline-message" role="status">
            {{ orderMessage }}
          </p>
        </div>
      </aside></ModalSurface
    >

    <ModalSurface
      :open="loginOpen"
      label="登录"
      class="auth-overlay"
      @close="loginOpen = false"
      ><section class="auth-panel">
        <button
          class="close-button icon-button"
          type="button"
          aria-label="关闭登录"
          @click="loginOpen = false"
        >
          <X :size="22" />
        </button>
        <h2>继续挑选<br />喜欢的砖</h2>
        <p class="auth-intro">登录演示，不发送真实短信验证码</p>
        <form class="auth-form" @submit.prevent="submitLogin">
          <label
            >手机号<input
              v-model.trim="loginForm.phone"
              type="tel"
              inputmode="numeric"
              maxlength="11"
              placeholder="请输入手机号"
              autocomplete="tel" /></label
          ><label
            >验证码
            <div class="code-field">
              <input
                v-model.trim="loginForm.code"
                type="text"
                inputmode="numeric"
                maxlength="6"
                placeholder="请输入 6 位数字"
                autocomplete="one-time-code"
              /><button
                type="button"
                :disabled="countdown > 0"
                @click="sendCode"
              >
                {{ countdown > 0 ? `${countdown}s 后重发` : "获取验证码" }}
              </button>
            </div></label
          ><button class="primary-button auth-submit" type="submit">
            登录 / 注册<ArrowRight :size="18" />
          </button>
        </form>
        <p v-if="loginMessage" class="form-message" role="status">
          {{ loginMessage }}
        </p>
        <p class="auth-note">首次登录即代表你同意我们的服务说明</p>
      </section></ModalSurface
    >
    <ProductDetailModal
      :product="selectedProduct"
      :open="detailOpen"
      @close="closeProduct"
      @add="addProductFromDetail"
    />
  </main>
</template>
