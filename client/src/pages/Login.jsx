import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Mail, Lock, User, ArrowRight } from "lucide-react";

import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isRegister = mode === "register";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (isRegister && name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }

    if (isRegister && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setSubmitting(true);
      if (isRegister) {
        await register(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-zinc-100">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-zinc-950">
            <Activity size={22} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">GitHealth</h1>
            <p className="text-xs text-zinc-500">Repository intelligence</p>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <h2 className="text-xl font-bold text-white">
            {isRegister ? "Create your account" : "Welcome back"}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            {isRegister
              ? "Your analyses and history stay private to you."
              : "Sign in to see your saved repository history."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {isRegister && (
              <div className="flex items-center rounded-xl border border-zinc-700 bg-zinc-950 px-4 focus-within:border-indigo-500">
                <User size={17} className="mr-3 shrink-0 text-zinc-500" />
                <input
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-zinc-600"
                />
              </div>
            )}

            <div className="flex items-center rounded-xl border border-zinc-700 bg-zinc-950 px-4 focus-within:border-indigo-500">
              <Mail size={17} className="mr-3 shrink-0 text-zinc-500" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-zinc-600"
              />
            </div>

            <div className="flex items-center rounded-xl border border-zinc-700 bg-zinc-950 px-4 focus-within:border-indigo-500">
              <Lock size={17} className="mr-3 shrink-0 text-zinc-500" />
              <input
                type="password"
                required
                autoComplete={isRegister ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isRegister ? "At least 8 characters" : "Password"}
                className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-zinc-600"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2 text-xs text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Please wait…"
                : isRegister
                ? "Create account"
                : "Sign in"}
              {!submitting && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-zinc-500">
            {isRegister ? "Already have an account?" : "New here?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(isRegister ? "login" : "register");
                setError("");
              }}
              className="font-medium text-indigo-400 hover:text-indigo-300"
            >
              {isRegister ? "Sign in" : "Create an account"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
