import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import {
  ShieldCheck,
  Settings as SettingsIcon,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  Star,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useAppState, actions } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Lumen" }] }),
  component: Profile,
  ssr: false,
});

function Profile() {
  const user = useAppState((s) => s.user);
  const navigate = useNavigate();
  if (!user) return <Navigate to="/auth" replace />;

  const initials = user.fullName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <AppShell>
      <PageHeader title="Profile" />
      <div className="px-5 pt-4">
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{user.fullName}</p>
            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
          </div>
          <span
            className={
              "rounded-full px-2.5 py-1 text-[10px] font-semibold " +
              (user.kycVerified
                ? "bg-success/15 text-success"
                : "bg-warning/15 text-warning-foreground")
            }
          >
            {user.kycVerified ? "VERIFIED" : "UNVERIFIED"}
          </span>
        </div>

        <Section title="Account">
          <Row
            icon={ShieldCheck}
            label="Identity verification"
            sub={user.kycVerified ? "Verified" : "Complete to unlock limits"}
            to="/settings"
          />
          <Row icon={Star} label="Referrals" sub="Invite friends, earn credit" to="/settings" />
          <Row icon={SettingsIcon} label="Settings" to="/settings" />
        </Section>

        <Section title="Support">
          <Row icon={HelpCircle} label="Help center" to="/settings" />
          <Row icon={FileText} label="Legal & policies" to="/settings" />
        </Section>

        <button
          onClick={() => {
            actions.signOut();
            navigate({ to: "/auth" });
          }}
          className="tap-scale mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-surface py-3.5 text-sm font-medium text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">Lumen v1.0.0</p>
      </div>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
      <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">{children}</ul>
    </section>
  );
}

function Row({
  icon: Icon,
  label,
  sub,
  to,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  sub?: string;
  to: "/settings";
}) {
  return (
    <li>
      <Link to={to} className="tap-scale flex items-center gap-3 px-4 py-3.5">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-muted">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{label}</p>
          {sub ? <p className="truncate text-xs text-muted-foreground">{sub}</p> : null}
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>
    </li>
  );
}
