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
      <div className="min-h-screen bg-zinc-50 pb-20">
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
              <ArrowUpRight class
