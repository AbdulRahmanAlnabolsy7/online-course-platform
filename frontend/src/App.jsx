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
