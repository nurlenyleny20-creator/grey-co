import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useAppState, actions } from "@/lib/store";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Lumen" }] }),
  component: Settings,
  ssr: false,
});

function Settings() {
  const user = useAppState((s) => s.user);
  const settings = useAppState((s) => s.settings);
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <AppShell>
      <PageHeader title="Settings" back="/profile" />
      <div className="px-5 pt-4">
        <Section title="Security">
          <Toggle
            label="Biometric sign-in"
            sub="Face ID or fingerprint when supported"
            value={settings.biometric}
            onChange={(v) => actions.updateSettings({ biometric: v })}
          />
          <RowLink label="Change password" />
          <RowLink label="Trusted devices" />
        </Section>

        <Section title="Notifications">
          <Toggle
            label="Push notifications"
            value={settings.pushEnabled}
            onChange={(v) => actions.updateSettings({ pushEnabled: v })}
          />
          <Toggle
            label="Product email updates"
            value={settings.emailUpdates}
            onChange={(v) => actions.updateSettings({ emailUpdates: v })}
          />
        </Section>

        <Section title="Preferences">
          <SelectRow
            label="Language"
            value={settings.language}
            options={[
              { v: "en", l: "English" },
              { v: "id", l: "Bahasa Indonesia" },
            ]}
            onChange={(v) => actions.updateSettings({ language: v as "en" | "id" })}
          />
          <SelectRow
            label="Theme"
            value={settings.theme}
            options={[
              { v: "system", l: "System" },
              { v: "light", l: "Light" },
              { v: "dark", l: "Dark" },
            ]}
            onChange={(v) => actions.updateSettings({ theme: v as "system" | "light" | "dark" })}
          />
        </Section>

        <Section title="Identity verification">
          <div className="px-4 py-4">
            <p className="text-sm">
              {user.kycVerified
                ? "Your identity has been verified."
                : "Verify your government ID to lift sending limits and unlock international transfers."}
            </p>
            {!user.kycVerified && (
              <button
                onClick={() => actions.updateProfile({ kycVerified: true })}
                className="tap-scale mt-3 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Start verification
              </button>
            )}
          </div>
        </Section>

        <Section title="Legal">
          <RowLink label="Terms of service" />
          <RowLink label="Privacy policy" />
          <RowLink label="Data safety" />
        </Section>

        <button
          onClick={() => {
            if (confirm("Reset demo data?")) actions.reset();
          }}
          className="tap-scale mt-6 w-full rounded-2xl border border-border bg-surface py-3 text-xs text-muted-foreground"
        >
          Reset demo data
        </button>
      </div>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
      <div className="divide-y divide-border rounded-2xl border border-border bg-surface">{children}</div>
    </section>
  );
}

function Toggle({
  label,
  sub,
  value,
  onChange,
}: {
  label: string;
  sub?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{label}</p>
        {sub ? <p className="text-xs text-muted-foreground">{sub}</p> : null}
      </div>
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={
          "relative h-6 w-10 shrink-0 rounded-full transition-colors " +
          (value ? "bg-primary" : "bg-muted-foreground/30")
        }
      >
        <span
          className={
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all " +
            (value ? "left-[18px]" : "left-0.5")
          }
        />
      </button>
    </div>
  );
}

function SelectRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { v: string; l: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <p className="text-sm font-medium">{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg bg-muted px-3 py-1.5 text-sm outline-none"
      >
        {options.map((o) => (
          <option key={o.v} value={o.v}>
            {o.l}
          </option>
        ))}
      </select>
    </div>
  );
}

function RowLink({ label }: { label: string }) {
  return (
    <button className="tap-scale flex w-full items-center justify-between px-4 py-3.5 text-left">
      <span className="text-sm font-medium">{label}</span>
      <span className="text-xs text-muted-foreground">›</span>
    </button>
  );
}
