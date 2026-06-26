import { createFileRoute, Link, Navigate, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, ArrowDownLeft, Plus, Copy, Check } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useAppState, formatMoney, actions, type CurrencyCode } from "@/lib/store";

export const Route = createFileRoute("/wallets/$currency")({
  head: ({ params }) => ({ meta: [{ title: `${params.currency} wallet — Lumen` }] }),
  component: WalletDetail,
  ssr: false,
});

function WalletDetail() {
  const { currency } = Route.useParams();
  const user = useAppState((s) => s.user);
  const wallet = useAppState((s) =>
    s.wallets.find((w) => w.currency === (currency as CurrencyCode)),
  );
  const txs = useAppState((s) =>
    s.transactions.filter((t) => t.currency === (currency as CurrencyCode)),
  );
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  if (!user) return <Navigate to="/auth" replace />;
  if (!wallet) throw notFound();

  const iban = `LUMEN ${currency} 0142 ${user.id.slice(0, 4).toUpperCase()} ${user.id.slice(-4).toUpperCase()}`;

  const copy = () => {
    navigator.clipboard?.writeText(iban);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <AppShell>
      <PageHeader title={`${wallet.name}`} back="/wallets" />
      <div className="px-5 pt-4">
        <div className="overflow-hidden rounded-3xl bg-[var(--gradient-card-dark)] p-5 text-white">
          <div className="flex items-center justify-between">
            <span className="text-3xl">{wallet.flag}</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wider">
              {wallet.currency}
            </span>
          </div>
          <p className="mt-5 text-xs text-white/60">Available balance</p>
          <p className="font-display text-3xl font-semibold tabular-nums">
            {formatMoney(wallet.balance, wallet.currency)}
          </p>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <ActionTile
              icon={ArrowUpRight}
              label="Send"
              onClick={() => navigate({ to: "/send", search: { from: wallet.currency } })}
            />
            <ActionTile
              icon={Plus}
              label="Top up"
              onClick={() => {
                const amt = Number(prompt(`Top up amount (${wallet.currency})`, "100"));
                if (amt > 0) actions.topup(wallet.currency, amt);
              }}
            />
            <ActionTile
              icon={ArrowDownLeft}
              label="Receive"
              onClick={copy}
            />
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs text-muted-foreground">Account number</p>
          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="truncate font-mono text-sm">{iban}</p>
            <button
              onClick={copy}
              className="tap-scale grid h-9 w-9 place-items-center rounded-lg bg-muted"
              aria-label="Copy account number"
            >
              {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <h2 className="mt-6 mb-3 text-sm font-semibold tracking-tight">Activity</h2>
        {txs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="text-sm font-medium">No transactions yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Top up or send to start using this wallet.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
            {txs.map((tx) => (
              <li key={tx.id}>
                <Link
                  to="/transactions/$id"
                  params={{ id: tx.id }}
                  className="tap-scale flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{tx.counterparty}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.date).toLocaleDateString()} · {tx.type}
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
      </div>
    </AppShell>
  );
}

function ActionTile({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="tap-scale flex flex-col items-center gap-1.5 rounded-2xl bg-white/10 py-3 text-xs font-medium text-white"
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
