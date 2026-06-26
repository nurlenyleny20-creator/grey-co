import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Bell, BellOff } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useAppState, actions } from "@/lib/store";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Lumen" }] }),
  component: Notifications,
  ssr: false,
});

function Notifications() {
  const user = useAppState((s) => s.user);
  const items = useAppState((s) => s.notifications);
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <AppShell>
      <PageHeader
        title="Notifications"
        right={
          items.some((n) => !n.read) ? (
            <button
              onClick={() => actions.markAllRead()}
              className="text-xs font-medium text-primary"
            >
              Mark all read
            </button>
          ) : undefined
        }
      />
      <div className="px-5 pt-4">
        {items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-muted">
              <BellOff className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="mt-4 font-medium">You're all caught up</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Alerts about your money will appear here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
            {items.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => actions.markNotificationRead(n.id)}
                  className="tap-scale flex w-full items-start gap-3 px-4 py-4 text-left"
                >
                  <span
                    className={
                      "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full " +
                      (n.read ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary")
                    }
                  >
                    <Bell className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold">{n.title}</p>
                      {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {new Date(n.date).toLocaleString()}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
