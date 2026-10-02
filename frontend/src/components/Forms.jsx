import { useId } from "react";
export function FormInput({ label, help, error, ...props }) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} {...props} aria-invalid={Boolean(error)} />
      {help && <small>{help}</small>}
      {error && <small className="text-red-700">{error}</small>}
    </div>
  );
}
export function TextArea({ label, help, ...props }) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <textarea id={id} rows={5} {...props} />
      {help && <small>{help}</small>}
    </div>
  );
}
export function Select({ label, children, ...props }) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} {...props}>
        {children}
      </select>
    </div>
  );
}
export function Checkbox({ label, ...props }) {
  return (
    <label className="checkbox">
      <input type="checkbox" {...props} />
      <span>{label}</span>
    </label>
  );
}
export function SubmitButton({ busy, children, ...props }) {
  return (
    <button type="submit" className="btn primary" disabled={busy} {...props}>
      {busy ? "Please wait…" : children}
    </button>
  );
}
