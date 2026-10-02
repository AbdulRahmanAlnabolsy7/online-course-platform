import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Pencil, Plus, Trash2, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import { instructorApi } from "../api/instructorApi";
import { coursesApi } from "../api/coursesApi";
import { useAuth } from "../context/AuthContext";
import useAsync from "../hooks/useAsync";
import { CourseArtwork } from "../components/CourseCard";
import {
  ConfirmDialog,
  EmptyState,
  ErrorMessage,
  LoadingSpinner,
  PageHeading,
  Pagination,
} from "../components/UI";
import { price, titleCase } from "../utils/format";
export default function InstructorCourses() {
  const { user } = useAuth();
  const [page, setPage] = useState(1),
    [deleting, setDeleting] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(null);
  const courses = useAsync(
    () => instructorApi.courses({ page, limit: 6 }),
    [page, user._id],
  );
  async function remove() {
    setBusy(true);
    setError(null);
    try {
      await coursesApi.remove(deleting._id);
      setDeleting(null);
      toast.success("Course deleted");
      if (courses.data.data.length === 1 && page > 1) setPage(page - 1);
      else await courses.reload();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="container section">
      <PageHeading
        eyebrow="Your teaching studio"
        title="Make your knowledge go further."
        description="Create, refine, and share your courses with the community."
      >
        <Link className="btn primary" to="/instructor/courses/new">
          <Plus size={17} />
          Create course
        </Link>
      </PageHeading>
      {error && <ErrorMessage error={error} />}
      {courses.loading ? (
        <LoadingSpinner />
      ) : courses.error ? (
        <ErrorMessage error={courses.error} retry={courses.reload} />
      ) : courses.data.data.length ? (
        <>
          <div className="course-grid">
            {courses.data.data.map((c) => (
              <article className="course-card" key={c._id}>
                <CourseArtwork course={c} />
                <div className="course-card-body">
                  <div className="flex justify-between">
                    <span className="tiny-label">{titleCase(c.level)}</span>
                    <span
                      className={c.isPublished ? "badge published" : "badge"}
                    >
                      {c.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                  <h3>
                    <Link to={`/courses/${c._id}`}>{c.title}</Link>
                  </h3>
                  <p className="description-preview">{c.description}</p>
                  <strong>{price(c.price)}</strong>
                  <div className="manage-actions">
                    <Link
                      className="btn primary small"
                      to={`/instructor/courses/${c._id}/lessons`}
                    >
                      <BookOpen size={15} />
                      Lessons
                    </Link>
                    <Link
                      className="btn secondary small"
                      to={`/instructor/courses/${c._id}/edit`}
                    >
                      <Pencil size={15} />
                      Edit
                    </Link>
                    <button
                      className="icon-button"
                      aria-label={`Delete ${c.title}`}
                      onClick={() => setDeleting(c)}
                    >
                      <Trash2 size={17} />
                    </button>
                    <Link
                      className="icon-button"
                      aria-label={`View ${c.title}`}
                      to={`/courses/${c._id}`}
                    >
                      <ArrowUpRight size={17} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <Pagination pagination={courses.data.pagination} onChange={setPage} />
        </>
      ) : (
        <EmptyState
          title="You have not created any courses yet"
          description="Your experience could be someone's next breakthrough."
        >
          <Link className="btn primary" to="/instructor/courses/new">
            Create your first course
          </Link>
        </EmptyState>
      )}
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this course?"
        description="This also deletes its lessons, enrollments, comments, ratings, and progress. This cannot be undone."
        busy={busy}
        onCancel={() => setDeleting(null)}
        onConfirm={remove}
      />
    </div>
  );
}
