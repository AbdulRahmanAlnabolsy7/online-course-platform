import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, Star, Users } from "lucide-react";
import { instructorApi } from "../api/instructorApi";
import useAsync from "../hooks/useAsync";
import { useAuth } from "../context/AuthContext";
import {
  EmptyState,
  ErrorMessage,
  LoadingSpinner,
  PageHeading,
  StatCard,
} from "../components/UI";
export default function InstructorDashboard() {
  const { user } = useAuth();
  const stats = useAsync(instructorApi.stats, [user._id]);
  return (
    <div className="container section">
      <PageHeading
        eyebrow="Your teaching space"
        title={`Ideas grow when you share them, ${user.name.split(" ")[0]}.`}
        description="A clear view of your courses and the learners you're reaching."
      >
        <Link to="/instructor/courses/new" className="btn primary">
          Create a course
          <ArrowUpRight size={17} />
        </Link>
      </PageHeading>
      {stats.loading ? (
        <LoadingSpinner />
      ) : stats.error ? (
        <ErrorMessage error={stats.error} retry={stats.reload} />
      ) : (
        <>
          <div className="stats-grid">
            <StatCard
              label="Your courses"
              value={stats.data.numberOfCourses}
              icon={BookOpen}
            />
            <StatCard
              label="Total enrollments"
              value={stats.data.totalEnrollments}
              icon={Users}
            />
            <StatCard
              label="Average course rating"
              value={Number(stats.data.averageCourseRating).toFixed(1)}
              icon={Star}
              detail="Weighted by the number of reviews"
            />
          </div>
          <div className="panel mt-9">
            <div className="section-heading">
              <h2>Your courses at a glance</h2>
              <Link to="/instructor/courses" className="text-button">
                Manage courses
                <ArrowUpRight size={16} />
              </Link>
            </div>
            {stats.data.courses.length ? (
              <div className="analytics-list">
                {stats.data.courses.map((course, i) => (
                  <div key={course._id}>
                    <span className="lesson-number">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="grow min-w-0">
                      <Link
                        className="font-semibold"
                        to={`/courses/${course._id}`}
                      >
                        {course.title}
                      </Link>
                      <div className="analytics-bar">
                        <span
                          style={{
                            width: `${stats.data.totalEnrollments ? (course.enrollments / stats.data.totalEnrollments) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span>
                      {course.enrollments} <small>enrollments</small>
                    </span>
                    <span className="rating">
                      <Star size={15} />
                      {Number(course.averageRating).toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Your first course starts with an idea"
                description="Turn what you know into a learning experience."
              >
                <Link className="btn primary" to="/instructor/courses/new">
                  Create your first course
                </Link>
              </EmptyState>
            )}
          </div>
          {stats.data.mostPopularCourse && stats.data.totalEnrollments > 0 && (
            <p className="muted mt-5">
              Most popular:{" "}
              <strong>{stats.data.mostPopularCourse.title}</strong> ·{" "}
              {stats.data.mostPopularCourse.enrollments} enrollments
            </p>
          )}
        </>
      )}
    </div>
  );
}
