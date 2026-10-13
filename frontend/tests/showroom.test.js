import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import {
  galleryCategories,
  showroomGallery,
} from "../src/data/showroomGallery.js";
import { trapDialogFocus } from "../src/utils/dialogFocus.js";

test("gallery references 48 unique, present originals and previews", () => {
  assert.equal(showroomGallery.length, 48);
  assert.equal(new Set(showroomGallery.map((item) => item.id)).size, 48);
  for (const item of showroomGallery) {
    assert(galleryCategories.includes(item.category));
    assert(item.name && item.alt && item.description);
    assert(
      existsSync(new URL(`../public${item.image}`, import.meta.url)),
      item.image,
    );
    assert(
      existsSync(new URL(`../public${item.original}`, import.meta.url)),
      item.original,
    );
  }
});

test("each gallery category has photographs", () => {
  for (const category of galleryCategories.filter(
    (value) => value !== "全部",
  )) {
    assert(showroomGallery.some((item) => item.category === category));
  }
});

test("dialog tab boundaries wrap and skip disabled controls", () => {
  const previousDocument = globalThis.document;
  let focused;
  let prevented = false;
  const makeControl = (disabled) => ({
    disabled,
    getClientRects: () => [1],
    focus() {
      focused = this;
    },
  });
  const first = makeControl(false);
  const disabled = makeControl(true);
  const last = makeControl(false);
  const dialog = {
    querySelectorAll: () => [first, disabled, last],
    contains: (element) => [first, disabled, last].includes(element),
  };
  globalThis.document = { activeElement: first };
  try {
    trapDialogFocus({
      key: "Tab",
      shiftKey: true,
      currentTarget: dialog,
      preventDefault: () => {
        prevented = true;
      },
    });
    assert.equal(focused, last);
    assert(prevented);
    globalThis.document.activeElement = last;
    trapDialogFocus({
      key: "Tab",
      shiftKey: false,
      currentTarget: dialog,
      preventDefault() {},
    });
    assert.equal(focused, first);
    focused = null;
    trapDialogFocus({ key: "ArrowRight", currentTarget: dialog });
    assert.equal(focused, null);
  } finally {
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
  }
});
