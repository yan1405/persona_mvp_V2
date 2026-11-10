"use client";

import { useId, useState } from "react";

import { cx } from "./cx";

export type SwitchProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
};

// <button role="switch">: alcançável por Tab, alterna com Espaço/Enter, `disabled` real.
export function Switch({ checked, defaultChecked, onChange, label, disabled, id, className }: SwitchProps) {
  const [inner, setInner] = useState(!!defaultChecked);
  const auto = useId();
  const bid = id || auto;
  const on = checked != null ? checked : inner;
  const toggle = () => {
    if (disabled) return;
    const next = !on;
    if (checked == null) setInner(next);
    onChange?.(next);
  };
  return (
    <span className={cx("dx-switch-wrap", disabled && "is-disabled", className)}>
      <button id={bid} type="button" role="switch" aria-checked={on} disabled={disabled} onClick={toggle} className="dx-switch">
        <span className="dx-switch__knob" aria-hidden="true" />
      </button>
      {label != null ? (
        <label className="dx-switch-wrap__label" htmlFor={bid}>
          {label}
        </label>
      ) : null}
    </span>
  );
}
