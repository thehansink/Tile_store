const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
menuToggle?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

const filterButtons = [...document.querySelectorAll('[data-filter]')];
const productCards = [...document.querySelectorAll('.product-card')];
function applyFilter(value) {
  productCards.forEach((card) => card.classList.toggle('is-hidden', value !== 'all' && card.dataset.category !== value));
  document.querySelectorAll('.filter-tab').forEach((button) => {
    const active = button.dataset.filter === value;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', String(active));
  });
  document.querySelectorAll('.quick-option').forEach((button) => button.classList.toggle('is-active', button.dataset.filter === value));
}
filterButtons.forEach((button) => button.addEventListener('click', () => {
  applyFilter(button.dataset.filter);
  if (button.classList.contains('quick-option')) document.querySelector('#products').scrollIntoView({ behavior: 'smooth' });
}));
document.querySelectorAll('[data-filter-link]').forEach((link) => link.addEventListener('click', () => applyFilter(link.dataset.filterLink)));

document.querySelectorAll('.favorite').forEach((button) => button.addEventListener('click', () => {
  const selected = button.classList.toggle('is-favorite');
  button.textContent = selected ? '♥' : '♡';
  button.setAttribute('aria-label', selected ? '取消收藏' : '收藏此产品');
}));

const modal = document.querySelector('[data-modal]');
const openModal = () => { modal.hidden = false; document.body.style.overflow = 'hidden'; modal.querySelector('input')?.focus(); };
const closeModal = () => { modal.hidden = true; document.body.style.overflow = ''; };
document.querySelectorAll('[data-open-booking]').forEach((button) => button.addEventListener('click', openModal));
document.querySelector('[data-close-booking]')?.addEventListener('click', closeModal);
modal?.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && modal && !modal.hidden) closeModal(); });
document.querySelector('#booking-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = event.currentTarget.querySelector('.form-message');
  message.textContent = '已收到预约，我们会在工作时间内联系你。';
  event.currentTarget.reset();
});

const cart = [];
const cartDrawer = document.querySelector('[data-cart-drawer]');
const cartScrim = document.querySelector('[data-cart-scrim]');
const cartItems = document.querySelector('[data-cart-items]');
const cartCount = document.querySelector('.cart-count');
const cartTotal = document.querySelector('[data-cart-total]');
const checkoutModal = document.querySelector('[data-checkout-modal]');
const checkoutItems = document.querySelector('[data-checkout-items]');
const checkoutTotal = document.querySelector('[data-checkout-total]');
const money = (value) => `¥ ${value.toLocaleString('zh-CN')}`;

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = count;
  cartTotal.textContent = money(total);
  cartItems.innerHTML = cart.length ? cart.map((item) => `<div class="cart-row"><div><h3>${item.name}</h3><p>${money(item.price)} / ${item.unit}</p><div class="quantity-control"><button type="button" data-quantity="-" data-name="${item.name}" aria-label="减少数量">−</button><span>${item.quantity}</span><button type="button" data-quantity="+" data-name="${item.name}" aria-label="增加数量">+</button></div></div><strong>${money(item.price * item.quantity)}</strong></div>`).join('') : '<p class="cart-empty">还没有选择产品。<br />从精选瓷砖开始挑选吧。</p>';
  cartItems.querySelectorAll('[data-quantity]').forEach((button) => button.addEventListener('click', () => {
    const item = cart.find((entry) => entry.name === button.dataset.name);
    if (!item) return;
    item.quantity += button.dataset.quantity === '+' ? 1 : -1;
    if (item.quantity < 1) cart.splice(cart.indexOf(item), 1);
    renderCart();
  }));
  checkoutItems.innerHTML = cart.length ? cart.map((item) => `<div class="checkout-line"><span>${item.name} × ${item.quantity}</span><span>${money(item.price * item.quantity)}</span></div>`).join('') : '<p class="cart-empty">购物车是空的，请先选择瓷砖。</p>';
  checkoutTotal.textContent = money(total);
}

document.querySelectorAll('.add-cart').forEach((button) => button.addEventListener('click', () => {
  const existing = cart.find((item) => item.name === button.dataset.product);
  if (existing) existing.quantity += 1;
  else cart.push({ name: button.dataset.product, price: Number(button.dataset.price), unit: button.dataset.unit, quantity: 1 });
  button.classList.add('is-added');
  button.textContent = '已加入购物车';
  renderCart();
  openCart();
}));

function openCart() { cartDrawer.classList.add('is-open'); cartDrawer.setAttribute('aria-hidden', 'false'); cartScrim.hidden = false; }
function closeCart() { cartDrawer.classList.remove('is-open'); cartDrawer.setAttribute('aria-hidden', 'true'); cartScrim.hidden = true; }
document.querySelector('[data-open-cart]')?.addEventListener('click', openCart);
document.querySelector('[data-close-cart]')?.addEventListener('click', closeCart);
cartScrim?.addEventListener('click', closeCart);
document.querySelector('[data-open-shop]')?.addEventListener('click', () => document.querySelector('#products').scrollIntoView({ behavior: 'smooth' }));
document.querySelector('[data-checkout]')?.addEventListener('click', () => {
  if (!cart.length) { cartItems.innerHTML = '<p class="cart-empty">请先在产品列表中点击“加入购物车”。</p>'; return; }
  closeCart(); renderCart(); checkoutModal.hidden = false; checkoutModal.querySelector('input')?.focus();
});
document.querySelector('[data-close-checkout]')?.addEventListener('click', () => { checkoutModal.hidden = true; });
checkoutModal?.addEventListener('click', (event) => { if (event.target === checkoutModal) checkoutModal.hidden = true; });

const loginModal = document.querySelector('[data-login-modal]');
document.querySelector('[data-open-login]')?.addEventListener('click', () => { loginModal.hidden = false; loginModal.querySelector('input')?.focus(); });
document.querySelector('[data-close-login]')?.addEventListener('click', () => { loginModal.hidden = true; });
loginModal?.addEventListener('click', (event) => { if (event.target === loginModal) loginModal.hidden = true; });
document.querySelector('[data-send-code]')?.addEventListener('click', (event) => {
  const button = event.currentTarget; let seconds = 60; button.disabled = true; button.textContent = `${seconds}s 后重发`;
  const timer = setInterval(() => { seconds -= 1; button.textContent = seconds ? `${seconds}s 后重发` : '获取验证码'; if (!seconds) { clearInterval(timer); button.disabled = false; } }, 1000);
  loginModal.querySelector('.form-message').textContent = '演示验证码已生成：123456';
});
document.querySelector('#login-form')?.addEventListener('submit', (event) => {
  event.preventDefault(); const form = event.currentTarget; const message = form.querySelector('.form-message');
  const code = form.elements.code.value.trim(); message.textContent = code === '123456' ? '登录成功，欢迎回来。' : '验证码不正确，请输入演示验证码 123456。';
  if (code === '123456') setTimeout(() => { loginModal.hidden = true; }, 900);
});
document.querySelector('#checkout-form')?.addEventListener('submit', (event) => {
  event.preventDefault(); const message = event.currentTarget.querySelector('.form-message'); message.textContent = '订单已创建（演示），不会真实扣款。';
  cart.length = 0; renderCart(); event.currentTarget.reset();
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (loginModal && !loginModal.hidden) loginModal.hidden = true;
  if (checkoutModal && !checkoutModal.hidden) checkoutModal.hidden = true;
  if (cartDrawer?.classList.contains('is-open')) closeCart();
});
renderCart();
