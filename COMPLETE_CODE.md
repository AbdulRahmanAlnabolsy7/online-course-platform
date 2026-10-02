# Complete project source

Generated from the actual project files. Local secrets and installed dependencies are excluded. The dependency lockfile is delivered separately.

```text
.dockerignore
.env.example
.gitignore
.vscode/launch.json
.vscode/tasks.json
Dockerfile
FINAL_AUDIT.md
LICENSE
README.md
docker-compose.yml
frontend/.env.example
frontend/INTEGRATION.md
frontend/e2e/platform.spec.js
frontend/e2e/responsive.spec.js
frontend/index.html
frontend/package.json
frontend/playwright.config.js
frontend/scripts/cleanup-e2e.mjs
frontend/src/App.jsx
frontend/src/api/authApi.js
frontend/src/api/axios.js
frontend/src/api/commentsApi.js
frontend/src/api/coursesApi.js
frontend/src/api/enrollmentApi.js
frontend/src/api/instructorApi.js
frontend/src/api/lessonsApi.js
frontend/src/api/progressApi.js
frontend/src/api/ratingsApi.js
frontend/src/components/Comments.jsx
frontend/src/components/CourseCard.jsx
frontend/src/components/Forms.jsx
frontend/src/components/Ratings.jsx
frontend/src/components/UI.jsx
frontend/src/components/VideoPlayer.jsx
frontend/src/context/AuthContext.jsx
frontend/src/hooks/useAsync.js
frontend/src/layouts/MainLayout.jsx
frontend/src/main.jsx
frontend/src/pages/Auth.jsx
frontend/src/pages/CourseDetails.jsx
frontend/src/pages/CourseForm.jsx
frontend/src/pages/Courses.jsx
frontend/src/pages/Home.jsx
frontend/src/pages/InstructorCourses.jsx
frontend/src/pages/InstructorDashboard.jsx
frontend/src/pages/Learning.jsx
frontend/src/pages/LessonManagement.jsx
frontend/src/pages/StudentCourses.jsx
frontend/src/routes/ProtectedRoute.jsx
frontend/src/styles.css
frontend/src/utils/format.js
frontend/src/utils/getApiError.js
frontend/vite.config.js
package.json
postman/online-course-platform.json
scripts/dev-demo.js
scripts/export-code.js
scripts/generate-postman.js
scripts/seed.js
src/app.js
src/config/db.js
src/config/env.js
src/controllers/auth.controller.js
src/controllers/comment.controller.js
src/controllers/course.controller.js
src/controllers/enrollment.controller.js
src/controllers/lesson.controller.js
src/controllers/progress.controller.js
src/controllers/rating.controller.js
src/docs/swagger.js
src/middleware/auth.middleware.js
src/middleware/error.middleware.js
src/middleware/rateLimit.middleware.js
src/middleware/validation.middleware.js
src/models/Comment.js
src/models/Course.js
src/models/Enrollment.js
src/models/Lesson.js
src/models/LessonProgress.js
src/models/Rating.js
src/models/User.js
src/routes/index.js
src/server.js
src/services/access.js
src/services/courseLock.js
src/services/ratings.js
src/utils/ApiError.js
src/utils/response.js
src/validators/index.js
tests/api.test.js
```

FILE: .dockerignore

```text
node_modules
.git
.env
coverage
tests

```

FILE: .env.example

```text
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/online_course_platform
JWT_SECRET=replace-with-a-random-secret-of-at-least-32-characters
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000,http://localhost:5173,http://127.0.0.1:5173

```

FILE: .gitignore

```text
node_modules/
.env
.env.*
!.env.example
coverage/
dist/
test-results/
playwright-report/
*.log
.DS_Store

```

FILE: .vscode/launch.json

```json
{
  "version": "0.2.0",
  "configurations": [
    { "type": "node", "request": "launch", "name": "Debug API", "program": "${workspaceFolder}/src/server.js", "envFile": "${workspaceFolder}/.env", "skipFiles": ["<node_internals>/**"] },
    { "type": "node", "request": "launch", "name": "Debug Jest", "program": "${workspaceFolder}/node_modules/jest/bin/jest.js", "args": ["--runInBand"], "console": "integratedTerminal", "skipFiles": ["<node_internals>/**"] }
  ]
}

```

FILE: .vscode/tasks.json

```json
{
 "version":"2.0.0",
 "tasks":[
  {"label":"Run backend demo","type":"npm","script":"dev:demo","isBackground":true,"problemMatcher":[],"presentation":{"reveal":"always","panel":"dedicated"}},
  {"label":"Run frontend","type":"npm","script":"dev","path":"frontend","isBackground":true,"problemMatcher":[],"presentation":{"reveal":"always","panel":"dedicated"}},
  {"label":"Run full platform","dependsOn":["Run backend demo","Run frontend"],"dependsOrder":"parallel","problemMatcher":[]},
  {"label":"Build frontend","type":"npm","script":"build","path":"frontend","group":{"kind":"build","isDefault":true},"problemMatcher":[]}
 ]
}

```

FILE: Dockerfile

```text
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY src ./src
USER node
EXPOSE 5000
CMD ["node", "src/server.js"]

```

FILE: FINAL_AUDIT.md

````markdown
# Final project audit

## Implemented phases

1. Architecture, relationships and authorization: documented in README; actual tree and every source file are exported to COMPLETE_CODE.md.
2. Bootstrap: package scripts, environment validation, database startup, common responses, errors, validation, authentication and rate limiting.
3. Models: all seven required entities with references, timestamps, safe User JSON serialization and compound unique indexes.
4. Authentication: register, login, current user, HS256 JWT issuer/audience, bcrypt and role authorization.
5. Courses and lessons: ownership enforcement, draft visibility, ordered lessons and preview/protected content.
6. Enrollment: student-only create/delete, duplicate rejection, current user's enrollment list and status.
7. Comments, ratings and progress: enrollment restrictions, comment ownership, rating bounds/uniqueness, aggregate refresh, reversible completion.
8. Catalog: search, filters, bounded pagination and deterministic sorting.
9. Security and analytics: Helmet/CORS/rate limits/input allowlists; instructor aggregation statistics.
10. OpenAPI: all API routes documented with path/query parameters and Joi-derived request bodies; Swagger UI and JSON endpoints.
11. Tests: Jest/Supertest against a real isolated MongoDB, including the full instructor/student flow and permission failures.
12. Docker: non-root API container, dependency lockfile, MongoDB health dependency and persistent volume.
13. Postman: complete collection with required folders, example bodies, status assertions and token/resource ID scripts.
14. README: setup, architecture, API usage, data design, authentication, security, Docker, tests, VS Code and suggested commits.
15. Audit: imports, routes, middleware order, model indexes, environment variables and cleanup verified during integration tests.

## Verification performed

- `npm test`: 1 suite, 13 tests passed, including concurrent rating updates.
- `npm audit --omit=dev --audit-level=high`: zero vulnerabilities reported at verification time.
- Installation audit also reported zero vulnerabilities.
- Health, Swagger UI and OpenAPI JSON verified by integration tests.
- Unique indexes initialized before test traffic and application startup.
- Invalid JSON, invalid JWT, invalid IDs, unknown fields, ownership and enrollment failures return consistent errors.
- Passwords excluded from registration, login and profile output.

The first test attempt timed out during initial MongoDB download. The initial-download hook now allows 20 minutes; subsequent runs reuse the installed binary and complete in seconds.

## Practical limits

Docker is provided but has not been launched on this machine because Docker is not installed/available on PATH. The tests verify a real MongoDB-backed API; they do not claim to verify container startup.

MongoDB transactions are not required for standalone development. Cascading cleanup spans multiple operations; process failure can leave related records requiring reconciliation. Rating mutations are serialized per course inside a single Node process. Multiple API instances require coordinated updates/transactions and a shared rate-limit store. Paid enrollment, refresh/revocation, password reset and email verification are not part of this assignment.

`npm run dev:demo` uses a temporary MongoDB; normal `npm run dev` uses the configured persistent MongoDB. `.env` contains a generated local secret and is ignored by Git. No remote repository has been created or published.

## Frontend integration audit

React/Vite JavaScript frontend added separately in `frontend/`, using React Router, Axios, Context, Tailwind CSS, reusable forms and async-state components. Public catalog, course details, auth, student dashboard/enrollments/learning, instructor dashboard/course/lesson management, comments, ratings and persisted lesson completion are connected to existing endpoints.

Compatibility changes: added completedLessonIds to the existing progress response; added Vite origins to example/local CORS configuration; scoped Jest backend tests so frontend Playwright files do not collide. Backend routes and architecture were preserved. The frontend API service layer was derived from the actual route/controller/validator implementation.

Production build succeeded. Backend tests passed again with the completion-ID assertion (13/13). Both Chrome tests passed (2/2): the full-flow test covers instructor course/lesson CRUD, student enrollment/learning, comment and rating CRUD, progress restoration, role guards and home layouts at 1440/768/390px; a second test checks course details, catalog filters, dashboards, learning, course forms and lesson management at tablet/mobile widths. No horizontal overflow was detected. Source formatting completed using Prettier. Real local API/database requests were used, with no mocked course data. Test course records are cleaned up; test users remain because the existing API has no account-delete endpoint.

The frontend still uses the assignment's immediate enrollment behavior for priced courses; it does not invent checkout. LocalStorage JWT persistence is suitable for this assignment, with future production hardening documented in README. External video/thumbnail hosting depends on provider availability. Multiple progress requests and paginated own-review discovery are required by the current read endpoints. Docker was not rerun, and GitHub publication remains outside this frontend task.

````

FILE: LICENSE

```text
MIT License

Copyright (c) 2026 Online Course Platform contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```

FILE: README.md

````markdown
# Online Course Platform API

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

````

FILE: docker-compose.yml

```yaml
services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      PORT: 5000
      MONGO_URI: mongodb://mongo:27017/online_course_platform
      JWT_SECRET: ${JWT_SECRET:?Set JWT_SECRET in .env}
      JWT_EXPIRES_IN: ${JWT_EXPIRES_IN:-7d}
      CORS_ORIGIN: ${CORS_ORIGIN:-http://localhost:3000}
    depends_on:
      mongo:
        condition: service_healthy
    restart: unless-stopped
  mongo:
    image: mongo:8.0
    volumes:
      - mongo-data:/data/db
    healthcheck:
      test: ["CMD", "mongosh", "--quiet", "--eval", "db.adminCommand('ping').ok"]
      interval: 10s
      timeout: 5s
      retries: 10
    restart: unless-stopped
volumes:
  mongo-data:

```

FILE: frontend/.env.example

```text
VITE_API_URL=http://localhost:5000/api/v1

```

FILE: frontend/INTEGRATION.md

````markdown
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

````

FILE: frontend/e2e/platform.spec.js

```js
import { test, expect } from "@playwright/test";
const stamp = Date.now();
const instructorEmail = `teacher-${stamp}@example.com`;
const studentEmail = `learner-${stamp}@example.com`;
const password = "PlatformTest123!";
const courseTitle = `Creative Backend ${stamp}`;
async function register(page, email, role) {
  await page.goto("/register");
  await page
    .getByLabel("Full name")
    .fill(role === "instructor" ? "Alex Instructor" : "Sam Learner");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("I want to").selectOption(role);
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  await expect(page).toHaveURL(new RegExp(`/${role}/dashboard$`));
}
async function login(page, email) {
  await page.goto("/login");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}
test("real instructor and student flows, persistence, ownership and responsive layouts", async ({
  page,
}) => {
  const consoleErrors = [];
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  await page.goto("/instructor/courses");
  await expect(page).toHaveURL(/\/login$/);
  await register(page, instructorEmail, "instructor");
  await page.getByRole("button", { name: "Log out" }).click();
  await login(page, instructorEmail);
  await page
    .getByRole("link", { name: "Create a course", exact: true })
    .click();
  await page.getByLabel("Course title").fill(courseTitle);
  await page
    .getByLabel("Description", { exact: true })
    .fill("Build useful skills through focused lessons and guided practice.");
  await page.getByLabel("Category", { exact: true }).fill("programming");
  await page.getByLabel("Publish this course").check();
  await page
    .getByRole("button", { name: "Create course", exact: true })
    .click();
  await expect(page).toHaveURL(/\/instructor\/courses\/[^/]+\/lessons$/);
  const courseId = page.url().split("/").at(-2);
  await page.getByRole("button", { name: "Add lesson", exact: true }).click();
  await page.getByLabel("Lesson title").fill("Your first chapter");
  await page
    .getByLabel("Lesson content")
    .fill("This protected content is for enrolled learners.");
  await page.getByLabel("Duration (minutes)").fill("12");
  await page
    .locator("form")
    .getByRole("button", { name: "Add lesson", exact: true })
    .click();
  await expect(
    page.getByText("Your first chapter", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Edit Your first chapter", exact: true })
    .click();
  await page.getByLabel("Lesson title").fill("Your first chapter, refined");
  await page.getByRole("button", { name: "Save lesson", exact: true }).click();
  await expect(
    page.getByText("Your first chapter, refined", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Add lesson", exact: true }).click();
  await page.getByLabel("Lesson title").fill("A temporary chapter");
  await page
    .getByLabel("Lesson content")
    .fill("Remove this chapter during testing.");
  await page
    .locator("form")
    .getByRole("button", { name: "Add lesson", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Delete A temporary chapter", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Confirm delete", exact: true })
    .click();
  await expect(
    page.getByText("A temporary chapter", { exact: true }),
  ).toHaveCount(0);
  await page.goto(`/instructor/courses/${courseId}/edit`);
  await page.getByLabel("Course title").fill(`${courseTitle} Updated`);
  await page.getByRole("button", { name: "Save course", exact: true }).click();
  await expect(page).toHaveURL(/\/instructor\/courses$/);
  await expect(
    page.getByText(`${courseTitle} Updated`, { exact: true }),
  ).toBeVisible();
  await page.goto("/instructor/dashboard");
  await expect(page.getByText("Your courses at a glance")).toBeVisible();
  await page.goto("/student/dashboard");
  await expect(
    page.getByText("This space is for a different role"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Log out" }).click();
  await page.goto(`/courses/${courseId}`);
  await expect(
    page.getByText("This protected content is for enrolled learners.", {
      exact: true,
    }),
  ).toHaveCount(0);
  await register(page, studentEmail, "student");
  await page.getByRole("button", { name: "Log out" }).click();
  await login(page, studentEmail);
  await page.goto("/instructor/courses");
  await expect(
    page.getByText("This space is for a different role"),
  ).toBeVisible();
  await page.goto("/courses");
  await page.getByLabel("Search courses").fill("Creative Backend");
  await page
    .getByLabel("Category", { exact: true })
    .selectOption("programming");
  await page.getByLabel("Level", { exact: true }).selectOption("beginner");
  await page.getByLabel("Sort by").selectOption("rating");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(
    page.getByRole("link", { name: `${courseTitle} Updated`, exact: true }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: `${courseTitle} Updated`, exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Enroll in course" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Edit this course" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Enroll in course" }).click();
  await expect(page.getByText("You're enrolled")).toBeVisible();
  await page.goto("/student/courses");
  await page.getByRole("link", { name: "Continue learning" }).click();
  await expect(
    page.getByRole("heading", { name: "Your first chapter, refined" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Mark lesson complete", exact: true })
    .click();
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "100",
  );
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Mark incomplete", exact: true }),
  ).toBeVisible();
  await page
    .getByLabel("Your comment", { exact: true })
    .fill("This lesson helped me understand the concept.");
  await page.getByRole("button", { name: "Post comment" }).click();
  await expect(
    page.getByText("This lesson helped me understand the concept.", {
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Edit comment", exact: true }).click();
  await page
    .getByLabel("Edit your comment")
    .fill("My updated thoughts on the lesson.");
  await page.getByRole("button", { name: "Save comment" }).click();
  await expect(
    page.getByText("My updated thoughts on the lesson.", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Delete comment", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Confirm delete", exact: true })
    .click();
  await expect(
    page.getByText("My updated thoughts on the lesson.", { exact: true }),
  ).toHaveCount(0);
  await page.goto(`/courses/${courseId}`);
  await page.getByRole("radio", { name: "4 stars", exact: true }).click();
  await page
    .getByLabel("Your review (optional)")
    .fill("A thoughtful course with clear lessons.");
  await page.getByRole("button", { name: "Submit rating" }).click();
  await expect(
    page.getByRole("button", { name: "Update rating" }),
  ).toBeVisible();
  await page.getByRole("radio", { name: "5 stars", exact: true }).click();
  await page.getByRole("button", { name: "Update rating" }).click();
  await expect(
    page.getByRole("radio", { name: "5 stars", exact: true }),
  ).toHaveAttribute("aria-checked", "true");
  await page.getByRole("button", { name: "Delete rating" }).click();
  await page
    .getByRole("button", { name: "Confirm delete", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Submit rating" }),
  ).toBeVisible();
  await page.goto("/student/dashboard");
  await expect(
    page.getByText("Completed courses", { exact: true }),
  ).toBeVisible();
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /Your next chapter/ }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/home-${width}.png`,
      fullPage: true,
    });
  }
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await page.getByRole("link", { name: "Dashboard", exact: true }).click();
  await expect(page).toHaveURL(/\/student\/dashboard$/);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole("button", { name: "Log out" }).click();
  await login(page, instructorEmail);
  await page.goto("/instructor/courses");
  await page
    .getByRole("button", { name: `Delete ${courseTitle} Updated`, exact: true })
    .click();
  await page
    .getByRole("button", { name: "Confirm delete", exact: true })
    .click();
  await expect(
    page.getByText(`${courseTitle} Updated`, { exact: true }),
  ).toHaveCount(0);
  expect(consoleErrors).toEqual([]);
});

```

FILE: frontend/e2e/responsive.spec.js

```js
import { test, expect } from "@playwright/test";
const base = process.env.VITE_API_URL || "http://localhost:5000/api/v1";
test("student learning and instructor forms fit tablet and mobile", async ({
  page,
  request,
}) => {
  const stamp = Date.now();
  async function account(role) {
    const result = await request.post(`${base}/auth/register`, {
      data: {
        name: `Responsive ${role}`,
        email: `responsive-${role}-${stamp}@example.com`,
        password: "ResponsiveTest123!",
        role,
      },
    });
    expect(result.status()).toBe(201);
    return (await result.json()).data;
  }
  const instructor = await account("instructor");
  const student = await account("student");
  const headers = { Authorization: `Bearer ${instructor.token}` };
  const created = await request.post(`${base}/courses`, {
    headers,
    data: {
      title: `Responsive Course ${stamp}`,
      description: "A real course for testing responsive learning layouts.",
      category: "design",
      isPublished: true,
    },
  });
  expect(created.status()).toBe(201);
  const courseId = (await created.json()).data._id;
  try {
    const lesson = await request.post(`${base}/courses/${courseId}/lessons`, {
      headers,
      data: {
        title: "A responsive learning chapter",
        content: "This lesson is loaded from the actual API.",
        duration: 10,
        order: 1,
      },
    });
    expect(lesson.status()).toBe(201);
    expect(
      (
        await request.post(`${base}/courses/${courseId}/enroll`, {
          headers: { Authorization: `Bearer ${student.token}` },
        })
      ).status(),
    ).toBe(201);
    await page.goto("/");
    async function session(token) {
      await page.evaluate(
        (value) => localStorage.setItem("luma.auth.token", value),
        token,
      );
    }
    await session(student.token);
    for (const width of [768, 390]) {
      await page.setViewportSize({ width, height: 900 });
      for (const [path, heading] of [
        [`/courses/${courseId}`, `Responsive Course ${stamp}`],
        ["/student/courses", "My learning"],
        ["/student/dashboard", /A new day to grow/],
        [`/learn/${courseId}`, "A responsive learning chapter"],
      ]) {
        await page.goto(path);
        await expect(
          page.getByRole("heading", {
            name: heading,
            exact: typeof heading === "string",
          }),
        ).toBeVisible();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        ).toBe(true);
      }
      await page.screenshot({
        path: `test-results/learning-${width}.png`,
        fullPage: true,
      });
      await page.goto("/courses");
      await expect(
        page.getByRole("heading", { name: "Find your next possibility." }),
      ).toBeVisible();
      await expect(page.getByLabel("Search courses")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
    }
    await session(instructor.token);
    for (const width of [768, 390]) {
      await page.setViewportSize({ width, height: 900 });
      for (const [path, heading] of [
        ["/instructor/dashboard", /Ideas grow when you share/],
        ["/instructor/courses", "Make your knowledge go further."],
        ["/instructor/courses/new", "What will you teach the world?"],
        [`/instructor/courses/${courseId}/edit`, "Refine your next chapter."],
      ]) {
        await page.goto(path);
        await expect(
          page.getByRole("heading", { name: heading }),
        ).toBeVisible();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        ).toBe(true);
      }
      await page.goto(`/instructor/courses/${courseId}/lessons`);
      await page
        .getByRole("button", { name: "Add lesson", exact: true })
        .click();
      await expect(page.getByLabel("Lesson title")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: `test-results/lesson-manager-${width}.png`,
        fullPage: true,
      });
    }
  } finally {
    await request.delete(`${base}/courses/${courseId}`, { headers });
  }
});

```

FILE: frontend/index.html

```html
<!doctype html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><meta name="theme-color" content="#214d3b"/><meta name="description" content="Thoughtful courses, inspiring instructors, and a place to grow."/><title>Luma · A little learning, a lot of possibility</title></head><body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body></html>

```

FILE: frontend/package.json

```json
{
  "name": "luma-course-platform",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "vite build",
    "preview": "vite preview --host 127.0.0.1",
    "test:e2e": "playwright test",
    "format": "prettier --write src e2e *.js"
  },
  "dependencies": {
    "axios": "^1.12.0",
    "lucide-react": "^0.468.0",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-hot-toast": "^2.6.0",
    "react-router-dom": "^7.9.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.55.1",
    "@tailwindcss/vite": "^4.1.13",
    "@vitejs/plugin-react": "^4.7.0",
    "prettier": "^3.9.9",
    "tailwindcss": "^4.1.13",
    "vite": "^6.4.0"
  }
}

```

FILE: frontend/playwright.config.js

```js
import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  timeout: 90000,
  expect: { timeout: 15000 },
  workers: 1,
  retries: 0,
  use: {
    baseURL: "http://127.0.0.1:5173",
    channel: "chrome",
    headless: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  reporter: [["list"], ["html", { open: "never" }]],
});

```

FILE: frontend/scripts/cleanup-e2e.mjs

```text
// Removes only the course created by one known local e2e run; the API enforces ownership.
import axios from 'axios';
const stamp=process.argv[2];
if(!/^\d{13}$/.test(stamp||''))throw new Error('Provide the timestamp from the test course title.');
const api=axios.create({baseURL:process.env.VITE_API_URL||'http://localhost:5000/api/v1'});
async function cleanup(){
const login=await api.post('/auth/login',{email:`teacher-${stamp}@example.com`,password:'PlatformTest123!'});
api.defaults.headers.common.Authorization=`Bearer ${login.data.data.token}`;
let page=1,removed=0;
while(true){const result=(await api.get('/instructor/courses',{params:{page,limit:100}})).data;
 for(const course of result.data){if([`Creative Backend ${stamp}`,`Creative Backend ${stamp} Updated`].includes(course.title)){await api.delete(`/courses/${course._id}`);removed++;}}
 if(page>=result.pagination.totalPages)break;page++;
}
console.log(`Removed ${removed} course(s) from the specified local test run.`);
}
cleanup().catch(error=>{console.error(error.response?.data?.message||'Local test cleanup failed.');process.exitCode=1;});

```

FILE: frontend/src/App.jsx

```jsx
import { Route, Routes, Link } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { ProtectedRoute, RoleRoute } from "./routes/ProtectedRoute";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Auth from "./pages/Auth";
import StudentCourses from "./pages/StudentCourses";
import Learning from "./pages/Learning";
import InstructorDashboard from "./pages/InstructorDashboard";
import InstructorCourses from "./pages/InstructorCourses";
import CourseForm from "./pages/CourseForm";
import LessonManagement from "./pages/LessonManagement";
import { EmptyState } from "./components/UI";
export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:courseId" element={<CourseDetails />} />
        <Route path="login" element={<Auth mode="login" />} />
        <Route path="register" element={<Auth mode="register" />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute role="student" />}>
            <Route
              path="student/dashboard"
              element={<StudentCourses dashboard />}
            />
            <Route path="student/courses" element={<StudentCourses />} />
            <Route path="learn/:courseId" element={<Learning />} />
          </Route>
          <Route element={<RoleRoute role="instructor" />}>
            <Route
              path="instructor/dashboard"
              element={<InstructorDashboard />}
            />
            <Route path="instructor/courses" element={<InstructorCourses />} />
            <Route path="instructor/courses/new" element={<CourseForm />} />
            <Route
              path="instructor/courses/:courseId/edit"
              element={<CourseForm />}
            />
            <Route
              path="instructor/courses/:courseId/lessons"
              element={<LessonManagement />}
            />
          </Route>
        </Route>
        <Route
          path="*"
          element={
            <EmptyState
              title="This chapter doesn't exist"
              description="Let's get you back to familiar ground."
            >
              <Link to="/" className="btn primary">
                Back to home
              </Link>
            </EmptyState>
          }
        />
      </Route>
    </Routes>
  );
}

```

FILE: frontend/src/api/authApi.js

```js
import api, { payload } from "./axios";
export const authApi = {
  login: (body) => payload(api.post("/auth/login", body, { skipAuth: true })),
  register: (body) =>
    payload(api.post("/auth/register", body, { skipAuth: true })),
  me: () => payload(api.get("/auth/me")),
};

```

FILE: frontend/src/api/axios.js

```js
import axios from "axios";
export const TOKEN_KEY = "luma.auth.token";
export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}
export function saveToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && !config.skipAuth)
    config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config?.skipAuth &&
      getToken()
    ) {
      saveToken(null);
      window.dispatchEvent(new Event("luma:session-expired"));
    }
    return Promise.reject(error);
  },
);
export const payload = async (promise) => (await promise).data.data;
export const collection = async (promise) => (await promise).data;
export default api;

```

FILE: frontend/src/api/commentsApi.js

```js
import api, { payload, collection } from "./axios";
export const commentsApi = {
  list: (l, params) =>
    collection(api.get(`/lessons/${l}/comments`, { params })),
  create: (l, text) => payload(api.post(`/lessons/${l}/comments`, { text })),
  update: (id, text) => payload(api.patch(`/comments/${id}`, { text })),
  remove: (id) => api.delete(`/comments/${id}`),
};

```

FILE: frontend/src/api/coursesApi.js

```js
import api, { payload, collection } from "./axios";
export const coursesApi = {
  list: (params) => collection(api.get("/courses", { params })),
  get: (id) => payload(api.get(`/courses/${id}`)),
  create: (body) => payload(api.post("/courses", body)),
  update: (id, body) => payload(api.patch(`/courses/${id}`, body)),
  remove: (id) => api.delete(`/courses/${id}`),
  categories: () => payload(api.get("/categories")),
};

```

FILE: frontend/src/api/enrollmentApi.js

```js
import api, { payload, collection } from "./axios";
export const enrollmentApi = {
  mine: (params) => collection(api.get("/enrollments/me", { params })),
  status: (c) => payload(api.get(`/courses/${c}/enrollment-status`)),
  enroll: (c) => payload(api.post(`/courses/${c}/enroll`)),
  unenroll: (c) => api.delete(`/courses/${c}/enroll`),
};

```

FILE: frontend/src/api/instructorApi.js

```js
import api, { payload, collection } from "./axios";
export const instructorApi = {
  courses: (params) => collection(api.get("/instructor/courses", { params })),
  stats: () => payload(api.get("/instructor/stats")),
};

```

FILE: frontend/src/api/lessonsApi.js

```js
import api, { payload } from "./axios";
export const lessonsApi = {
  list: (c) => payload(api.get(`/courses/${c}/lessons`)),
  get: (c, l) => payload(api.get(`/courses/${c}/lessons/${l}`)),
  create: (c, b) => payload(api.post(`/courses/${c}/lessons`, b)),
  update: (c, l, b) => payload(api.patch(`/courses/${c}/lessons/${l}`, b)),
  remove: (c, l) => api.delete(`/courses/${c}/lessons/${l}`),
};

```

FILE: frontend/src/api/progressApi.js

```js
import api, { payload } from "./axios";
export const progressApi = {
  get: (c) => payload(api.get(`/courses/${c}/progress`)),
  update: (l, completed) =>
    payload(api.patch(`/lessons/${l}/progress`, { completed })),
};

```

FILE: frontend/src/api/ratingsApi.js

```js
import api, { payload, collection } from "./axios";
export const ratingsApi = {
  list: (c, params) => collection(api.get(`/courses/${c}/ratings`, { params })),
  create: (c, b) => payload(api.post(`/courses/${c}/ratings`, b)),
  update: (c, b) => payload(api.patch(`/courses/${c}/ratings/me`, b)),
  remove: (c) => api.delete(`/courses/${c}/ratings/me`),
};

```

FILE: frontend/src/components/Comments.jsx

```jsx
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { commentsApi } from "../api/commentsApi";
import { useAuth } from "../context/AuthContext";
import useAsync from "../hooks/useAsync";
import {
  ConfirmDialog,
  EmptyState,
  ErrorMessage,
  LoadingSpinner,
  Pagination,
} from "./UI";
import { TextArea, SubmitButton } from "./Forms";
import { date, idOf, initials } from "../utils/format";
export default function Comments({ lessonId }) {
  const { user } = useAuth();
  const [page, setPage] = useState(1),
    [editing, setEditing] = useState(null),
    [deleting, setDeleting] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(null);
  const comments = useAsync(
    () => commentsApi.list(lessonId, { page, limit: 5 }),
    [lessonId, page],
  );
  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const text = new FormData(form).get("text").trim();
    if (!text) return;
    setBusy(true);
    setError(null);
    try {
      if (editing) await commentsApi.update(editing._id, text);
      else await commentsApi.create(lessonId, text);
      setEditing(null);
      form.reset();
      toast.success(editing ? "Comment updated" : "Comment added");
      await comments.reload();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    setBusy(true);
    setError(null);
    try {
      await commentsApi.remove(deleting._id);
      setDeleting(null);
      toast.success("Comment deleted");
      if (comments.data.data.length === 1 && page > 1) setPage(page - 1);
      else await comments.reload();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="discussion panel">
      <h2>Keep the conversation going.</h2>
      <p className="muted mb-6">
        Ask a question or share a thought about this lesson.
      </p>
      {error && <ErrorMessage error={error} />}
      {user.role === "student" && (
        <form onSubmit={submit} key={editing?._id || "new"}>
          <TextArea
            label={editing ? "Edit your comment" : "Your comment"}
            name="text"
            defaultValue={editing?.text || ""}
            required
            maxLength={2000}
          />
          <div className="flex gap-3">
            <SubmitButton busy={busy}>
              {editing ? "Save comment" : "Post comment"}
            </SubmitButton>
            {editing && (
              <button
                className="btn secondary"
                type="button"
                disabled={busy}
                onClick={() => setEditing(null)}
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>
      )}
      {comments.loading ? (
        <LoadingSpinner />
      ) : comments.error ? (
        <ErrorMessage error={comments.error} retry={comments.reload} />
      ) : comments.data.data.length ? (
        <div className="comment-list">
          {comments.data.data.map((comment) => (
            <article key={comment._id} className="comment">
              <span className="avatar">{initials(comment.user?.name)}</span>
              <div className="min-w-0 grow">
                <div className="flex justify-between gap-3 flex-wrap">
                  <div>
                    <strong>{comment.user?.name || "Learner"}</strong>
                    <small>{date(comment.createdAt)}</small>
                  </div>
                  {idOf(comment.user) === user._id && (
                    <div className="flex gap-3">
                      <button
                        className="icon-button"
                        aria-label="Edit comment"
                        disabled={busy}
                        onClick={() => {
                          setEditing(comment);
                          setError(null);
                        }}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="icon-button"
                        aria-label="Delete comment"
                        disabled={busy}
                        onClick={() => setDeleting(comment)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
                <p className="whitespace-pre-wrap break-words mt-3">
                  {comment.text}
                </p>
              </div>
            </article>
          ))}
          <Pagination
            pagination={comments.data.pagination}
            onChange={setPage}
          />
        </div>
      ) : (
        <EmptyState
          title="No comments yet"
          description="Be the first to start a conversation."
        />
      )}
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this comment?"
        description="Your comment will be permanently removed."
        busy={busy}
        onCancel={() => setDeleting(null)}
        onConfirm={remove}
      />
    </section>
  );
}

```

FILE: frontend/src/components/CourseCard.jsx

```jsx
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

```

FILE: frontend/src/components/Forms.jsx

```jsx
import { useId } from "react";
export function FormInput({ label, help, error, ...props }) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} {...props} aria-invalid={Boolean(error)} />
      {help && <small>{help}</small>}
      {error && <small className="text-red-700">{error}</small>}
    </div>
  );
}
export function TextArea({ label, help, ...props }) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <textarea id={id} rows={5} {...props} />
      {help && <small>{help}</small>}
    </div>
  );
}
export function Select({ label, children, ...props }) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} {...props}>
        {children}
      </select>
    </div>
  );
}
export function Checkbox({ label, ...props }) {
  return (
    <label className="checkbox">
      <input type="checkbox" {...props} />
      <span>{label}</span>
    </label>
  );
}
export function SubmitButton({ busy, children, ...props }) {
  return (
    <button type="submit" className="btn primary" disabled={busy} {...props}>
      {busy ? "Please wait…" : children}
    </button>
  );
}

```

FILE: frontend/src/components/Ratings.jsx

```jsx
import { useState } from "react";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import { ratingsApi } from "../api/ratingsApi";
import { useAuth } from "../context/AuthContext";
import useAsync from "../hooks/useAsync";
import {
  ConfirmDialog,
  EmptyState,
  ErrorMessage,
  LoadingSpinner,
  Pagination,
} from "./UI";
import { TextArea, SubmitButton } from "./Forms";
import { date, idOf, initials } from "../utils/format";
export function Stars({ value, onChange }) {
  return (
    <div
      className="stars"
      role={onChange ? "radiogroup" : undefined}
      aria-label={onChange ? "Course rating" : `${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) =>
        onChange ? (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={n === value}
            aria-label={`${n} ${n === 1 ? "star" : "stars"}`}
            onClick={() => onChange(n)}
          >
            <Star size={28} fill={n <= value ? "currentColor" : "none"} />
          </button>
        ) : (
          <Star key={n} size={16} fill={n <= value ? "currentColor" : "none"} />
        ),
      )}
    </div>
  );
}
async function ownRating(courseId, userId) {
  let page = 1;
  while (true) {
    const result = await ratingsApi.list(courseId, { page, limit: 100 });
    const own = result.data.find((r) => idOf(r.student) === userId);
    if (own) return own;
    if (page >= result.pagination.totalPages) return null;
    page++;
  }
}
function RatingForm({ courseId, own, onSaved }) {
  const [value, setValue] = useState(own?.value || 5),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(null),
    [deleting, setDeleting] = useState(false);
  async function submit(event) {
    event.preventDefault();
    const review = new FormData(event.currentTarget).get("review").trim();
    setBusy(true);
    setError(null);
    try {
      await ratingsApi[own ? "update" : "create"](courseId, { value, review });
      toast.success(own ? "Rating updated" : "Thanks for sharing your rating");
      await onSaved();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    setBusy(true);
    setError(null);
    try {
      await ratingsApi.remove(courseId);
      setDeleting(false);
      toast.success("Rating deleted");
      await onSaved();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="rating-form">
      {error && <ErrorMessage error={error} />}
      <form onSubmit={submit}>
        <h3 className="mb-3">
          {own ? "Your course review" : "How is your learning experience?"}
        </h3>
        <fieldset disabled={busy}>
          <Stars value={value} onChange={setValue} />
          <TextArea
            label="Your review (optional)"
            name="review"
            defaultValue={own?.review || ""}
            maxLength={2000}
          />
          <div className="flex flex-wrap gap-3">
            <SubmitButton busy={busy}>
              {own ? "Update rating" : "Submit rating"}
            </SubmitButton>
            {own && (
              <button
                type="button"
                className="btn secondary"
                disabled={busy}
                onClick={() => setDeleting(true)}
              >
                Delete rating
              </button>
            )}
          </div>
        </fieldset>
      </form>
      <ConfirmDialog
        open={deleting}
        title="Delete your rating?"
        description="Your review and rating will be removed."
        busy={busy}
        onCancel={() => setDeleting(false)}
        onConfirm={remove}
      />
    </div>
  );
}
export default function Ratings({ courseId, enrolled, onChanged }) {
  const { user } = useAuth();
  const [page, setPage] = useState(1),
    [revision, setRevision] = useState(0);
  const list = useAsync(
    () => ratingsApi.list(courseId, { page, limit: 5 }),
    [courseId, page, revision],
  );
  const canRate = enrolled && user?.role === "student";
  const own = useAsync(
    () => (canRate ? ownRating(courseId, user._id) : Promise.resolve(null)),
    [courseId, user?._id, canRate, revision],
  );
  async function refresh() {
    setRevision((r) => r + 1);
    await onChanged();
  }
  return (
    <section className="panel reviews">
      <div className="section-heading">
        <div>
          <p className="eyebrow">From the learning community</p>
          <h2>Thoughts & reviews</h2>
        </div>
      </div>
      {canRate &&
        (own.loading ? (
          <LoadingSpinner label="Loading your review…" />
        ) : own.error ? (
          <ErrorMessage error={own.error} retry={own.reload} />
        ) : (
          <RatingForm
            key={`${revision}-${own.data?._id || "new"}`}
            courseId={courseId}
            own={own.data}
            onSaved={refresh}
          />
        ))}
      {list.loading ? (
        <LoadingSpinner />
      ) : list.error ? (
        <ErrorMessage error={list.error} retry={list.reload} />
      ) : list.data.data.length ? (
        <>
          <div className="comment-list">
            {list.data.data.map((r) => (
              <article key={r._id} className="comment">
                <span className="avatar">{initials(r.student?.name)}</span>
                <div className="grow min-w-0">
                  <div className="flex flex-wrap justify-between gap-3">
                    <div>
                      <strong>{r.student?.name || "Learner"}</strong>
                      <small>{date(r.createdAt)}</small>
                    </div>
                    <Stars value={r.value} />
                  </div>
                  {r.review && (
                    <p className="whitespace-pre-wrap break-words mt-3">
                      {r.review}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
          <Pagination pagination={list.data.pagination} onChange={setPage} />
        </>
      ) : (
        <EmptyState
          title="No reviews yet"
          description="Enrolled students can share their experience here."
        />
      )}
    </section>
  );
}

```

FILE: frontend/src/components/UI.jsx

```jsx
import { useEffect, useRef } from "react";
import {
  AlertCircle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  X,
} from "lucide-react";
import getApiError from "../utils/getApiError";
export function LoadingSpinner({ label = "Getting things ready…" }) {
  return (
    <div className="state" role="status">
      <LoaderCircle className="animate-spin" size={28} />
      <p>{label}</p>
    </div>
  );
}
export function ErrorMessage({ error, retry }) {
  return (
    <div className="error-box" role="alert">
      <AlertCircle size={20} />
      <div>
        <strong>We hit a small bump.</strong>
        <p>{getApiError(error)}</p>
        {retry && (
          <button className="text-button" onClick={retry}>
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
export function EmptyState({ title, description, children }) {
  return (
    <div className="state empty">
      <span className="empty-icon">
        <BookOpen size={28} />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  );
}
export function Pagination({ pagination, onChange }) {
  if (!pagination || pagination.totalPages < 2) return null;
  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="btn secondary"
        disabled={pagination.page <= 1}
        onClick={() => onChange(pagination.page - 1)}
      >
        <ChevronLeft size={16} />
        Previous
      </button>
      <span>
        Page {pagination.page} of {pagination.totalPages}
      </span>
      <button
        className="btn secondary"
        disabled={pagination.page >= pagination.totalPages}
        onClick={() => onChange(pagination.page + 1)}
      >
        Next
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
export function ConfirmDialog({
  open,
  title,
  description,
  busy,
  onCancel,
  onConfirm,
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (open && !ref.current.open) ref.current.showModal();
    if (!open && ref.current.open) ref.current.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className="confirm-dialog"
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onCancel();
      }}
    >
      <div className="flex justify-between gap-4">
        <h2>{title}</h2>
        <button aria-label="Close dialog" disabled={busy} onClick={onCancel}>
          <X size={20} />
        </button>
      </div>
      <p>{description}</p>
      <div className="flex justify-end gap-3">
        <button className="btn secondary" disabled={busy} onClick={onCancel}>
          Cancel
        </button>
        <button className="btn danger" disabled={busy} onClick={onConfirm}>
          {busy ? "Working…" : "Confirm delete"}
        </button>
      </div>
    </dialog>
  );
}
export function ProgressBar({ progress }) {
  return (
    <div className="progress-wrap">
      <div className="flex justify-between gap-3 text-sm mb-2">
        <span>
          {progress.completedLessons} / {progress.totalLessons} lessons
          completed
        </span>
        <strong>{progress.progressPercentage}%</strong>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={progress.progressPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Course progress"
      >
        <span style={{ width: `${progress.progressPercentage}%` }} />
      </div>
    </div>
  );
}
export function PageHeading({ eyebrow, title, description, children }) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="muted mt-3 max-w-2xl">{description}</p>}
      </div>
      {children}
    </div>
  );
}
export function StatCard({ label, value, icon: Icon, detail }) {
  return (
    <div className="stat-card">
      <div className="flex justify-between items-center">
        <span>{label}</span>
        {Icon && <Icon size={20} />}
      </div>
      <strong>{value}</strong>
      {detail && <p>{detail}</p>}
    </div>
  );
}

```

FILE: frontend/src/components/VideoPlayer.jsx

```jsx
export default function VideoPlayer({ url }) {
  if (!url) return null;
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (!["http:", "https:"].includes(parsed.protocol)) return null;
  const youtube =
    parsed.hostname === "youtu.be"
      ? parsed.pathname.slice(1)
      : ["youtube.com", "www.youtube.com"].includes(parsed.hostname)
        ? parsed.searchParams.get("v") || parsed.pathname.split("/").pop()
        : null;
  const vimeo = ["vimeo.com", "www.vimeo.com"].includes(parsed.hostname)
    ? parsed.pathname.split("/").pop()
    : null;
  const embed =
    youtube && /^[\w-]{11}$/.test(youtube)
      ? `https://www.youtube-nocookie.com/embed/${youtube}`
      : vimeo && /^\d+$/.test(vimeo)
        ? `https://player.vimeo.com/video/${vimeo}`
        : null;
  return (
    <div className="video-wrap">
      {embed ? (
        <iframe
          src={embed}
          title="Lesson video"
          allow="fullscreen; picture-in-picture"
          allowFullScreen
        />
      ) : /\.(mp4|webm|ogg)$/i.test(parsed.pathname) ? (
        <video src={url} controls preload="metadata" />
      ) : null}
      <a
        className="text-button mt-3"
        href={url}
        target="_blank"
        rel="noreferrer"
      >
        Open lesson video ↗
      </a>
    </div>
  );
}

```

FILE: frontend/src/context/AuthContext.jsx

```jsx
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authApi } from "../api/authApi";
import { getToken, saveToken } from "../api/axios";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(null);
  async function restore() {
    setLoading(true);
    setError(null);
    try {
      setUser(getToken() ? await authApi.me() : null);
    } catch (err) {
      if (err.response?.status === 401) setUser(null);
      else setError(err);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    restore();
    const expire = () => {
      setUser(null);
      toast.error("Your session has expired. Please sign in again.");
    };
    const sync = (e) => {
      if (e.key === "luma.auth.token") restore();
    };
    window.addEventListener("luma:session-expired", expire);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("luma:session-expired", expire);
      window.removeEventListener("storage", sync);
    };
  }, []);
  async function authenticate(mode, body) {
    const result = await authApi[mode](body);
    saveToken(result.token);
    setUser(result.user);
    setError(null);
    return result.user;
  }
  function logout() {
    saveToken(null);
    setUser(null);
    setError(null);
  }
  return (
    <AuthContext.Provider
      value={{ user, loading, error, restore, authenticate, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);

```

FILE: frontend/src/hooks/useAsync.js

```js
import { useCallback, useEffect, useRef, useState } from "react";
export default function useAsync(loader, dependencies = []) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });
  const sequence = useRef(0);
  const reload = useCallback(async () => {
    const version = ++sequence.current;
    setState((old) => ({ ...old, loading: true, error: null }));
    try {
      const data = await loader();
      if (version === sequence.current)
        setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      if (version === sequence.current)
        setState((old) => ({ ...old, loading: false, error }));
      return null;
    }
  }, dependencies);
  useEffect(() => {
    reload();
    return () => {
      sequence.current++;
    };
  }, [reload]);
  return { ...state, reload };
}

```

FILE: frontend/src/layouts/MainLayout.jsx

```jsx
import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { ArrowUpRight, BookOpen, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { initials } from "../utils/format";
import { ErrorMessage, LoadingSpinner } from "../components/UI";
export default function MainLayout() {
  const { user, logout, loading, error, restore } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const links = [
    ["/", "Home"],
    ["/courses", "Explore courses"],
  ];
  if (user)
    links.push(
      [`/${user.role}/dashboard`, "Dashboard"],
      [
        `/${user.role}/courses`,
        user.role === "student" ? "My learning" : "Manage courses",
      ],
    );
  function signOut() {
    logout();
    setOpen(false);
    navigate("/");
  }
  return (
    <>
      <div className="announcement">
        Make room for your next chapter.{" "}
        <Link to="/courses">
          Find your course <ArrowUpRight size={12} />
        </Link>
      </div>
      <header className="site-header">
        <div className="container nav-inner">
          <Link className="brand" to="/" onClick={() => setOpen(false)}>
            <span className="brand-mark">
              <BookOpen size={21} />
            </span>
            luma<span className="brand-dot">.</span>
          </Link>
          <button
            className="mobile-menu"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
          <nav
            className={open ? "main-nav open" : "main-nav"}
            aria-label="Main navigation"
          >
            {links.map(([path, name]) => (
              <NavLink
                end={path === "/"}
                key={path}
                to={path}
                onClick={() => setOpen(false)}
              >
                {name}
              </NavLink>
            ))}
          </nav>
          <div className={`nav-actions ${open ? "open" : ""}`}>
            {user ? (
              <>
                <span className="avatar" title={user.name}>
                  {initials(user.name)}
                </span>
                <button className="btn secondary small" onClick={signOut}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="nav-login"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="btn primary small"
                >
                  Start learning
                  <ArrowUpRight size={15} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="main-content">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="container py-12">
            <ErrorMessage error={error} retry={restore} />
            <button className="btn secondary mt-4" onClick={signOut}>
              Continue signed out
            </button>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <Link to="/" className="brand">
              luma.
            </Link>
            <p>A little learning. A lot of possibility.</p>
          </div>
          <div className="footer-links">
            <Link to="/courses">Explore courses</Link>
            <Link to="/register">Become an instructor</Link>
            <Link to={user ? `/${user.role}/dashboard` : "/login"}>
              Your learning space
              <ArrowUpRight size={14} />
            </Link>
          </div>
          <span className="footer-note">Keep your curiosity close.</span>
        </div>
      </footer>
    </>
  );
}

```

FILE: frontend/src/main.jsx

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./styles.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          style: { fontFamily: "inherit", borderRadius: "12px" },
        }}
      />
    </AuthProvider>
  </BrowserRouter>,
);

```

FILE: frontend/src/pages/Auth.jsx

```jsx
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { FormInput, Select, SubmitButton } from "../components/Forms";
import { ErrorMessage } from "../components/UI";
export default function Auth({ mode }) {
  const { user, authenticate } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(null);
  const register = mode === "register";
  if (user) return <Navigate to={`/${user.role}/dashboard`} replace />;
  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const body = Object.fromEntries(new FormData(form));
    if (register && new TextEncoder().encode(body.password).length > 72) {
      setError(new Error("Password must be at most 72 UTF-8 bytes."));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const account = await authenticate(mode, body);
      form.reset();
      toast.success(
        register ? "Your next chapter starts here. Welcome!" : "Welcome back!",
      );
      const from = location.state?.from;
      const permitted =
        from &&
        (!from.startsWith("/instructor") || account.role === "instructor") &&
        ((!from.startsWith("/student") && !from.startsWith("/learn")) ||
          account.role === "student");
      navigate(permitted ? from : `/${account.role}/dashboard`, {
        replace: true,
      });
    } catch (err) {
      setError(err);
    } finally {
      const password = form.querySelector('[name="password"]');
      if (password) password.value = "";
      setBusy(false);
    }
  }
  return (
    <div className="container auth-layout section">
      <div className="auth-story">
        <p className="eyebrow">A place for your possibilities</p>
        <h1>
          {register ? "Make room for" : "Good to have"}
          <br />
          <em>{register ? "something new." : "you back."}</em>
        </h1>
        <p>
          One small step can open a whole new world.
          <br />
          Let's see where your curiosity takes you.
        </p>
        <div className="auth-illustration" aria-hidden="true">
          <BookOpen size={92} strokeWidth={1} />
          <span>
            Keep turning
            <br />
            the page.
          </span>
          <ArrowUpRight size={44} />
        </div>
      </div>
      <div className="panel auth-form">
        <h2>{register ? "Create your account" : "Welcome back"}</h2>
        <p className="muted mb-7">
          {register
            ? "Start learning, or share what you know."
            : "Sign in and pick up where you left off."}
        </p>
        {error && <ErrorMessage error={error} />}
        <form onSubmit={submit}>
          {register && (
            <FormInput
              label="Full name"
              name="name"
              autoComplete="name"
              required
              maxLength={100}
            />
          )}
          <FormInput
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            autoComplete={register ? "new-password" : "current-password"}
            required
            minLength={register ? 8 : 1}
            maxLength={register ? 72 : 200}
            help={
              register
                ? "At least 8 characters; at most 72 UTF-8 bytes."
                : undefined
            }
          />
          {register && (
            <Select label="I want to" name="role" defaultValue="student">
              <option value="student">Learn — Student</option>
              <option value="instructor">Teach — Instructor</option>
            </Select>
          )}
          <SubmitButton busy={busy} className="btn primary w-full">
            {register ? "Create account" : "Sign in"}
            <ArrowUpRight size={17} />
          </SubmitButton>
        </form>
        <p className="auth-switch">
          {register ? "Already part of Luma?" : "New around here?"}{" "}
          <Link to={register ? "/login" : "/register"}>
            {register ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </div>
    </div>
  );
}

```

FILE: frontend/src/pages/CourseDetails.jsx

```jsx
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

```

FILE: frontend/src/pages/CourseForm.jsx

```jsx
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

```

FILE: frontend/src/pages/Courses.jsx

```jsx
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

```

FILE: frontend/src/pages/Home.jsx

```jsx
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

```

FILE: frontend/src/pages/InstructorCourses.jsx

```jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Pencil, Plus, Trash2, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import { instructorApi } from "../api/instructorApi";
import { coursesApi } from "../api/coursesApi";
import { useAuth } from "../context/AuthContext";
import useAsync from "../hooks/useAsync";
import { CourseArtwork } from "../components/CourseCard";
import {
  ConfirmDialog,
  EmptyState,
  ErrorMessage,
  LoadingSpinner,
  PageHeading,
  Pagination,
} from "../components/UI";
import { price, titleCase } from "../utils/format";
export default function InstructorCourses() {
  const { user } = useAuth();
  const [page, setPage] = useState(1),
    [deleting, setDeleting] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(null);
  const courses = useAsync(
    () => instructorApi.courses({ page, limit: 6 }),
    [page, user._id],
  );
  async function remove() {
    setBusy(true);
    setError(null);
    try {
      await coursesApi.remove(deleting._id);
      setDeleting(null);
      toast.success("Course deleted");
      if (courses.data.data.length === 1 && page > 1) setPage(page - 1);
      else await courses.reload();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="container section">
      <PageHeading
        eyebrow="Your teaching studio"
        title="Make your knowledge go further."
        description="Create, refine, and share your courses with the community."
      >
        <Link className="btn primary" to="/instructor/courses/new">
          <Plus size={17} />
          Create course
        </Link>
      </PageHeading>
      {error && <ErrorMessage error={error} />}
      {courses.loading ? (
        <LoadingSpinner />
      ) : courses.error ? (
        <ErrorMessage error={courses.error} retry={courses.reload} />
      ) : courses.data.data.length ? (
        <>
          <div className="course-grid">
            {courses.data.data.map((c) => (
              <article className="course-card" key={c._id}>
                <CourseArtwork course={c} />
                <div className="course-card-body">
                  <div className="flex justify-between">
                    <span className="tiny-label">{titleCase(c.level)}</span>
                    <span
                      className={c.isPublished ? "badge published" : "badge"}
                    >
                      {c.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                  <h3>
                    <Link to={`/courses/${c._id}`}>{c.title}</Link>
                  </h3>
                  <p className="description-preview">{c.description}</p>
                  <strong>{price(c.price)}</strong>
                  <div className="manage-actions">
                    <Link
                      className="btn primary small"
                      to={`/instructor/courses/${c._id}/lessons`}
                    >
                      <BookOpen size={15} />
                      Lessons
                    </Link>
                    <Link
                      className="btn secondary small"
                      to={`/instructor/courses/${c._id}/edit`}
                    >
                      <Pencil size={15} />
                      Edit
                    </Link>
                    <button
                      className="icon-button"
                      aria-label={`Delete ${c.title}`}
                      onClick={() => setDeleting(c)}
                    >
                      <Trash2 size={17} />
                    </button>
                    <Link
                      className="icon-button"
                      aria-label={`View ${c.title}`}
                      to={`/courses/${c._id}`}
                    >
                      <ArrowUpRight size={17} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <Pagination pagination={courses.data.pagination} onChange={setPage} />
        </>
      ) : (
        <EmptyState
          title="You have not created any courses yet"
          description="Your experience could be someone's next breakthrough."
        >
          <Link className="btn primary" to="/instructor/courses/new">
            Create your first course
          </Link>
        </EmptyState>
      )}
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this course?"
        description="This also deletes its lessons, enrollments, comments, ratings, and progress. This cannot be undone."
        busy={busy}
        onCancel={() => setDeleting(null)}
        onConfirm={remove}
      />
    </div>
  );
}

```

FILE: frontend/src/pages/InstructorDashboard.jsx

```jsx
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

```

FILE: frontend/src/pages/Learning.jsx

```jsx
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

```

FILE: frontend/src/pages/LessonManagement.jsx

```jsx
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { coursesApi } from "../api/coursesApi";
import { lessonsApi } from "../api/lessonsApi";
import { useAuth } from "../context/AuthContext";
import useAsync from "../hooks/useAsync";
import {
  Checkbox,
  FormInput,
  SubmitButton,
  TextArea,
} from "../components/Forms";
import {
  ConfirmDialog,
  EmptyState,
  ErrorMessage,
  LoadingSpinner,
  PageHeading,
} from "../components/UI";
import { idOf, optionalFields } from "../utils/format";
function LessonEditor({ courseId, lesson, nextOrder, onSaved, onCancel }) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(null);
  async function submit(event) {
    event.preventDefault();
    const raw = Object.fromEntries(new FormData(event.currentTarget));
    const body = optionalFields(
      {
        ...raw,
        order: Number(raw.order),
        duration: Number(raw.duration),
        isPreview: raw.isPreview === "on",
      },
      ["videoUrl"],
    );
    setBusy(true);
    setError(null);
    try {
      if (lesson) await lessonsApi.update(courseId, lesson._id, body);
      else await lessonsApi.create(courseId, body);
      toast.success(lesson ? "Lesson updated" : "Lesson created");
      await onSaved();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="panel editor-form" onSubmit={submit}>
      <h2 className="mb-6">{lesson ? "Edit lesson" : "Add a new chapter"}</h2>
      {error && <ErrorMessage error={error} />}
      <FormInput
        label="Lesson title"
        name="title"
        required
        maxLength={200}
        defaultValue={lesson?.title || ""}
      />
      <TextArea
        label="Lesson content"
        name="content"
        required
        maxLength={50000}
        defaultValue={lesson?.content || ""}
      />
      <FormInput
        label="Video URL (optional)"
        name="videoUrl"
        type="url"
        pattern="https?://.*"
        defaultValue={lesson?.videoUrl || ""}
        help="YouTube, Vimeo or a direct video URL."
      />
      <div className="grid grid-cols-2 gap-5">
        <FormInput
          label="Duration (minutes)"
          name="duration"
          type="number"
          min={0}
          max={100000}
          step="0.1"
          required
          defaultValue={lesson?.duration || 0}
        />
        <FormInput
          label="Lesson order"
          name="order"
          type="number"
          min={1}
          step={1}
          required
          defaultValue={lesson?.order || nextOrder}
          help="Each lesson needs a unique order in the course."
        />
      </div>
      <Checkbox
        label="Allow anyone to preview this lesson"
        name="isPreview"
        defaultChecked={lesson?.isPreview || false}
      />
      <div className="form-actions">
        <button
          type="button"
          className="btn secondary"
          disabled={busy}
          onClick={onCancel}
        >
          Cancel
        </button>
        <SubmitButton busy={busy}>
          {lesson ? "Save lesson" : "Add lesson"}
        </SubmitButton>
      </div>
    </form>
  );
}
export default function LessonManagement() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [editing, setEditing] = useState(undefined),
    [deleting, setDeleting] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(null);
  const data = useAsync(async () => {
    const [course, lessons] = await Promise.all([
      coursesApi.get(courseId),
      lessonsApi.list(courseId),
    ]);
    return { course, lessons };
  }, [courseId]);
  async function remove() {
    setBusy(true);
    setError(null);
    try {
      await lessonsApi.remove(courseId, deleting._id);
      setDeleting(null);
      toast.success("Lesson deleted");
      await data.reload();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }
  if (data.loading) return <LoadingSpinner />;
  if (data.error)
    return (
      <div className="container section">
        <ErrorMessage error={data.error} retry={data.reload} />
      </div>
    );
  if (idOf(data.data.course.instructor) !== user._id)
    return <EmptyState title="This course belongs to another instructor" />;
  const { course, lessons } = data.data;
  return (
    <div className="container section">
      <Link className="text-button mb-6" to="/instructor/courses">
        ← Back to your courses
      </Link>
      <PageHeading
        eyebrow="Build the learning journey"
        title={course.title}
        description="Organize your lessons into clear, engaging chapters."
      >
        <button className="btn primary" onClick={() => setEditing(null)}>
          <Plus size={17} />
          Add lesson
        </button>
      </PageHeading>
      {error && <ErrorMessage error={error} />}
      <div
        className={
          editing !== undefined ? "lesson-management-grid" : "max-w-4xl"
        }
      >
        <div className="panel">
          <h2 className="mb-6">
            Course chapters <span className="muted">({lessons.length})</span>
          </h2>
          {lessons.length ? (
            lessons.map((l) => (
              <div className="lesson-row" key={l._id}>
                <span className="lesson-number">
                  {String(l.order).padStart(2, "0")}
                </span>
                <div className="grow min-w-0">
                  <strong>{l.title}</strong>
                  <small>
                    {l.duration} min{l.isPreview ? " · Preview" : ""}
                  </small>
                </div>
                <button
                  className="icon-button"
                  aria-label={`Edit ${l.title}`}
                  onClick={() => setEditing(l)}
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="icon-button"
                  aria-label={`Delete ${l.title}`}
                  onClick={() => setDeleting(l)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <EmptyState
              title="Every journey needs a first chapter"
              description="Add your first lesson to get started."
            />
          )}
        </div>
        {editing !== undefined && (
          <LessonEditor
            key={editing?._id || "new"}
            courseId={courseId}
            lesson={editing}
            nextOrder={Math.max(0, ...lessons.map((l) => l.order)) + 1}
            onSaved={async () => {
              setEditing(undefined);
              await data.reload();
            }}
            onCancel={() => setEditing(undefined)}
          />
        )}
      </div>
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this lesson?"
        description="Comments and progress for this lesson will also be removed."
        busy={busy}
        onCancel={() => setDeleting(null)}
        onConfirm={remove}
      />
    </div>
  );
}

```

FILE: frontend/src/pages/StudentCourses.jsx

```jsx
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

```

FILE: frontend/src/routes/ProtectedRoute.jsx

```jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { EmptyState, ErrorMessage, LoadingSpinner } from "../components/UI";
export function ProtectedRoute() {
  const { user, loading, error, restore } = useAuth();
  const location = useLocation();
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} retry={restore} />;
  return user ? (
    <Outlet />
  ) : (
    <Navigate
      to="/login"
      replace
      state={{ from: location.pathname + location.search }}
    />
  );
}
export function RoleRoute({ role }) {
  const { user } = useAuth();
  return user?.role === role ? (
    <Outlet />
  ) : (
    <EmptyState
      title="This space is for a different role"
      description={`You need a ${role} account to access this page.`}
    />
  );
}

```

FILE: frontend/src/styles.css

```css
@import "tailwindcss";
@theme {
  --color-forest: #214d3b;
  --color-cream: #faf9f5;
}
:root {
  font-family: Inter, "Segoe UI", Arial, sans-serif;
  color: #25392e;
  background: #faf9f5;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  font-size: 15px;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
}
button,
a,
input,
textarea,
select {
  -webkit-tap-highlight-color: transparent;
}
button,
a {
  transition:
    background 0.18s,
    color 0.18s,
    box-shadow 0.18s;
}
button {
  cursor: pointer;
}
button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
a {
  color: inherit;
  text-decoration: none;
}
input,
textarea,
select,
button {
  font: inherit;
}
h1,
h2,
h3,
p {
  margin: 0;
}
h1,
h2 {
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 400;
  letter-spacing: -0.045em;
  line-height: 1.12;
}
h1 {
  font-size: clamp(34px, 4.3vw, 56px);
}
h2 {
  font-size: clamp(27px, 3vw, 38px);
}
h3 {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
}
p {
  line-height: 1.7;
}
em {
  color: #547151;
  font-family: Georgia, serif;
}
img {
  max-width: 100%;
}
:focus-visible {
  outline: 3px solid #cc914a;
  outline-offset: 4px;
}
.container {
  max-width: 1232px;
  margin: auto;
  padding: 0 40px;
}
.section {
  padding-top: 64px;
  padding-bottom: 64px;
}
.narrow {
  max-width: 900px;
}
.muted {
  color: #718075;
}
.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.17em;
  font-size: 10px;
  font-weight: 700;
  color: #67785f;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #b49b56;
}
.tiny-label {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 9px;
  font-weight: 600;
  color: #7c877b;
}
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 46px;
  padding: 12px 21px;
  border: 1px solid transparent;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}
.btn.primary {
  color: white;
  background: #214d3b;
}
.btn.primary:hover {
  background: #173c2c;
}
.btn.secondary {
  background: transparent;
  border-color: #d5dacf;
  color: #314536;
}
.btn.secondary:hover {
  background: #f0f1e9;
}
.btn.small {
  min-height: 37px;
  padding: 9px 15px;
  font-size: 12px;
}
.btn.light {
  background: #f9f7ed;
  color: #214d3b;
}
.btn.danger {
  background: #a63435;
  color: white;
}
.text-button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 600;
  color: #305d45;
}
.text-button:hover {
  color: #b26e36;
}
.icon-button {
  display: inline-flex;
  padding: 8px;
  border-radius: 5px;
  color: #607363;
}
.icon-button:hover {
  background: #edf0e9;
}
.announcement {
  background: #214d3b;
  color: #e7ebdc;
  text-align: center;
  font-size: 10px;
  letter-spacing: 0.035em;
  padding: 9px 16px;
}
.announcement a {
  margin-left: 9px;
  display: inline-flex;
  gap: 4px;
  align-items: center;
  color: #e9dbb7;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.site-header {
  border-bottom: 1px solid #e5e6dd;
  background: #faf9f5;
}
.nav-inner {
  display: flex;
  align-items: center;
  gap: 48px;
  min-height: 88px;
}
.brand {
  font-family: Georgia, serif;
  font-size: 34px;
  letter-spacing: -1.8px;
  display: flex;
  align-items: center;
  font-weight: 700;
  color: #214d3b;
}
.brand-mark {
  margin-right: 8px;
  display: flex;
  align-items: center;
}
.brand-dot {
  color: #ae7950;
}
.main-nav {
  display: flex;
  gap: 25px;
  font-size: 12px;
  align-items: center;
  flex: 1;
}
.main-nav a {
  padding: 12px 0;
  color: #748071;
}
.main-nav a.active {
  color: #214d3b;
}
.nav-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}
.nav-login {
  font-size: 12px;
  font-weight: 600;
}
.avatar {
  background: #e1e8d7;
  color: #405f40;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}
.avatar.mini {
  width: 24px;
  height: 24px;
  font-size: 8px;
}
.mobile-menu {
  display: none;
}
.main-content {
  min-height: 60vh;
}
.hero {
  background: #f6f5ee;
  overflow: hidden;
}
.hero-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  min-height: 550px;
  align-items: center;
  gap: 55px;
}
.hero-copy {
  padding: 65px 0;
}
.hero h1 {
  font-size: clamp(40px, 4.7vw, 62px);
  letter-spacing: -0.055em;
  line-height: 1.12;
}
.hero h1 em {
  position: relative;
}
.hero h1 em:after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 3px;
  right: 3px;
  height: 2px;
  background: #c7b688;
  transform: rotate(-2deg);
}
.hero-description {
  font-size: 14px;
  color: #7b8576;
  margin: 26px 0 30px;
  line-height: 1.85;
}
.hero-footnote {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  color: #85917f;
  margin-top: 30px;
}
.mini-spark {
  color: #9da77c;
}
.hero-art {
  height: 430px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.orbit {
  position: absolute;
  border: 1px solid #d8dfcc;
  border-radius: 50%;
  height: 390px;
  width: 390px;
}
.orbit-two {
  height: 325px;
  width: 325px;
  background: #e8ebda;
}
.floating-spark {
  font-size: 58px;
  position: absolute;
  right: 0;
  top: 25px;
  color: #aaab73;
  font-weight: 200;
}
.book {
  position: absolute;
  box-shadow: 6px 16px 25px #61734325;
  height: 318px;
  width: 225px;
  border-radius: 3px 9px 9px 3px;
}
.book-back {
  background: #d4a270;
  transform: rotate(13deg);
  left: 95px;
  top: 54px;
  border-left: 8px solid #be8a5a;
}
.book-front {
  background: #305b43;
  color: #e7ebd4;
  transform: rotate(-9deg);
  padding: 27px 23px;
  left: 80px;
  top: 48px;
  border-left: 7px solid #244935;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.book-small {
  font-size: 6px;
  letter-spacing: 2px;
  color: #b3c499;
}
.book-title {
  font-family: Georgia, serif;
  font-size: 30px;
  line-height: 1.12;
  margin-top: 15px;
}
.book-title em {
  color: #d0dba4;
}
.book-bottom {
  font-size: 6px;
  letter-spacing: 1.8px;
  margin-top: auto;
}
.book-illustration {
  position: absolute;
  bottom: 44px;
  right: 15px;
  width: 95px;
  height: 115px;
}
.book-illustration div {
  position: absolute;
  width: 30px;
  height: 85px;
  border-radius: 100% 0 100% 0;
  background: #abbc78;
  transform: rotate(-24deg);
  left: 35px;
  bottom: 0;
}
.book-illustration div:nth-child(2) {
  transform: rotate(24deg);
  left: 58px;
  bottom: 7px;
  background: #d3dca7;
  height: 95px;
}
.book-illustration div:nth-child(3) {
  transform: rotate(-55deg);
  left: 13px;
  bottom: 0;
  height: 65px;
  background: #80985f;
}
.book-front > svg {
  margin-top: auto;
  margin-bottom: 12px;
}
.floating-note {
  position: absolute;
  bottom: 32px;
  right: 1px;
  display: flex;
  gap: 13px;
  align-items: center;
  background: #fffdf5;
  box-shadow: 0 8px 25px #65734d15;
  border: 1px solid #e8e9de;
  border-radius: 9px;
  padding: 17px 22px;
  transform: rotate(3deg);
}
.floating-note strong {
  font-size: 11px;
}
.floating-note p {
  font-size: 9px;
  color: #7d8a74;
  margin-top: 3px;
}
.note-icon {
  background: #eaf0df;
  border-radius: 50%;
  padding: 10px;
  color: #557743;
}
.benefit-strip {
  border-top: 1px solid #e7e7dd;
  border-bottom: 1px solid #e7e7dd;
  background: #f7f7f0;
}
.benefit-strip .container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 110px;
  padding-top: 24px;
  padding-bottom: 24px;
}
.benefit-strip span {
  display: flex;
  align-items: center;
  gap: 11px;
  font-size: 11px;
  color: #7a856e;
}
.benefit-strip svg {
  color: #809068;
}
.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 30px;
}
.section-heading .eyebrow {
  margin-bottom: 12px;
}
.category-list {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.category-list a {
  display: flex;
  align-items: center;
  gap: 18px;
  background: #f0f1e7;
  border: 1px solid #e3e6d9;
  border-radius: 6px;
  padding: 18px 23px;
  font-size: 12px;
  font-weight: 600;
  flex: 1;
  min-width: 160px;
}
.category-list a:hover {
  background: #e5ebdd;
}
.category-number {
  color: #99a484;
  font-size: 10px;
  font-weight: 400;
}
.category-list svg {
  margin-left: auto;
  color: #718468;
}
.featured-section {
  background: #f0f2e9;
  border-block: 1px solid #e3e6db;
}
.course-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}
.course-card {
  background: #fffefb;
  border: 1px solid #e1e5da;
  border-radius: 10px;
  overflow: hidden;
  transition: box-shadow 0.2s;
}
.course-card:hover {
  box-shadow: 0 8px 25px #2943290a;
}
.course-art {
  height: 178px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: #3d644a;
}
.course-art.sage {
  background: #dce5d2;
}
.course-art.peach {
  background: #ead9c4;
  color: #795b41;
}
.course-art.lilac {
  background: #dddde5;
  color: #635a7a;
}
.course-art.sand {
  background: #e9e4cb;
  color: #777044;
}
.course-art img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 2;
}
.art-decoration {
  position: relative;
  transform: rotate(-12deg);
  display: flex;
  align-items: center;
  justify-content: center;
}
.art-decoration > svg {
  z-index: 1;
}
.art-ring {
  position: absolute;
  width: 125px;
  height: 125px;
  border: 1px solid currentColor;
  border-radius: 50%;
  opacity: 0.35;
}
.art-ring:after {
  content: "";
  position: absolute;
  width: 90px;
  height: 90px;
  border: 1px solid currentColor;
  border-radius: 50%;
  top: 16px;
  left: 16px;
}
.art-category {
  position: absolute;
  bottom: 16px;
  left: 20px;
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  z-index: 3;
  background: #ffffffa6;
  padding: 5px 8px;
  border-radius: 3px;
}
.course-card-body {
  padding: 23px;
}
.course-card h3 {
  font-family: Georgia, serif;
  font-size: 21px;
  font-weight: 400;
  letter-spacing: -0.025em;
  margin: 15px 0 10px;
}
.rating {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  color: #a77940;
  font-size: 10px;
  white-space: nowrap;
}
.description-preview {
  font-size: 11px;
  color: #85907f;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 38px;
  overflow-wrap: anywhere;
}
.instructor-line {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  color: #778373;
  margin-top: 17px;
}
.course-card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #eaede4;
  padding-top: 16px;
  margin-top: 19px;
}
.course-card-bottom strong {
  font-size: 15px;
}
.course-card-bottom .text-button {
  font-size: 10px;
}
.why-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 110px;
}
.why-grid h2 {
  font-size: 44px;
}
.feature-list {
  display: flex;
  flex-direction: column;
  gap: 26px;
}
.feature-list > div {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}
.feature-list > div > span {
  padding: 14px;
  background: #eef1e6;
  border-radius: 9px;
  color: #708663;
}
.feature-list h3 {
  font-family: Georgia, serif;
  font-size: 20px;
  font-weight: 400;
  margin-bottom: 7px;
}
.feature-list p {
  color: #889080;
  font-size: 12px;
}
.teach-banner {
  background: #234d39;
  border-radius: 12px;
  padding: 49px 55px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
  color: #f5f5e5;
}
.teach-banner .eyebrow {
  color: #b5c49f;
}
.teach-banner h2 {
  font-size: 36px;
}
.teach-banner p:not(.eyebrow) {
  color: #b3c0a9;
  font-size: 11px;
  margin-top: 18px;
}
.site-footer {
  border-top: 1px solid #e3e7db;
  padding: 34px 0;
  background: #f3f4ec;
}
.footer-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 25px;
}
.footer-inner .brand {
  font-size: 29px;
}
.footer-inner p,
.footer-note {
  font-size: 9px;
  color: #8a947f;
  margin-top: 8px;
}
.footer-links {
  display: flex;
  gap: 28px;
  font-size: 10px;
  color: #6f7e65;
}
.footer-links a:last-child {
  display: flex;
  gap: 3px;
}
.page-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 30px;
  margin-bottom: 44px;
}
.page-heading h1 {
  font-size: 42px;
  max-width: 820px;
}
.page-heading .eyebrow {
  margin-bottom: 13px;
}
.panel {
  background: #fffefb;
  border: 1px solid #e2e6dc;
  border-radius: 10px;
  padding: 30px;
}
.state {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 17px;
  text-align: center;
  padding: 64px 24px;
  color: #778671;
  min-height: 230px;
}
.state h3 {
  font-family: Georgia, serif;
  font-weight: 400;
  font-size: 26px;
  color: #314e39;
}
.state p {
  max-width: 460px;
  font-size: 13px;
}
.empty-icon {
  padding: 16px;
  background: #eaf0df;
  border-radius: 50%;
  color: #6d845b;
}
.empty {
  border: 1px dashed #d8dfce;
  border-radius: 10px;
  background: #fafbf5;
}
.error-box {
  display: flex;
  align-items: flex-start;
  gap: 13px;
  background: #fff2ed;
  color: #914837;
  border: 1px solid #ead6cb;
  padding: 18px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 12px;
}
.error-box p {
  overflow-wrap: anywhere;
  margin-top: 4px;
}
.error-box svg {
  flex-shrink: 0;
}
.error-box .text-button {
  margin-top: 8px;
  color: #914837;
}
.field {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.field label {
  font-size: 12px;
  font-weight: 600;
  color: #4f654e;
}
.field input,
.field textarea,
.field select {
  background: #fffefa;
  border: 1px solid #dce2d4;
  border-radius: 6px;
  padding: 12px 13px;
  min-width: 0;
  width: 100%;
  color: #3d513b;
  font-size: 13px;
}
.field textarea {
  resize: vertical;
  min-height: 110px;
}
.field small {
  font-size: 10px;
  line-height: 1.6;
  color: #8b947f;
}
.field input::placeholder,
.field textarea::placeholder {
  color: #a3aa9b;
}
.checkbox {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 12px;
  line-height: 1.7;
  margin: 20px 0;
}
.checkbox input {
  margin-top: 5px;
  accent-color: #214d3b;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 30px;
  border-top: 1px solid #e7ebdf;
  padding-top: 24px;
}
.form-section-heading {
  display: flex;
  gap: 18px;
  align-items: center;
  margin: 10px 0 25px;
}
.form-section-heading > span {
  border: 1px solid #dfe5d6;
  color: #8b9a78;
  font-size: 11px;
  padding: 9px;
  border-radius: 50%;
}
.form-section-heading p {
  font-size: 11px;
  color: #8b957f;
}
.form-section-heading h3 {
  font-family: Georgia, serif;
  font-weight: 400;
  font-size: 22px;
}
.catalog-layout {
  display: grid;
  grid-template-columns: 235px minmax(0, 1fr);
  gap: 35px;
}
.filter-panel {
  background: #f0f2e8;
  border: 1px solid #e3e6d9;
  padding: 23px;
  border-radius: 8px;
  align-self: start;
}
.filter-panel h3 {
  display: flex;
  gap: 8px;
  font-size: 12px;
  margin-bottom: 23px;
}
.filter-panel .field label {
  font-size: 10px;
}
.filter-panel .field input,
.filter-panel .field select {
  font-size: 11px;
  padding: 10px;
}
.catalog-grid {
  gap: 18px;
}
.catalog-grid .course-card-body {
  padding: 19px;
}
.catalog-grid .course-art {
  height: 148px;
}
.catalog-grid .course-card h3 {
  font-size: 19px;
}
.catalog-grid .course-card-bottom {
  flex-wrap: wrap;
  gap: 10px;
}
.catalog-count {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #7f8a73;
  margin-bottom: 20px;
}
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 35px;
  font-size: 11px;
  color: #7a896e;
}
.pagination .btn {
  min-height: 38px;
  padding: 8px 13px;
  font-size: 11px;
}
.auth-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  align-items: center;
  gap: 90px;
  max-width: 1100px;
}
.auth-story h1 {
  font-size: 54px;
}
.auth-story > p:not(.eyebrow) {
  font-size: 13px;
  color: #829075;
  margin-top: 24px;
}
.auth-form {
  padding: 40px;
}
.auth-form h2 {
  font-size: 34px;
  margin-bottom: 10px;
}
.auth-form > p {
  font-size: 12px;
}
.auth-switch {
  text-align: center;
  font-size: 11px;
  color: #88947b;
  margin-top: 25px;
}
.auth-switch a {
  font-weight: 600;
  color: #3b6245;
}
.auth-illustration {
  margin-top: 45px;
  background: #e7ebdb;
  border-radius: 110px 110px 10px 10px;
  max-width: 310px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  color: #69825c;
  gap: 23px;
}
.auth-illustration > span {
  font-family: Georgia, serif;
  font-size: 23px;
  line-height: 1.2;
}
.auth-illustration > svg:last-child {
  position: absolute;
  right: 15px;
  top: 25px;
  transform: rotate(-10deg);
  color: #bd9969;
}
.details-grid {
  display: grid;
  grid-template-columns: 1fr 335px;
  gap: 60px;
  align-items: start;
}
.course-title {
  font-size: 48px;
  overflow-wrap: anywhere;
}
.course-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 22px;
  font-size: 11px;
  color: #718367;
  margin: 25px 0;
}
.course-meta > span {
  display: flex;
  align-items: center;
  gap: 7px;
}
.course-meta .rating {
  font-size: 12px;
}
.enrollment-card {
  padding: 0;
  overflow: hidden;
  position: sticky;
  top: 25px;
}
.enrollment-card .course-art {
  height: 210px;
}
.course-price {
  display: block;
  font-size: 31px;
  margin-bottom: 25px;
}
.enrolled-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #5c7b49;
  font-size: 12px;
  margin-bottom: 15px;
}
.included {
  display: flex;
  flex-direction: column;
  gap: 13px;
  margin-top: 28px;
  font-size: 11px;
  color: #7a8a6b;
}
.included span {
  display: flex;
  align-items: center;
  gap: 10px;
}
.fine-print {
  font-size: 9px;
  color: #9aa18f;
  margin-top: 22px;
}
.tag-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 30px;
}
.tag-list span {
  font-size: 9px;
  color: #748766;
  background: #ebefdf;
  padding: 6px 10px;
  border-radius: 5px;
}
.curriculum {
  margin-top: 35px;
}
.curriculum h2 {
  font-size: 30px;
  margin-bottom: 9px;
}
.curriculum > p {
  font-size: 12px;
}
.lesson-row {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px 0;
  border-bottom: 1px solid #e8edde;
  overflow-wrap: anywhere;
}
.lesson-row:last-child {
  border: 0;
}
.lesson-row strong {
  font-size: 13px;
  font-weight: 500;
}
.lesson-row small {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  color: #8a987c;
  margin-top: 6px;
}
.lesson-number {
  color: #93a181;
  font-size: 11px;
  border: 1px solid #e4e9dc;
  border-radius: 5px;
  padding: 8px;
  flex-shrink: 0;
}
.preview-content {
  font-size: 12px;
  padding: 10px 0 20px;
}
.preview-content summary {
  cursor: pointer;
  color: #557847;
}
.preview-content .lesson-content {
  font-size: 12px;
}
.reviews {
  margin-top: 40px;
}
.stars {
  display: flex;
  gap: 6px;
  color: #b38a48;
  align-items: center;
}
.stars button {
  padding: 4px;
}
.rating-form {
  background: #f3f5e9;
  border: 1px solid #e3e7d9;
  border-radius: 7px;
  padding: 25px;
  margin-bottom: 35px;
}
.rating-form .field {
  margin-top: 18px;
}
.comment-list {
  margin-top: 25px;
}
.comment {
  display: flex;
  gap: 15px;
  padding: 23px 0;
  border-top: 1px solid #e7ecdf;
  font-size: 12px;
}
.comment strong {
  font-size: 12px;
}
.comment small {
  display: block;
  color: #95a187;
  font-size: 9px;
  margin-top: 5px;
}
.discussion {
  margin-top: 28px;
}
.discussion h2 {
  font-size: 28px;
}
.discussion > p {
  font-size: 12px;
}
.confirm-dialog {
  padding: 30px;
  border: 1px solid #dce4d2;
  border-radius: 12px;
  max-width: 460px;
  width: calc(100% - 40px);
  margin: auto;
  background: #fffef8;
  color: #2d4c32;
  box-shadow: 0 25px 100px #1022163a;
}
.confirm-dialog::backdrop {
  background: #17382580;
  backdrop-filter: blur(3px);
}
.confirm-dialog h2 {
  font-size: 28px;
}
.confirm-dialog > p {
  font-size: 13px;
  color: #7b8a6d;
  margin: 22px 0 30px;
}
.progress-wrap {
  font-size: 11px;
}
.progress-wrap .text-sm {
  font-size: 10px;
  color: #738764;
}
.progress-track {
  height: 6px;
  background: #e8eddf;
  border-radius: 20px;
  overflow: hidden;
}
.progress-track > span {
  display: block;
  background: #799664;
  height: 100%;
  border-radius: 20px;
  transition: width 0.3s;
}
.learning-card-footer {
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid #e7ebdf;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 23px;
}
.stat-card {
  background: #fffef9;
  border: 1px solid #e2e7d8;
  border-radius: 9px;
  padding: 25px;
}
.stat-card > div {
  color: #819271;
  font-size: 11px;
}
.stat-card > strong {
  display: block;
  font-family: Georgia, serif;
  font-weight: 400;
  font-size: 43px;
  margin-top: 19px;
}
.stat-card > p {
  font-size: 9px;
  color: #95a183;
  margin-top: 7px;
}
.analytics-list > div {
  display: flex;
  gap: 24px;
  align-items: center;
  border-top: 1px solid #e6ebdd;
  padding: 23px 0;
  font-size: 12px;
}
.analytics-list small {
  font-size: 9px;
  color: #8e9b7f;
}
.analytics-bar {
  background: #eef1e5;
  height: 4px;
  border-radius: 20px;
  margin-top: 13px;
}
.analytics-bar > span {
  display: block;
  height: 100%;
  background: #8ba775;
  border-radius: 20px;
}
.manage-actions {
  display: flex;
  gap: 9px;
  align-items: center;
  padding-top: 20px;
  margin-top: 20px;
  border-top: 1px solid #e6ebdb;
}
.badge {
  background: #eeeadd;
  color: #938366;
  font-size: 9px;
  border-radius: 4px;
  padding: 4px 7px;
}
.badge.published {
  background: #e7efd9;
  color: #60844c;
}
.learning-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  margin-bottom: 35px;
}
.learning-heading .progress-wrap {
  min-width: 290px;
}
.learning-layout {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 30px;
}
.lesson-sidebar {
  padding: 20px 14px;
  align-self: start;
  position: sticky;
  top: 20px;
}
.lesson-sidebar h3 {
  padding: 4px 10px 20px;
  font-size: 13px;
}
.lesson-choice {
  display: flex;
  gap: 11px;
  align-items: center;
  width: 100%;
  padding: 15px 11px;
  border-radius: 6px;
  font-size: 12px;
  color: #859472;
  margin-top: 4px;
}
.lesson-choice:hover {
  background: #f1f4e8;
}
.lesson-choice.selected {
  background: #e8eedb;
  color: #486c38;
}
.lesson-choice small {
  display: block;
  font-size: 9px;
  margin-top: 5px;
  color: #98a587;
}
.completion-dot {
  width: 23px;
  height: 23px;
  border-radius: 50%;
  border: 1px solid #dfe7d3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  flex-shrink: 0;
}
.completion-dot.complete {
  background: #7f9e66;
  color: white;
  border: 0;
}
.lesson-panel h1 {
  font-size: 38px;
}
.lesson-content {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font-size: 14px;
  line-height: 1.9;
  margin: 30px 0 35px;
  color: #647855;
}
.video-wrap {
  margin: 25px 0;
}
.video-wrap iframe,
.video-wrap video {
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 8px;
  border: 0;
  background: #1b3020;
}
.lesson-navigation {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  border-top: 1px solid #e4ebda;
  padding-top: 25px;
  margin-top: 30px;
}
.lesson-navigation .btn {
  font-size: 11px;
}
.lesson-management-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  align-items: start;
}
@media (min-width: 1440px) {
  .hero-grid {
    min-height: 595px;
  }
  .hero-art {
    transform: scale(1.07);
  }
}
@media (max-width: 1024px) {
  .container {
    padding-left: 25px;
    padding-right: 25px;
  }
  .nav-inner {
    gap: 26px;
  }
  .main-nav {
    gap: 17px;
  }
  .nav-actions {
    gap: 12px;
  }
  .hero-grid {
    gap: 20px;
  }
  .hero-art {
    transform: scale(0.88);
    transform-origin: center;
  }
  .benefit-strip .container {
    gap: 55px;
  }
  .catalog-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .details-grid {
    gap: 35px;
    grid-template-columns: 1fr 300px;
  }
  .why-grid {
    gap: 60px;
  }
  .auth-layout {
    gap: 50px;
  }
  .learning-layout {
    grid-template-columns: 240px 1fr;
  }
  .course-grid {
    gap: 18px;
  }
  .lesson-management-grid {
    gap: 20px;
  }
  .manage-actions {
    flex-wrap: wrap;
  }
  .page-heading .btn {
    white-space: normal;
  }
  .footer-note {
    display: none;
  }
}
@media (max-width: 767px) {
  .container {
    padding-inline: 20px;
  }
  .section {
    padding-block: 40px;
  }
  .announcement {
    font-size: 8px;
  }
  .nav-inner {
    min-height: 73px;
    flex-wrap: wrap;
    gap: 0;
    justify-content: space-between;
  }
  .brand {
    font-size: 30px;
  }
  .mobile-menu {
    display: block;
    padding: 8px;
    color: #3c5d3e;
  }
  .main-nav,
  .nav-actions {
    display: none;
  }
  .main-nav.open {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    width: 100%;
    flex: auto;
    padding: 10px 0 0;
  }
  .main-nav.open a {
    padding: 11px 0;
    border-top: 1px solid #e5e9dc;
  }
  .nav-actions.open {
    display: flex;
    width: 100%;
    padding: 15px 0 20px;
    border-top: 1px solid #e5e9dc;
    justify-content: space-between;
  }
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .hero-copy {
    padding: 47px 0 14px;
  }
  .hero h1 {
    font-size: 44px;
  }
  .hero-description {
    font-size: 13px;
  }
  .hero-art {
    height: 365px;
    transform: scale(0.85);
    max-width: 390px;
    width: 100%;
    margin: auto;
  }
  .hero-footnote {
    font-size: 9px;
  }
  .hero-copy .btn {
    font-size: 11px;
    padding: 11px 14px;
  }
  .benefit-strip .container {
    gap: 20px;
    justify-content: space-between;
    flex-wrap: wrap;
    padding-block: 18px;
  }
  .benefit-strip span {
    font-size: 9px;
    gap: 7px;
  }
  .benefit-strip svg {
    width: 15px;
  }
  .benefit-strip span:last-child {
    display: none;
  }
  .section-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 15px;
  }
  .category-list {
    gap: 10px;
  }
  .category-list a {
    min-width: 140px;
    padding: 14px;
    font-size: 11px;
    gap: 10px;
  }
  .course-grid,
  .catalog-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .course-card-body,
  .catalog-grid .course-card-body {
    padding: 16px;
  }
  .course-art,
  .catalog-grid .course-art {
    height: 140px;
  }
  .course-card h3 {
    font-size: 19px;
  }
  .course-card .description-preview {
    font-size: 10px;
  }
  .course-card-bottom {
    flex-wrap: wrap;
    gap: 10px;
  }
  .rating {
    font-size: 9px;
  }
  .tiny-label {
    font-size: 8px;
  }
  .why-grid {
    grid-template-columns: 1fr;
    gap: 35px;
  }
  .why-grid h2 {
    font-size: 36px;
  }
  .teach-banner {
    padding: 32px 25px;
    align-items: flex-start;
    flex-direction: column;
  }
  .teach-banner h2 {
    font-size: 30px;
  }
  .footer-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  .footer-links {
    gap: 17px;
    flex-wrap: wrap;
  }
  .page-heading {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 30px;
  }
  .page-heading h1 {
    font-size: 35px;
  }
  .page-heading p:not(.eyebrow) {
    font-size: 13px;
  }
  .catalog-layout {
    grid-template-columns: 1fr;
    gap: 25px;
  }
  .filter-panel {
    padding: 20px;
  }
  .filter-panel form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 15px;
  }
  .filter-panel .field:first-child {
    grid-column: 1/-1;
  }
  .filter-panel .grid {
    grid-column: 1/-1;
  }
  .filter-panel .text-button {
    margin-top: 0;
  }
  .catalog-count .tiny-label {
    display: none;
  }
  .auth-layout {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .auth-story h1 {
    font-size: 39px;
  }
  .auth-story > p:not(.eyebrow) {
    font-size: 12px;
  }
  .auth-illustration {
    display: none;
  }
  .auth-form {
    padding: 25px;
  }
  .details-grid {
    display: flex;
    flex-direction: column;
    gap: 25px;
  }
  .details-grid > div,
  .enrollment-card {
    width: 100%;
  }
  .course-title {
    font-size: 37px;
  }
  .enrollment-card {
    position: static;
    order: -1;
  }
  .enrollment-card .course-art {
    display: none;
  }
  .curriculum {
    margin-top: 25px;
  }
  .panel {
    padding: 22px;
  }
  .enrollment-card {
    padding: 0;
  }
  .curriculum h2 {
    font-size: 27px;
  }
  .reviews h2 {
    font-size: 29px;
  }
  .stats-grid {
    gap: 12px;
  }
  .stat-card {
    padding: 15px;
  }
  .stat-card > strong {
    font-size: 33px;
  }
  .stat-card > div {
    font-size: 9px;
    gap: 5px;
  }
  .stat-card svg {
    width: 15px;
  }
  .analytics-list > div {
    gap: 12px;
    flex-wrap: wrap;
  }
  .analytics-list > div > div {
    min-width: 130px;
  }
  .analytics-list small {
    display: block;
  }
  .learning-heading {
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
  }
  .learning-heading .progress-wrap {
    min-width: 0;
  }
  .learning-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .lesson-sidebar {
    position: static;
    max-height: 310px;
    overflow: auto;
  }
  .lesson-panel h1 {
    font-size: 31px;
  }
  .lesson-navigation {
    gap: 8px;
  }
  .lesson-navigation .btn {
    padding: 9px;
    font-size: 9px;
    gap: 4px;
  }
  .lesson-management-grid {
    grid-template-columns: 1fr;
  }
  .rating-form {
    padding: 18px;
  }
  .pagination {
    gap: 10px;
    font-size: 9px;
  }
  .pagination .btn {
    font-size: 10px;
    padding: 9px;
  }
  .editor-form .form-actions {
    justify-content: space-between;
  }
}
@media (max-width: 430px) {
  .course-grid,
  .catalog-grid {
    grid-template-columns: 1fr;
  }
  .course-art,
  .catalog-grid .course-art {
    height: 190px;
  }
  .course-card-body,
  .catalog-grid .course-card-body {
    padding: 23px;
  }
  .hero h1 {
    font-size: 38px;
  }
  .hero-art {
    margin-left: -10px;
    width: calc(100% + 20px);
  }
  .stats-grid {
    grid-template-columns: 1fr;
  }
  .stat-card {
    padding: 20px;
  }
  .stat-card > strong {
    font-size: 36px;
    margin-top: 12px;
  }
  .stat-card > div {
    font-size: 12px;
  }
  .filter-panel form {
    display: block;
  }
  .filter-panel form > .grid {
    display: grid;
  }
  .page-heading h1 {
    font-size: 31px;
  }
  .course-meta {
    gap: 13px;
  }
  .lesson-row {
    gap: 10px;
  }
  .field label {
    font-size: 11px;
  }
}

```

FILE: frontend/src/utils/format.js

```js
export const idOf = (v) => (typeof v === "object" && v ? v._id : v);
export const price = (v) =>
  Number(v) === 0 ? "Free" : `$${Number(v || 0).toFixed(2)}`;
export const titleCase = (v) =>
  (v || "").replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
export const date = (v) =>
  new Date(v).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
export const initials = (name) =>
  (name || "?")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
export function optionalFields(body, fields) {
  const copy = { ...body };
  fields.forEach((k) => {
    if (!copy[k]) delete copy[k];
  });
  return copy;
}

```

FILE: frontend/src/utils/getApiError.js

```js
export default function getApiError(error) {
  const body = error?.response?.data;
  if (Array.isArray(body?.errors))
    return body.errors.map((e) => `${e.field}: ${e.message}`).join(" · ");
  if (body?.message) return body.message;
  if (error?.code === "ECONNABORTED")
    return "This request took too long. Please try again.";
  if (!error?.response && error?.isAxiosError)
    return "We could not reach the platform. Check your connection and that the API is running.";
  return error?.message || "Something went wrong. Please try again.";
}

```

FILE: frontend/vite.config.js

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: { postcss: { plugins: [] } },
  server: {
    port: 5173,
    strictPort: true,
    watch: {
      ignored: ["**/test-results/**", "**/playwright-report/**", "**/e2e/**"],
    },
  },
});

```

FILE: package.json

```json
{
  "name": "online-course-platform-api",
  "version": "1.0.0",
  "private": true,
  "description": "Online learning REST API",
  "main": "src/server.js",
  "engines": { "node": ">=20" },
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "dev:demo": "node scripts/dev-demo.js",
    "test": "jest --runInBand",
    "test:watch": "jest --watch --runInBand",
    "seed": "node scripts/seed.js"
  },
  "dependencies": {
    "bcryptjs": "^3.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.6.1",
    "express": "^5.1.0",
    "express-rate-limit": "^8.1.0",
    "helmet": "^8.1.0",
    "joi": "^17.13.3",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.19.1",
    "swagger-ui-express": "^5.0.1"
  },
  "devDependencies": {
    "jest": "^30.2.0",
    "mongodb-memory-server": "^10.2.1",
    "nodemon": "^3.1.10",
    "supertest": "^7.1.4"
  },
  "jest": { "testEnvironment": "node", "testTimeout": 120000, "testMatch": ["**/tests/**/*.test.js"] },
  "license": "MIT"
}

```

FILE: postman/online-course-platform.json

```json
{
  "info": {
    "name": "Online Course Platform",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api/v1"
    },
    {
      "key": "token",
      "value": ""
    },
    {
      "key": "courseId",
      "value": ""
    },
    {
      "key": "lessonId",
      "value": ""
    },
    {
      "key": "commentId",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register a student or instructor",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": "{{baseUrl}}/auth/register",
            "description": "Register a student or instructor",
            "auth": {
              "type": "noauth"
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Demo Instructor\",\n  \"email\": \"instructor@example.com\",\n  \"password\": \"DemoPass123!\",\n  \"role\": \"instructor\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test('Expected status', function () { pm.response.to.have.status(201); });",
                  "if (pm.response.code < 300) pm.collectionVariables.set('token', pm.response.json().data.token);"
                ]
              }
            }
          ]
        },
        {
          "name": "Login and receive a Bearer JWT",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": "{{baseUrl}}/auth/login",
            "description": "Login and receive a Bearer JWT",
            "auth": {
              "type": "noauth"
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"instructor@example.com\",\n  \"password\": \"DemoPass123!\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test('Expected status', function () { pm.response.to.have.status(200); });",
                  "if (pm.response.code < 300) pm.collectionVariables.set('token', pm.response.json().data.token);"
                ]
              }
            }
          ]
        },
        {
          "name": "Get current user",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{baseUrl}}/auth/me",
            "description": "Get current user",
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test('Expected status', function () { pm.response.to.have.status(200); });"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "name": "Courses",
      "item": [
        {
          "name": "List categories used by published courses",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{baseUrl}}/categories",
            "description": "List categories used by published courses",
            "auth": {
              "type": "noauth"
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test('Expected status', function () { pm.response.to.have.status(200); });"
                ]
              }
            }
          ]
        },
        {
          "name": "Browse published courses",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{baseUrl}}/courses",
            "description": "Browse published courses",
            "auth": {
              "type": "noauth"
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test('Expected status', function () { pm.response.to.have.status(200); });"
                ]
              }
            }
          ]
        },
        {
          "name": "Create a course (instructor)",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": "{{baseUrl}}/courses",
            "description": "Create a course (instructor)",
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Node.js Fundamentals\",\n  \"description\": \"Build backend APIs with Node.js.\",\n  \"category\": \"programming\",\n  \"price\": 0,\n  \"level\": \"beginner\",\n  \"isPublished\": true\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test('Expected status', function () { pm.response.to.have.status(201); });",
                  "if (pm.response.code < 300) pm.collectionVariables.set('courseId', pm.response.json().data._id);"
                ]
              }
            }
          ]
        },
        {
          "name": "View a published course; draft requires owner token",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{baseUrl}}/courses/{{courseId}}",
            "description": "View a published course; draft requires owner token",
            "auth": {
              "type": "noauth"
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test('Expected status', function () { pm.response.to.have.status(200); });"
                ]
              }
            }
          ]
        },
        {
          "name": "Update own course",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": "{{baseUrl}}/courses/{{courseId}}",
            "description": "Update own course",
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Updated Node.js Course\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test('Expected status', function () { pm.response.to.have.status(200); });"
                ]
              }
            }
          ]
        },
        {
          "name": "Delete own course and related records",
          "request": {
            "method": "DELETE",
            "header": [],
            "url": "{{baseUrl}}/courses/{{courseId}}",
            "description": "Delete own course and related records",
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test('Expected status', function () { pm.response.to.have.status(204); });"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "name": "Instructor Stats",
      "item": [
        {
          "name": "List instructor courses, including drafts",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{baseUrl}}/instructor/courses",
            "description": "List instructor courses, including drafts",
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test('Expected status', function () { pm.response.to.have.status(200); });"
                ]
              }
            }
          ]
        },
        {
          "name": "Enrollment counts and weighted rating analytics",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{baseUrl}}/instructor/stats",
            "description": "Enrollment counts and weighted rating analytics",
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test('Expected status', function () { pm.response.to.have.status(200); });"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "name": "Lessons",
      "item": [
        {
          "name": "List lessons; protected content requires enrollment",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{baseUrl}}/courses/{{courseId}}/lessons",
            "description": "List lessons; protected content requires enrollment",
            "auth": {
              "type": "noauth"
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test('Expected status', function () { pm.response.to.have.status(200); });"
                ]
              }
            }
          ]
        },
        {
          "name": "Create lesson in own course",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": "{{baseUrl}}/courses/{{courseId}}/lessons",
            "description": "Create lesson in own course",
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Introduction\",\n  \"content\": \"Welcome to the course.\",\n  \"order\": 1,\n  \"duration\": 10,\n  \"isPreview\": false\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test('Expected status', function () { pm.response.to.have.status(201); });",
                  "if (pm.response.code < 300) pm.collectionVariables.set('lessonId', pm.response.json().data._id);"
                ]
              }
            }
          ]
        },
        {
          "name": "Read lesson; previews are public",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{baseUrl}}/courses/{{courseId}}/lessons/{{lessonId}}",
            "description": "Read lesson; previews are public",
            "auth": {
              "type": "noauth"
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test('Expected status', function () { pm.response.to.have.status(200); });"
                ]
              }
            }
          ]
        },
        {
          "name": "Update lesson in own course",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": "{{baseUrl}}/courses/{{courseId}}/lessons/{{lessonId}}",
            "description": "Update lesson in own course",
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Updated Introduction\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test('Expected status', function () { pm.response.to.have.status(200); });"
                ]
              }
            }
          ]
        },
        {
          "name": "Delete lesson in own course",
          "request": {
            "method": "DELETE",
            "header": [],
            "url": "{{baseUrl}}/courses/{{courseId}}/lessons/{{lessonId}}",
            "description": "Delete lesson in own course",
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test('Expected status', function () { pm.response.to.have.status(204); });"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "name": "Enrollments",
      "item": [
        {
          "name": "Enroll as student",
          "request": {
            "method": "POST",
            "header": [],
            "url": "{{baseUrl}}/courses/{{courseId}}/enroll",
            "description": "Enroll as student",
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test('Expected status', function () { pm.response.to.have.status(201); });"
                ]
              }
            }
          ]
        },
        {
          "name": "Unenroll and remove progress and rating",
          "request": {
            "method": "DELETE",
            "header": [],
            "url": "{{baseUrl}}/courses/{{courseId}}/enroll",
            "description": "Unenroll and remove progress and rating",
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test('Expected status', function () { pm.response.to.have.status(204); });"
                ]
              }
            }
          ]
        },
        {
          "name": "List enrolled courses",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{baseUrl}}/enrollments/me",
            "description": "List enrolled courses",
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test('Expected status', function () { pm.response.to.have.status(200); });"
                ]
              }
            }
          ]
        },
        {
          "name": "Check own enrollment",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{baseUrl}}/courses/{{courseId}}/enrollment-status",
            "description": "Check own enrollment",
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test('Expected status', function () { pm.response.to.have.status(200); });"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "name": "Progress",
      "item": [
        {
          "name": "Get completion count and percentage",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{baseUrl}}/courses/{{courseId}}/progress",
            "description": "Get completion count and percentage",
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test('Expected status', function () { pm.response.to.have.status(200); });"
                ]
              }
            }
          ]
        },
        {
          "name": "Mark lesson completed or incomplete",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": "{{baseUrl}}/lessons/{{lessonId}}/progress",
            "description": "Mark lesson completed or incomplete",
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"completed\": true\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test('Expected status', function () { pm.response.to.have.status(200); });"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "name": "Comments",
      "item": [
        {
          "name": "List comments (enrolled student or owner)",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{baseUrl}}/lessons/{{lessonId}}/comments",
            "description": "List comments (enrolled student or owner)",
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test('Expected status', function () { pm.response.to.have.status(200); });"
                ]
              }
            }
          ]
        },
        {
          "name": "Comment as enrolled student",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": "{{baseUrl}}/lessons/{{lessonId}}/comments",
            "description": "Comment as enrolled student",
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"text\": \"Helpful lesson!\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test('Expected status', function () { pm.response.to.have.status(201); });",
                  "if (pm.response.code < 300) pm.collectionVariables.set('commentId', pm.response.json().data._id);"
                ]
              }
            }
          ]
        },
        {
          "name": "Edit own comment",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": "{{baseUrl}}/comments/{{commentId}}",
            "description": "Edit own comment",
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"text\": \"Updated feedback\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test('Expected status', function () { pm.response.to.have.status(200); });"
                ]
              }
            }
          ]
        },
        {
          "name": "Delete own comment",
          "request": {
            "method": "DELETE",
            "header": [],
            "url": "{{baseUrl}}/comments/{{commentId}}",
            "description": "Delete own comment",
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test('Expected status', function () { pm.response.to.have.status(204); });"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "name": "Ratings",
      "item": [
        {
          "name": "List ratings",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{baseUrl}}/courses/{{courseId}}/ratings",
            "description": "List ratings",
            "auth": {
              "type": "noauth"
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test('Expected status', function () { pm.response.to.have.status(200); });"
                ]
              }
            }
          ]
        },
        {
          "name": "Rate as enrolled student",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": "{{baseUrl}}/courses/{{courseId}}/ratings",
            "description": "Rate as enrolled student",
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"value\": 5,\n  \"review\": \"Great course\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test('Expected status', function () { pm.response.to.have.status(201); });"
                ]
              }
            }
          ]
        },
        {
          "name": "Update own rating",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": "{{baseUrl}}/courses/{{courseId}}/ratings/me",
            "description": "Update own rating",
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"value\": 4,\n  \"review\": \"Updated review\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test('Expected status', function () { pm.response.to.have.status(200); });"
                ]
              }
            }
          ]
        },
        {
          "name": "Delete own rating",
          "request": {
            "method": "DELETE",
            "header": [],
            "url": "{{baseUrl}}/courses/{{courseId}}/ratings/me",
            "description": "Delete own rating",
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "pm.test('Expected status', function () { pm.response.to.have.status(204); });"
                ]
              }
            }
          ]
        }
      ]
    }
  ]
}

```

FILE: scripts/dev-demo.js

```js
// Local demo only: starts an isolated temporary MongoDB and the real API server.
process.env.MONGOMS_DOWNLOAD_DIR = require('path').resolve(__dirname, '../node_modules/.cache/mongodb-memory-server');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { spawn } = require('child_process');
async function main() {
  const mongo = await MongoMemoryServer.create();
  const child = spawn(process.execPath, ['src/server.js'], {
    stdio: 'inherit', env: { ...process.env, MONGO_URI: mongo.getUri(), NODE_ENV: 'development' }
  });
  console.log('Temporary demo database: data disappears when this process stops.');
  let stopping = false;
  const stop = async () => {
    if (stopping) return;
    stopping = true;
    child.kill('SIGTERM');
    await mongo.stop();
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
  child.on('exit', async code => { await stop(); process.exitCode = code || 0; });
}
main().catch(err => { console.error(err.message); process.exitCode = 1; });

```

FILE: scripts/export-code.js

```js
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const excluded = new Set(['.git', 'node_modules', '.env', 'coverage', 'dist', 'test-results', 'playwright-report', 'COMPLETE_CODE.md', 'package-lock.json']);
function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (excluded.has(entry.name)) return [];
    const target = path.join(dir, entry.name);
    return entry.isDirectory() ? files(target) : [target];
  });
}
const all = files(root).sort();
const tree = all.map(file => path.relative(root, file).replace(/\\/g, '/')).join('\n');
const content = '# Complete project source\n\nGenerated from the actual project files. Local secrets and installed dependencies are excluded. The dependency lockfile is delivered separately.\n\n```text\n' + tree + '\n```\n\n' + all.map(file => {
  const name = path.relative(root, file).replace(/\\/g, '/');
  const language = { '.js': 'js', '.jsx': 'jsx', '.css': 'css', '.html': 'html', '.json': 'json', '.yml': 'yaml', '.md': 'markdown' }[path.extname(file)] || 'text';
  const fence = language === 'markdown' ? '````' : '```';
  return `FILE: ${name}\n\n${fence}${language}\n${fs.readFileSync(file, 'utf8')}\n${fence}\n`;
}).join('\n');
fs.writeFileSync(path.join(root, 'COMPLETE_CODE.md'), content);

```

FILE: scripts/generate-postman.js

```js
const fs = require('fs');
const path = require('path');
const docs = require('../src/docs/swagger');
const groups = new Map();
for (const op of docs.operations) {
  const raw = '{{baseUrl}}' + op.path.replace(/\{(\w+)\}/g, '{{$1}}');
  const request = { method: op.method.toUpperCase(), header: [], url: raw,
    description: op.summary, auth: op.security ? { type: 'bearer', bearer: [{ key: 'token', value: '{{token}}', type: 'string' }] } : { type: 'noauth' } };
  if (op.example) {
    request.header.push({ key: 'Content-Type', value: 'application/json' });
    request.body = { mode: 'raw', raw: JSON.stringify(op.example, null, 2), options: { raw: { language: 'json' } } };
  }
  const lines = [`pm.test('Expected status', function () { pm.response.to.have.status(${op.status}); });`];
  if (op.path.startsWith('/auth/') && op.method === 'post') lines.push("if (pm.response.code < 300) pm.collectionVariables.set('token', pm.response.json().data.token);");
  const variable = op.method === 'post' ? ({ '/courses': 'courseId', '/courses/{courseId}/lessons': 'lessonId', '/lessons/{lessonId}/comments': 'commentId' })[op.path] : null;
  if (variable) lines.push(`if (pm.response.code < 300) pm.collectionVariables.set('${variable}', pm.response.json().data._id);`);
  const item = { name: op.summary, request, event: [{ listen: 'test', script: { type: 'text/javascript', exec: lines } }] };
  if (!groups.has(op.tag)) groups.set(op.tag, []);
  groups.get(op.tag).push(item);
}
const collection = { info: { name: 'Online Course Platform', schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json' },
  variable: ['baseUrl', 'token', 'courseId', 'lessonId', 'commentId'].map(key => ({ key, value: key === 'baseUrl' ? 'http://localhost:5000/api/v1' : '' })),
  item: Array.from(groups, ([name, item]) => ({ name, item })) };
fs.mkdirSync(path.join(__dirname, '../postman'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '../postman/online-course-platform.json'), JSON.stringify(collection, null, 2) + '\n');

```

FILE: scripts/seed.js

```js
const env = require('../src/config/env');
const connect = require('../src/config/db');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Course = require('../src/models/Course');
const Lesson = require('../src/models/Lesson');
async function seed() {
  if (env.NODE_ENV === 'production') throw new Error('Demo seed is disabled in production');
  await connect(env.MONGO_URI);
  let instructor = await User.findOne({ email: 'instructor@example.com' });
  if (!instructor) instructor = await User.create({ name: 'Demo Instructor', email: 'instructor@example.com', password: 'DemoPass123!', role: 'instructor' });
  if (!await User.exists({ email: 'student@example.com' })) await User.create({ name: 'Demo Student', email: 'student@example.com', password: 'DemoPass123!', role: 'student' });
  let course = await Course.findOne({ title: 'Node.js Fundamentals', instructor: instructor._id });
  if (!course) course = await Course.create({ title: 'Node.js Fundamentals', description: 'Learn to build REST APIs.', instructor: instructor._id, category: 'programming', isPublished: true });
  for (let order = 1; order <= 3; order++) await Lesson.updateOne({ course: course._id, order }, { $setOnInsert: {
    title: ['Welcome', 'Express routing', 'MongoDB models'][order - 1], content: 'Demo lesson content for API exploration.', isPreview: order === 1, duration: 15
  } }, { upsert: true, runValidators: true });
  console.log('Demo data ready. instructor@example.com / student@example.com; password: DemoPass123!');
}
seed().catch(err => { console.error(err.message); process.exitCode = 1; }).finally(async () => mongoose.disconnect());

```

FILE: src/app.js

```js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const mongoose = require('mongoose');
const env = require('./config/env');
const { apiLimiter } = require('./middleware/rateLimit.middleware');
const { safeInput } = require('./middleware/validation.middleware');
const ApiError = require('./utils/ApiError');
const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN.split(',').map(s => s.trim()) }));
app.use(express.json({ limit: '100kb' }));
app.use(safeInput);
app.get('/health', (req, res) => {
  const ready = mongoose.connection.readyState === 1;
  res.status(ready ? 200 : 503).json({ success: ready, message: ready ? 'API ready' : 'Database unavailable' });
});
app.get('/api-docs.json', (req, res) => res.json(require('./docs/swagger')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require('./docs/swagger')));
app.use('/api/v1', apiLimiter, require('./routes'));
app.use((req, res, next) => next(new ApiError(404, 'Route not found')));
app.use(require('./middleware/error.middleware'));
module.exports = app;

```

FILE: src/config/db.js

```js
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
module.exports = async (uri) => mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });

```

FILE: src/config/env.js

```js
require('dotenv').config();
const Joi = require('joi');
const { value, error } = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().port().default(5000),
  MONGO_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().pattern(/^\d+[smhd]$/).default('7d'),
  CORS_ORIGIN: Joi.string().default('http://localhost:3000')
}).unknown(true).validate(process.env);
if (error) throw new Error(`Invalid environment configuration: ${error.message}`);
module.exports = value;

```

FILE: src/controllers/auth.controller.js

```js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const { ok } = require('../utils/response');
const token = (user) => jwt.sign({}, env.JWT_SECRET, { subject: user.id, expiresIn: env.JWT_EXPIRES_IN,
  algorithm: 'HS256', issuer: 'course-api', audience: 'course-client' });
exports.register = async (req, res) => {
  const user = await User.create(req.validated.body);
  ok(res, { user, token: token(user) }, 'Registered successfully', 201);
};
exports.login = async (req, res) => {
  const { email, password } = req.validated.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !await user.comparePassword(password)) throw new ApiError(401, 'Invalid email or password');
  ok(res, { user, token: token(user) }, 'Logged in successfully');
};
exports.me = async (req, res) => ok(res, req.user);

```

FILE: src/controllers/comment.controller.js

```js
const Comment = require('../models/Comment');
const access = require('../services/access');
const ApiError = require('../utils/ApiError');
const { ok, paginate } = require('../utils/response');
exports.list = async (req, res) => {
  const { course } = await access.lesson(req.params.lessonId, req.user);
  await access.learning(course, req.user);
  await paginate(res, Comment, { lesson: req.params.lessonId }, req.validated.query, { populate: { path: 'user', select: 'name avatar' } });
};
exports.create = async (req, res) => {
  const { lesson, course } = await access.lesson(req.params.lessonId, req.user);
  await access.enrolled(course._id, req.user);
  const comment = await Comment.create({ user: req.user._id, lesson: lesson._id, ...req.validated.body });
  await comment.populate('user', 'name avatar');
  ok(res, comment, 'Comment created', 201);
};
const ownedComment = async (req) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) throw new ApiError(404, 'Comment not found');
  if (!comment.user.equals(req.user._id)) throw new ApiError(403, 'Only the comment owner can perform this action');
  return comment;
};
exports.update = async (req, res) => {
  const comment = await ownedComment(req);
  comment.text = req.validated.body.text;
  await comment.save();
  await comment.populate('user', 'name avatar');
  ok(res, comment, 'Comment updated');
};
exports.remove = async (req, res) => { await (await ownedComment(req)).deleteOne(); res.status(204).end(); };

```

FILE: src/controllers/course.controller.js

```js
const mongoose = require('mongoose');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const Comment = require('../models/Comment');
const Rating = require('../models/Rating');
const LessonProgress = require('../models/LessonProgress');
const access = require('../services/access');
const { ok, paginate } = require('../utils/response');
exports.list = async (req, res) => {
  const q = req.validated.query;
  const filter = { isPublished: true };
  for (const key of ['category', 'instructor', 'level']) if (q[key]) filter[key] = q[key];
  if (q.minPrice !== undefined || q.maxPrice !== undefined) {
    filter.price = {};
    if (q.minPrice !== undefined) filter.price.$gte = q.minPrice;
    if (q.maxPrice !== undefined) filter.price.$lte = q.maxPrice;
  }
  if (q.minRating !== undefined) filter.averageRating = { $gte: q.minRating };
  if (q.search) {
    const escaped = q.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [{ title: { $regex: escaped, $options: 'i' } }, { description: { $regex: escaped, $options: 'i' } }];
  }
  const sorts = { newest: { createdAt: -1 }, rating: { averageRating: -1 }, price: { price: 1 },
    '-price': { price: -1 }, title: { title: 1 }, '-title': { title: -1 },
    '-createdAt': { createdAt: -1 }, '-averageRating': { averageRating: -1 } };
  await paginate(res, Course, filter, q, { sort: { ...sorts[q.sort], _id: 1 }, populate: { path: 'instructor', select: 'name avatar' } });
};
exports.get = async (req, res) => {
  const course = await access.course(req.params.courseId, req.user);
  await course.populate('instructor', 'name avatar');
  ok(res, course);
};
exports.create = async (req, res) => ok(res, await Course.create({ ...req.validated.body, instructor: req.user._id }), 'Course created', 201);
exports.update = async (req, res) => {
  const course = await access.ownedCourse(req.params.courseId, req.user);
  Object.assign(course, req.validated.body);
  ok(res, await course.save(), 'Course updated');
};
exports.remove = async (req, res) => {
  const course = await access.ownedCourse(req.params.courseId, req.user);
  const lessons = await Lesson.find({ course: course._id }).select('_id');
  await Comment.deleteMany({ lesson: { $in: lessons.map(l => l._id) } });
  await Promise.all([Lesson.deleteMany({ course: course._id }), Enrollment.deleteMany({ course: course._id }),
    Rating.deleteMany({ course: course._id }), LessonProgress.deleteMany({ course: course._id })]);
  await course.deleteOne();
  res.status(204).end();
};
exports.mine = async (req, res) => paginate(res, Course, { instructor: req.user._id }, req.validated.query);
exports.categories = async (req, res) => ok(res, await Course.distinct('category', { isPublished: true }));
exports.stats = async (req, res) => {
  const courses = await Course.aggregate([
    { $match: { instructor: new mongoose.Types.ObjectId(req.user.id) } },
    { $lookup: { from: 'enrollments', let: { courseId: '$_id' }, pipeline: [
      { $match: { $expr: { $eq: ['$course', '$$courseId'] } } }, { $count: 'count' }
    ], as: 'enrollmentSummary' } },
    { $project: { title: 1, averageRating: 1, ratingsCount: 1,
      enrollments: { $ifNull: [{ $arrayElemAt: ['$enrollmentSummary.count', 0] }, 0] } } },
    { $sort: { enrollments: -1, _id: 1 } }
  ]);
  const ratingsCount = courses.reduce((n, c) => n + c.ratingsCount, 0);
  ok(res, { numberOfCourses: courses.length, totalEnrollments: courses.reduce((n, c) => n + c.enrollments, 0),
    averageCourseRating: ratingsCount ? courses.reduce((n, c) => n + c.averageRating * c.ratingsCount, 0) / ratingsCount : 0,
    mostPopularCourse: courses[0] || null, courses });
};

```

FILE: src/controllers/enrollment.controller.js

```js
const Enrollment = require('../models/Enrollment');
const LessonProgress = require('../models/LessonProgress');
const Rating = require('../models/Rating');
const access = require('../services/access');
const ratings = require('../services/ratings');
const { ok, paginate } = require('../utils/response');
exports.create = async (req, res) => {
  const course = await access.course(req.params.courseId, req.user);
  ok(res, await Enrollment.create({ course: course._id, student: req.user._id }), 'Enrolled successfully', 201);
};
exports.mine = async (req, res) => paginate(res, Enrollment, { student: req.user._id }, req.validated.query,
  { sort: { enrolledAt: -1, _id: -1 }, populate: { path: 'course', populate: { path: 'instructor', select: 'name avatar' } } });
exports.status = async (req, res) => {
  const course = await access.course(req.params.courseId, req.user);
  ok(res, { enrolled: Boolean(await Enrollment.exists({ student: req.user._id, course: course._id })) });
};
exports.remove = async (req, res) => {
  const course = await access.course(req.params.courseId, req.user);
  const enrollment = await access.enrolled(course._id, req.user);
  await Promise.all([LessonProgress.deleteMany({ student: req.user._id, course: course._id }),
    Rating.deleteOne({ student: req.user._id, course: course._id })]);
  await enrollment.deleteOne();
  await ratings.refresh(course._id);
  res.status(204).end();
};

```

FILE: src/controllers/lesson.controller.js

```js
const Lesson = require('../models/Lesson');
const Comment = require('../models/Comment');
const LessonProgress = require('../models/LessonProgress');
const Enrollment = require('../models/Enrollment');
const access = require('../services/access');
const ApiError = require('../utils/ApiError');
const { ok } = require('../utils/response');
const nestedLesson = async (req) => {
  const lesson = await Lesson.findOne({ _id: req.params.lessonId, course: req.params.courseId });
  if (!lesson) throw new ApiError(404, 'Lesson not found in this course');
  return lesson;
};
exports.list = async (req, res) => {
  const course = await access.course(req.params.courseId, req.user);
  const canLearn = course.instructor.equals(req.user?._id) || (req.user && await Enrollment.exists({ course: course._id, student: req.user._id }));
  const lessons = await Lesson.find({ course: course._id }).sort({ order: 1 }).lean();
  ok(res, lessons.map(lesson => {
    if (canLearn || lesson.isPreview) return lesson;
    const { content, videoUrl, ...metadata } = lesson;
    return metadata;
  }));
};
exports.get = async (req, res) => {
  const course = await access.course(req.params.courseId, req.user);
  const lesson = await nestedLesson(req);
  if (!lesson.isPreview) await access.learning(course, req.user);
  ok(res, lesson);
};
exports.create = async (req, res) => {
  await access.ownedCourse(req.params.courseId, req.user);
  ok(res, await Lesson.create({ ...req.validated.body, course: req.params.courseId }), 'Lesson created', 201);
};
exports.update = async (req, res) => {
  await access.ownedCourse(req.params.courseId, req.user);
  const lesson = await nestedLesson(req);
  Object.assign(lesson, req.validated.body);
  ok(res, await lesson.save(), 'Lesson updated');
};
exports.remove = async (req, res) => {
  await access.ownedCourse(req.params.courseId, req.user);
  const lesson = await nestedLesson(req);
  await Promise.all([Comment.deleteMany({ lesson: lesson._id }), LessonProgress.deleteMany({ lesson: lesson._id })]);
  await lesson.deleteOne();
  res.status(204).end();
};

```

FILE: src/controllers/progress.controller.js

```js
const Lesson = require('../models/Lesson');
const LessonProgress = require('../models/LessonProgress');
const access = require('../services/access');
const { ok } = require('../utils/response');
const summary = async (courseId, student) => {
  const lessons = await Lesson.find({ course: courseId }).select('_id').lean();
  const completions = await LessonProgress.find({ student, course: courseId, lesson: { $in: lessons.map(l => l._id) } }).select('lesson').lean();
  const completedLessonIds = completions.map(item => item.lesson);
  const completedLessons = completedLessonIds.length;
  const totalLessons = lessons.length;
  return { courseId, completedLessons, totalLessons, completedLessonIds, progressPercentage: totalLessons ? Math.round(completedLessons / totalLessons * 10000) / 100 : 0 };
};
exports.get = async (req, res) => {
  const course = await access.course(req.params.courseId, req.user);
  await access.enrolled(course._id, req.user);
  ok(res, await summary(course._id, req.user._id));
};
exports.update = async (req, res) => {
  const { lesson, course } = await access.lesson(req.params.lessonId, req.user);
  await access.enrolled(course._id, req.user);
  const filter = { student: req.user._id, lesson: lesson._id };
  if (req.validated.body.completed) {
    await LessonProgress.updateOne(filter, { $setOnInsert: { ...filter, course: course._id } }, { upsert: true, runValidators: true });
  } else await LessonProgress.deleteOne(filter);
  ok(res, await summary(course._id, req.user._id), 'Progress updated');
};

```

FILE: src/controllers/rating.controller.js

```js
const Rating = require('../models/Rating');
const access = require('../services/access');
const ratings = require('../services/ratings');
const ApiError = require('../utils/ApiError');
const { ok, paginate } = require('../utils/response');
exports.list = async (req, res) => {
  await access.course(req.params.courseId, req.user);
  await paginate(res, Rating, { course: req.params.courseId }, req.validated.query, { populate: { path: 'student', select: 'name avatar' } });
};
const context = async (req) => {
  const course = await access.course(req.params.courseId, req.user);
  await access.enrolled(course._id, req.user);
  return course;
};
exports.create = async (req, res) => {
  const course = await context(req);
  const rating = await Rating.create({ ...req.validated.body, course: course._id, student: req.user._id });
  await ratings.refresh(course._id);
  ok(res, rating, 'Rating created', 201);
};
exports.update = async (req, res) => {
  const course = await context(req);
  const rating = await Rating.findOneAndUpdate({ course: course._id, student: req.user._id }, req.validated.body, { new: true, runValidators: true });
  if (!rating) throw new ApiError(404, 'Rating not found');
  await ratings.refresh(course._id);
  ok(res, rating, 'Rating updated');
};
exports.remove = async (req, res) => {
  const course = await context(req);
  const rating = await Rating.findOneAndDelete({ course: course._id, student: req.user._id });
  if (!rating) throw new ApiError(404, 'Rating not found');
  await ratings.refresh(course._id);
  res.status(204).end();
};

```

FILE: src/docs/swagger.js

```js
const v = require('../validators');
function joiSchema(schema) {
  const convert = d => {
    const result = { type: d.type === 'number' ? 'number' : d.type === 'object' ? 'object' : d.type === 'array' ? 'array' : d.type === 'boolean' ? 'boolean' : 'string' };
    if (d.flags?.default !== undefined) result.default = d.flags.default;
    if (d.flags?.only) result.enum = d.allow;
    for (const rule of d.rules || []) {
      if (rule.name === 'integer') result.type = 'integer';
      if (rule.name === 'min' && typeof rule.args.limit === 'number') result[d.type === 'number' ? 'minimum' : 'minLength'] = rule.args.limit;
      if (rule.name === 'max' && typeof rule.args.limit === 'number') result[d.type === 'number' ? 'maximum' : 'maxLength'] = rule.args.limit;
      if (rule.name === 'email') result.format = 'email';
      if (rule.name === 'uri') result.format = 'uri';
    }
    if (d.keys) {
      result.properties = Object.fromEntries(Object.entries(d.keys).map(([k, s]) => [k, convert(s)]));
      result.required = Object.entries(d.keys).filter(([, s]) => s.flags?.presence === 'required').map(([k]) => k);
      result.additionalProperties = false;
    }
    if (d.items) result.items = convert(d.items[0]);
    return result;
  };
  return convert(schema.describe());
}
const paths = {};
const operations = [];
function add(method, path, tag, summary, schema, query, security = true, status = 200, example) {
  const parameters = [...path.matchAll(/\{(\w+)\}/g)].map(m => ({ name: m[1], in: 'path', required: true, schema: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' } }));
  if (query) for (const [name, spec] of Object.entries(joiSchema(query).properties)) parameters.push({ name, in: 'query', schema: spec });
  const responses = {};
  for (const code of [status, 400, 401, 403, 404, 409, 422, 429, 500]) responses[code] = {
    description: code === status ? 'Successful operation' : 'Request failed',
    ...(code === 204 ? {} : { content: { 'application/json': { schema: { $ref: code === status ? '#/components/schemas/Success' : '#/components/schemas/Error' } } } })
  };
  const publicAuthEndpoint = path.startsWith('/auth/');
  const operation = { tags: [tag], summary, parameters,
    security: security ? [{ bearerAuth: [] }] : publicAuthEndpoint ? [] : [{}, { bearerAuth: [] }], responses };
  if (schema) operation.requestBody = { required: true, content: { 'application/json': { schema: joiSchema(schema), ...(example ? { example } : {}) } } };
  paths[path] = { ...paths[path], [method]: operation };
  operations.push({ method, path, tag, summary, example, security, status });
}
const courseExample = { title: 'Node.js Fundamentals', description: 'Build backend APIs with Node.js.', category: 'programming', price: 0, level: 'beginner', isPublished: true };
const lessonExample = { title: 'Introduction', content: 'Welcome to the course.', order: 1, duration: 10, isPreview: false };
add('post', '/auth/register', 'Auth', 'Register a student or instructor', v.register, null, false, 201, { name: 'Demo Instructor', email: 'instructor@example.com', password: 'DemoPass123!', role: 'instructor' });
add('post', '/auth/login', 'Auth', 'Login and receive a Bearer JWT', v.login, null, false, 200, { email: 'instructor@example.com', password: 'DemoPass123!' });
add('get', '/auth/me', 'Auth', 'Get current user');
add('get', '/categories', 'Courses', 'List categories used by published courses', null, null, false);
add('get', '/courses', 'Courses', 'Browse published courses', null, v.courseQuery, false);
add('post', '/courses', 'Courses', 'Create a course (instructor)', v.createCourse, null, true, 201, courseExample);
add('get', '/courses/{courseId}', 'Courses', 'View a published course; draft requires owner token', null, null, false);
add('patch', '/courses/{courseId}', 'Courses', 'Update own course', v.updateCourse, null, true, 200, { title: 'Updated Node.js Course' });
add('delete', '/courses/{courseId}', 'Courses', 'Delete own course and related records', null, null, true, 204);
add('get', '/instructor/courses', 'Instructor Stats', 'List instructor courses, including drafts', null, v.paging);
add('get', '/instructor/stats', 'Instructor Stats', 'Enrollment counts and weighted rating analytics');
add('get', '/courses/{courseId}/lessons', 'Lessons', 'List lessons; protected content requires enrollment', null, null, false);
add('post', '/courses/{courseId}/lessons', 'Lessons', 'Create lesson in own course', v.createLesson, null, true, 201, lessonExample);
add('get', '/courses/{courseId}/lessons/{lessonId}', 'Lessons', 'Read lesson; previews are public', null, null, false);
add('patch', '/courses/{courseId}/lessons/{lessonId}', 'Lessons', 'Update lesson in own course', v.updateLesson, null, true, 200, { title: 'Updated Introduction' });
add('delete', '/courses/{courseId}/lessons/{lessonId}', 'Lessons', 'Delete lesson in own course', null, null, true, 204);
add('post', '/courses/{courseId}/enroll', 'Enrollments', 'Enroll as student', null, null, true, 201);
add('delete', '/courses/{courseId}/enroll', 'Enrollments', 'Unenroll and remove progress and rating', null, null, true, 204);
add('get', '/enrollments/me', 'Enrollments', 'List enrolled courses', null, v.paging);
add('get', '/courses/{courseId}/enrollment-status', 'Enrollments', 'Check own enrollment');
add('get', '/courses/{courseId}/progress', 'Progress', 'Get completion count and percentage');
add('patch', '/lessons/{lessonId}/progress', 'Progress', 'Mark lesson completed or incomplete', v.progress, null, true, 200, { completed: true });
add('get', '/lessons/{lessonId}/comments', 'Comments', 'List comments (enrolled student or owner)', null, v.paging);
add('post', '/lessons/{lessonId}/comments', 'Comments', 'Comment as enrolled student', v.comment, null, true, 201, { text: 'Helpful lesson!' });
add('patch', '/comments/{commentId}', 'Comments', 'Edit own comment', v.comment, null, true, 200, { text: 'Updated feedback' });
add('delete', '/comments/{commentId}', 'Comments', 'Delete own comment', null, null, true, 204);
add('get', '/courses/{courseId}/ratings', 'Ratings', 'List ratings', null, v.paging, false);
add('post', '/courses/{courseId}/ratings', 'Ratings', 'Rate as enrolled student', v.rating, null, true, 201, { value: 5, review: 'Great course' });
add('patch', '/courses/{courseId}/ratings/me', 'Ratings', 'Update own rating', v.rating, null, true, 200, { value: 4, review: 'Updated review' });
add('delete', '/courses/{courseId}/ratings/me', 'Ratings', 'Delete own rating', null, null, true, 204);
module.exports = {
  openapi: '3.0.3', info: { title: 'Online Course Platform API', version: '1.0.0', description: 'JWT roles: student and instructor. Drafts are visible only to their owner. No payment processing is implemented; enrollment is immediate even for courses with a listed price.' },
  servers: [{ url: '/api/v1' }], paths,
  components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } }, schemas: {
    Success: { type: 'object', properties: { success: { type: 'boolean', example: true }, message: { type: 'string' }, data: {},
      results: { type: 'integer' }, pagination: { type: 'object', properties: { page: { type: 'integer' }, limit: { type: 'integer' }, totalPages: { type: 'integer' }, totalItems: { type: 'integer' } } } } },
    Error: { type: 'object', properties: { success: { type: 'boolean', example: false }, message: { type: 'string' }, errors: { type: 'array', items: { type: 'object', properties: { field: { type: 'string' }, message: { type: 'string' } } } } } }
  } }
};
Object.defineProperty(module.exports, 'operations', { value: operations, enumerable: false });

```

FILE: src/middleware/auth.middleware.js

```js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
exports.optionalAuth = async (req, res, next) => {
  const header = req.get('authorization');
  if (!header) return next();
  if (!/^Bearer \S+$/i.test(header)) throw new ApiError(401, 'Use a Bearer token');
  const payload = jwt.verify(header.split(' ')[1], env.JWT_SECRET, { algorithms: ['HS256'], issuer: 'course-api', audience: 'course-client' });
  req.user = await User.findById(payload.sub);
  if (!req.user) throw new ApiError(401, 'User no longer exists');
  next();
};
exports.protect = (req, res, next) => {
  if (!req.user) throw new ApiError(401, 'Authentication required');
  next();
};
exports.authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) throw new ApiError(403, 'Role is not permitted');
  next();
};

```

FILE: src/middleware/error.middleware.js

```js
module.exports = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  let status = err.status || 500;
  let message = err.message;
  if (err.code === 11000) { status = 409; message = 'Resource already exists'; }
  if (err.name === 'CastError') { status = 400; message = 'Invalid resource ID'; }
  if (err.name === 'ValidationError') { status = 422; message = 'Database validation failed'; }
  if (['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError'].includes(err.name)) {
    status = 401; message = 'Invalid or expired authentication token';
  }
  if (status >= 500) {
    if (process.env.NODE_ENV !== 'test') console.error(err);
    message = 'Internal server error';
  }
  res.status(status).json({ success: false, message, ...(err.errors && status < 500 ? { errors: err.errors } : {}) });
};

```

FILE: src/middleware/rateLimit.middleware.js

```js
const { rateLimit } = require('express-rate-limit');
const message = { success: false, message: 'Too many requests. Try again later.' };
exports.apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-8', legacyHeaders: false, message });
exports.authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-8', legacyHeaders: false, message });

```

FILE: src/middleware/validation.middleware.js

```js
const ApiError = require('../utils/ApiError');
exports.validate = (schema, source = 'body') => (req, res, next) => {
  const { value, error } = schema.validate(req[source], { abortEarly: false, convert: true });
  if (error) throw new ApiError(422, 'Validation failed', error.details.map(d => ({ field: d.path.join('.'), message: d.message })));
  req.validated = { ...req.validated, [source]: value };
  next();
};
exports.safeInput = (req, res, next) => {
  const inspect = (value) => {
    if (!value || typeof value !== 'object') return;
    for (const [key, child] of Object.entries(value)) {
      if (key.startsWith('$') || key.includes('.') || ['__proto__', 'constructor', 'prototype'].includes(key))
        throw new ApiError(400, 'Unsafe request key');
      inspect(child);
    }
  };
  inspect(req.body); inspect(req.query);
  next();
};

```

FILE: src/models/Comment.js

```js
const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true, index: true },
  text: { type: String, required: true, trim: true, maxlength: 2000 }
}, { timestamps: true });
module.exports = mongoose.model('Comment', schema);

```

FILE: src/models/Course.js

```js
const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, maxlength: 10000 },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  category: { type: String, required: true, lowercase: true, trim: true, index: true },
  price: { type: Number, min: 0, default: 0 },
  thumbnail: String,
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  tags: [String],
  isPublished: { type: Boolean, default: false },
  averageRating: { type: Number, min: 0, max: 5, default: 0 },
  ratingsCount: { type: Number, default: 0 }
}, { timestamps: true });
schema.index({ isPublished: 1, createdAt: -1 });
module.exports = mongoose.model('Course', schema);

```

FILE: src/models/Enrollment.js

```js
const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  enrolledAt: { type: Date, default: Date.now }
});
schema.index({ student: 1, course: 1 }, { unique: true });
schema.index({ course: 1 });
module.exports = mongoose.model('Enrollment', schema);

```

FILE: src/models/Lesson.js

```js
const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 200 },
  content: { type: String, required: true, maxlength: 50000 },
  videoUrl: String,
  duration: { type: Number, min: 0, default: 0 },
  order: { type: Number, min: 1, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  isPreview: { type: Boolean, default: false }
}, { timestamps: true });
schema.index({ course: 1, order: 1 }, { unique: true });
module.exports = mongoose.model('Lesson', schema);

```

FILE: src/models/LessonProgress.js

```js
const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  completedAt: { type: Date, default: Date.now }
});
schema.index({ student: 1, lesson: 1 }, { unique: true });
module.exports = mongoose.model('LessonProgress', schema);

```

FILE: src/models/Rating.js

```js
const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  value: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, maxlength: 2000 }
}, { timestamps: true });
schema.index({ student: 1, course: 1 }, { unique: true });
schema.index({ course: 1 });
module.exports = mongoose.model('Rating', schema);

```

FILE: src/models/User.js

```js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['student', 'instructor'], required: true },
  avatar: String
}, { timestamps: true, toJSON: { transform: (_doc, ret) => { delete ret.password; delete ret.__v; return ret; } } });
schema.pre('save', async function () {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 12);
});
schema.methods.comparePassword = async function (candidate) { return bcrypt.compare(candidate, this.password); };
module.exports = mongoose.model('User', schema);

```

FILE: src/routes/index.js

```js
const express = require('express');
const auth = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { authLimiter } = require('../middleware/rateLimit.middleware');
const v = require('../validators');
const a = require('../controllers/auth.controller');
const c = require('../controllers/course.controller');
const l = require('../controllers/lesson.controller');
const e = require('../controllers/enrollment.controller');
const cm = require('../controllers/comment.controller');
const r = require('../controllers/rating.controller');
const p = require('../controllers/progress.controller');
const locked = require('../services/courseLock');
const router = express.Router();
const student = [auth.protect, auth.authorizeRoles('student')];
const instructor = [auth.protect, auth.authorizeRoles('instructor')];
const ids = (...names) => validate(v.params(...names), 'params');
const paging = validate(v.paging, 'query');
router.post('/auth/register', authLimiter, validate(v.register), a.register);
router.post('/auth/login', authLimiter, validate(v.login), a.login);
router.use(auth.optionalAuth);
router.get('/auth/me', auth.protect, a.me);
router.get('/categories', c.categories);
router.get('/instructor/courses', ...instructor, paging, c.mine);
router.get('/instructor/stats', ...instructor, c.stats);
router.get('/courses', validate(v.courseQuery, 'query'), c.list);
router.post('/courses', ...instructor, validate(v.createCourse), c.create);
router.get('/courses/:courseId', ids('courseId'), c.get);
router.patch('/courses/:courseId', ...instructor, ids('courseId'), validate(v.updateCourse), c.update);
router.delete('/courses/:courseId', ...instructor, ids('courseId'), locked(c.remove));
router.get('/courses/:courseId/lessons', ids('courseId'), l.list);
router.post('/courses/:courseId/lessons', ...instructor, ids('courseId'), validate(v.createLesson), l.create);
router.get('/courses/:courseId/lessons/:lessonId', ids('courseId', 'lessonId'), l.get);
router.patch('/courses/:courseId/lessons/:lessonId', ...instructor, ids('courseId', 'lessonId'), validate(v.updateLesson), l.update);
router.delete('/courses/:courseId/lessons/:lessonId', ...instructor, ids('courseId', 'lessonId'), l.remove);
router.post('/courses/:courseId/enroll', ...student, ids('courseId'), e.create);
router.delete('/courses/:courseId/enroll', ...student, ids('courseId'), locked(e.remove));
router.get('/courses/:courseId/enrollment-status', ...student, ids('courseId'), e.status);
router.get('/enrollments/me', ...student, paging, e.mine);
router.get('/courses/:courseId/progress', ...student, ids('courseId'), p.get);
router.patch('/lessons/:lessonId/progress', ...student, ids('lessonId'), validate(v.progress), p.update);
router.get('/lessons/:lessonId/comments', auth.protect, ids('lessonId'), paging, cm.list);
router.post('/lessons/:lessonId/comments', ...student, ids('lessonId'), validate(v.comment), cm.create);
router.patch('/comments/:commentId', ...student, ids('commentId'), validate(v.comment), cm.update);
router.delete('/comments/:commentId', ...student, ids('commentId'), cm.remove);
router.get('/courses/:courseId/ratings', ids('courseId'), paging, r.list);
router.post('/courses/:courseId/ratings', ...student, ids('courseId'), validate(v.rating), locked(r.create));
router.patch('/courses/:courseId/ratings/me', ...student, ids('courseId'), validate(v.rating), locked(r.update));
router.delete('/courses/:courseId/ratings/me', ...student, ids('courseId'), locked(r.remove));
module.exports = router;

```

FILE: src/server.js

```js
const env = require('./config/env');
const connect = require('./config/db');
const mongoose = require('mongoose');
const app = require('./app');
let server;
async function start() {
  await connect(env.MONGO_URI);
  await Promise.all(Object.values(mongoose.models).map(model => model.init()));
  server = app.listen(env.PORT, () => console.log(`API listening on http://localhost:${env.PORT}; documentation: /api-docs`));
}
async function shutdown() {
  const timer = setTimeout(() => process.exit(1), 10000).unref();
  if (server) await new Promise(resolve => server.close(resolve));
  await mongoose.disconnect();
  clearTimeout(timer);
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
start().catch(err => { console.error(err.message); process.exitCode = 1; });

```

FILE: src/services/access.js

```js
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const ApiError = require('../utils/ApiError');
exports.course = async (id, user) => {
  const course = await Course.findById(id);
  if (!course || (!course.isPublished && !course.instructor.equals(user?._id))) throw new ApiError(404, 'Course not found');
  return course;
};
exports.ownedCourse = async (id, user) => {
  const course = await Course.findById(id);
  if (!course) throw new ApiError(404, 'Course not found');
  if (!course.instructor.equals(user._id)) throw new ApiError(403, 'Only the course owner can perform this action');
  return course;
};
exports.enrolled = async (courseId, user) => {
  const enrollment = await Enrollment.findOne({ course: courseId, student: user._id });
  if (!enrollment) throw new ApiError(403, 'Course enrollment required');
  return enrollment;
};
exports.lesson = async (id, user) => {
  const lesson = await Lesson.findById(id);
  if (!lesson) throw new ApiError(404, 'Lesson not found');
  const course = await exports.course(lesson.course, user);
  return { lesson, course };
};
exports.learning = async (course, user) => {
  if (course.instructor.equals(user?._id)) return;
  if (!user) throw new ApiError(401, 'Authentication required');
  await exports.enrolled(course._id, user);
};

```

FILE: src/services/courseLock.js

```js
// Serializes rating writes in one API process. Multiple instances need database transactions.
const tails = new Map();
module.exports = handler => async (req, res, next) => {
  const key = req.params.courseId;
  const previous = tails.get(key) || Promise.resolve();
  let release;
  const current = new Promise(resolve => { release = resolve; });
  tails.set(key, current);
  await previous;
  try { await handler(req, res, next); }
  finally {
    release();
    if (tails.get(key) === current) tails.delete(key);
  }
};

```

FILE: src/services/ratings.js

```js
const Rating = require('../models/Rating');
const Course = require('../models/Course');
exports.refresh = async (courseId) => {
  // Cached aggregates are rebuilt from the rating collection after each mutation.
  const [summary] = await Rating.aggregate([
    { $match: { course: courseId } },
    { $group: { _id: '$course', averageRating: { $avg: '$value' }, ratingsCount: { $sum: 1 } } }
  ]);
  await Course.updateOne({ _id: courseId }, { $set: {
    averageRating: summary?.averageRating || 0, ratingsCount: summary?.ratingsCount || 0
  } });
};

```

FILE: src/utils/ApiError.js

```js
class ApiError extends Error {
  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}
module.exports = ApiError;

```

FILE: src/utils/response.js

```js
exports.ok = (res, data, message = 'Request successful', status = 200) =>
  res.status(status).json({ success: true, message, data });

exports.paginate = async (res, Model, filter, query, options = {}) => {
  const { page = 1, limit = 10 } = query;
  let cursor = Model.find(filter).sort(options.sort || { createdAt: -1, _id: -1 })
    .skip((page - 1) * limit).limit(limit);
  if (options.populate) cursor = cursor.populate(options.populate);
  if (options.select) cursor = cursor.select(options.select);
  const [data, totalItems] = await Promise.all([cursor, Model.countDocuments(filter)]);
  return res.json({ success: true, results: data.length,
    pagination: { page, limit, totalPages: Math.ceil(totalItems / limit), totalItems }, data });
};

```

FILE: src/validators/index.js

```js
const Joi = require('joi');
const id = Joi.string().pattern(/^[a-fA-F0-9]{24}$/);
const text = (max) => Joi.string().trim().min(1).max(max);
const url = Joi.string().uri({ scheme: ['http', 'https'] });
const course = {
  title: text(200), description: text(10000), category: text(60).lowercase().pattern(/^[a-z0-9-]+$/),
  price: Joi.number().min(0).max(1000000), thumbnail: url,
  level: Joi.string().valid('beginner', 'intermediate', 'advanced'),
  tags: Joi.array().items(text(40).lowercase()).max(20), isPublished: Joi.boolean()
};
const lesson = { title: text(200), content: text(50000), videoUrl: url,
  duration: Joi.number().min(0).max(100000), order: Joi.number().integer().min(1), isPreview: Joi.boolean() };
exports.params = (...names) => Joi.object(Object.fromEntries(names.map(name => [name, id.required()])));
exports.register = Joi.object({ name: text(100).required(), email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).max(72).custom((v, h) => Buffer.byteLength(v, 'utf8') > 72 ? h.error('any.invalid') : v).required(),
  role: Joi.string().valid('student', 'instructor').required(), avatar: url });
exports.login = Joi.object({ email: Joi.string().email().lowercase().required(), password: Joi.string().max(200).required() });
exports.createCourse = Joi.object({ ...course, title: course.title.required(), description: course.description.required(), category: course.category.required() });
exports.updateCourse = Joi.object(course).min(1);
exports.createLesson = Joi.object({ ...lesson, title: lesson.title.required(), content: lesson.content.required(), order: lesson.order.required() });
exports.updateLesson = Joi.object(lesson).min(1);
exports.comment = Joi.object({ text: text(2000).required() });
exports.rating = Joi.object({ value: Joi.number().integer().min(1).max(5).required(), review: text(2000).allow('') });
exports.progress = Joi.object({ completed: Joi.boolean().required() });
const paging = { page: Joi.number().integer().min(1).max(100000).default(1), limit: Joi.number().integer().min(1).max(100).default(10) };
exports.paging = Joi.object(paging);
exports.courseQuery = Joi.object({ ...paging, category: course.category, instructor: id, level: course.level,
  search: text(100), minPrice: Joi.number().min(0), maxPrice: Joi.number().min(Joi.ref('minPrice', { adjust: v => v || 0 })),
  minRating: Joi.number().min(0).max(5),
  sort: Joi.string().valid('newest', 'rating', 'price', '-price', 'title', '-title', '-createdAt', '-averageRating').default('newest') });

```

FILE: tests/api.test.js

```js
process.env.NODE_ENV = 'test';
process.env.MONGO_URI = 'mongodb://127.0.0.1/course_test';
process.env.JWT_SECRET = 'test-secret-only-at-least-thirty-two-characters';
process.env.MONGOMS_DOWNLOAD_DIR = require('path').resolve(__dirname, '../node_modules/.cache/mongodb-memory-server');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const connect = require('../src/config/db');
let mongo, instructor, otherInstructor, student, otherStudent, courseId, lessonId, commentId;
const call = (method, path, token, body) => {
  let req = request(app)[method]('/api/v1' + path);
  if (token) req = req.set('Authorization', `Bearer ${token}`);
  return body === undefined ? req : req.send(body);
};
const register = async (email, role) => {
  const res = await call('post', '/auth/register', null, { name: role, email, role, password: 'Password123!' });
  expect(res.status).toBe(201);
  expect(res.body.data.user.password).toBeUndefined();
  return res.body.data.token;
};
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await connect(mongo.getUri());
  await Promise.all(Object.values(mongoose.models).map(m => m.init()));
}, 1200000);
afterAll(async () => { await mongoose.disconnect(); if (mongo) await mongo.stop(); });
test('register users; normalize email; reject duplicate registration and invalid input', async () => {
  instructor = await register('INSTRUCTOR@example.com', 'instructor');
  otherInstructor = await register('other-instructor@example.com', 'instructor');
  student = await register('student@example.com', 'student');
  otherStudent = await register('other-student@example.com', 'student');
  expect((await call('post', '/auth/register', null, { name: 'Duplicate', email: 'instructor@example.com', role: 'student', password: 'Password123!' })).status).toBe(409);
  expect((await call('post', '/auth/register', null, { role: 'admin' })).status).toBe(422);
});
test('login and JWT protection never expose passwords', async () => {
  const login = await call('post', '/auth/login', null, { email: 'student@example.com', password: 'Password123!' });
  expect(login.status).toBe(200);
  expect(login.body.data.user.password).toBeUndefined();
  expect((await call('post', '/auth/login', null, { email: 'student@example.com', password: 'wrong' })).status).toBe(401);
  expect((await call('get', '/auth/me')).status).toBe(401);
  expect((await call('get', '/auth/me', 'invalid')).status).toBe(401);
  const me = await call('get', '/auth/me', student);
  expect(me.status).toBe(200);
  expect(me.body.data.password).toBeUndefined();
});
test('only instructor creates course; only owner updates it; validate IDs and input', async () => {
  const body = { title: 'Node.js Basics', description: 'Backend programming', category: 'programming', isPublished: true, price: 10 };
  expect((await call('post', '/courses', student, body)).status).toBe(403);
  const created = await call('post', '/courses', instructor, body);
  expect(created.status).toBe(201); courseId = created.body.data._id;
  expect((await call('patch', `/courses/${courseId}`, otherInstructor, { title: 'Stolen' })).status).toBe(403);
  expect((await call('patch', `/courses/${courseId}`, instructor, { title: 'Node.js Advanced' })).status).toBe(200);
  expect((await call('get', '/courses/bad-id')).status).toBe(422);
  expect((await call('patch', `/courses/${courseId}`, instructor, { instructor: '123' })).status).toBe(422);
});
test('lesson ownership, unique order, nested IDs and protected content', async () => {
  const body = { title: 'First lesson', content: 'Protected content', order: 1 };
  expect((await call('post', `/courses/${courseId}/lessons`, otherInstructor, body)).status).toBe(403);
  const created = await call('post', `/courses/${courseId}/lessons`, instructor, body);
  expect(created.status).toBe(201); lessonId = created.body.data._id;
  expect((await call('post', `/courses/${courseId}/lessons`, instructor, body)).status).toBe(409);
  expect((await call('get', `/courses/${courseId}/lessons/${lessonId}`)).status).toBe(401);
  expect((await call('get', `/courses/${courseId}/lessons/${lessonId}`, student)).status).toBe(403);
  const list = await call('get', `/courses/${courseId}/lessons`);
  expect(list.body.data[0].content).toBeUndefined();
  expect((await call('patch', `/courses/${courseId}/lessons/${lessonId}`, otherInstructor, { title: 'Stolen' })).status).toBe(403);
});
test('enrollment is student only and unique', async () => {
  expect((await call('post', `/courses/${courseId}/enroll`, instructor)).status).toBe(403);
  expect((await call('post', `/courses/${courseId}/enroll`, student)).status).toBe(201);
  expect((await call('post', `/courses/${courseId}/enroll`, student)).status).toBe(409);
  expect((await call('get', `/courses/${courseId}/enrollment-status`, student)).body.data.enrolled).toBe(true);
  expect((await call('get', '/enrollments/me', student)).body.data).toHaveLength(1);
  expect((await call('get', `/courses/${courseId}/lessons/${lessonId}`, student)).body.data.content).toBe('Protected content');
});
test('comments require enrollment and only owner can edit/delete', async () => {
  expect((await call('post', `/lessons/${lessonId}/comments`, otherStudent, { text: 'No access' })).status).toBe(403);
  const created = await call('post', `/lessons/${lessonId}/comments`, student, { text: 'Helpful' });
  expect(created.status).toBe(201); commentId = created.body.data._id;
  expect(created.body.data.user.name).toBeDefined();
  expect((await call('patch', `/comments/${commentId}`, otherStudent, { text: 'Stolen' })).status).toBe(403);
  expect((await call('delete', `/comments/${commentId}`, otherStudent)).status).toBe(403);
  expect((await call('patch', `/comments/${commentId}`, student, { text: 'Updated' })).status).toBe(200);
  expect((await call('get', `/lessons/${lessonId}/comments?page=1&limit=1`, student)).body.pagination.totalItems).toBe(1);
});
test('ratings require enrollment; uniqueness, bounds and aggregates update', async () => {
  expect((await call('post', `/courses/${courseId}/ratings`, otherStudent, { value: 5 })).status).toBe(403);
  expect((await call('post', `/courses/${courseId}/ratings`, student, { value: 6 })).status).toBe(422);
  expect((await call('post', `/courses/${courseId}/ratings`, student, { value: 5 })).status).toBe(201);
  expect((await call('post', `/courses/${courseId}/ratings`, student, { value: 4 })).status).toBe(409);
  expect((await call('get', `/courses/${courseId}`)).body.data.averageRating).toBe(5);
  expect((await call('patch', `/courses/${courseId}/ratings/me`, student, { value: 3 })).status).toBe(200);
  expect((await call('get', `/courses/${courseId}`)).body.data.averageRating).toBe(3);
  expect((await call('delete', `/courses/${courseId}/ratings/me`, student)).status).toBe(204);
  const course = await call('get', `/courses/${courseId}`);
  expect(course.body.data.averageRating).toBe(0); expect(course.body.data.ratingsCount).toBe(0);
});
test('completion is idempotent, reversible, and restricted to enrolled students', async () => {
  expect((await call('patch', `/lessons/${lessonId}/progress`, otherStudent, { completed: true })).status).toBe(403);
  const result = await call('patch', `/lessons/${lessonId}/progress`, student, { completed: true });
  expect(result.status).toBe(200); expect(result.body.data.progressPercentage).toBe(100);
  expect(result.body.data.completedLessonIds).toEqual([lessonId]);
  expect((await call('get', `/courses/${courseId}/progress`, student)).body.data.completedLessonIds).toEqual([lessonId]);
  expect((await call('patch', `/lessons/${lessonId}/progress`, student, { completed: true })).body.data.completedLessons).toBe(1);
  expect((await call('patch', `/lessons/${lessonId}/progress`, student, { completed: false })).body.data.progressPercentage).toBe(0);
  await call('patch', `/lessons/${lessonId}/progress`, student, { completed: true });
  await call('post', `/courses/${courseId}/lessons`, instructor, { title: 'Second', content: 'Second lesson', order: 2 });
  expect((await call('get', `/courses/${courseId}/progress`, student)).body.data.progressPercentage).toBe(50);
});
test('search, filters, pagination, category list, analytics and malicious input', async () => {
  const search = await call('get', '/courses?search=node&category=programming&minPrice=0&maxPrice=20&sort=-averageRating&limit=1');
  expect(search.status).toBe(200); expect(search.body.pagination.totalItems).toBe(1);
  expect((await call('get', '/courses?search=%5B')).status).toBe(200);
  expect((await call('get', '/courses?page=0')).status).toBe(422);
  expect((await call('get', '/courses?minPrice=20&maxPrice=10')).status).toBe(422);
  expect((await call('post', '/auth/login', null, { email: { $ne: '' }, password: 'x' })).status).toBe(400);
  expect((await call('get', '/categories')).body.data).toContain('programming');
  const stats = await call('get', '/instructor/stats', instructor);
  expect(stats.status).toBe(200); expect(stats.body.data.totalEnrollments).toBe(1);
  expect((await call('get', '/instructor/stats', student)).status).toBe(403);
});
test('concurrent ratings produce consistent cached aggregates in a single process', async () => {
  await call('post', `/courses/${courseId}/enroll`, otherStudent);
  const results = await Promise.all([
    call('post', `/courses/${courseId}/ratings`, student, { value: 5 }),
    call('post', `/courses/${courseId}/ratings`, otherStudent, { value: 3 })
  ]);
  expect(results.map(r => r.status)).toEqual([201, 201]);
  const course = await call('get', `/courses/${courseId}`);
  expect(course.body.data.averageRating).toBe(4); expect(course.body.data.ratingsCount).toBe(2);
  await call('delete', `/courses/${courseId}/ratings/me`, student);
  await call('delete', `/courses/${courseId}/ratings/me`, otherStudent);
});
test('draft courses are owner only; public preview exposes only preview content', async () => {
  const draft = await call('post', '/courses', instructor, { title: 'Draft', description: 'Hidden', category: 'design' });
  const id = draft.body.data._id;
  expect((await call('get', `/courses/${id}`)).status).toBe(404);
  expect((await call('get', `/courses/${id}`, otherInstructor)).status).toBe(404);
  expect((await call('get', `/courses/${id}`, instructor)).status).toBe(200);
  expect((await call('post', `/courses/${id}/enroll`, student)).status).toBe(404);
  await call('post', `/courses/${courseId}/lessons`, instructor, { title: 'Preview', content: 'Free preview', order: 3, isPreview: true });
  const list = await call('get', `/courses/${courseId}/lessons`);
  expect(list.body.data.find(l => l.isPreview).content).toBe('Free preview');
  expect((await call('get', `/courses/${id}/lessons/${lessonId}`, instructor)).status).toBe(404);
});
test('Swagger, health, JSON parse errors and unknown routes are consistent', async () => {
  expect((await request(app).get('/health')).status).toBe(200);
  expect((await request(app).get('/api-docs/')).status).toBe(200);
  const docs = await request(app).get('/api-docs.json');
  expect(docs.body.openapi).toBe('3.0.3'); expect(Object.keys(docs.body.paths).length).toBeGreaterThan(15);
  const invalid = await request(app).post('/api/v1/auth/login').set('Content-Type', 'application/json').send('{');
  expect(invalid.status).toBe(400); expect(invalid.body.success).toBe(false);
  expect((await call('get', '/missing')).status).toBe(404);
});
test('unenrollment clears progress and rating; deletion cascades related records', async () => {
  await call('post', `/courses/${courseId}/ratings`, student, { value: 5 });
  expect((await call('delete', `/courses/${courseId}/enroll`, student)).status).toBe(204);
  expect((await call('get', `/courses/${courseId}/progress`, student)).status).toBe(403);
  expect((await call('get', `/courses/${courseId}`)).body.data.ratingsCount).toBe(0);
  await call('post', `/courses/${courseId}/enroll`, student);
  expect((await call('get', `/courses/${courseId}/progress`, student)).body.data.completedLessons).toBe(0);
  expect((await call('delete', `/courses/${courseId}`, instructor)).status).toBe(204);
  expect((await call('get', `/courses/${courseId}`)).status).toBe(404);
  expect(await mongoose.model('Lesson').countDocuments({ course: courseId })).toBe(0);
  expect(await mongoose.model('Enrollment').countDocuments({ course: courseId })).toBe(0);
  expect(await mongoose.model('Comment').countDocuments({ lesson: lessonId })).toBe(0);
});

```
