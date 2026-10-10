<script setup>
import { computed, ref, watch } from 'vue';
import { calculateTileEstimate, DEFAULT_WASTE_RATE } from '../utils/tileCalculator';

const props = defineProps({
  products: { type: Array, default: () => [] }
});

const selectedId = ref(null);
const length = ref('');
const width = ref('');
const wasteRate = ref(DEFAULT_WASTE_RATE);
const coveragePerBox = ref('');

const selectedProduct = computed(() => props.products.find((product) => product.id === selectedId.value) || props.products[0]);
watch(selectedProduct, (product) => {
  coveragePerBox.value = product?.coveragePerBox ? String(product.coveragePerBox) : '';
}, { immediate: true });
const estimate = computed(() => selectedProduct.value ? calculateTileEstimate({
  length: length.value,
  width: width.value,
  wasteRate: wasteRate.value,
  price: selectedProduct.value.price,
  coveragePerBox: coveragePerBox.value
}) : null);

function selectDefaultProduct() {
  if (!selectedId.value && props.products.length) selectedId.value = props.products[0].id;
}

selectDefaultProduct();
</script>

<template>
  <section class="calculator-panel" aria-labelledby="calculator-title">
    <div class="calculator-heading">
      <p class="section-kicker">用量估算</p>
      <h3 id="calculator-title">先算清楚，再决定买多少</h3>
      <p>输入房间尺寸，按预计损耗率估算箱数和金额</p>
    </div>
    <div class="calculator-form">
      <label>选择瓷砖<select v-model="selectedId"><option v-for="product in products" :key="product.id" :value="product.id">{{ product.name }}</option></select></label>
      <label>房间长度（米）<input v-model="length" type="number" min="0.1" step="0.1" placeholder="例如 4.2" /></label>
      <label>房间宽度（米）<input v-model="width" type="number" min="0.1" step="0.1" placeholder="例如 3.6" /></label>
      <label>每箱覆盖面积（㎡）<input v-model="coveragePerBox" type="number" min="0.01" step="0.01" placeholder="查看商品包装后填写" /></label>
      <label>预计损耗（{{ wasteRate }}%）<input v-model.number="wasteRate" type="range" min="0" max="20" step="1" /></label>
    </div>
    <div v-if="estimate" class="calculator-result" aria-live="polite">
      <div><span>房间面积</span><strong>{{ estimate.area }}㎡</strong></div>
      <div><span>建议购买</span><strong>{{ estimate.boxes }} 箱</strong></div>
      <div><span>预计金额</span><strong>¥{{ estimate.estimatedTotal.toFixed(0) }}</strong></div>
    </div>
    <p v-else class="calculator-hint">填写房间尺寸和包装上的每箱覆盖面积后，会显示预计用量</p>
    <p class="calculator-note">仅供参考，损耗按{{ wasteRate }}%估算；每箱覆盖面积请以商品包装标注为准</p>
  </section>
</template>
