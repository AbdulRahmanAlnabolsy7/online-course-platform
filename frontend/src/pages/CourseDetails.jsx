import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Lock,
  Play,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";
import { coursesApi } from "../api/coursesApi";
import { lessonsApi } from "../api/lessonsApi";
import { enrollmentApi } from "../api/enrollmentApi";
import { useAuth } from "../context/AuthContext";
import useAsync from "../hooks/useAsync";
import { CourseArtwork } from "../components/CourseCard";
import { ErrorMessage, LoadingSpinner, EmptyState } from "../components/UI";
import Ratings from "../components/Ratings";
import VideoPlayer from "../components/VideoPlayer";
import { idOf, price, titleCase } from "../utils/format";
export default function CourseDetails() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(null);
  const details = useAsync(async () => {
    const [course, lessons, status] = await Promise.all([
      coursesApi.get(courseId),
      lessonsApi.list(courseId),
      user?.role === "student"
        ? enrollmentApi.status(courseId)
        : Promise.resolve({ enrolled: false }),
    ]);
    return { course, lessons, enrolled: status.enrolled };
  }, [courseId, user?._id]);
  if (details.loading) return <LoadingSpinner />;
  if (details.error)
    return (
      <div className="container section">
        <ErrorMessage error={details.error} retry={details.reload} />
      </div>
    );
  const { course, lessons, enrolled } = details.data;
  const owner = idOf(course.instructor) === user?._id;
  async function enroll() {
    setBusy(true);
    setError(null);
    try {
      await enrollmentApi.enroll(courseId);
      toast.success("You are enrolled. Happy learning!");
      await details.reload();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="container section">
      <Link to="/courses" className="text-button mb-7">
        ← Back to courses
      </Link>
      <div className="details-grid">
        <div>
          <p className="eyebrow">
            {titleCase(course.category)} · {titleCase(course.level)}
          </p>
          <h1 className="course-title">{course.title}</h1>
          <p className="muted whitespace-pre-wrap break-words mt-5">
            {course.description}
          </p>
          <div className="course-meta">
            <span>
              With <strong>{course.instructor?.name}</strong>
            </span>
            <span className="rating">
              <Star size={16} fill="currentColor" />
              {Number(course.averageRating).toFixed(1)} ({course.ratingsCount}{" "}
              reviews)
            </span>
            <span>
              <BookOpen size={17} />
              {lessons.length} lessons
            </span>
          </div>
          {course.tags?.length > 0 && (
            <div className="tag-list">
              {course.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          )}
          <section className="panel curriculum">
            <h2>Your learning journey</h2>
            <p className="muted mb-6">A chapter at a time. At your own pace.</p>
            {lessons.length ? (
              lessons.map((lesson) => (
                <div className="curriculum-item" key={lesson._id}>
                  <div className="lesson-row">
                    <span className="lesson-number">
                      {String(lesson.order).padStart(2, "0")}
                    </span>
                    <div className="grow min-w-0">
                      <strong>{lesson.title}</strong>
                      <small>
                        <Clock size={12} />
                        {lesson.duration} min
                        {lesson.isPreview ? " · Free preview" : ""}
                      </small>
                    </div>
                    {enrolled ? (
                      <Link
                        className="text-button"
                        to={`/learn/${courseId}?lesson=${lesson._id}`}
                        aria-label={`Learn ${lesson.title}`}
                      >
                        <Play size={18} />
                      </Link>
                    ) : owner ? (
                      <CheckCircle2 size={17} />
                    ) : lesson.isPreview ? (
                      <Play size={17} />
                    ) : (
                      <Lock size={16} />
                    )}
                  </div>
                  {lesson.isPreview && !enrolled && (
                    <details className="preview-content">
                      <summary>Preview lesson</summary>
                      <p className="lesson-content">{lesson.content}</p>
                      <VideoPlayer url={lesson.videoUrl} />
                    </details>
                  )}
                </div>
              ))
            ) : (
              <EmptyState
                title="Lessons are on their way"
                description="The instructor hasn't added lessons yet."
              />
            )}
          </section>
        </div>
        <aside className="enrollment-card panel">
          <CourseArtwork course={course} />
          <div className="p-6">
            <p className="eyebrow">Invest in your next chapter</p>
            <strong className="course-price">{price(course.price)}</strong>
            {error && <ErrorMessage error={error} />}
            {owner ? (
              <>
                <Link
                  className="btn primary w-full"
                  to={`/instructor/courses/${courseId}/lessons`}
                >
                  Manage lessons
                  <ArrowRight size={17} />
                </Link>
                <Link
                  className="text-button mt-4"
                  to={`/instructor/courses/${courseId}/edit`}
                >
                  Edit this course
                </Link>
              </>
            ) : enrolled ? (
              <>
                <span className="enrolled-label">
                  <CheckCircle2 size={17} />
                  You're enrolled
                </span>
                <Link className="btn primary w-full" to={`/learn/${courseId}`}>
                  Continue learning
                  <ArrowRight size={17} />
                </Link>
              </>
            ) : user?.role === "student" ? (
              <button
                className="btn primary w-full"
                disabled={busy}
                onClick={enroll}
              >
                {busy ? "Enrolling…" : "Enroll in course"}
                <ArrowRight size={17} />
              </button>
            ) : !user ? (
              <Link
                className="btn primary w-full"
                to="/login"
                state={{ from: `/courses/${courseId}` }}
              >
                Sign in to enroll
                <ArrowRight size={17} />
              </Link>
            ) : (
              <p className="muted">
                Enrollment is available to student accounts.
              </p>
            )}
            <div className="included">
              <span>
                <BookOpen size={16} />
                Self-paced lessons
              </span>
              <span>
                <CheckCircle2 size={16} />
                Track your progress
              </span>
              <span>
                <Star size={16} />
                Share your experience
              </span>
            </div>
            {Number(course.price) > 0 && (
              <p className="fine-print">
                Enrollment is currently available without checkout.
              </p>
            )}
          </div>
        </aside>
      </div>
      <Ratings
        courseId={courseId}
        enrolled={enrolled}
        onChanged={details.reload}
      />
    </div>
  );
}
