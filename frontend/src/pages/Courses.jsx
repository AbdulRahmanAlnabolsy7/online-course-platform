import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { coursesApi } from "../api/coursesApi";
import useAsync from "../hooks/useAsync";
import CourseCard from "../components/CourseCard";
import { FormInput, Select } from "../components/Forms";
import {
  EmptyState,
  ErrorMessage,
  LoadingSpinner,
  PageHeading,
  Pagination,
} from "../components/UI";
import { titleCase } from "../utils/format";
export default function Courses() {
  const [search, setSearch] = useSearchParams();
  const key = search.toString();
  const query = Object.fromEntries(
    ["search", "category", "level", "minPrice", "maxPrice", "sort", "page"]
      .filter((k) => search.get(k))
      .map((k) => [k, search.get(k)]),
  );
  const courses = useAsync(
    () => coursesApi.list({ ...query, limit: 9 }),
    [key],
  );
  const categories = useAsync(coursesApi.categories);
  function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    Object.keys(values).forEach((k) => {
      if (!values[k]) delete values[k];
    });
    setSearch(values);
  }
  return (
    <div className="container section">
      <PageHeading
        eyebrow="Follow your curiosity"
        title="Find your next possibility."
        description="Explore courses made by people who love what they do."
      />
      <div className="catalog-layout">
        <aside className="filter-panel">
          <h3>
            <SlidersHorizontal size={17} /> Refine your search
          </h3>
          <form key={key} onSubmit={submit}>
            <FormInput
              label="Search courses"
              name="search"
              placeholder="What would you like to learn?"
              defaultValue={query.search || ""}
              maxLength={100}
            />
            <Select
              label="Category"
              name="category"
              defaultValue={query.category || ""}
            >
              <option value="">All categories</option>
              {categories.data?.map((c) => (
                <option key={c} value={c}>
                  {titleCase(c)}
                </option>
              ))}
            </Select>
            {categories.error && (
              <ErrorMessage
                error={categories.error}
                retry={categories.reload}
              />
            )}
            <Select label="Level" name="level" defaultValue={query.level || ""}>
              <option value="">All levels</option>
              {["beginner", "intermediate", "advanced"].map((l) => (
                <option key={l} value={l}>
                  {titleCase(l)}
                </option>
              ))}
            </Select>
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Min price"
                name="minPrice"
                type="number"
                min={0}
                step="0.01"
                defaultValue={query.minPrice || ""}
              />
              <FormInput
                label="Max price"
                name="maxPrice"
                type="number"
                min={0}
                step="0.01"
                defaultValue={query.maxPrice || ""}
              />
            </div>
            <Select
              label="Sort by"
              name="sort"
              defaultValue={query.sort || "newest"}
            >
              <option value="newest">Newest first</option>
              <option value="rating">Highest rated</option>
              <option value="price">Price: low to high</option>
              <option value="-price">Price: high to low</option>
              <option value="title">Title: A–Z</option>
            </Select>
            <button className="btn primary w-full" type="submit">
              <Search size={16} />
              Apply filters
            </button>
            <button
              className="text-button mt-3 w-full justify-center"
              type="button"
              onClick={() => setSearch({})}
            >
              Clear filters
            </button>
          </form>
        </aside>
        <div className="min-w-0">
          <div className="catalog-count">
            <span>
              {courses.data?.pagination.totalItems ?? "…"} courses to explore
            </span>
            <span className="tiny-label">Keep discovering</span>
          </div>
          {courses.loading ? (
            <LoadingSpinner />
          ) : courses.error ? (
            <ErrorMessage error={courses.error} retry={courses.reload} />
          ) : courses.data?.data.length ? (
            <>
              <div className="course-grid catalog-grid">
                {courses.data.data.map((c) => (
                  <CourseCard key={c._id} course={c} />
                ))}
              </div>
              <Pagination
                pagination={courses.data.pagination}
                onChange={(page) => setSearch({ ...query, page: String(page) })}
              />
            </>
          ) : (
            <EmptyState
              title="No courses found"
              description="Try a different search or clear your filters."
            />
          )}
        </div>
      </div>
    </div>
  );
}
