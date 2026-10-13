export function trapDialogFocus(event) {
  if (event.key !== "Tab") return;
  const dialog = event.currentTarget;
  const controls = [
    ...dialog.querySelectorAll(
      'button, a[href], input, select, textarea, [tabindex="0"]',
    ),
  ].filter((element) => !element.disabled && element.getClientRects().length);
  const first = controls[0];
  const last = controls.at(-1);
  if (!first) {
    event.preventDefault();
    dialog.focus();
    return;
  }
  if (
    event.shiftKey &&
    (document.activeElement === first ||
      !dialog.contains(document.activeElement))
  ) {
    event.preventDefault();
    last.focus();
  } else if (
    !event.shiftKey &&
    (document.activeElement === last ||
      !dialog.contains(document.activeElement))
  ) {
    event.preventDefault();
    first.focus();
  }
}
