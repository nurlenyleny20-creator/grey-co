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
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
        {/* Header & Background */}
        <div className="relative h-64 bg-cover" style={{ backgroundImage: 'url("/bg_grey_home.webp")' }}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute top-12 left-5 right-5 flex justify-between items-start">
            <div>
              <p className="text-3xl font-bold">Hello MUHAMMAD,</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur px-4 py-1 rounded-full text-sm">English</div>
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">MS</div>
            </div>
          </div>
        </div>

        {/* Balance */}
        <div className="-mt-12 relative z-10 px-5">
          <div className="bg-white rounded-3xl p-6 shadow-xl text-black">
            <div className="text-center">
              <p className="text-sm text-zinc-500">Total balance</p>
              <p className="text-6xl font-bold mt-1">$0</p>
            </div>
            <div className="flex justify-center gap-8 mt-8">
              <button onClick={() => navigate({ to: '/wallets' })} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full border-2 border-zinc-200 flex items-center justify-center"><Plus className="w-7 h-7" /></div>
                <p className="text-xs mt-2">Add money</p>
              </button>
              <button onClick={() => navigate({ to: '/send' })} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full border-2 border-zinc-200 flex items-center justify-center"><ArrowUpRight className="w-7 h-7" /></div>
                <p className="text-xs mt-2">Send</p>
              </button>
              <button onClick={() => navigate({ to: '/wallets' })} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full border-2 border-zinc-200 flex items-center justify-center"><Repeat className="w-7 h-7" /></div>
                <p className="text-xs mt-2">Convert</p>
              </button>
            </div>
          </div>
        </div>

        {/* Currency Horizontal Scroll */}
        <div className="px-5 mt-8">
          <div className="flex gap-4 overflow-x-auto pb-8 snap-x snap-mandatory">
            {wallets.map((w: any) => (
              <div key={w.currency} className="snap-start w-80 bg-white rounded-3xl p-6 shadow">
                <div className="text-6xl">{w.flag}</div>
                <p className="mt-4 font-semibold text-xl">{w.name}</p>
                <p className="text-sm text-zinc-500">{w.currency}</p>
                <p className="mt-8 text-4xl font-bold">{formatMoney(w.balance, w.currency)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Continue Setup */}
        <div className="mx-5 mt-4 bg-blue-50 rounded-3xl p-6">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold text-lg">Continue setup</p>
              <p className="text-sm text-zinc-600">Use this guide to finish setting up your account</p>
            </div>
            <div className="text-blue-600 text-5xl font-bold">4/5</div>
          </div>
          <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold">Complete setup</button>
        </div>
      </div>
    </AppShell>
  );
}
