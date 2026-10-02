import { useEffect, useRef } from "react";
import {
  AlertCircle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  X,
} from "lucide-react";
import getApiError from "../utils/getApiError";
export function LoadingSpinner({ label = "Getting things ready…" }) {
  return (
    <div className="state" role="status">
      <LoaderCircle className="animate-spin" size={28} />
      <p>{label}</p>
    </div>
  );
}
export function ErrorMessage({ error, retry }) {
  return (
    <div className="error-box" role="alert">
      <AlertCircle size={20} />
      <div>
        <strong>We hit a small bump.</strong>
        <p>{getApiError(error)}</p>
        {retry && (
          <button className="text-button" onClick={retry}>
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
export function EmptyState({ title, description, children }) {
  return (
    <div className="state empty">
      <span className="empty-icon">
        <BookOpen size={28} />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  );
}
export function Pagination({ pagination, onChange }) {
  if (!pagination || pagination.totalPages < 2) return null;
  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="btn secondary"
        disabled={pagination.page <= 1}
        onClick={() => onChange(pagination.page - 1)}
      >
        <ChevronLeft size={16} />
        Previous
      </button>
      <span>
        Page {pagination.page} of {pagination.totalPages}
      </span>
      <button
        className="btn secondary"
        disabled={pagination.page >= pagination.totalPages}
        onClick={() => onChange(pagination.page + 1)}
      >
        Next
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
export function ConfirmDialog({
  open,
  title,
  description,
  busy,
  onCancel,
  onConfirm,
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (open && !ref.current.open) ref.current.showModal();
    if (!open && ref.current.open) ref.current.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className="confirm-dialog"
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onCancel();
      }}
    >
      <div className="flex justify-between gap-4">
        <h2>{title}</h2>
        <button aria-label="Close dialog" disabled={busy} onClick={onCancel}>
          <X size={20} />
        </button>
      </div>
      <p>{description}</p>
      <div className="flex justify-end gap-3">
        <button className="btn secondary" disabled={busy} onClick={onCancel}>
          Cancel
        </button>
        <button className="btn danger" disabled={busy} onClick={onConfirm}>
          {busy ? "Working…" : "Confirm delete"}
        </button>
      </div>
    </dialog>
  );
}
export function ProgressBar({ progress }) {
  return (
    <div className="progress-wrap">
      <div className="flex justify-between gap-3 text-sm mb-2">
        <span>
          {progress.completedLessons} / {progress.totalLessons} lessons
          completed
        </span>
        <strong>{progress.progressPercentage}%</strong>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={progress.progressPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Course progress"
      >
        <span style={{ width: `${progress.progressPercentage}%` }} />
      </div>
    </div>
  );
}
export function PageHeading({ eyebrow, title, description, children }) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="muted mt-3 max-w-2xl">{description}</p>}
      </div>
      {children}
    </div>
  );
}
export function StatCard({ label, value, icon: Icon, detail }) {
  return (
    <div className="stat-card">
      <div className="flex justify-between items-center">
        <span>{label}</span>
        {Icon && <Icon size={20} />}
      </div>
      <strong>{value}</strong>
      {detail && <p>{detail}</p>}
    </div>
  );
}
