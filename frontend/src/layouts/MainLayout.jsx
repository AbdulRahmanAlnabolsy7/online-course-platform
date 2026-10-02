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
