import React from 'react';
// Double focus indicator (WCAG 2.2 AA, 1.4.11 ≥ 3:1). Built only from existing tokens.
// Light surfaces (#FFFFFF · #FAFAFC · #F2F1F7): inner 2px #A78BFA + outer 2px #6D28D9 (outer vs bg 6.3–7.1:1).
// Dark surfaces (#1A1726 · #2E1A6B): inner 2px #6D28D9 + outer 2px #A78BFA (outer vs bg 5.2–6.5:1).
export const FOCUS_RING = { outline: '2px solid var(--brand-strong)', outlineOffset: 2, boxShadow: '0 0 0 2px var(--focus-ring)' };
export const FOCUS_RING_DARK = { outline: '2px solid var(--focus-ring)', outlineOffset: 2, boxShadow: '0 0 0 2px var(--brand-strong)' };
// Text fields: 2px #6D28D9 edge hugging the 1px border (box-shadow, no layout shift) + soft #A78BFA halo.
export const FIELD_FOCUS = { boxShadow: '0 0 0 2px var(--brand-strong), 0 0 0 5px rgb(167 139 250 / 0.35)' };
export const NO_OUTLINE = { outline: 'none' };
function isVisible(el) { try { return el.matches(':focus-visible'); } catch (e) { return true; } }
// Ring only for :focus-visible (keyboard); mouse focus shows nothing. Merges caller's onFocus/onBlur.
export function useFocusVisible(onFocus, onBlur) {
  const [on, setOn] = React.useState(false);
  return [on, {
    onFocus: e => { if (e.target === e.currentTarget) setOn(isVisible(e.currentTarget)); onFocus && onFocus(e); },
    onBlur: e => { if (e.target === e.currentTarget) setOn(false); onBlur && onBlur(e); },
  }];
}
