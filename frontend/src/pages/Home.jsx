import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Compass,
  GraduationCap,
  MessagesSquare,
  Sparkles,
} from "lucide-react";
import { coursesApi } from "../api/coursesApi";
import useAsync from "../hooks/useAsync";
import CourseCard from "../components/CourseCard";
import { EmptyState, ErrorMessage, LoadingSpinner } from "../components/UI";
import { titleCase } from "../utils/format";
export default function Home() {
  const courses = useAsync(() => coursesApi.list({ limit: 3, sort: "rating" }));
  const categories = useAsync(coursesApi.categories);
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="dot" />
              For the endlessly curious
            </p>
            <h1>
              Your next chapter
              <br />
              starts with <em>curiosity.</em>
            </h1>
            <p className="hero-description">
              Learn a new skill. Find a fresh perspective.
              <br className="hidden md:block" />
              Make a little space for the person you want to become.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/courses" className="btn primary">
                Explore courses
                <ArrowUpRight size={18} />
              </Link>
              <Link to="/register" className="btn secondary">
                Share what you know
                <ArrowRight size={17} />
              </Link>
            </div>
            <div className="hero-footnote">
              <span className="mini-spark">
                <Sparkles size={17} />
              </span>
              Small steps today. New possibilities tomorrow.
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <span className="floating-spark">✳</span>
            <div className="book book-back" />
            <div className="book book-front">
              <span className="book-small">A FIELD GUIDE TO</span>
              <span className="book-title">
                Growing
                <br />
                your
                <br />
                <em>potential.</em>
              </span>
              <div className="book-illustration">
                <div />
                <div />
                <div />
              </div>
              <BookOpen size={27} />
              <span className="book-bottom">ONE CHAPTER AT A TIME</span>
            </div>
            <div className="floating-note">
              <span className="note-icon">
                <GraduationCap size={24} />
              </span>
              <div>
                <strong>Made for your next step</strong>
                <p>Learn at your own pace</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="benefit-strip">
        <div className="container">
          <span>
            <Compass size={18} />
            Follow your interests
          </span>
          <span>
            <BookOpen size={18} />
            Learn at your own pace
          </span>
          <span>
            <MessagesSquare size={18} />
            Connect through ideas
          </span>
        </div>
      </div>
      <section className="container section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Find your starting point</p>
            <h2>A world of things to learn.</h2>
          </div>
          <Link to="/courses" className="text-button">
            Browse all courses
            <ArrowUpRight size={18} />
          </Link>
        </div>
        {categories.loading ? (
          <LoadingSpinner label="Loading topics…" />
        ) : categories.error ? (
          <ErrorMessage error={categories.error} retry={categories.reload} />
        ) : categories.data?.length ? (
          <div className="category-list">
            {categories.data.map((category, i) => (
              <Link
                key={category}
                to={`/courses?category=${encodeURIComponent(category)}`}
              >
                <span className="category-number">0{i + 1}</span>
                {titleCase(category)}
                <ArrowUpRight size={18} />
              </Link>
            ))}
          </div>
        ) : (
          <p className="muted">
            Topics will appear here as instructors publish their courses.
          </p>
        )}
      </section>
      <section className="featured-section">
        <div className="container section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A little inspiration</p>
              <h2>Your next favorite course.</h2>
            </div>
            <span className="tiny-label">From our learning community</span>
          </div>
          {courses.loading ? (
            <LoadingSpinner />
          ) : courses.error ? (
            <ErrorMessage error={courses.error} retry={courses.reload} />
          ) : courses.data?.data.length ? (
            <div className="course-grid">
              {courses.data.data.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Good things are on their way"
              description="Our instructors haven't published any courses yet. Have something to share?"
            >
              <Link to="/register" className="btn primary">
                Become an instructor
                <ArrowUpRight size={17} />
              </Link>
            </EmptyState>
          )}
        </div>
      </section>
      <section className="container section why-grid">
        <div>
          <p className="eyebrow">Learning that fits your life</p>
          <h2>
            Room to explore.
            <br />
            <em>Space to grow.</em>
          </h2>
          <p className="muted mt-5">
            A thoughtful place to build skills, ask questions, and turn a spark
            of interest into something more.
          </p>
        </div>
        <div className="feature-list">
          {[
            [
              Compass,
              "Your path, your pace",
              "Pick a course that speaks to you and learn when it works for you.",
            ],
            [
              MessagesSquare,
              "Learn together",
              "Ask questions, share your thoughts, and join the lesson discussion.",
            ],
            [
              GraduationCap,
              "See how far you have come",
              "Track your lessons and celebrate every step forward.",
            ],
          ].map(([Icon, title, copy]) => (
            <div key={title}>
              <span>
                <Icon size={24} />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="container pb-20">
        <div className="teach-banner">
          <div>
            <p className="eyebrow">Turn experience into impact</p>
            <h2>
              Someone is ready to learn
              <br />
              what you already know.
            </h2>
            <p>
              Create your course. Share your perspective. Help someone grow.
            </p>
          </div>
          <Link to="/register" className="btn light">
            Start teaching
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
