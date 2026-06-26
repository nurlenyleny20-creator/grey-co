import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Repeat, Plus, Search } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useAppState, formatMoney } from "@/lib/store";

export const Route = createFileRoute("/transactions")({
  head: () => ({ meta: [{ title: "Activity — Lumen" }] }),
  component: Transactions,
  ssr: false,
});

const filters = ["All", "Sent", "Received", "Converted", "Top up"] as const;

function Transactions() {
  const user = useAppState((s) => s.user);
  const txs = useAppState((s) => s.transactions);
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [query, setQuery] = useState("");

  if (!user) return <Navigate to="/auth" replace />;

  const filtered = useMemo(() => {
    const map: Record<string, string> = {
      Sent: "send",
      Received: "receive",
      Converted: "convert",
      "Top up": "topup",
    };
    return txs.filter((t) => {
      if (filter !== "All" && t.type !== map[filter]) return false;
      if (query && !t.counterparty.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [txs, filter, query]);

  const grouped = useMemo(() => {
    const groups: Record<string, typeof filtered> = {};
    for (const tx of filtered) {
      const d = new Date(tx.date);
      const key = d.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      (groups[key] ??= []).push(tx);
    }
    return groups;
  }, [filtered]);

  return (
    <AppShell>
      <PageHeader title="Activity" />
      <div className="px-5 pt-3">
        <label className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search transactions"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </label>

        <div className="-mx-5 mt-4 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={
                  "tap-scale shrink-0 rounded-full px-4 py-2 text-xs font-medium transition " +
                  (filter === f
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-surface text-foreground")
                }
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center">
            <p className="text-sm font-medium">No transactions found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try a different filter or make your first transfer.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-5">
            {Object.entries(grouped).map(([date, items]) => (
              <section key={date}>
                <h2 className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  {date}
                </h2>
                <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
                  {items.map((tx) => (
                    <li key={tx.id}>
                      <Link
                        to="/transactions/$id"
                        params={{ id: tx.id }}
                        className="tap-scale flex items-center gap-3 px-4 py-3"
                      >
                        <TxIcon type={tx.type} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{tx.counterparty}</p>
                          <p className="text-xs capitalize text-muted-foreground">{tx.status}</p>
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
              </section>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
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
