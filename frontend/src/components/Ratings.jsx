import { useState } from "react";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import { ratingsApi } from "../api/ratingsApi";
import { useAuth } from "../context/AuthContext";
import useAsync from "../hooks/useAsync";
import {
  ConfirmDialog,
  EmptyState,
  ErrorMessage,
  LoadingSpinner,
  Pagination,
} from "./UI";
import { TextArea, SubmitButton } from "./Forms";
import { date, idOf, initials } from "../utils/format";
export function Stars({ value, onChange }) {
  return (
    <div
      className="stars"
      role={onChange ? "radiogroup" : undefined}
      aria-label={onChange ? "Course rating" : `${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) =>
        onChange ? (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={n === value}
            aria-label={`${n} ${n === 1 ? "star" : "stars"}`}
            onClick={() => onChange(n)}
          >
            <Star size={28} fill={n <= value ? "currentColor" : "none"} />
          </button>
        ) : (
          <Star key={n} size={16} fill={n <= value ? "currentColor" : "none"} />
        ),
      )}
    </div>
  );
}
async function ownRating(courseId, userId) {
  let page = 1;
  while (true) {
    const result = await ratingsApi.list(courseId, { page, limit: 100 });
    const own = result.data.find((r) => idOf(r.student) === userId);
    if (own) return own;
    if (page >= result.pagination.totalPages) return null;
    page++;
  }
}
function RatingForm({ courseId, own, onSaved }) {
  const [value, setValue] = useState(own?.value || 5),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(null),
    [deleting, setDeleting] = useState(false);
  async function submit(event) {
    event.preventDefault();
    const review = new FormData(event.currentTarget).get("review").trim();
    setBusy(true);
    setError(null);
    try {
      await ratingsApi[own ? "update" : "create"](courseId, { value, review });
      toast.success(own ? "Rating updated" : "Thanks for sharing your rating");
      await onSaved();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    setBusy(true);
    setError(null);
    try {
      await ratingsApi.remove(courseId);
      setDeleting(false);
      toast.success("Rating deleted");
      await onSaved();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="rating-form">
      {error && <ErrorMessage error={error} />}
      <form onSubmit={submit}>
        <h3 className="mb-3">
          {own ? "Your course review" : "How is your learning experience?"}
        </h3>
        <fieldset disabled={busy}>
          <Stars value={value} onChange={setValue} />
          <TextArea
            label="Your review (optional)"
            name="review"
            defaultValue={own?.review || ""}
            maxLength={2000}
          />
          <div className="flex flex-wrap gap-3">
            <SubmitButton busy={busy}>
              {own ? "Update rating" : "Submit rating"}
            </SubmitButton>
            {own && (
              <button
                type="button"
                className="btn secondary"
                disabled={busy}
                onClick={() => setDeleting(true)}
              >
                Delete rating
              </button>
            )}
          </div>
        </fieldset>
      </form>
      <ConfirmDialog
        open={deleting}
        title="Delete your rating?"
        description="Your review and rating will be removed."
        busy={busy}
        onCancel={() => setDeleting(false)}
        onConfirm={remove}
      />
    </div>
  );
}
export default function Ratings({ courseId, enrolled, onChanged }) {
  const { user } = useAuth();
  const [page, setPage] = useState(1),
    [revision, setRevision] = useState(0);
  const list = useAsync(
    () => ratingsApi.list(courseId, { page, limit: 5 }),
    [courseId, page, revision],
  );
  const canRate = enrolled && user?.role === "student";
  const own = useAsync(
    () => (canRate ? ownRating(courseId, user._id) : Promise.resolve(null)),
    [courseId, user?._id, canRate, revision],
  );
  async function refresh() {
    setRevision((r) => r + 1);
    await onChanged();
  }
  return (
    <section className="panel reviews">
      <div className="section-heading">
        <div>
          <p className="eyebrow">From the learning community</p>
          <h2>Thoughts & reviews</h2>
        </div>
      </div>
      {canRate &&
        (own.loading ? (
          <LoadingSpinner label="Loading your review…" />
        ) : own.error ? (
          <ErrorMessage error={own.error} retry={own.reload} />
        ) : (
          <RatingForm
            key={`${revision}-${own.data?._id || "new"}`}
            courseId={courseId}
            own={own.data}
            onSaved={refresh}
          />
        ))}
      {list.loading ? (
        <LoadingSpinner />
      ) : list.error ? (
        <ErrorMessage error={list.error} retry={list.reload} />
      ) : list.data.data.length ? (
        <>
          <div className="comment-list">
            {list.data.data.map((r) => (
              <article key={r._id} className="comment">
                <span className="avatar">{initials(r.student?.name)}</span>
                <div className="grow min-w-0">
                  <div className="flex flex-wrap justify-between gap-3">
                    <div>
                      <strong>{r.student?.name || "Learner"}</strong>
                      <small>{date(r.createdAt)}</small>
                    </div>
                    <Stars value={r.value} />
                  </div>
                  {r.review && (
                    <p className="whitespace-pre-wrap break-words mt-3">
                      {r.review}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
          <Pagination pagination={list.data.pagination} onChange={setPage} />
        </>
      ) : (
        <EmptyState
          title="No reviews yet"
          description="Enrolled students can share their experience here."
        />
      )}
    </section>
  );
}
