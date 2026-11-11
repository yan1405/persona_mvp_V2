import { useId, type InputHTMLAttributes, type ReactNode } from "react";

import { cx } from "./cx";
import { Icon, type IconName } from "./icon";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  variant?: "field" | "search";
  icon?: IconName;
  label?: string;
  hint?: string;
  error?: string;
  trailing?: ReactNode;
};

export function Input({ variant = "field", icon, label, hint, error, trailing, disabled, className, id, ...rest }: InputProps) {
  const auto = useId();
  const fid = id || auto;
  const note = error || hint;
  const noteId = note ? fid + "-note" : undefined;
  const isSearch = variant === "search";
  return (
    <div className={cx("dx-field", isSearch && "dx-field--search", error && "dx-field--error", disabled && "dx-field--disabled", className)}>
      {label ? (
        <label className="dx-field__label" htmlFor={fid}>
          {label}
        </label>
      ) : null}
      <div className="dx-field__box">
        {icon || isSearch ? <Icon name={icon || "search"} size={18} /> : null}
        <input
          id={fid}
          className="dx-field__input"
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={noteId}
          {...rest}
        />
        {trailing}
      </div>
      {note ? (
        <span id={noteId} className="dx-field__note" role={error ? "alert" : undefined}>
          {note}
        </span>
      ) : null}
    </div>
  );
}
