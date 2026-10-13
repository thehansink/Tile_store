<script setup>
defineProps({ text: { type: String, required: true } });
</script>

<template>
  <span class="rolling-text"
    ><span>{{ text }}</span
    ><span aria-hidden="true">{{ text }}</span></span
  >
</template>

<style scoped>
.rolling-text {
  position: relative;
  display: inline-flex;
  overflow: hidden;
  line-height: 1.5;
  vertical-align: middle;
}
.rolling-text > span {
  white-space: nowrap;
  transition: transform 500ms ease-in-out;
}
.rolling-text > span:last-child {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(120%);
}
:global(.roll-control:hover) .rolling-text > span:first-child,
:global(.roll-control:focus-visible) .rolling-text > span:first-child {
  transform: translateY(-120%);
}
:global(.roll-control:hover) .rolling-text > span:last-child,
:global(.roll-control:focus-visible) .rolling-text > span:last-child {
  transform: translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  .rolling-text > span {
    transition: none;
  }
  .rolling-text > span:last-child {
    display: none;
  }
  :global(.roll-control:hover) .rolling-text > span:first-child,
  :global(.roll-control:focus-visible) .rolling-text > span:first-child {
    transform: none;
  }
}
</style>
