import { ArrowUpRight, BookOpen, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { initials, price, titleCase } from "../utils/format";
export function CourseArtwork({ course }) {
  const colors = ["sage", "peach", "lilac", "sand"];
  return (
    <div className={`course-art ${colors[(course.title || "").length % 4]}`}>
      {course.thumbnail && (
        <img
          src={course.thumbnail}
          alt=""
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}
      <div className="art-decoration" aria-hidden="true">
        <BookOpen size={46} strokeWidth={1.2} />
        <span className="art-ring" />
      </div>
      <span className="art-category">{titleCase(course.category)}</span>
    </div>
  );
}
export default function CourseCard({ course, footer }) {
  return (
    <article className="course-card">
      <Link to={`/courses/${course._id}`} aria-label={`View ${course.title}`}>
        <CourseArtwork course={course} />
      </Link>
      <div className="course-card-body">
        <div className="flex justify-between gap-2">
          <span className="tiny-label">{titleCase(course.level)}</span>
          <span className="rating">
            <Star size={13} fill="currentColor" />
            {Number(course.averageRating || 0).toFixed(1)}{" "}
            <span className="muted">({course.ratingsCount || 0})</span>
          </span>
        </div>
        <h3>
          <Link to={`/courses/${course._id}`}>{course.title}</Link>
        </h3>
        <p className="description-preview">{course.description}</p>
        <div className="instructor-line">
          <span className="avatar mini">
            {initials(course.instructor?.name)}
          </span>
          {course.instructor?.name || "Course instructor"}
        </div>
        <div className="course-card-bottom">
          <strong>{price(course.price)}</strong>
          <Link to={`/courses/${course._id}`} className="text-button">
            Explore course
            <ArrowUpRight size={17} />
          </Link>
        </div>
        {footer}
      </div>
    </article>
  );
}
