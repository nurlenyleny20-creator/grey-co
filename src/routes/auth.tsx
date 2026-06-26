import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, User, Globe } from "lucide-react";
import { actions } from "@/lib/store";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Lumen" },
      { name: "description", content: "Sign in or create your Lumen account." },
    ],
  }),
  component: AuthPage,
  ssr: false,
});

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "At least 6 characters").max(128),
});

const signUpSchema = signInSchema.extend({
  fullName: z.string().trim().min(2, "Enter your name").max(80),
  country: z.string().min(2).max(40),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      if (mode === "signup") {
        const data = signUpSchema.parse({
          fullName: fd.get("fullName"),
          email: fd.get("email"),
          password: fd.get("password"),
          country: fd.get("country") || "US",
        });
        actions.signUp({ fullName: data.fullName, email: data.email, country: data.country });
      } else {
        const data = signInSchema.parse({
          email: fd.get("email"),
          password: fd.get("password"),
        });
        actions.signIn(data.email);
      }
      setTimeout(() => navigate({ to: "/home" }), 400);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0]?.message ?? "Check your details");
      } else {
        setError("Something went wrong");
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex items-center justify-between px-6 pt-6">
        <Logo />
      </header>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pt-8">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Sign in to access your Lumen wallets."
            : "Takes under a minute. No card required."}
        </p>

        <div className="mt-6 grid grid-cols-2 rounded-2xl bg-muted p-1 text-sm">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setError(null);
              }}
              className={
                "tap-scale rounded-xl py-2.5 font-medium transition-colors " +
                (mode === m
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-muted-foreground")
              }
            >
              {m === "signin" ? "Sign in" : "Sign up"}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          {mode === "signup" && (
            <Field icon={User} name="fullName" placeholder="Full name" autoComplete="name" />
          )}
          <Field
            icon={Mail}
            name="email"
            placeholder="you@example.com"
            type="email"
            autoComplete="email"
          />
          <Field
            icon={Lock}
            name="password"
            placeholder="Password"
            type={showPw ? "text" : "password"}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            trailing={
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="text-muted-foreground"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          {mode === "signup" && (
            <Field icon={Globe} name="country" placeholder="Country (e.g. ID)" defaultValue="ID" />
          )}

          {error ? (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
          ) : null}

          {mode === "signin" && (
            <button type="button" className="block text-sm text-primary hover:underline">
              Forgot password?
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="tap-scale mt-2 w-full rounded-2xl bg-primary py-4 font-semibold text-primary-foreground shadow-[var(--shadow-card)] disabled:opacity-60"
          >
            {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          OR
          <span className="h-px flex-1 bg-border" />
        </div>

        <button
          type="button"
          onClick={() => {
            actions.signIn("guest@lumen.app");
            navigate({ to: "/home" });
          }}
          className="tap-scale flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-surface py-3.5 text-sm font-medium"
        >
          Continue as guest
        </button>

        <p className="mt-auto py-8 text-center text-xs text-muted-foreground">
          By continuing you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  trailing,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ComponentType<{ className?: string }>;
  trailing?: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3.5 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <input
        {...rest}
        required
        className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
      />
      {trailing}
    </label>
  );
}
