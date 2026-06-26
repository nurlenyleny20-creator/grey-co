import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { ChevronRight, Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useAppState, formatMoney, totalInUsd } from "@/lib/store";

export const Route = createFileRoute("/wallets")({
  head: () => ({ meta: [{ title: "Wallets — Lumen" }] }),
  component: Wallets,
  ssr: false,
});

function Wallets() {
  const user = useAppState((s) => s.user);
  const wallets = useAppState((s) => s.wallets);
  if (!user) return <Navigate to="/auth" replace />;
  const total = totalInUsd(wallets);

  return (
    <AppShell>
      <PageHeader title="Wallets" />
      <div className="px-5 pt-4">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs text-muted-foreground">Total value</p>
          <p className="mt-1 font-display text-2xl font-semibold tabular-nums">
            {formatMoney(total, "USD")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Estimated in USD at mid-market rates</p>
        </div>

        <h2 className="mt-6 mb-3 text-sm font-semibold tracking-tight">All currencies</h2>
        <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
          {wallets.map((w) => (
            <li key={w.currency}>
              <Link
                to="/wallets/$currency"
                params={{ currency: w.currency }}
                className="tap-scale flex items-center gap-3 px-4 py-3.5"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-muted text-lg">
                  {w.flag}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{w.name}</p>
                  <p className="text-xs text-muted-foreground">{w.currency}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold tabular-nums">
                    {formatMoney(w.balance, w.currency)}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>

        <button className="tap-scale mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-surface py-3.5 text-sm font-medium text-muted-foreground">
          <Plus className="h-4 w-4" />
          Request a new currency
        </button>
      </div>
    </AppShell>
  );
}
