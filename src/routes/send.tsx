import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ChevronDown, Check } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import {
  useAppState,
  actions,
  formatMoney,
  convert,
  type CurrencyCode,
} from "@/lib/store";

type Search = { from?: CurrencyCode };

export const Route = createFileRoute("/send")({
  head: () => ({ meta: [{ title: "Send money — Lumen" }] }),
  validateSearch: (s: Record<string, unknown>): Search => ({
    from: typeof s.from === "string" ? (s.from as CurrencyCode) : undefined,
  }),
  component: Send,
  ssr: false,
});

const schema = z.object({
  amount: z.number().positive("Enter an amount"),
  recipient: z.string().trim().min(2, "Recipient required").max(80),
  note: z.string().trim().max(120).optional(),
});

function Send() {
  const user = useAppState((s) => s.user);
  const wallets = useAppState((s) => s.wallets);
  const { from } = Route.useSearch();
  const navigate = useNavigate();
  const [fromCcy, setFromCcy] = useState<CurrencyCode>(from ?? "USD");
  const [toCcy, setToCcy] = useState<CurrencyCode>("EUR");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "review" | "success">("form");

  if (!user) return <Navigate to="/auth" replace />;

  const numAmount = Number(amount) || 0;
  const wallet = wallets.find((w) => w.currency === fromCcy)!;
  const converted = convert(numAmount, fromCcy, toCcy);

  const submit = () => {
    setError(null);
    try {
      schema.parse({ amount: numAmount, recipient, note: note || undefined });
      if (wallet.balance < numAmount) {
        setError("Insufficient balance in this wallet");
        return;
      }
      setStep("review");
    } catch (e) {
      if (e instanceof z.ZodError) setError(e.issues[0]?.message ?? "Check the form");
    }
  };

  const confirm = () => {
    try {
      actions.send({ from: fromCcy, amount: numAmount, to: recipient, note });
      setStep("success");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
      setStep("form");
    }
  };

  if (step === "success") {
    return (
      <AppShell>
        <PageHeader title="Sent" />
        <div className="flex flex-col items-center px-6 pt-12 text-center">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-success/15 text-success animate-in zoom-in-50 duration-300">
            <Check className="h-10 w-10" strokeWidth={2.5} />
          </div>
          <h2 className="mt-5 font-display text-2xl font-semibold tracking-tight">Transfer sent</h2>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
            {formatMoney(numAmount, fromCcy)} is on its way to {recipient}.
          </p>
          <div className="mt-8 grid w-full max-w-sm gap-2">
            <button
              onClick={() => navigate({ to: "/transactions" })}
              className="tap-scale rounded-2xl bg-primary py-3.5 font-semibold text-primary-foreground"
            >
              View activity
            </button>
            <button
              onClick={() => navigate({ to: "/home" })}
              className="tap-scale rounded-2xl border border-border bg-surface py-3.5 text-sm font-medium"
            >
              Back home
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  if (step === "review") {
    return (
      <AppShell>
        <PageHeader title="Review" back="/send" />
        <div className="px-5 pt-4">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs text-muted-foreground">You're sending</p>
            <p className="mt-1 font-display text-3xl font-semibold tabular-nums">
              {formatMoney(numAmount, fromCcy)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              ≈ {formatMoney(converted, toCcy)} at mid-market rate
            </p>
          </div>
          <dl className="mt-4 divide-y divide-border rounded-2xl border border-border bg-surface text-sm">
            <Row k="Recipient" v={recipient} />
            <Row k="From" v={`${wallet.flag}  ${wallet.name}`} />
            <Row k="Arrives in" v={toCcy} />
            <Row k="Fee" v="Free" />
            {note ? <Row k="Note" v={note} /> : null}
          </dl>
          <button
            onClick={confirm}
            className="tap-scale mt-6 w-full rounded-2xl bg-primary py-4 font-semibold text-primary-foreground"
          >
            Confirm and send
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader title="Send" back="/home" />
      <div className="px-5 pt-4">
        <div className="rounded-3xl border border-border bg-surface p-5">
          <p className="text-xs text-muted-foreground">You send</p>
          <div className="mt-1 flex items-end justify-between gap-3">
            <input
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="min-w-0 flex-1 bg-transparent font-display text-4xl font-semibold tabular-nums outline-none placeholder:text-muted-foreground/40"
            />
            <CurrencyChip ccy={fromCcy} onChange={setFromCcy} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Available {formatMoney(wallet.balance, fromCcy)}
          </p>

          <div className="my-4 border-t border-dashed border-border" />

          <p className="text-xs text-muted-foreground">Recipient gets</p>
          <div className="mt-1 flex items-end justify-between gap-3">
            <p className="min-w-0 flex-1 truncate font-display text-2xl font-semibold tabular-nums text-muted-foreground">
              {numAmount ? formatMoney(converted, toCcy) : "—"}
            </p>
            <CurrencyChip ccy={toCcy} onChange={setToCcy} />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <label className="flex flex-col gap-1.5 rounded-2xl border border-border bg-surface px-4 py-3">
            <span className="text-xs font-medium text-muted-foreground">Recipient</span>
            <input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Name, @lumen tag, or account"
              className="bg-transparent text-[15px] outline-none"
              maxLength={80}
            />
          </label>
          <label className="flex flex-col gap-1.5 rounded-2xl border border-border bg-surface px-4 py-3">
            <span className="text-xs font-medium text-muted-foreground">Note (optional)</span>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's this for?"
              className="bg-transparent text-[15px] outline-none"
              maxLength={120}
            />
          </label>
        </div>

        {error && (
          <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <button
          onClick={submit}
          className="tap-scale mt-5 w-full rounded-2xl bg-primary py-4 font-semibold text-primary-foreground"
        >
          Review transfer
        </button>
      </div>
    </AppShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-medium">{v}</dd>
    </div>
  );
}

function CurrencyChip({
  ccy,
  onChange,
}: {
  ccy: CurrencyCode;
  onChange: (c: CurrencyCode) => void;
}) {
  return (
    <div className="relative">
      <select
        value={ccy}
        onChange={(e) => onChange(e.target.value as CurrencyCode)}
        className="appearance-none rounded-full bg-muted py-2 pl-3 pr-8 text-sm font-semibold outline-none"
      >
        {(["USD", "EUR", "GBP", "NGN", "IDR"] as CurrencyCode[]).map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
