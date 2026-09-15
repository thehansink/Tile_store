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
