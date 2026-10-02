import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";
import { enrollmentApi } from "../api/enrollmentApi";
import { progressApi } from "../api/progressApi";
import useAsync from "../hooks/useAsync";
import CourseCard from "../components/CourseCard";
import {
  EmptyState,
  ErrorMessage,
  LoadingSpinner,
  PageHeading,
  ProgressBar,
  StatCard,
} from "../components/UI";
import { useAuth } from "../context/AuthContext";
async function loadLearning() {
  let page = 1;
  const enrollments = [];
  while (true) {
    const result = await enrollmentApi.mine({ page, limit: 100 });
    enrollments.push(...result.data);
    if (page >= result.pagination.totalPages) break;
    page++;
  }
  return Promise.all(
    enrollments
      .filter((e) => e.course)
      .map(async (e) => {
        try {
          return { ...e, progress: await progressApi.get(e.course._id) };
        } catch (error) {
          return { ...e, progressError: error };
        }
      }),
  );
}
export default function StudentCourses({ dashboard = false }) {
  const { user } = useAuth();
  const learning = useAsync(loadLearning, [user._id]);
  const data = learning.data || [];
  const available = data.filter((e) => e.progress);
  const completed = available.filter(
    (e) => e.progress.totalLessons > 0 && e.progress.progressPercentage === 100,
  ).length;
  return (
    <div className="container section">
      <PageHeading
        eyebrow="Your learning space"
        title={
          dashboard
            ? `A new day to grow, ${user.name.split(" ")[0]}.`
            : "Your next chapters."
        }
        description={
          dashboard
            ? "Every lesson is a step forward. Keep your momentum going."
            : "All your courses, together. Pick up wherever curiosity takes you."
        }
      >
        <Link to="/courses" className="btn secondary">
          Discover more
          <ArrowRight size={17} />
        </Link>
      </PageHeading>
      {learning.loading ? (
        <LoadingSpinner />
      ) : learning.error ? (
        <ErrorMessage error={learning.error} retry={learning.reload} />
      ) : (
        <>
          {dashboard && (
            <div className="stats-grid mb-10">
              <StatCard
                label="Enrolled courses"
                value={data.length}
                icon={BookOpen}
              />
              <StatCard
                label="Completed courses"
                value={completed}
                icon={GraduationCap}
              />
              <StatCard
                label="Lessons completed"
                value={available.reduce(
                  (n, e) => n + e.progress.completedLessons,
                  0,
                )}
                icon={CheckCircle2}
              />
            </div>
          )}
          {data.length ? (
            <>
              <h2 className="mb-6">
                {dashboard ? "Keep the momentum going" : "My learning"}
              </h2>
              <div className="course-grid">
                {data.map((e) => (
                  <CourseCard
                    key={e._id}
                    course={e.course}
                    footer={
                      <div className="learning-card-footer">
                        {e.progress ? (
                          <>
                            <ProgressBar progress={e.progress} />
                            <Link
                              className="btn primary w-full mt-4"
                              to={`/learn/${e.course._id}`}
                            >
                              Continue learning
                              <ArrowRight size={16} />
                            </Link>
                          </>
                        ) : (
                          <ErrorMessage
                            error={e.progressError}
                            retry={learning.reload}
                          />
                        )}
                      </div>
                    }
                  />
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              title="You are not enrolled in any courses yet"
              description="Find something that sparks your curiosity and start your first chapter."
            >
              <Link className="btn primary" to="/courses">
                Explore courses
                <ArrowRight size={17} />
              </Link>
            </EmptyState>
          )}
        </>
      )}
    </div>
  );
}
