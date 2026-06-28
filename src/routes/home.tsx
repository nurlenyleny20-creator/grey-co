import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Repeat,
  Plus,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAppState, formatMoney, totalInUsd, type CurrencyCode } from "@/lib/store";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Home — Grey" }] }),
  component: Home,
  ssr: false,
});

function Home() {
  const user = useAppState((s) => s.user);
  const wallets = useAppState((s) => s.wallets);
  const [hidden, setHidden] = useState(false);
  const navigate = useNavigate();

  if (!user) return <Navigate to="/auth" replace />;

  const total = totalInUsd(wallets);

  return (
    <AppShell>
      <div className="px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-white font-semibold">
              MS
            </div>
            <div>
              <p className="text-xs text-zinc-500">Welcome back</p>
              <p className="font-semibold">Muhammad</p>
            </div>
          </div>
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-full text-sm font-medium flex items-center gap-1.5">
            <span>⚡</span> Earn $5
          </button>
        </div>

        {/* Total Balance */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
            🇺🇸 TOTAL BALANCE
          </div>
          <p className="mt-2 text-6xl font-semibold tracking-tighter">
            {hidden ? "••••" : "$0"}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex justify-center gap-8">
          {[
            { label: "Add money", icon: Plus },
            { label: "Send", icon: ArrowUpRight },
            { label: "Convert", icon: Repeat },
          ].map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => navigate({ to: label === "Send" ? "/send" : "/wallets" })}
              className="flex flex-col items-center gap-2"
            >
              <div className="h-14 w-14 rounded-full border-2 border-zinc-200 flex items-center justify-center">
                <Icon className="h-6 w-6" />
              </div>
              <p className="text-xs font-medium">{label}</p>
            </button>
          ))}
        </div>

        {/* Currency Accounts */}
        <div className="mt-10 space-y-3">
          {wallets.slice(0, 4).map((w: any) => (
            <div key={w.currency} className="bg-white rounded-3xl p-4 shadow flex items-center justify-between border">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{w.flag}</span>
                <div>
                  <p className="font-medium">{w.name}</p>
                  <p className="text-xs text-zinc-500">{w.currency}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">
                  {hidden ? "••••" : formatMoney(w.balance, w.currency as CurrencyCode)}
                </p>
                <p className="text-xs text-zinc-500">{w.currency} Wallet</p>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Setup */}
        <div className="mt-6 bg-blue-50 rounded-3xl p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">Continue setup</p>
              <p className="text-sm text-zinc-600 mt-1">Use this guide to finish setting up your account</p>
            </div>
            <div className="text-3xl font-semibold text-blue-600">4/5</div>
          </div>
          <button className="mt-4 w-full bg-blue-600 text-white py-3.5 rounded-2xl font-medium">
            Complete setup
          </button>
        </div>
      </div>
    </AppShell>
  );
}
