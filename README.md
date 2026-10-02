# Online Course Platform API

Source repository: [online-course-platform](https://github.com/AbdulRahmanAlnabolsy7/online-course-platform). The repository is private; sign in with the owner account or request collaborator access to view it.

A university/ITI online learning platform with a React frontend and an Express/MongoDB REST API. Instructors manage courses and ordered lessons; students enroll, discuss lessons, rate courses, and track completion. The backend uses CommonJS JavaScript; the frontend uses JavaScript ES modules.

## Features and stack

Node.js 20+, Express 5, MongoDB, Mongoose, bcryptjs, JWT, Joi, Helmet, CORS and rate limiting. Includes ownership checks, draft visibility, preview lessons, search, filters, sorting, pagination, instructor aggregation analytics, Swagger UI, Postman, Docker, demo data, and Jest/Supertest integration tests using an isolated temporary MongoDB instance.

## Architecture

```text
src/
  config/       environment validation and database connection
  controllers/  auth, course, lesson, enrollment, comment, rating, progress
  docs/         OpenAPI definition derived from Joi request schemas
  middleware/   authentication, validation, safe input, errors, rate limits
  models/       User, Course, Lesson, Enrollment, Comment, Rating, LessonProgress
  routes/       mounted REST endpoint definitions
  services/     reusable access checks and rating aggregation
  utils/        API error and response/pagination helpers
  app.js        independently testable Express app
  server.js     startup, index initialization, graceful shutdown
scripts/        demo seed and Postman generator
tests/          integration tests
postman/        importable collection
.vscode/        API and Jest debugging configurations
```

Controllers implement the use cases; shared access checks keep ownership and enrollment decisions consistent. Express 5 forwards rejected async handlers to the final error middleware.

## Database design

| Model | Relationships and design |
| --- | --- |
| User | Unique normalized email, bcrypt password excluded by default, student/instructor role |
| Course | Instructor reference; string category slug; publication state and cached rating summary |
| Lesson | Course reference; unique course/order index for predictable ordering |
| Enrollment | Unique student/course pair; enrollment date |
| Comment | User and lesson references; timestamps |
| Rating | Unique student/course pair; integer score 1–5 and optional review |
| LessonProgress | Unique student/lesson pair; course reference for cleanup; existence means completed |

Categories are strings rather than a separate collection because this assignment does not require category administration. `GET /categories` lists the categories in published courses. Completion counts and percentages are calculated from current lessons and progress records, so adding or removing lessons changes progress correctly without updating every enrollment. Rating summaries are recalculated with MongoDB aggregation after mutations. Course and lesson deletions clean related records; unenrollment removes progress and ratings, while authored comments remain.

## Installation and environment

Install Node.js 20 or newer and run MongoDB locally, or use Docker below.

```powershell
npm install
Copy-Item .env.example .env
```

Set `JWT_SECRET` in `.env` to a random secret of at least 32 characters. Generate one locally:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

| Variable | Description |
| --- | --- |
| PORT | API port, default 5000 |
| NODE_ENV | development, test or production |
| MONGO_URI | Required MongoDB connection string |
| JWT_SECRET | Required JWT signing secret, minimum 32 characters |
| JWT_EXPIRES_IN | Integer with s/m/h/d unit; default 7d |
| CORS_ORIGIN | Comma-separated allowed frontend origins |

```powershell
npm run dev
# Production process:
npm start
# Optional non-destructive demo seed (disabled in production):
npm run seed
```

For a quick demo without an installed MongoDB server, configure `.env` and run `npm run dev:demo`. This downloads/starts a temporary MongoDB using a development dependency and runs the actual API. Demo data is temporary and disappears on shutdown; use normal `npm run dev` with your own MongoDB for persistent work.

Demo accounts use `instructor@example.com` and `student@example.com`, password `DemoPass123!`. Use them only for local exploration. The seed is repeatable and does not delete existing data.

## VS Code

Open this directory with **File → Open Folder**. Run the commands above in the integrated terminal. The Run and Debug panel includes **Debug API** and **Debug Jest**. Debug API requires a configured `.env` and an available MongoDB server. The API runs on port 5000; the React application runs on port 5173. **Terminal → Run Task → Run full platform** starts both demo backend and frontend in VS Code terminals. Stop any already running servers first to avoid port conflicts.

## Authentication and authorization

Register with `role: "instructor"` or `role: "student"`. Registration and login return `{user, token}`. Send `Authorization: Bearer <token>` on protected requests. JWTs use HS256 with a fixed issuer and audience, expiration, and the database user ID as subject. Roles come from the current database user, not a trusted client ID. Passwords never appear in API responses.

Only the instructor who owns a course can modify it or its lessons. Instructors cannot enroll. Students must enroll before reading protected lesson content, writing comments, rating, or tracking progress. Comment edits/deletes require ownership. Published lesson lists expose metadata and preview content to visitors; protected content is omitted. Draft courses are visible only to the owner, including their lesson endpoints. Optional authenticated reads should still provide a valid token if an Authorization header is sent.

## Endpoint overview

All paths below are relative to `/api/v1`.

| Area | Endpoints |
| --- | --- |
| Auth | POST `/auth/register`, POST `/auth/login`, GET `/auth/me` |
| Courses | GET/POST `/courses`, GET/PATCH/DELETE `/courses/:courseId` |
| Categories | GET `/categories` |
| Instructor | GET `/instructor/courses`, GET `/instructor/stats` |
| Lessons | GET/POST `/courses/:courseId/lessons`, GET/PATCH/DELETE `/courses/:courseId/lessons/:lessonId` |
| Enrollment | POST/DELETE `/courses/:courseId/enroll`, GET `/enrollments/me`, GET `/courses/:courseId/enrollment-status` |
| Comments | GET/POST `/lessons/:lessonId/comments`, PATCH/DELETE `/comments/:commentId` |
| Ratings | GET/POST `/courses/:courseId/ratings`, PATCH/DELETE `/courses/:courseId/ratings/me` |
| Progress | PATCH `/lessons/:lessonId/progress`, GET `/courses/:courseId/progress` |

`GET /courses` accepts `page`, `limit`, `category`, `instructor`, `level`, `minPrice`, `maxPrice`, `minRating`, `search`, and `sort`. Sorting: `newest`, `rating`, `price`, `-price`, `title`, `-title`, `-createdAt`, `-averageRating`. Search matches title/description with an escaped literal substring. Defaults: page 1, limit 10; limit is capped at 100. Comments, ratings, enrollments and instructor course lists support pagination. Instructor stats use aggregation and return enrollment counts, most popular course, and a rating average weighted by rating count.

Lesson orders must be positive and unique within a course. To swap two orders, first move one lesson to an unused temporary order. Empty courses have 0% progress. Completion is idempotent and reversible.

## Example requests

Register an instructor:

```http
POST /api/v1/auth/register
Content-Type: application/json

{"name":"Instructor","email":"teacher@example.com","password":"StrongPass123!","role":"instructor"}
```

Create a published course with the returned token:

```http
POST /api/v1/courses
Authorization: Bearer <token>
Content-Type: application/json

{"title":"Node.js","description":"Learn REST APIs","category":"programming","isPublished":true,"price":0}
```

```http
GET /api/v1/courses?search=node&category=programming&sort=-averageRating&page=1&limit=10
```

Complete a lesson as an enrolled student:

```http
PATCH /api/v1/lessons/<lessonId>/progress
Authorization: Bearer <student-token>
Content-Type: application/json

{"completed":true}
```

```json
{"success":true,"message":"Progress updated","data":{"courseId":"507f1f77bcf86cd799439011","completedLessons":1,"totalLessons":2,"progressPercentage":50}}
```

Errors use consistent JSON and meaningful HTTP status codes:

```json
{"success":false,"message":"Course enrollment required"}
```

```json
{"success":false,"message":"Validation failed","errors":[{"field":"value","message":"\"value\" must be less than or equal to 5"}]}
```

Successful deletes return 204 with no body. Duplicate unique resources return 409; validation errors return 422; invalid/expired tokens return 401; permission failures return 403; hidden/missing resources return 404. Unexpected server errors are logged but never expose stack traces in responses.

## Tests

```powershell
npm test
npm run test:watch
```

Tests create an isolated MongoDB using `mongodb-memory-server`, initialize indexes, execute the full instructor/student flow, and remove the temporary database afterward. No local development data is used. The first test run downloads a MongoDB binary, so internet access is required initially. Tests cover roles, ownership, IDs, drafts, previews, duplicate enrollment/rating, comments, aggregate updates, progress changes, cleanup, validation, input injection and documentation.

## Swagger and Postman

Open [Swagger UI](http://localhost:5000/api-docs) while the server is running. The OpenAPI JSON is at `/api-docs.json`. Request schemas and query parameters derive from the same Joi validators used by the API. Click **Authorize** and paste the JWT without the Bearer prefix. Public reads also accept an optional token for owner/enrollment visibility.

Import `postman/online-course-platform.json`. `baseUrl` defaults to `http://localhost:5000/api/v1`; auth responses save `token`; creation requests save `courseId`, `lessonId`, and `commentId`. Register/login an instructor, create the published course and lessons, then register/login a student with a different email and role before running enrollment, comments, ratings and progress. Each login replaces the token; log in as the instructor again for owner operations. Request folders contain all required endpoints, example bodies and expected-status assertions. Regenerate the collection with `node scripts/generate-postman.js` after changing docs.

## Docker

Configure `.env` with a secure JWT secret, then:

```powershell
docker compose up --build -d
docker compose logs -f api
docker compose down
```

Compose starts API and MongoDB, waits for the database health check, and persists data in a named volume. MongoDB is only available within the Compose network. `docker compose down` preserves the volume. The API runs as the unprivileged Node user. The image installs production dependencies from `package-lock.json`. `/health` returns 200 when the database connection is ready and 503 otherwise.

## Security and deployment limits

Helmet, explicit CORS origins, JSON size limits, request-key checks, strict Joi allowlists, escaped searches and server-built database queries reduce unsafe input. Passwords use bcrypt cost 12 and a 72-byte input limit. Auth requests are limited to 20 per 15 minutes/IP; all API requests to 300 per 15 minutes/IP. Indexes enforce uniqueness at the database level. Never commit `.env`; terminate HTTPS at your deployment proxy. Trust proxy is intentionally not enabled: configure it for your specific proxy before deploying behind one. Rate limits currently use an in-process store; multiple instances require a shared store.

This is a production-style assignment, not a paid learning service. Listed prices do not implement checkout: enrollment is immediate. JWT refresh/revocation, email verification, password resets, uploads, and payments are future work. Course/lesson cascade cleanup and cached rating refresh are multiple database operations rather than transactions. Concurrent mutations or interrupted cleanup can require reconciliation; for a multi-instance production deployment, use replica-set transactions and coordinated rating updates. The API works with standalone MongoDB for straightforward local setup. Public search uses substring matching; large catalogs should use indexed text/search infrastructure.

## Suggested real commit sequence

Commit actual changes as you develop; do not fabricate history:

1. `chore: initialize express application and configuration`
2. `feat: add mongoose models and jwt authentication`
3. `feat: implement course and lesson ownership`
4. `feat: add enrollment comments ratings and progress`
5. `feat: add catalog search and instructor analytics`
6. `test: cover instructor and student API flows`
7. `docs: add openapi postman and setup guide`
8. `chore: add docker and vscode debugging`

## Author and license

Author: Abdalrahaman Mohamed. MIT license; see `LICENSE`.

## Frontend — Luma

The complete responsive application is in `frontend/`. Stack: React 19, Vite 6, JavaScript, React Router, Axios, Tailwind CSS 4, Lucide icons, and react-hot-toast. It reads actual API data; empty catalogs show an honest empty state. The frontend uses Context, a small request hook, reusable components, and separate services for each API area.

```text
frontend/
  src/
    api/          Axios client and feature API services
    components/   cards, forms, loading/errors, pagination, dialogs, comments, ratings, video
    context/      JWT authentication and session restoration
    hooks/        async request state and stale response protection
    layouts/      shared navigation and footer
    pages/        public, student, instructor and management pages
    routes/       authentication and role guards
    utils/        error parsing, formatting and reference helpers
    App.jsx
    main.jsx
    styles.css
  e2e/            Playwright full-flow browser test
  .env.example
  vite.config.js
  playwright.config.js
  INTEGRATION.md
```

### Run the full platform

Backend terminal, repository root:

```powershell
npm install
# Configure .env with MONGO_URI and a secure JWT_SECRET, then:
npm run dev
# Or use the temporary database for a demo:
npm run dev:demo
```

Frontend terminal:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Open [Luma](http://127.0.0.1:5173). `VITE_API_URL` defaults to `http://localhost:5000/api/v1`; it is public configuration, not a secret. Keep JWT secrets only in the backend. Set the backend `CORS_ORIGIN` to include both `http://localhost:5173` and `http://127.0.0.1:5173`, as shown in `.env.example`. Restart the API after changing CORS.

### Pages and flows

| Route | Purpose |
| --- | --- |
| `/` | Editorial home page, API-backed featured courses and categories |
| `/courses` | Search, category/level/price filters, sorting and pagination |
| `/courses/:courseId` | Course details, curriculum, previews, enrollment and reviews |
| `/login`, `/register` | Authentication using actual student/instructor role values |
| `/student/dashboard` | Real enrollment and progress totals |
| `/student/courses` | Enrolled courses, progress bars and continue learning |
| `/learn/:courseId` | Lesson sidebar, content, videos, progress and comments |
| `/instructor/dashboard` | API-backed instructor statistics and enrollment bars |
| `/instructor/courses` | Own courses, publication state and management actions |
| `/instructor/courses/new` | Create a course |
| `/instructor/courses/:courseId/edit` | Edit own course |
| `/instructor/courses/:courseId/lessons` | Add, edit, order and delete lessons |

Student: register or sign in as **Student**, browse/search/filter a published course, enroll, open **My learning**, read lessons, mark completion, and participate in comments and ratings. Comments can be edited/deleted only by their author. Ratings can be created, updated, and deleted only by enrolled students. Completion is saved to MongoDB and survives refresh.

Instructor: register or sign in as **Instructor**, create a course, add lessons, edit course details, enable publication, and monitor the dashboard. Drafts are visible to their owner only. Students cannot enter instructor routes; instructors cannot enter student learning routes. The backend remains the final authorization authority.

JWTs are persisted in localStorage for this assignment and restored through `/auth/me`. A 401 clears the session. Validation, 403, 404, duplicates, server errors and network failures show readable feedback. Course details do not expose protected lesson content before enrollment. Lesson text is rendered as plain text, not HTML. Blank optional URLs are omitted from edit requests; they preserve an existing URL because the current API does not offer an unset operation.

### Build and browser tests

```powershell
cd frontend
npm run build
npm run preview
# With backend and Vite already running:
npm run test:e2e
```

Production files are generated in `frontend/dist`. Configure static hosting to route unknown frontend paths to `index.html`; set `VITE_API_URL` before building for your deployment. Docker Compose currently runs the API and MongoDB; frontend hosting is separate.

Playwright uses the installed Chrome browser. If Chrome is unavailable, install the Playwright Chromium browser and remove `channel: 'chrome'` from `playwright.config.js`. The full-flow test creates unique local accounts and a course, tests instructor and student operations, takes screenshots at 1440/768/390px, checks role protection and persisted progress, then deletes its course. Accounts remain because there is no user-delete API. Use a disposable local database. Backend tests still run independently with `npm test` from the repository root.

See `frontend/INTEGRATION.md` for the actual API contract and compatibility changes. The sole application-code backend change adds `completedLessonIds` to the existing progress response; no new routes or architecture were introduced. Future scalability work could add a batch progress endpoint and a GET-own-rating endpoint to reduce repeated reads for large catalogs. Payment processing, persistent hosting and external video availability retain the backend/platform limitations described above.
