<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const apiUrl = (path) => `${API_BASE_URL}${path}`;

const tileImages = {
  mist: '/tiles/catalog/007b0ab2d6654d5a033f3667f1ae4f64.jpg',
  cream: '/tiles/catalog/0b0e09f43ad26bb35e158a45c6212761.jpg',
  terracotta: '/tiles/catalog/0e61d33ed68c584ec2d3f21b56038f61.jpg',
  blueGrey: '/tiles/catalog/516ff1495a194af0486a4b67227478db.jpg',
  marble: '/tiles/catalog/26955489c0b976d96d467241bf10e473.jpg'
};
const tileImageByName = {
  '雾灰石纹': tileImages.mist,
  '奶油白微水泥': tileImages.cream,
  '墨岩黑大板': tileImages.marble,
  '原木浅棕': tileImages.terracotta
};
const fallbackProducts = [
  { id: 1, name: '雾灰石纹', category: 'floor', price: 128, unit: '㎡', specification: 'MAT-042 · 600×1200mm', imageUrl: tileImages.mist },
  { id: 2, name: '奶油白微水泥', category: 'wall', price: 156, unit: '㎡', specification: 'WAL-018 · 750×1500mm', imageUrl: tileImages.cream },
  { id: 3, name: '墨岩黑大板', category: 'slab', price: 298, unit: '㎡', specification: 'SLB-007 · 900×1800mm', imageUrl: tileImages.marble },
  { id: 4, name: '原木浅棕', category: 'floor', price: 96, unit: '㎡', specification: 'WD-031 · 200×1200mm', imageUrl: tileImages.terracotta }
];
const carouselSlides = [
  { name: '现场看样', spec: '展厅实拍 · 现场光线', label: '真实动线', video: '/videos/showroom-02.mp4', poster: tileImages.mist, alt: '瓷砖展厅现场视频' },
  { name: '暖色纹理', spec: '样板墙 · 近距离观察', label: '温润质感', video: '/videos/showroom-03.mp4', poster: tileImages.terracotta, alt: '暖色瓷砖样板墙视频' },
  { name: '展厅细节', spec: '大板陈列 · 实拍画面', label: '清晰看样', video: '/videos/showroom-04.mp4', poster: tileImages.cream, alt: '瓷砖展厅样板视频' }
];

const categoryLabels = { floor: '地面砖', wall: '墙面砖', slab: '岩板' };
const categories = [
  { value: '全部', label: '全部瓷砖' },
  { value: 'floor', label: '地面砖' },
  { value: 'wall', label: '墙面砖' },
  { value: 'slab', label: '岩板大板' }
];

const products = ref([]);
const loading = ref(true);
const activeCategory = ref('全部');
const isDemoMode = ref(false);
const cart = ref([]);
const cartOpen = ref(false);
const cartMessage = ref('');
const orderMessage = ref('');
const orderForm = ref({ receiverName: '', receiverPhone: '', shippingAddress: '', paymentMethod: 'WECHAT_PAY' });

const loginOpen = ref(false);
const isLoggedIn = ref(false);
const loginForm = ref({ phone: '', code: '' });
const codeSent = ref(false);
const countdown = ref(0);
const loginMessage = ref('');
const currentSlide = ref(0);
let countdownTimer;
let carouselTimer;
const videoRefs = ref([]);

const filteredProducts = computed(() => activeCategory.value === '全部'
  ? products.value
  : products.value.filter((product) => product.category === activeCategory.value));
const cartTotal = computed(() => cart.value.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0));
const cartCount = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0));
const userPhone = computed(() => {
  const phone = localStorage.getItem('tile-store-phone') || '';
  return phone ? `${phone.slice(0, 3)}****${phone.slice(-4)}` : '';
});

function normalizeProducts(list) {
  return list.map((product) => ({
    ...product,
    imageUrl: tileImageByName[product.name] || product.imageUrl || tileImages.mist
  }));
}

function categoryLabel(category) {
  return categoryLabels[category] || '精选瓷砖';
}

function readDemoCart() {
  try {
    cart.value = JSON.parse(localStorage.getItem('tile-store-cart') || '[]');
  } catch {
    cart.value = [];
  }
}

function saveDemoCart() {
  localStorage.setItem('tile-store-cart', JSON.stringify(cart.value));
}

async function loadCart() {
  if (isDemoMode.value) {
    readDemoCart();
    return;
  }
  try {
    const response = await fetch(apiUrl('/api/cart?cartKey=demo-user'));
    if (!response.ok) throw new Error('购物车读取失败');
    cart.value = await response.json();
  } catch {
    isDemoMode.value = true;
    readDemoCart();
  }
}

async function addToCart(product) {
  cartMessage.value = '';
  if (isDemoMode.value) {
    const existing = cart.value.find((item) => item.product.id === product.id);
    if (existing) existing.quantity += 1;
    else cart.value.push({ id: `demo-${product.id}`, product, quantity: 1 });
    saveDemoCart();
  } else {
    const response = await fetch(apiUrl('/api/cart?cartKey=demo-user'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, quantity: 1 })
    });
    if (!response.ok) {
      cartMessage.value = '暂时没能加入购物袋，请稍后再试';
      return;
    }
    await loadCart();
  }
  cartMessage.value = `${product.name} 已加入购物袋`;
  cartOpen.value = true;
}

async function changeQuantity(item, quantity) {
  if (quantity < 1) {
    cart.value = cart.value.filter((line) => line.id !== item.id);
    if (isDemoMode.value) saveDemoCart();
    else await fetch(apiUrl(`/api/cart/${item.product.id}?cartKey=demo-user`), { method: 'DELETE' });
    return;
  }
  if (isDemoMode.value) {
    item.quantity = quantity;
    saveDemoCart();
    return;
  }
  const response = await fetch(apiUrl(`/api/cart/${item.product.id}?cartKey=demo-user`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity })
  });
  if (response.ok) await loadCart();
}

async function createOrder() {
  orderMessage.value = '';
  if (isDemoMode.value) {
    orderMessage.value = '订单信息已记录，正式营业后会有专人和你确认';
    cart.value = [];
    saveDemoCart();
    return;
  }
  const response = await fetch(apiUrl('/api/orders?cartKey=demo-user'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderForm.value)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    orderMessage.value = data.message || '创建订单失败，请检查填写内容';
    return;
  }
  orderMessage.value = `订单 ${data.orderNumber} 已创建，应付 ${Number(data.totalAmount).toFixed(2)} 元`;
  await loadCart();
}

function sendCode() {
  loginMessage.value = '';
  if (!/^1\d{10}$/.test(loginForm.value.phone)) {
    loginMessage.value = '请输入正确的手机号';
    return;
  }
  codeSent.value = true;
  countdown.value = 60;
  loginMessage.value = '验证码已发送，请注意查收';
  window.clearInterval(countdownTimer);
  countdownTimer = window.setInterval(() => {
    countdown.value -= 1;
    if (countdown.value <= 0) window.clearInterval(countdownTimer);
  }, 1000);
}

function submitLogin() {
  loginMessage.value = '';
  if (!codeSent.value) {
    loginMessage.value = '请先获取验证码';
    return;
  }
  if (!/^\d{6}$/.test(loginForm.value.code)) {
    loginMessage.value = '请输入 6 位验证码';
    return;
  }
  localStorage.setItem('tile-store-phone', loginForm.value.phone);
  isLoggedIn.value = true;
  loginOpen.value = false;
  loginMessage.value = '';
}

function logout() {
  localStorage.removeItem('tile-store-phone');
  isLoggedIn.value = false;
}

function openLogin() {
  loginMessage.value = '';
  loginOpen.value = true;
}

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % carouselSlides.length;
}

function previousSlide() {
  currentSlide.value = (currentSlide.value - 1 + carouselSlides.length) % carouselSlides.length;
}

function setVideoRef(element, index) {
  if (element) videoRefs.value[index] = element;
}

function syncCarouselVideos() {
  videoRefs.value.forEach((video, index) => {
    if (!video) return;
    if (index === currentSlide.value) video.play().catch(() => {});
    else video.pause();
  });
}

function startCarousel() {
  window.clearInterval(carouselTimer);
  carouselTimer = window.setInterval(nextSlide, 5000);
  nextTick(syncCarouselVideos);
}

function stopCarousel() {
  window.clearInterval(carouselTimer);
  videoRefs.value[currentSlide.value]?.pause();
}

watch(currentSlide, () => nextTick(syncCarouselVideos));

onMounted(async () => {
  isLoggedIn.value = Boolean(localStorage.getItem('tile-store-phone'));
  try {
    const response = await fetch(apiUrl('/api/products'));
    if (!response.ok) throw new Error('商品读取失败');
    products.value = normalizeProducts(await response.json());
  } catch {
    products.value = fallbackProducts;
    isDemoMode.value = true;
  } finally {
    await loadCart();
    loading.value = false;
    startCarousel();
    nextTick(syncCarouselVideos);
  }
});

onUnmounted(() => {
  window.clearInterval(countdownTimer);
  window.clearInterval(carouselTimer);
});
</script>

<template>
  <main class="site-shell">
    <header class="site-header">
      <a class="brand" href="#top" aria-label="回到首页"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span><strong>TILE STORE</strong><small>瓷砖生活馆</small></span></a>
      <nav class="main-nav" aria-label="主导航"><a href="#collection">精选瓷砖</a><a href="#inspiration">空间灵感</a><a href="#service">选砖服务</a></nav>
      <div class="header-actions"><button class="text-button" type="button" @click="isLoggedIn ? logout() : openLogin()">{{ isLoggedIn ? userPhone : '登录' }}</button><button class="bag-button" type="button" aria-label="打开购物袋" @click="cartOpen = true"><span class="bag-icon" aria-hidden="true"></span><span>购物袋</span><b v-if="cartCount">{{ cartCount }}</b></button></div>
    </header>

    <section id="top" class="hero-section"><div class="hero-copy"><p class="hero-kicker">把纹理看清楚</p><h1>好瓷砖<br /><em>值得慢慢挑</em></h1><p class="hero-description">从柔和的雾灰，到温润的奶油白，先看清颜色、触感和纹理，再决定哪一块适合你的空间</p><div class="hero-actions"><a class="primary-button" href="#collection">开始选砖 <span aria-hidden="true">↗</span></a><a class="secondary-link" href="#service">了解选砖服务</a></div><div class="hero-notes"><span><b>01</b>真实纹理</span><span><b>02</b>小样先看</span><span><b>03</b>按需搭配</span></div></div><div class="hero-visual" @mouseenter="stopCarousel" @mouseleave="startCarousel"><div class="carousel-frame" aria-live="polite"><video v-for="(slide, index) in carouselSlides" :key="slide.name" :ref="(element) => setVideoRef(element, index)" class="carousel-video" :class="{ active: index === currentSlide }" :src="slide.video" :poster="slide.poster" :aria-label="slide.alt" muted loop playsinline preload="metadata"></video></div><div class="hero-tag"><span>{{ carouselSlides[currentSlide].label }}</span><strong>{{ carouselSlides[currentSlide].name }}</strong><small>{{ carouselSlides[currentSlide].spec }}</small></div><div class="hero-stamp">纹理<br />清晰<br />耐看</div><button class="carousel-arrow carousel-prev" type="button" aria-label="上一张" @click="previousSlide">‹</button><button class="carousel-arrow carousel-next" type="button" aria-label="下一张" @click="nextSlide">›</button><div class="carousel-dots" role="tablist" aria-label="首屏视频切换"><button v-for="(slide, index) in carouselSlides" :key="`${slide.name}-dot`" type="button" :class="{ active: index === currentSlide }" :aria-label="`查看${slide.name}`" :aria-selected="index === currentSlide" role="tab" @click="currentSlide = index; startCarousel()"></button></div></div></section>

    <section class="promise-strip" aria-label="选砖承诺"><div><span class="promise-number">01</span><span><strong>真实纹理</strong><small>每一块都经得起近看</small></span></div><div><span class="promise-number">02</span><span><strong>小样先行</strong><small>把喜欢带回家再决定</small></span></div><div><span class="promise-number">03</span><span><strong>细致建议</strong><small>按空间给你搭配灵感</small></span></div></section>

    <section id="collection" class="collection-section"><div class="section-heading"><div><p class="section-kicker">今日选砖</p><h2>把喜欢的样子带回家</h2></div><p>精选耐看的材质与纹理<br />让每一次选择都更笃定</p></div><div class="category-tabs" role="tablist" aria-label="瓷砖分类"><button v-for="category in categories" :key="category.value" type="button" :class="{ active: activeCategory === category.value }" @click="activeCategory = category.value">{{ category.label }}</button></div><p v-if="loading" class="state">正在为你准备精选款式</p><div v-else class="product-grid"><article v-for="(product, index) in filteredProducts" :key="product.id" class="product-card" :class="`card-${index + 1}`"><div class="product-image-wrap"><img :src="product.imageUrl" :alt="product.name" /><span class="product-category">{{ categoryLabel(product.category) }}</span><button class="quick-add" type="button" :aria-label="`加入${product.name}`" @click="addToCart(product)">+</button></div><div class="product-info"><div><h3>{{ product.name }}</h3><p>{{ product.specification }}</p></div><strong>¥{{ Number(product.price).toFixed(0) }}<small>/{{ product.unit }}</small></strong></div><button class="card-add" type="button" @click="addToCart(product)">加入购物袋 <span aria-hidden="true">↗</span></button></article></div><p v-if="!loading && !filteredProducts.length" class="state">这个分类暂时没有款式</p><p v-if="cartMessage" class="inline-message">{{ cartMessage }}</p></section>

    <section id="inspiration" class="inspiration-section"><div class="inspiration-image"><img :src="tileImages.cream" alt="奶油白瓷砖的细腻表面" /><span>纹理观察 · 奶油白</span></div><div class="inspiration-copy"><p class="section-kicker">选砖灵感</p><h2>先看清纹理<br />再想象铺好的样子</h2><p>同一块砖在不同光线下会有不同表情，放大细节，颜色和质感都更容易判断</p><a class="secondary-link" href="#collection">查看全部款式 <span aria-hidden="true">↗</span></a></div></section>

    <section id="service" class="service-section"><div class="section-heading"><div><p class="section-kicker">选砖服务</p><h2>从看样到铺好<br />每一步都有回应</h2></div><a class="secondary-link" href="#top">回到顶部 <span aria-hidden="true">↑</span></a></div><div class="service-list"><div><span>01</span><h3>按空间挑选</h3><p>厨房、卫生间、客厅，不同场景有不同的耐用答案</p></div><div><span>02</span><h3>小样先寄到家</h3><p>在自己的光线和家具旁，看清真实颜色再做决定</p></div><div><span>03</span><h3>到店慢慢体验</h3><p>来店里摸一摸、比一比，找到最合心意的那一块</p></div></div></section>

    <footer class="site-footer"><span>TILE STORE · 瓷砖生活馆</span><span>把家的质感铺在每一寸日常</span></footer>

    <div v-if="cartOpen" class="overlay" @click.self="cartOpen = false"><aside class="cart-drawer" aria-label="购物袋"><div class="drawer-heading"><div><p class="section-kicker">我的选择</p><h2>购物袋 <small>{{ cartCount }} 件</small></h2></div><button class="close-button" type="button" aria-label="关闭购物袋" @click="cartOpen = false">×</button></div><p v-if="!cart.length" class="drawer-empty">还没有喜欢的款式<br />先去逛逛精选瓷砖</p><div v-for="item in cart" :key="item.id" class="drawer-line"><img :src="item.product.imageUrl" :alt="item.product.name" /><div><h3>{{ item.product.name }}</h3><p>¥{{ Number(item.product.price).toFixed(0) }} / {{ item.product.unit }}</p><div class="stepper"><button type="button" aria-label="减少数量" @click="changeQuantity(item, item.quantity - 1)">−</button><b>{{ item.quantity }}</b><button type="button" aria-label="增加数量" @click="changeQuantity(item, item.quantity + 1)">+</button></div></div><strong>¥{{ (Number(item.product.price) * item.quantity).toFixed(0) }}</strong></div><div v-if="cart.length" class="drawer-bottom"><div><span>合计</span><strong>¥{{ cartTotal.toFixed(0) }}</strong></div><form @submit.prevent="createOrder"><label>收货人<input v-model.trim="orderForm.receiverName" required placeholder="请输入姓名" /></label><label>联系电话<input v-model.trim="orderForm.receiverPhone" required pattern="1[0-9]{10}" placeholder="请输入手机号" /></label><label>收货地址<input v-model.trim="orderForm.shippingAddress" required placeholder="请输入详细地址" /></label><button class="primary-button" type="submit">提交订单 <span aria-hidden="true">↗</span></button></form><p v-if="orderMessage" class="inline-message">{{ orderMessage }}</p></div></aside></div>

    <div v-if="loginOpen" class="overlay auth-overlay" @click.self="loginOpen = false"><section class="auth-panel" aria-label="登录"><button class="close-button" type="button" aria-label="关闭登录" @click="loginOpen = false">×</button><div class="auth-mark"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span></div><p class="section-kicker">欢迎回来</p><h2>登录后<br /><em>继续挑选喜欢的砖</em></h2><p class="auth-intro">收藏喜欢的款式，购物袋会一直替你记着</p><form class="auth-form" @submit.prevent="submitLogin"><label>手机号<input v-model.trim="loginForm.phone" type="tel" inputmode="numeric" maxlength="11" placeholder="请输入手机号" autocomplete="tel" /></label><label>验证码<div class="code-field"><input v-model.trim="loginForm.code" type="text" inputmode="numeric" maxlength="6" placeholder="请输入 6 位验证码" autocomplete="one-time-code" /><button type="button" :disabled="countdown > 0" @click="sendCode">{{ countdown > 0 ? `${countdown}s 后重发` : '获取验证码' }}</button></div></label><button class="primary-button auth-submit" type="submit">登录 / 注册 <span aria-hidden="true">↗</span></button></form><p v-if="loginMessage" class="form-message">{{ loginMessage }}</p><p class="auth-note">首次登录即代表你同意我们的服务说明</p></section></div>
  </main>
</template>
