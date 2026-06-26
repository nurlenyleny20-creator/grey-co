import { createFileRoute, Navigate, notFound } from "@tanstack/react-router";
import { Check, Clock, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useAppState, formatMoney } from "@/lib/store";

export const Route = createFileRoute("/transactions/$id")({
  head: () => ({ meta: [{ title: "Transaction — Lumen" }] }),
  component: TxDetail,
  ssr: false,
});

function TxDetail() {
  const { id } = Route.useParams();
  const user = useAppState((s) => s.user);
  const tx = useAppState((s) => s.transactions.find((t) => t.id === id));
  if (!user) return <Navigate to="/auth" replace />;
  if (!tx) throw notFound();

  const positive = tx.type === "receive" || tx.type === "topup";
  const StatusIcon = tx.status === "completed" ? Check : tx.status === "pending" ? Clock : X;

  return (
    <AppShell>
      <PageHeader title="Transaction" back="/transactions" />
      <div className="px-5 pt-6">
        <div className="flex flex-col items-center text-center">
          <div
            className={
              "grid h-16 w-16 place-items-center rounded-full " +
              (positive ? "bg-success/15 text-success" : "bg-muted text-foreground")
            }
          >
            <StatusIcon className="h-7 w-7" strokeWidth={2.4} />
          </div>
          <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
            {tx.type === "send"
              ? "Sent to"
              : tx.type === "receive"
                ? "Received from"
                : tx.type === "topup"
                  ? "Top up"
                  : "Converted"}
          </p>
          <h1 className="mt-1 font-display text-lg font-semibold">{tx.counterparty}</h1>
          <p
            className={
              "mt-3 font-display text-3xl font-semibold tabular-nums " +
              (positive ? "text-success" : "text-foreground")
            }
          >
            {positive ? "+" : "−"}
            {formatMoney(tx.amount, tx.currency)}
          </p>
        </div>

        <dl className="mt-8 divide-y divide-border rounded-2xl border border-border bg-surface text-sm">
          <Row k="Status" v={cap(tx.status)} />
          <Row k="Reference" v={tx.id.slice(0, 12).toUpperCase()} />
          <Row k="Date" v={new Date(tx.date).toLocaleString()} />
          <Row k="Currency" v={tx.currency} />
          {tx.note ? <Row k="Note" v={tx.note} /> : null}
          <Row k="Fee" v="Free" />
        </dl>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <button className="tap-scale rounded-2xl border border-border bg-surface py-3 text-sm font-medium">
            Share receipt
          </button>
          <button className="tap-scale rounded-2xl border border-border bg-surface py-3 text-sm font-medium">
            Report issue
          </button>
        </div>
      </div>
    </AppShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="max-w-[60%] truncate text-right font-medium">{v}</dd>
    </div>
  );
}

function cap(s: string) {
  return s[0]?.toUpperCase() + s.slice(1);
}
