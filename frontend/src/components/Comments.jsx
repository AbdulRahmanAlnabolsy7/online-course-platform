import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { commentsApi } from "../api/commentsApi";
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
export default function Comments({ lessonId }) {
  const { user } = useAuth();
  const [page, setPage] = useState(1),
    [editing, setEditing] = useState(null),
    [deleting, setDeleting] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(null);
  const comments = useAsync(
    () => commentsApi.list(lessonId, { page, limit: 5 }),
    [lessonId, page],
  );
  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const text = new FormData(form).get("text").trim();
    if (!text) return;
    setBusy(true);
    setError(null);
    try {
      if (editing) await commentsApi.update(editing._id, text);
      else await commentsApi.create(lessonId, text);
      setEditing(null);
      form.reset();
      toast.success(editing ? "Comment updated" : "Comment added");
      await comments.reload();
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
      await commentsApi.remove(deleting._id);
      setDeleting(null);
      toast.success("Comment deleted");
      if (comments.data.data.length === 1 && page > 1) setPage(page - 1);
      else await comments.reload();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="discussion panel">
      <h2>Keep the conversation going.</h2>
      <p className="muted mb-6">
        Ask a question or share a thought about this lesson.
      </p>
      {error && <ErrorMessage error={error} />}
      {user.role === "student" && (
        <form onSubmit={submit} key={editing?._id || "new"}>
          <TextArea
            label={editing ? "Edit your comment" : "Your comment"}
            name="text"
            defaultValue={editing?.text || ""}
            required
            maxLength={2000}
          />
          <div className="flex gap-3">
            <SubmitButton busy={busy}>
              {editing ? "Save comment" : "Post comment"}
            </SubmitButton>
            {editing && (
              <button
                className="btn secondary"
                type="button"
                disabled={busy}
                onClick={() => setEditing(null)}
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>
      )}
      {comments.loading ? (
        <LoadingSpinner />
      ) : comments.error ? (
        <ErrorMessage error={comments.error} retry={comments.reload} />
      ) : comments.data.data.length ? (
        <div className="comment-list">
          {comments.data.data.map((comment) => (
            <article key={comment._id} className="comment">
              <span className="avatar">{initials(comment.user?.name)}</span>
              <div className="min-w-0 grow">
                <div className="flex justify-between gap-3 flex-wrap">
                  <div>
                    <strong>{comment.user?.name || "Learner"}</strong>
                    <small>{date(comment.createdAt)}</small>
                  </div>
                  {idOf(comment.user) === user._id && (
                    <div className="flex gap-3">
                      <button
                        className="icon-button"
                        aria-label="Edit comment"
                        disabled={busy}
                        onClick={() => {
                          setEditing(comment);
                          setError(null);
                        }}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="icon-button"
                        aria-label="Delete comment"
                        disabled={busy}
                        onClick={() => setDeleting(comment)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
                <p className="whitespace-pre-wrap break-words mt-3">
                  {comment.text}
                </p>
              </div>
            </article>
          ))}
          <Pagination
            pagination={comments.data.pagination}
            onChange={setPage}
          />
        </div>
      ) : (
        <EmptyState
          title="No comments yet"
          description="Be the first to start a conversation."
        />
      )}
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this comment?"
        description="Your comment will be permanently removed."
        busy={busy}
        onCancel={() => setDeleting(null)}
        onConfirm={remove}
      />
    </section>
  );
}
