import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, ArrowUpRight, Repeat } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAppState, formatMoney } from "@/lib/store";

export const Route = createFileRoute("/home")({
  component: Home,
});

function Home() {
  const user = useAppState((s) => s.user);
  const wallets = useAppState((s) => s.wallets);
  const [hidden, setHidden] = useState(false);
  const navigate = useNavigate();

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <AppShell>
      <div className="min-h-screen bg-zinc-50 pb-20">
        {/* Header */}
        <div className="px-5 pt-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold text-lg">
              MS
            </div>
            <div>
              <p className="text-xs text-zinc-500">Welcome back</p>
              <p className="font-semibold text-lg">Muhammad</p>
            </div>
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-3xl flex items-center gap-2 text-sm font-medium">
            ⚡ Earn $5
          </button>
        </div>

        {/* Total Balance */}
        <div className="px-5 mt-8 text-center">
          <div className="flex justify-center items-center gap-2 text-sm text-zinc-500 mb-1">
            🇺🇸 TOTAL BALANCE
          </div>
          <div className="text-7xl font-bold tracking-tighter text-black">
            $0
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center gap-10 mt-10">
          <button onClick={() => navigate({ to: '/wallets' })} className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full border border-zinc-300 flex items-center justify-center mb-2">
              <Plus className="w-6 h-6" />
            </div>
            <p className="text-xs font-medium">Add money</p>
          </button>
          <button onClick={() => navigate({ to: '/send' })} className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full border border-zinc-300 flex items-center justify-center mb-2">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <p className="text-xs font-medium">Send</p>
          </button>
          <button onClick={() => navigate({ to: '/wallets' })} className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full border border-zinc-300 flex items-center justify-center mb-2">
              <Repeat className="w-6 h-6" />
            </div>
            <p className="text-xs font-medium">Convert</p>
          </button>
        </div>

        {/* Currency Cards - Horizontal Scroll */}
<div className="mt-10 px-5">
  <div className="-mx-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] snap-x snap-mandatory flex gap-4">
    {wallets.map((w: any) => (
      <div key={w.currency} className="snap-start bg-white rounded-3xl p-5 w-80 shrink-0 shadow-sm border border-zinc-100">
        <div className="flex items-center gap-4">
          <div className="text-5xl">{w.flag}</div>
          <div>
            <p className="font-semibold text-lg">{w.name}</p>
            <p className="text-sm text-zinc-500">{w.currency}</p>
          </div>
        </div>
        <p className="mt-8 text-3xl font-semibold">
          {formatMoney(w.balance, w.currency)}
        </p>
        <p className="text-xs text-zinc-500 mt-1">{w.currency} Wallet</p>
      </div>
    ))}
  </div>
</div>

        {/* Continue Setup */}
        <div className="mx-5 mt-8 bg-blue-50 rounded-3xl p-6">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">Continue setup</p>
              <p className="text-sm text-zinc-600 mt-1">Use this guide to finish setting up your account</p>
            </div>
            <div className="text-blue-600 text-4xl font-semibold">4/5</div>
          </div>
          <button className="w-full mt-6 bg-blue-600 text-white py-4 rounded-2xl font-semibold">
            Complete setup
          </button>
        </div>          </div>
          <button className="mt-4 w-full bg-blue-600 text-white py-3.5 rounded-2xl font-medium">
            Complete setup
          </button>
        </div>
      </div>
    </AppShell>
  );
}
