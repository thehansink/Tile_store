<script setup>
import { onMounted, ref } from 'vue';

const products = ref([]);
const loading = ref(true);
const error = ref('');
const cart = ref([]);
const cartMessage = ref('');
const orderMessage = ref('');
const orderForm = ref({ receiverName: '', receiverPhone: '', shippingAddress: '', paymentMethod: 'WECHAT_PAY' });

async function loadCart() {
  const response = await fetch('/api/cart?cartKey=demo-user');
  if (!response.ok) throw new Error('购物车读取失败');
  cart.value = await response.json();
}

async function addToCart(product) {
  cartMessage.value = '';
  const response = await fetch('/api/cart?cartKey=demo-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId: product.id, quantity: 1 })
  });
  if (!response.ok) { cartMessage.value = '加入购物车失败，请确认后端和数据库正在运行'; return; }
  await loadCart();
  cartMessage.value = `${product.name} 已加入购物车`;
}

async function changeQuantity(item, quantity) {
  if (quantity < 1) return;
  const response = await fetch(`/api/cart/${item.product.id}?cartKey=demo-user`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity })
  });
  if (response.ok) await loadCart();
}

const cartTotal = () => cart.value.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);

async function createOrder() {
  orderMessage.value = '';
  const response = await fetch('/api/orders?cartKey=demo-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderForm.value)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) { orderMessage.value = data.message || '创建订单失败，请检查填写内容'; return; }
  orderMessage.value = `订单 ${data.orderNumber} 已创建，应付 ${Number(data.totalAmount).toFixed(2)} 元。当前为演示订单，不会真实扣款。`;
  await loadCart();
}

onMounted(async () => {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) throw new Error('商品接口暂时不可用');
    products.value = await response.json();
    await loadCart();
  } catch (err) {
    error.value = `${err.message}。请先启动 Java 后端`;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <main class="app-shell">
    <header class="app-header"><span class="mark">TS</span><strong>Tile_store</strong><span class="status">Vue 商城接口预览</span></header>
    <section class="intro"><p class="eyebrow">PRODUCT CATALOG</p><h1>从领盛家居里，<em>挑一块好瓷砖</em></h1><p>这是前后端分离的第一步：Vue 页面正在读取 Spring MVC 商品接口。</p></section>
    <p v-if="loading" class="state">正在读取商品...</p>
    <p v-else-if="error" class="state error">{{ error }}</p>
    <section v-else class="products"><article v-for="product in products" :key="product.id" class="product"><img :src="product.imageUrl" :alt="product.name" /><div><h2>{{ product.name }}</h2><p>{{ product.specification }} · {{ product.unit }}</p><strong>¥ {{ product.price }}</strong><button class="add-button" @click="addToCart(product)">加入购物车</button></div></article><p v-if="!products.length" class="state">数据库中还没有商品。</p></section>
    <p v-if="cartMessage" class="cart-message">{{ cartMessage }}</p>
    <section class="cart-panel"><div><p class="eyebrow">DATABASE CART</p><h2>我的购物车</h2></div><p v-if="!cart.length" class="state">购物车还是空的，先挑一块砖。</p><div v-for="item in cart" :key="item.id" class="cart-line"><span>{{ item.product.name }}</span><span class="stepper"><button @click="changeQuantity(item, item.quantity - 1)" aria-label="减少数量">−</button><b>{{ item.quantity }}</b><button @click="changeQuantity(item, item.quantity + 1)" aria-label="增加数量">+</button></span><strong>¥ {{ (Number(item.product.price) * item.quantity).toFixed(2) }}</strong></div><div class="cart-total" v-if="cart.length"><span>合计</span><strong>¥ {{ cartTotal().toFixed(2) }}</strong></div></section>
    <section v-if="cart.length" class="checkout-panel"><div><p class="eyebrow">DEMO CHECKOUT</p><h2>确认订单</h2><p>填写信息后会生成 MySQL 订单记录。此处不会调用真实微信支付或支付宝。</p></div><form @submit.prevent="createOrder"><label>收货人<input v-model.trim="orderForm.receiverName" required placeholder="请输入姓名" /></label><label>联系电话<input v-model.trim="orderForm.receiverPhone" required pattern="1[0-9]{10}" placeholder="请输入 11 位手机号" /></label><label>收货地址<input v-model.trim="orderForm.shippingAddress" required placeholder="省 / 市 / 区 / 详细地址" /></label><label>支付方式<select v-model="orderForm.paymentMethod"><option value="WECHAT_PAY">微信支付</option><option value="ALIPAY">支付宝</option><option value="STORE_PAY">到店付款</option></select></label><button class="add-button" type="submit">创建订单</button></form><p v-if="orderMessage" class="cart-message">{{ orderMessage }}</p></section>
  </main>
</template>
