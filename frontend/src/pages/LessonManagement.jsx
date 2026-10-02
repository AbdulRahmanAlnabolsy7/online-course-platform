import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { coursesApi } from "../api/coursesApi";
import { lessonsApi } from "../api/lessonsApi";
import { useAuth } from "../context/AuthContext";
import useAsync from "../hooks/useAsync";
import {
  Checkbox,
  FormInput,
  SubmitButton,
  TextArea,
} from "../components/Forms";
import {
  ConfirmDialog,
  EmptyState,
  ErrorMessage,
  LoadingSpinner,
  PageHeading,
} from "../components/UI";
import { idOf, optionalFields } from "../utils/format";
function LessonEditor({ courseId, lesson, nextOrder, onSaved, onCancel }) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(null);
  async function submit(event) {
    event.preventDefault();
    const raw = Object.fromEntries(new FormData(event.currentTarget));
    const body = optionalFields(
      {
        ...raw,
        order: Number(raw.order),
        duration: Number(raw.duration),
        isPreview: raw.isPreview === "on",
      },
      ["videoUrl"],
    );
    setBusy(true);
    setError(null);
    try {
      if (lesson) await lessonsApi.update(courseId, lesson._id, body);
      else await lessonsApi.create(courseId, body);
      toast.success(lesson ? "Lesson updated" : "Lesson created");
      await onSaved();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="panel editor-form" onSubmit={submit}>
      <h2 className="mb-6">{lesson ? "Edit lesson" : "Add a new chapter"}</h2>
      {error && <ErrorMessage error={error} />}
      <FormInput
        label="Lesson title"
        name="title"
        required
        maxLength={200}
        defaultValue={lesson?.title || ""}
      />
      <TextArea
        label="Lesson content"
        name="content"
        required
        maxLength={50000}
        defaultValue={lesson?.content || ""}
      />
      <FormInput
        label="Video URL (optional)"
        name="videoUrl"
        type="url"
        pattern="https?://.*"
        defaultValue={lesson?.videoUrl || ""}
        help="YouTube, Vimeo or a direct video URL."
      />
      <div className="grid grid-cols-2 gap-5">
        <FormInput
          label="Duration (minutes)"
          name="duration"
          type="number"
          min={0}
          max={100000}
          step="0.1"
          required
          defaultValue={lesson?.duration || 0}
        />
        <FormInput
          label="Lesson order"
          name="order"
          type="number"
          min={1}
          step={1}
          required
          defaultValue={lesson?.order || nextOrder}
          help="Each lesson needs a unique order in the course."
        />
      </div>
      <Checkbox
        label="Allow anyone to preview this lesson"
        name="isPreview"
        defaultChecked={lesson?.isPreview || false}
      />
      <div className="form-actions">
        <button
          type="button"
          className="btn secondary"
          disabled={busy}
          onClick={onCancel}
        >
          Cancel
        </button>
        <SubmitButton busy={busy}>
          {lesson ? "Save lesson" : "Add lesson"}
        </SubmitButton>
      </div>
    </form>
  );
}
export default function LessonManagement() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [editing, setEditing] = useState(undefined),
    [deleting, setDeleting] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(null);
  const data = useAsync(async () => {
    const [course, lessons] = await Promise.all([
      coursesApi.get(courseId),
      lessonsApi.list(courseId),
    ]);
    return { course, lessons };
  }, [courseId]);
  async function remove() {
    setBusy(true);
    setError(null);
    try {
      await lessonsApi.remove(courseId, deleting._id);
      setDeleting(null);
      toast.success("Lesson deleted");
      await data.reload();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }
  if (data.loading) return <LoadingSpinner />;
  if (data.error)
    return (
      <div className="container section">
        <ErrorMessage error={data.error} retry={data.reload} />
      </div>
    );
  if (idOf(data.data.course.instructor) !== user._id)
    return <EmptyState title="This course belongs to another instructor" />;
  const { course, lessons } = data.data;
  return (
    <div className="container section">
      <Link className="text-button mb-6" to="/instructor/courses">
        ← Back to your courses
      </Link>
      <PageHeading
        eyebrow="Build the learning journey"
        title={course.title}
        description="Organize your lessons into clear, engaging chapters."
      >
        <button className="btn primary" onClick={() => setEditing(null)}>
          <Plus size={17} />
          Add lesson
        </button>
      </PageHeading>
      {error && <ErrorMessage error={error} />}
      <div
        className={
          editing !== undefined ? "lesson-management-grid" : "max-w-4xl"
        }
      >
        <div className="panel">
          <h2 className="mb-6">
            Course chapters <span className="muted">({lessons.length})</span>
          </h2>
          {lessons.length ? (
            lessons.map((l) => (
              <div className="lesson-row" key={l._id}>
                <span className="lesson-number">
                  {String(l.order).padStart(2, "0")}
                </span>
                <div className="grow min-w-0">
                  <strong>{l.title}</strong>
                  <small>
                    {l.duration} min{l.isPreview ? " · Preview" : ""}
                  </small>
                </div>
                <button
                  className="icon-button"
                  aria-label={`Edit ${l.title}`}
                  onClick={() => setEditing(l)}
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="icon-button"
                  aria-label={`Delete ${l.title}`}
                  onClick={() => setDeleting(l)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <EmptyState
              title="Every journey needs a first chapter"
              description="Add your first lesson to get started."
            />
          )}
        </div>
        {editing !== undefined && (
          <LessonEditor
            key={editing?._id || "new"}
            courseId={courseId}
            lesson={editing}
            nextOrder={Math.max(0, ...lessons.map((l) => l.order)) + 1}
            onSaved={async () => {
              setEditing(undefined);
              await data.reload();
            }}
            onCancel={() => setEditing(undefined)}
          />
        )}
      </div>
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this lesson?"
        description="Comments and progress for this lesson will also be removed."
        busy={busy}
        onCancel={() => setDeleting(null)}
        onConfirm={remove}
      />
    </div>
  );
}
