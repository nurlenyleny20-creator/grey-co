import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Repeat,
  Plus,
  Eye,
  EyeOff,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAppState, formatMoney, totalInUsd, type CurrencyCode } from "@/lib/store";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [{ title: "Home — Lumen" }],
  }),
  component: Home,
  ssr: false,
});

function Home() {
  const user = useAppState((s) => s.user);
  const wallets = useAppState((s) => s.wallets);
  const txs = useAppState((s) => s.transactions);
  const [hidden, setHidden] = useState(false);
  const navigate = useNavigate();

  if (!user) return <Navigate to="/auth" replace />;

  const total = totalInUsd(wallets);
  const recent = txs.slice(0, 4);

  return (
    <AppShell>
      <div className="px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
        {/* Greeting */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back</p>
            <h1 className="font-display text-xl font-semibold tracking-tight">
              {user.fullName.split(" ")[0]}
            </h1>
          </div>
          <Link
            to="/profile"
            className="tap-scale grid h-11 w-11 place-items-center rounded-full bg-primary text-base font-semibold text-primary-foreground"
          >
            {user.fullName.charAt(0).toUpperCase()}
          </Link>
        </div>

        {/* Balance card */}
        <div className="mt-5 overflow-hidden rounded-3xl bg-[var(--gradient-card-dark)] p-5 text-white shadow-[var(--shadow-float)]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/60">Total balance · USD</p>
            <button
              onClick={() => setHidden((v) => !v)}
              className="tap-scale grid h-8 w-8 place-items-center rounded-full bg-white/10"
              aria-label={hidden ? "Show balance" : "Hide balance"}
            >
              {hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="mt-2 font-display text-[34px] font-semibold tracking-tight tabular-nums">
            {hidden ? "••••••" : formatMoney(total, "USD")}
          </p>
          <p className="mt-1 text-xs text-white/50">
            Across {wallets.length} currencies · Rates updated just now
          </p>

          <div className="mt-5 grid grid-cols-4 gap-2">
            {[
              { label: "Send", icon: ArrowUpRight, to: "/send" as const },
              { label: "Receive", icon: ArrowDownLeft, to: "/wallets" as const },
              { label: "Convert", icon: Repeat, to: "/send" as const },
              { label: "Top up", icon: Plus, to: "/wallets" as const },
            ].map(({ label, icon: Icon, to }) => (
              <button
                key={label}
                onClick={() => navigate({ to })}
                className="tap-scale flex flex-col items-center gap-1.5 rounded-2xl bg-white/10 py-3 text-xs font-medium"
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* KYC banner */}
        {!user.kycVerified && (
          <Link
            to="/settings"
            className="tap-scale mt-4 flex items-center gap-3 rounded-2xl border border-warning/30 bg-warning/10 p-3.5"
          >
            <ShieldAlert className="h-5 w-5 text-warning-foreground" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Verify your identity</p>
              <p className="truncate text-xs text-muted-foreground">
                Unlock higher limits and international transfers.
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        )}

        {/* Wallets row */}
        <section className="mt-6">
          <header className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-tight">Your wallets</h2>
            <Link to="/wallets" className="text-xs text-primary">
              See all
            </Link>
          </header>
          <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-3">
              {wallets.map((w) => (
                <Link
                  key={w.currency}
                  to="/wallets/$currency"
                  params={{ currency: w.currency }}
                  className="tap-scale flex w-40 shrink-0 flex-col rounded-2xl border border-border bg-surface p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{w.flag}</span>
                    <span className="text-[10px] font-semibold tracking-wider text-muted-foreground">
                      {w.currency}
                    </span>
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">{w.name}</p>
                  <p className="mt-0.5 font-display text-base font-semibold tabular-nums">
                    {hidden ? "••••" : formatMoney(w.balance, w.currency as CurrencyCode)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Recent activity */}
        <section className="mt-6">
          <header className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-tight">Recent activity</h2>
            <Link to="/transactions" className="text-xs text-primary">
              See all
            </Link>
          </header>

          {recent.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center">
              <p className="text-sm font-medium">No activity yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Your transfers and conversions will show up here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
              {recent.map((tx) => (
                <li key={tx.id}>
                  <Link
                    to="/transactions/$id"
                    params={{ id: tx.id }}
                    className="tap-scale flex items-center gap-3 px-4 py-3"
                  >
                    <TxIcon type={tx.type} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{tx.counterparty}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        · {labelFor(tx.type)}
                      </p>
                    </div>
                    <p
                      className={
                        "text-sm font-semibold tabular-nums " +
                        (tx.type === "receive" || tx.type === "topup"
                          ? "text-success"
                          : "text-foreground")
                      }
                    >
                      {tx.type === "receive" || tx.type === "topup" ? "+" : "−"}
                      {formatMoney(tx.amount, tx.currency)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AppShell>
  );
}

function labelFor(t: string) {
  return t === "send" ? "Sent" : t === "receive" ? "Received" : t === "topup" ? "Top up" : "Converted";
}

function TxIcon({ type }: { type: string }) {
  const map: Record<string, { Icon: typeof ArrowUpRight; bg: string }> = {
    send: { Icon: ArrowUpRight, bg: "bg-rose-500/10 text-rose-500" },
    receive: { Icon: ArrowDownLeft, bg: "bg-emerald-500/10 text-emerald-500" },
    convert: { Icon: Repeat, bg: "bg-sky-500/10 text-sky-500" },
    topup: { Icon: Plus, bg: "bg-amber-500/10 text-amber-500" },
  };
  const { Icon, bg } = map[type] ?? map.send;
  return (
    <span className={"grid h-10 w-10 place-items-center rounded-full " + bg}>
      <Icon className="h-4 w-4" />
    </span>
  );
}
