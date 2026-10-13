<script setup>
import { nextTick, onUnmounted, ref, watch } from "vue";
import { trapDialogFocus } from "../utils/dialogFocus";

const props = defineProps({
  open: Boolean,
  label: { type: String, required: true },
});
const emit = defineEmits(["close"]);
const dialog = ref(null);
let previousOverflow;
let ownsScrollLock = false;

function restoreScroll() {
  if (!ownsScrollLock) return;
  document.body.style.overflow = previousOverflow;
  ownsScrollLock = false;
}

watch(
  () => props.open,
  async (open) => {
    if (!open) {
      dialog.value?.close();
      restoreScroll();
      return;
    }
    await nextTick();
    if (!props.open || !dialog.value) return;
    previousOverflow = document.body.style.overflow;
    ownsScrollLock = true;
    document.body.style.overflow = "hidden";
    dialog.value.showModal();
  },
  { immediate: true },
);

function handleClose() {
  restoreScroll();
  if (props.open) emit("close");
}

onUnmounted(restoreScroll);
</script>

<template>
  <dialog
    ref="dialog"
    class="overlay native-overlay"
    :aria-label="label"
    @close="handleClose"
    @keydown="trapDialogFocus"
    @click.self="emit('close')"
  >
    <slot />
  </dialog>
</template>
