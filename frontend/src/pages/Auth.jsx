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
