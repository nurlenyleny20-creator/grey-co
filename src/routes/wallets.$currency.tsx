import { createFileRoute, Link, Navigate, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, ArrowDownLeft, Plus, Copy, Check } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAppState, formatMoney, actions, type CurrencyCode } from "@/lib/store";

export const Route = createFileRoute("/wallets/$currency")({
  head: ({ params }) => ({ meta: [{ title: `${params.currency} wallet — Grey` }] }),
  component: WalletDetail,
  ssr: false,
});

function WalletDetail() {
  const { currency } = Route.useParams();
  const user = useAppState((s) => s.user);
  const wallet = useAppState((s) =>
    s.wallets.find((w) => w.currency === (currency as CurrencyCode)),
  );
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  if (!user) return <Navigate to="/auth" replace />;
  if (!wallet) throw notFound();

  const iban = `LUMEN ${currency} 0142 ${user.id.slice(0, 4).toUpperCase()} ${user.id.slice(-4).toUpperCase()}`;

  const copy = () => {
    navigator.clipboard?.writeText(iban);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-zinc-50">
        {/* Header */}
        <div className="px-5 pt-12 flex items-center justify-between">
          <button onClick={() => window.history.back()} className="text-3xl">←</button>
          <div className="text-xl font-semibold">USD Balance</div>
          <div className="text-2xl">⋯</div>
        </div>

        {/* Flag & Balance */}
        <div className="px-5 mt-8">
          <div className="flex items-center gap-4">
            <div className="text-7xl">🇺🇸</div>
            <div>
              <p className="text-sm text-zinc-500">YOUR USD BALANCE</p>
              <p className="text-6xl font-bold">$0</p>
            </div>
          </div>
        </div>

        {/* Send & Convert */}
        <div className="px-5 mt-8 flex gap-4">
          <button onClick={() => navigate({ to: "/send" })} className="flex-1 border border-zinc-300 py-4 rounded-full text-sm font-medium">Send</button>
          <button className="flex-1 border border-zinc-300 py-4 rounded-full text-sm font-medium">Convert</button>
        </div>

        {/* Receive USD */}
        <div className="mx-5 mt-10">
          <p className="font-semibold">Receive USD</p>
          <p className="text-sm text-zinc-500">Easily accept payments via bank transfer</p>
          <button className="mt-4 bg-blue-100 text-blue-600 px-6 py-3 rounded-2xl flex items-center gap-2 w-full justify-center">
            🏦 Bank Transfer
          </button>
        </div>

        {/* Account Details */}
        <div className="mx-5 mt-8 bg-white rounded-3xl p-6 space-y-6">
          <div>
            <p className="text-sm text-zinc-500">Account holder</p>
            <p className="font-medium">MUHAMMAD RUDI SIAGIAN</p>
          </div>
          <div>
            <p className="text-sm text-zinc-500">Account number</p>
            <p className="font-mono text-lg">216774698486</p>
          </div>
          <div>
            <p className="text-sm text-zinc-500">Wire routing</p>
            <p className="font-mono">101019644</p>
          </div>
          <div>
            <p className="text-sm text-zinc-500">ACH Routing</p>
            <p className="font-mono">101019644</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
      }
