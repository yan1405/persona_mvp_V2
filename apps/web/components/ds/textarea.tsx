import { useId, type TextareaHTMLAttributes } from "react";

import { cx } from "./cx";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

// Derivado do Input do DS (o DS não traz campo de várias linhas): mesma caixa, rótulo, dica e erro.
export function Textarea({ label, hint, error, disabled, className, id, rows = 4, ...rest }: TextareaProps) {
  const auto = useId();
  const fid = id || auto;
  const note = error || hint;
  const noteId = note ? fid + "-note" : undefined;
  return (
    <div className={cx("dx-field", "dx-field--area", error && "dx-field--error", disabled && "dx-field--disabled", className)}>
      {label ? (
        <label className="dx-field__label" htmlFor={fid}>
          {label}
        </label>
      ) : null}
      <div className="dx-field__box">
        <textarea id={fid} className="dx-field__input dx-field__input--area" rows={rows} disabled={disabled} aria-invalid={error ? true : undefined} aria-describedby={noteId} {...rest} />
      </div>
      {note ? (
        <span id={noteId} className="dx-field__note" role={error ? "alert" : undefined}>
          {note}
        </span>
      ) : null}
    </div>
  );
}
