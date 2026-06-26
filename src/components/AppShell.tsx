import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Wallet, ArrowLeftRight, Bell, User } from "lucide-react";
import type { ReactNode } from "react";
import { useAppState } from "@/lib/store";

const nav = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/wallets", label: "Wallets", icon: Wallet },
  { to: "/transactions", label: "Activity", icon: ArrowLeftRight },
  { to: "/notifications", label: "Alerts", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const unread = useAppState((s) => s.notifications.filter((n) => !n.read).length);

  return (
    <div className="min-h-dvh bg-background text-foreground flex flex-col">
      <main className="flex-1 pb-24">{children}</main>
      <nav
        aria-label="Primary"
        className="glass fixed inset-x-0 bottom-0 z-40 border-t border-border/60 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      >
        <ul className="mx-auto flex max-w-md items-stretch justify-between">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || pathname.startsWith(to + "/");
            return (
              <li key={to} className="flex-1">
                <Link
                  to={to}
                  className="tap-scale relative flex flex-col items-center gap-1 rounded-xl py-2"
                  aria-current={active ? "page" : undefined}
                >
                  <span
                    className={
                      "relative grid h-9 w-9 place-items-center rounded-xl transition-colors " +
                      (active ? "bg-primary text-primary-foreground" : "text-muted-foreground")
                    }
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
                    {to === "/notifications" && unread > 0 ? (
                      <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                        {unread > 9 ? "9+" : unread}
                      </span>
                    ) : null}
                  </span>
                  <span
                    className={
                      "text-[10.5px] font-medium tracking-wide " +
                      (active ? "text-foreground" : "text-muted-foreground")
                    }
                  >
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
