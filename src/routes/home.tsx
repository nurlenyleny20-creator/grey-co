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
  const navigate = useNavigate();

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <AppShell>
      <div className="min-h-screen bg-zinc-50">
        {/* Top Header */}
        <div className="px-5 pt-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👋</span>
            <div>
              <p className="text-xl font-semibold">Hello MUHAMMAD,</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-1 rounded-full text-sm">English ▼</div>
            <div className="w-8 h-8 bg-zinc-800 text-white rounded-full flex items-center justify-center font-bold">MS</div>
            <div className="text-2xl">☰</div>
          </div>
        </div>

        {/* Balance Card */}
        <div className="mx-5 mt-6 bg-white rounded-3xl p-6 shadow">
          <div className="text-center">
            <p className="text-sm text-zinc-500">Total balance</p>
            <p className="text-6xl font-bold mt-2">$0.00</p>
          </div>

          <div className="flex justify-center gap-8 mt-8">
            <button onClick={() => navigate({ to: '/wallets' })} className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border flex items-center justify-center"><Plus className="w-6 h-6" /></div>
              <p className="text-xs mt-2">Add money</p>
            </button>
            <button onClick={() => navigate({ to: '/send' })} className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border flex items-center justify-center"><ArrowUpRight className="w-6 h-6" /></div>
              <p className="text-xs mt-2">Send</p>
            </button>
            <button onClick={() => navigate({ to: '/wallets' })} className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border flex items-center justify-center"><Repeat className="w-6 h-6" /></div>
              <p className="text-xs mt-2">Convert</p>
            </button>
          </div>
        </div>

        {/* My Balances */}
        <div className="px-5 mt-8">
          <p className="font-semibold px-1 mb-3">My Balances</p>
          <div className="bg-white rounded-3xl p-5 flex items-center gap-4">
            <div className="text-4xl">🇺🇸</div>
            <div className="flex-1">
              <p className="font-medium">US Dollars</p>
              <p className="text-sm text-zinc-500">USD</p>
            </div>
            <p className="font-bold text-2xl">$0.00</p>
          </div>
        </div>

        {/* Continue Setup */}
        <div className="mx-5 mt-6 bg-blue-50 rounded-3xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">Continue setup</p>
              <p className="text-sm text-zinc-600 mt-1">Use this guide to finish setting up your account</p>
            </div>
            <div className="text-4xl font-semibold text-blue-600">4/5</div>
          </div>
          <button className="mt-6 w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold">Complete setup</button>
        </div>
      </div>
    </AppShell>
  );
}
