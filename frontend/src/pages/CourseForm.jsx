import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { coursesApi } from "../api/coursesApi";
import { useAuth } from "../context/AuthContext";
import useAsync from "../hooks/useAsync";
import {
  Checkbox,
  FormInput,
  Select,
  SubmitButton,
  TextArea,
} from "../components/Forms";
import {
  EmptyState,
  ErrorMessage,
  LoadingSpinner,
  PageHeading,
} from "../components/UI";
import { idOf, optionalFields } from "../utils/format";
function Editor({ course }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(null);
  async function submit(event) {
    event.preventDefault();
    const raw = Object.fromEntries(new FormData(event.currentTarget));
    const tags = raw.tags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    if (tags.length > 20 || tags.some((t) => t.length > 40)) {
      setError(new Error("Use at most 20 tags, each at most 40 characters."));
      return;
    }
    const body = optionalFields(
      {
        ...raw,
        price: Number(raw.price),
        tags: [...new Set(tags)],
        isPublished: raw.isPublished === "on",
      },
      ["thumbnail"],
    );
    setBusy(true);
    setError(null);
    try {
      const result = course
        ? await coursesApi.update(course._id, body)
        : await coursesApi.create(body);
      toast.success(course ? "Course updated" : "Course created");
      navigate(
        course
          ? "/instructor/courses"
          : `/instructor/courses/${result._id}/lessons`,
      );
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="panel editor-form" onSubmit={submit}>
      {error && <ErrorMessage error={error} />}
      <div className="form-section-heading">
        <span>01</span>
        <div>
          <h3>The big picture</h3>
          <p>Give learners a reason to get curious.</p>
        </div>
      </div>
      <FormInput
        label="Course title"
        name="title"
        required
        maxLength={200}
        defaultValue={course?.title || ""}
        placeholder="A clear, inspiring title"
      />
      <TextArea
        label="Description"
        name="description"
        required
        maxLength={10000}
        defaultValue={course?.description || ""}
        placeholder="What will learners discover in this course?"
      />
      <div className="grid md:grid-cols-2 gap-5">
        <FormInput
          label="Category"
          name="category"
          required
          maxLength={60}
          pattern="[a-z0-9-]+"
          defaultValue={course?.category || ""}
          help="Lowercase letters, numbers and hyphens, e.g. web-development."
        />
        <Select
          label="Level"
          name="level"
          defaultValue={course?.level || "beginner"}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </Select>
      </div>
      <div className="form-section-heading">
        <span>02</span>
        <div>
          <h3>The finishing touches</h3>
          <p>Make your course easy to discover.</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <FormInput
          label="Price ($)"
          name="price"
          type="number"
          min={0}
          max={1000000}
          step="0.01"
          required
          defaultValue={course?.price || 0}
        />
        <FormInput
          label="Thumbnail URL (optional)"
          name="thumbnail"
          type="url"
          pattern="https?://.*"
          defaultValue={course?.thumbnail || ""}
        />
      </div>
      <FormInput
        label="Tags (optional)"
        name="tags"
        defaultValue={course?.tags?.join(", ") || ""}
        help="Separate tags with commas. Maximum 20 tags of 40 characters each."
      />
      <Checkbox
        label="Publish this course so students can discover and enroll in it"
        name="isPublished"
        defaultChecked={course?.isPublished || false}
      />
      <div className="form-actions">
        <Link className="btn secondary" to="/instructor/courses">
          Cancel
        </Link>
        <SubmitButton busy={busy}>
          {course ? "Save course" : "Create course"}
        </SubmitButton>
      </div>
    </form>
  );
}
export default function CourseForm() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const course = useAsync(
    () => (courseId ? coursesApi.get(courseId) : Promise.resolve(null)),
    [courseId],
  );
  return (
    <div className="container section narrow">
      <PageHeading
        eyebrow="Your teaching studio"
        title={
          courseId
            ? "Refine your next chapter."
            : "What will you teach the world?"
        }
        description="Bring your expertise to life, one course at a time."
      />
      {course.loading ? (
        <LoadingSpinner />
      ) : course.error ? (
        <ErrorMessage error={course.error} retry={course.reload} />
      ) : course.data && idOf(course.data.instructor) !== user._id ? (
        <EmptyState
          title="This course belongs to another instructor"
          description="You can only manage your own courses."
        />
      ) : (
        <Editor key={courseId || "new"} course={course.data} />
      )}
    </div>
  );
}
