import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";
import toast from "react-hot-toast";
import { coursesApi } from "../api/coursesApi";
import { lessonsApi } from "../api/lessonsApi";
import { progressApi } from "../api/progressApi";
import useAsync from "../hooks/useAsync";
import {
  EmptyState,
  ErrorMessage,
  LoadingSpinner,
  ProgressBar,
} from "../components/UI";
import Comments from "../components/Comments";
import VideoPlayer from "../components/VideoPlayer";
function LessonContent({
  courseId,
  lessonId,
  completed,
  onProgress,
  previous,
  next,
  onNavigate,
}) {
  const lesson = useAsync(
    () => lessonsApi.get(courseId, lessonId),
    [courseId, lessonId],
  );
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(null);
  async function mark() {
    setBusy(true);
    setError(null);
    try {
      const result = await progressApi.update(lessonId, !completed);
      onProgress(result);
      toast.success(
        completed
          ? "Lesson marked incomplete"
          : "One more step forward. Lesson completed!",
      );
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }
  if (lesson.loading) return <LoadingSpinner label="Opening your lesson…" />;
  if (lesson.error)
    return <ErrorMessage error={lesson.error} retry={lesson.reload} />;
  return (
    <>
      <section className="panel lesson-panel">
        <p className="eyebrow">
          Lesson {lesson.data.order} · {lesson.data.duration} min
        </p>
        <h1>{lesson.data.title}</h1>
        <VideoPlayer url={lesson.data.videoUrl} />
        <div className="lesson-content">{lesson.data.content}</div>
        {error && <ErrorMessage error={error} />}
        <button
          className={`btn ${completed ? "secondary" : "primary"}`}
          disabled={busy}
          onClick={mark}
        >
          <CheckCircle2 size={18} />
          {busy
            ? "Saving…"
            : completed
              ? "Mark incomplete"
              : "Mark lesson complete"}
        </button>
        <div className="lesson-navigation">
          <button
            className="btn secondary"
            disabled={!previous}
            onClick={() => onNavigate(previous)}
          >
            <ChevronLeft size={16} />
            Previous lesson
          </button>
          <button
            className="btn secondary"
            disabled={!next}
            onClick={() => onNavigate(next)}
          >
            Next lesson
            <ChevronRight size={16} />
          </button>
        </div>
      </section>
      <Comments key={lessonId} lessonId={lessonId} />
    </>
  );
}
export default function Learning() {
  const { courseId } = useParams();
  const [params, setParams] = useSearchParams();
  const [savedProgress, setSavedProgress] = useState(null);
  const course = useAsync(async () => {
    const [details, lessons, progress] = await Promise.all([
      coursesApi.get(courseId),
      lessonsApi.list(courseId),
      progressApi.get(courseId),
    ]);
    return { details, lessons, progress };
  }, [courseId]);
  if (course.loading) return <LoadingSpinner />;
  if (course.error)
    return (
      <div className="container section">
        <ErrorMessage error={course.error} retry={course.reload} />
        <Link to={`/courses/${courseId}`} className="btn secondary mt-6">
          Back to course
        </Link>
      </div>
    );
  const { details, lessons } = course.data;
  const progress =
    savedProgress?.courseId === courseId ? savedProgress : course.data.progress;
  const selected =
    lessons.find((l) => l._id === params.get("lesson")) || lessons[0];
  const index = lessons.findIndex((l) => l._id === selected?._id);
  const ids = new Set(progress.completedLessonIds || []);
  return (
    <div className="container section">
      <Link className="text-button mb-6" to={`/courses/${courseId}`}>
        ← Course overview
      </Link>
      <div className="learning-heading">
        <div>
          <p className="eyebrow">Your learning journey</p>
          <h2>{details.title}</h2>
        </div>
        <ProgressBar progress={progress} />
      </div>
      {lessons.length ? (
        <div className="learning-layout">
          <aside className="lesson-sidebar panel">
            <h3>Course chapters</h3>
            {lessons.map((l) => (
              <button
                key={l._id}
                className={
                  l._id === selected._id
                    ? "lesson-choice selected"
                    : "lesson-choice"
                }
                onClick={() => setParams({ lesson: l._id })}
              >
                <span
                  className={
                    ids.has(l._id)
                      ? "completion-dot complete"
                      : "completion-dot"
                  }
                >
                  {ids.has(l._id) ? <Check size={14} /> : l.order}
                </span>
                <span className="grow text-left">
                  {l.title}
                  <small>{l.duration} min</small>
                </span>
                {l._id === selected._id && <Play size={14} />}
              </button>
            ))}
          </aside>
          <div className="min-w-0">
            <LessonContent
              key={selected._id}
              courseId={courseId}
              lessonId={selected._id}
              completed={ids.has(selected._id)}
              onProgress={setSavedProgress}
              previous={lessons[index - 1]?._id}
              next={lessons[index + 1]?._id}
              onNavigate={(id) => setParams({ lesson: id })}
            />
          </div>
        </div>
      ) : (
        <EmptyState
          title="Your lessons are coming soon"
          description="The instructor hasn't added lessons to this course yet."
        />
      )}
    </div>
  );
}
