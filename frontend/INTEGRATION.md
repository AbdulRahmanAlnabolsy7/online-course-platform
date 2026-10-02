# Frontend API contract

The implementation was read from the existing backend routes, controllers, models, middleware, Joi validators, Swagger and Postman before the frontend was created. The frontend does not mock course data or create alternative endpoints.

## URL, session and responses

`VITE_API_URL` defaults to `http://localhost:5000/api/v1`. Axios adds a saved JWT as `Authorization: Bearer <token>`. Login and registration return `data.user` and `data.token`; `/auth/me` returns `data` directly as the current user. Exact role strings are `student` and `instructor`. The backend reads the current role from the database.

Successful single-resource responses contain `{success,message,data}`. Lists contain `{success,results,pagination:{page,limit,totalPages,totalItems},data:[...]}`. Axios helpers keep these formats distinct. IDs use `_id`; populated references may be objects, while create responses can return reference IDs. Error bodies contain `{success:false,message,errors?}`; validation errors have `field` and `message`.

The JWT is stored in localStorage for this assignment. A 401 from authenticated requests clears the session, and cross-tab login/logout is synchronized. Authentication errors on login/register retain their normal form feedback. Network errors during session restoration offer retry instead of silently destroying the saved token. Frontend role gates are UX only; every mutation remains protected by the backend.

## Exact endpoint mapping

| Service | API |
| --- | --- |
| authApi | POST `/auth/register`, POST `/auth/login`, GET `/auth/me` |
| coursesApi | GET/POST `/courses`, GET/PATCH/DELETE `/courses/:courseId`, GET `/categories` |
| lessonsApi | GET/POST `/courses/:courseId/lessons`, GET/PATCH/DELETE `/courses/:courseId/lessons/:lessonId` |
| enrollmentApi | GET `/enrollments/me`, GET `/courses/:courseId/enrollment-status`, POST/DELETE `/courses/:courseId/enroll` |
| commentsApi | GET/POST `/lessons/:lessonId/comments`, PATCH/DELETE `/comments/:commentId` |
| ratingsApi | GET/POST `/courses/:courseId/ratings`, PATCH/DELETE `/courses/:courseId/ratings/me` |
| progressApi | GET `/courses/:courseId/progress`, PATCH `/lessons/:lessonId/progress` |
| instructorApi | GET `/instructor/courses`, GET `/instructor/stats` |

Course filters are `search`, `category`, `level`, `minPrice`, `maxPrice`, `page`, `limit` and `sort`. UI sort values are `newest`, `rating`, `price`, `-price` and `title`, all supported by the backend. Category is a lowercase slug, not a category ObjectId. Course forms send only title, description, category, level, price, thumbnail, tags and isPublished. Lesson forms send title, content, videoUrl, duration, order and isPreview. Empty optional URLs are omitted to respect existing Joi URI validation. Tags are comma-separated in the UI and converted into an array.

Instructor statistics use actual `numberOfCourses`, `totalEnrollments`, `averageCourseRating`, `mostPopularCourse` and `courses[].enrollments`. Student statistics are computed from all paginated enrollments and actual progress responses; unavailable draft courses show an explicit error rather than invented progress. Course ratings are paginated; finding the current student's review walks supported rating pages because there is no GET-own-rating endpoint. Large enrollments/review lists may require a backend batch/own-resource read endpoint in the future.

## Minimal compatibility changes

1. `.env.example` and the ignored local `.env` allow `http://localhost:5173` and `http://127.0.0.1:5173` alongside the existing origin. `src/app.js` remains unchanged.
2. `src/controllers/progress.controller.js` adds `completedLessonIds` to the existing progress response. Counts and percentage remain unchanged. This supplies persisted per-lesson completion indicators without inventing an endpoint or keeping fake React-only progress.
3. The root Jest testMatch is scoped to backend `.test.js` files so it does not execute frontend Playwright `.spec.js` files. The progress test verifies the added IDs after a separate GET.

## Testing

`npm run build` validates the production bundle. `npm run test:e2e` runs the real platform flow in installed Chrome against the API and Vite servers. It creates unique local test accounts and a temporary course, exercises instructor course/lesson CRUD and stats, student enrollment/learning/comments/ratings, completion restoration after refresh, logged-out and role guards, and screenshots at desktop/tablet/mobile widths. The test deletes its course after the flow; test accounts remain because the existing backend has no user-delete API. Run against a local disposable database, never a production service.

No payment flow is invented. A listed course price is shown, but enrollment follows the backend's immediate enrollment behavior. Videos support recognized YouTube/Vimeo embeds and direct video files; other URLs open externally. External videos/thumbnails require the content host to permit access and embedding. The frontend displays lesson content as plain text to avoid executing stored HTML.
