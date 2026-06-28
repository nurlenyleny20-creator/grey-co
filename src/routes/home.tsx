import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
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
  const navigate = useNavigate();

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <AppShell>
      <div className="min-h-screen bg-zinc-50">
        {/* Header */}
        <div className="px-5 pt-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold">MS</div>
            <div>
              <p className="text-xs text-zinc-500">Welcome back</p>
              <p className="font-semibold">Muhammad</p>
            </div>
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2 rounded-full text-white text-sm font-medium flex items-center gap-2">
            ⚡ Earn $5
          </button>
        </div>

        {/* Total Balance */}
        <div className="px-5 mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
            🇺🇸 TOTAL BALANCE
          </div>
          <p className="text-7xl font-bold mt-2">$0</p>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center gap-10 mt-8">
          <button onClick={() => navigate({ to: '/wallets' })} className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 rounded-full border-2 border-zinc-300 flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <p className="text-xs">Add money</p>
          </button>
          <button onClick={() => navigate({ to: '/send' })} className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 rounded-full border-2 border-zinc-300 flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <p className="text-xs">Send</p>
          </button>
          <button onClick={() => navigate({ to: '/wallets' })} className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 rounded-full border-2 border-zinc-300 flex items-center justify-center">
              <Repeat className="w-6 h-6" />
            </div>
            <p className="text-xs">Convert</p>
          </button>
        </div>

        {/* Horizontal Currency Cards */}
        <div className="mt-10 px-5 overflow-x-auto flex gap-4 pb-6 snap-x snap-mandatory">
          {wallets.map((w: any) => (
            <div key={w.currency} className="snap-start w-72 bg-white rounded-3xl p-5 shadow border border-zinc-100 shrink-0">
              <div className="text-5xl mb-4">{w.flag}</div>
              <p className="font-semibold text-lg">{w.name}</p>
              <p className="text-sm text-zinc-500">{w.currency}</p>
              <p className="mt-8 text-4xl font-bold">{formatMoney(w.balance, w.currency)}</p>
              <p className="text-xs text-zinc-500 mt-1">{w.currency} Wallet</p>
            </div>
          ))}
        </div>

        {/* Continue Setup */}
        <div className="mx-5 mt-8 bg-blue-50 rounded-3xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-lg">Continue setup</p>
              <p className="text-sm text-zinc-600 mt-1">Use this guide to finish setting up your account</p>
            </div>
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3.5" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3b82f6" strokeWidth="3.5" strokeDasharray="80, 100" />
              </svg>
              <div className="absolute text-blue-600 font-semibold text-xl">4/5</div>
            </div>
          </div>
          <button className="mt-6 w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold text-lg">
            Complete setup
          </button>
        </div>
      </div>
    </AppShell>
  );
}
