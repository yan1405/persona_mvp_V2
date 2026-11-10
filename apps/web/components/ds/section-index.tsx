"use client";

import { useState } from "react";

import { cx } from "./cx";

export type SectionIndexItem = { id: string; label: string; meta?: string; disabled?: boolean };

export type SectionIndexProps = {
  items: SectionIndexItem[];
  activeId?: string;
  onSelect?: (id: string) => void;
  title?: string;
  className?: string;
};

export function SectionIndex({ items, activeId, onSelect, title = "Nesta página", className }: SectionIndexProps) {
  const [inner, setInner] = useState(items[0]?.id);
  const current = activeId ?? inner;
  const go = (id: string) => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
    if (activeId == null) setInner(id);
    onSelect?.(id);
  };
  return (
    <nav className={cx("dx-index", className)} aria-label={title}>
      <span className="dx-index__title">{title}</span>
      <ol className="dx-index__list">
        {items.map((it, i) => {
          const inside = (
            <>
              <span className="dx-index__dot" aria-hidden="true" />
              <span className="dx-index__num">{String(i + 1).padStart(2, "0")}</span>
              <span className="dx-index__label">{it.label}</span>
              {it.meta ? <span className="dx-index__meta">{it.meta}</span> : null}
            </>
          );
          return (
            <li key={it.id}>
              {it.disabled ? (
                <span className="dx-index__item" aria-disabled="true">
                  {inside}
                </span>
              ) : (
                <a
                  className="dx-index__item"
                  href={"#" + it.id}
                  aria-current={current === it.id ? "location" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    go(it.id);
                  }}
                >
                  {inside}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
