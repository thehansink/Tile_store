<script setup>
import { computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  product: { type: Object, default: null },
  open: { type: Boolean, default: false }
});

const emit = defineEmits(['close', 'add']);

const detail = computed(() => {
  if (!props.product) return null;
  return props.product;
});

const categoryLabels = { floor: '地面砖', wall: '墙面砖', slab: '岩板' };

function handleKeydown(event) {
  if (props.open && event.key === 'Escape') emit('close');
}

onMounted(() => window.addEventListener('keydown', handleKeydown));
onUnmounted(() => window.removeEventListener('keydown', handleKeydown));
</script>

<template>
  <div v-if="open && detail" class="overlay detail-overlay" @click.self="emit('close')">
    <section class="detail-panel" role="dialog" aria-modal="true" :aria-label="`${detail.name}商品详情`">
      <button class="close-button" type="button" aria-label="关闭商品详情" @click="emit('close')">×</button>
      <div class="detail-image"><img :src="detail.imageUrl" :alt="`${detail.name}瓷砖纹理`" /></div>
      <div class="detail-copy">
        <p class="section-kicker">商品详情</p>
        <h2>{{ detail.name }}</h2>
        <p class="detail-spec">{{ detail.specification }}</p>
        <p class="detail-description">查看商品规格与计价信息；材质工艺和适用空间以实际商品资料为准</p>
        <dl class="detail-facts">
          <div><dt>商品类别</dt><dd>{{ categoryLabels[detail.category] || '精选瓷砖' }}</dd></div>
          <div><dt>商品规格</dt><dd>{{ detail.specification || '资料待补充' }}</dd></div>
          <div><dt>计价方式</dt><dd>按平方米计价</dd></div>
        </dl>
        <div class="detail-price"><strong>¥{{ Number(detail.price).toFixed(0) }}</strong><span>/{{ detail.unit }}</span></div>
        <button class="primary-button" type="button" @click="emit('add', detail)">加入购物袋 <span aria-hidden="true">↗</span></button>
        <p class="detail-note">参数为当前商品资料，铺贴用量请以现场测量为准</p>
      </div>
    </section>
  </div>
</template>
