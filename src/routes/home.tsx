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
  const [selectedWallet, setSelectedWallet] = useState(null);

  // if (!user) return <Navigate to="/auth" replace />; // Login dihilangkan

  return (
    <AppShell>
      <div className="min-h-screen bg-zinc-50 pb-20">
        {/* Header */}
        <div className="px-5 pt-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold">MS</div>
            <div>
              <p className="text-xs text-zinc-500">Welcome back</p>
              <p className="font-semibold">MICHAL ADRIAN BORON</p>
            </div>
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2 rounded-full text-white text-sm font-medium flex items-center gap-2">
            ⚡ Earn $5
          </button>
        </div>

        {/* Total Balance */}
        <div className="px-5 mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur rounded-full px-4 py-1 text-sm text-zinc-500">
            🇺🇸 TOTAL BALANCE <span className="text-xs">▼</span>
          </div>
          <p className="text-7xl font-bold mt-3">$0</p>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center gap-10 mt-10">
          <button onClick={() => navigate({ to: '/wallets' })} className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 rounded-full border border-zinc-300 flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <p className="text-xs font-medium">Add money</p>
          </button>
          <button onClick={() => navigate({ to: '/send' })} className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 rounded-full border border-zinc-300 flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <p className="text-xs font-medium">Send</p>
          </button>
          <button onClick={() => navigate({ to: '/wallets' })} className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 rounded-full border border-zinc-300 flex items-center justify-center">
              <Repeat className="w-6 h-6" />
            </div>
            <p className="text-xs font-medium">Convert</p>
          </button>
        </div>

        {/* Horizontal Currency Cards */}
        <div className="mt-10 px-5 overflow-x-auto flex gap-4 pb-6 snap-x snap-mandatory">
          {wallets.map((w: any) => (
            <div 
              key={w.currency} 
              className="snap-start w-72 bg-white rounded-3xl p-5 shadow border border-zinc-100 shrink-0 cursor-pointer"
              onClick={() => setSelectedWallet(w)}
            >
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

        {/* Recent Transactions */}
        <div className="mx-5 mt-8">
          <div className="flex justify-between items-center mb-4 px-1">
            <p className="font-semibold text-zinc-500">RECENT TRANSACTIONS</p>
            <p className="text-blue-600 text-sm">See all</p>
          </div>
          <div className="bg-white rounded-3xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-lg font-medium">CC</div>
            <div className="flex-1">
              <p className="font-medium">Card creation</p>
              <p className="text-sm text-zinc-500">26 Juni, 2026</p>
            </div>
            <p className="font-semibold text-red-500">- $0</p>
          </div>
        </div>

        {/* Other Products */}
        <div className="mx-5 mt-6">
          <p className="font-semibold text-zinc-500 px-1 mb-4">OTHER PRODUCTS</p>
          <div className="flex gap-4">
            <div className="flex-1 bg-white rounded-3xl p-5 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">💳</div>
              <p className="font-medium">Gift Cards</p>
            </div>
            <div className="flex-1 bg-white rounded-3xl p-5 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">📄</div>
              <p className="font-medium">Invoices</p>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Detail Bank (berbeda per currency) */}
      {selectedWallet && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end" onClick={() => setSelectedWallet(null)}>
          <div className="bg-white w-full rounded-t-3xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-5">
              <button onClick={() => setSelectedWallet(null)} className="text-3xl">←</button>

              <div className="text-center mt-8">
                <div className="text-8xl mx-auto">{selectedWallet.flag}</div>
                <p className="text-6xl font-bold mt-6">$0</p>
                <p className="text-lg text-zinc-500">{selectedWallet.currency} Balance</p>
              </div>

              <div className="flex gap-4 mt-12">
                <button className="flex-1 border py-4 rounded-full font-medium">Send</button>
                <button className="flex-1 border py-4 rounded-full font-medium">Convert</button>
              </div>

              <div className="mt-12">
                <p className="font-semibold">Receive {selectedWallet.currency}</p>
                <button className="mt-4 bg-blue-100 text-blue-600 px-6 py-3 rounded-2xl w-full">🏦 Bank Transfer</button>
              </div>

              <div className="mt-12 space-y-6">
                <div>
                  <p className="text-sm text-zinc-500">Account holder</p>
                  <p className="font-medium">MICHAL ADRIAN BORON</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500">Account number</p>
                  <p className="font-mono text-lg">
                    {['EUR', 'GBP'].includes(selectedWallet.currency) ? "42853519" : "216774698486"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500">Bank name</p>
                  <p className="font-medium">
                    {['EUR', 'GBP'].includes(selectedWallet.currency) ? "Clear Junction Limited" : "Lead"}
                  </p>
                </div>
                {['EUR', 'GBP'].includes(selectedWallet.currency) && (
                  <>
                    <div>
                      <p className="text-sm text-zinc-500">Sort Code</p>
                      <p className="font-mono">041307</p>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-500">Swift Code</p>
                      <p className="font-mono">CLJUGB21XXX</p>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-500">IBAN</p>
                      <p className="font-mono">GB71CLJU04130742853519</p>
                    </div>
                  </>
                )}
                <div>
                  <p className="text-sm text-zinc-500">Bank address</p>
                  <p className="font-medium">
                    {['EUR', 'GBP'].includes(selectedWallet.currency) 
                      ? "4th Floor Imperial House, 15 Kingsway, London, United Kingdom, WC2B 6UN" 
                      : "1801 Main St., Kansas City, MO 64108"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
      }
