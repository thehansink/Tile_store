<script setup>
import { computed, nextTick, ref } from 'vue';

const props = defineProps({
  products: { type: Array, default: () => [] },
  apiBaseUrl: { type: String, default: '' }
});

const emit = defineEmits(['select-product']);
const message = ref('');
const reply = ref('');
const recommendations = ref([]);
const requirements = ref({});
const loading = ref(false);
const error = ref('');
const demoMode = ref(false);
const inputRef = ref(null);
const quickQuestions = [
  { label: '客厅 · 暖色 · 耐看', value: '我想选客厅地砖，喜欢暖一点的颜色，预算每平方米 150 元左右' },
  { label: '卫生间 · 墙面砖', value: '卫生间墙面砖怎么选，希望空间看起来明亮一些' },
  { label: '厨房 · 好打理', value: '厨房墙面砖，想要浅色、日常好打理，预算适中' },
  { label: '岩板 · 电视墙', value: '想做电视墙岩板，喜欢沉稳的深色，预算每平方米 300 元左右' }
];

const requirementSummary = computed(() => {
  const labels = [];
  const category = { floor: '地面砖', wall: '墙面砖', slab: '岩板' }[requirements.value.category];
  const tone = { warm: '暖色调', dark: '深色调', neutral: '中性色' }[requirements.value.tone];
  if (category) labels.push(category);
  if (tone) labels.push(tone);
  if (requirements.value.budget) labels.push(`预算 ¥${requirements.value.budget}/㎡`);
  return labels;
});

function useQuestion(question) {
  message.value = question.value;
  nextTick(() => inputRef.value?.focus());
}

function detectLocalRequirements(text) {
  const normalized = text.toLowerCase();
  const category = normalized.includes('卫生间') || normalized.includes('厨房') ? 'wall' : normalized.includes('岩板') || normalized.includes('电视墙') ? 'slab' : normalized.includes('客厅') || normalized.includes('卧室') || normalized.includes('地砖') ? 'floor' : '';
  const tone = normalized.includes('暖') || normalized.includes('棕') || normalized.includes('木') || normalized.includes('奶油') ? 'warm' : normalized.includes('深') || normalized.includes('黑') ? 'dark' : normalized.includes('灰') || normalized.includes('浅') || normalized.includes('白') ? 'neutral' : '';
  const budgetMatch = normalized.match(/(?:预算|每平方米|每平|¥|￥)\s*(\d+(?:\.\d+)?)/);
  return { category, tone, budget: budgetMatch ? Number(budgetMatch[1]) : null };
}

function localRecommend(text) {
  const normalized = text.toLowerCase();
  const colorMatch = normalized.includes('暖') || normalized.includes('棕') ? '原木浅棕' : normalized.includes('深') || normalized.includes('黑') ? '墨岩黑大板' : '';
  const roomMatch = normalized.includes('卫生间') || normalized.includes('厨房') ? 'wall' : normalized.includes('客厅') || normalized.includes('卧室') ? 'floor' : '';
  return props.products
    .filter((product) => (!roomMatch || product.category === roomMatch) || product.name === colorMatch)
    .slice(0, 3);
}

async function askAssistant() {
  if (!message.value.trim() || loading.value) return;
  loading.value = true;
  error.value = '';
  demoMode.value = false;
  try {
    const response = await fetch(`${props.apiBaseUrl || '/assistant-api'}/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: message.value.trim() })
    });
    if (!response.ok) throw new Error('助手暂时不可用');
    const data = await response.json();
    reply.value = data.reply;
    requirements.value = data.requirements || {};
    recommendations.value = (data.recommendations || []).map((recommendation) => {
      const product = props.products.find((item) => item.id === recommendation.id || item.name === recommendation.name);
      return product ? { ...product, recommendationReason: recommendation.recommendationReason } : recommendation;
    });
  } catch {
    demoMode.value = true;
    requirements.value = detectLocalRequirements(message.value);
    recommendations.value = localRecommend(message.value).map((product) => ({
      ...product,
      recommendationReason: '根据你描述的使用空间和偏好筛选'
    }));
    reply.value = recommendations.value.length ? '我先根据你的描述挑了几款，打开商品详情可以继续看规格' : '你可以告诉我使用空间、喜欢的颜色和预算，我再帮你缩小范围';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section class="assistant-section" aria-labelledby="assistant-title">
    <div class="assistant-intro">
      <p class="section-kicker">选砖助手</p>
      <h2 id="assistant-title">把你的想法说出来</h2>
      <p>不用记规格，告诉我空间、颜色和预算，我会先替你缩小范围</p>
      <div class="assistant-steps" aria-label="助手流程"><span><b>1</b>描述需求</span><span><b>2</b>得到推荐</span><span><b>3</b>打开详情</span></div>
    </div>
    <div class="assistant-box">
      <p class="assistant-prompt">不知道怎么问？先选一个方向</p>
      <div class="quick-questions">
        <button v-for="question in quickQuestions" :key="question.label" type="button" @click="useQuestion(question)">{{ question.label }}</button>
      </div>
      <form class="assistant-form" @submit.prevent="askAssistant">
        <label class="sr-only" for="assistant-message">描述你的选砖需求</label>
        <input id="assistant-message" ref="inputRef" v-model.trim="message" placeholder="例如：我家客厅采光一般，想要耐看的浅色地砖" />
        <button class="primary-button" type="submit" :disabled="loading || !message.trim()">{{ loading ? '正在整理' : '开始推荐' }} <span aria-hidden="true">↗</span></button>
      </form>
      <div v-if="requirementSummary.length" class="assistant-filters" aria-label="已识别的选砖条件"><span v-for="item in requirementSummary" :key="item">{{ item }}</span></div>
      <p v-if="reply" class="assistant-reply" aria-live="polite">{{ reply }}<small v-if="demoMode">当前为本地演示推荐，启动助手服务后会走 LangGraph 流程</small></p>
      <div v-if="recommendations.length" class="assistant-results" aria-label="推荐瓷砖">
        <button v-for="product in recommendations" :key="product.id" type="button" class="assistant-result" @click="emit('select-product', product)">
          <img :src="product.imageUrl" :alt="`${product.name}瓷砖纹理`" />
          <span><strong>{{ product.name }}</strong><small>{{ product.recommendationReason || product.specification || '精选瓷砖' }}</small></span>
          <b>查看详情 <span aria-hidden="true">↗</span></b>
        </button>
      </div>
      <p v-if="!reply && !loading" class="assistant-note">推荐只做参考，价格与商品信息以商品详情为准</p>
      <p v-if="error" class="form-message">{{ error }}</p>
    </div>
  </section>
</template>
