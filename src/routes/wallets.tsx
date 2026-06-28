import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/wallets/$currency")({
  component: WalletDetail,
});

function WalletDetail() {
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="min-h-screen bg-zinc-50 pb-20">
        {/* Header */}
        <div className="px-5 pt-12 flex items-center justify-between">
          <button onClick={() => window.history.back()} className="text-3xl">←</button>
          <div className="text-center">
            <p className="text-5xl font-bold">$0</p>
            <p className="text-sm text-zinc-500">USD Balance</p>
          </div>
          <div className="text-3xl">⋯</div>
        </div>

        {/* Send & Convert */}
        <div className="px-5 mt-8 flex gap-4">
          <button className="flex-1 border border-zinc-300 py-4 rounded-full font-medium">Send</button>
          <button className="flex-1 border border-zinc-300 py-4 rounded-full font-medium">Convert</button>
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
          <div>
            <p className="text-sm text-zinc-500">Account type</p>
            <p className="font-medium">Checking</p>
          </div>
          <div>
            <p className="text-sm text-zinc-500">Bank name</p>
            <p className="font-medium">Lead</p>
          </div>
          <div>
            <p className="text-sm text-zinc-500">Bank address</p>
            <p className="font-medium">1801 Main St., Kansas City, MO 64108</p>
          </div>
        </div>

        {/* Share Button */}
        <div className="mx-5 mt-6">
          <button className="w-full bg-zinc-100 text-blue-600 py-4 rounded-2xl font-medium flex items-center justify-center gap-2">
            Share <span>↑</span>
          </button>
        </div>

        {/* About this account */}
        <div className="mx-5 mt-8">
          <p className="font-semibold mb-4">About this account</p>
          <div className="text-sm text-zinc-600 space-y-4">
            <p>• You can receive payments instantly via FedNow (available 24/7/365) if the sending bank supports it. Fees: 0.8% (minimum $2, maximum $10).</p>
            <p>• Receiving payments via ACH has a 0.8% fee (minimum $2, maximum $10). You'll need the ACH routing number for these payments.</p>
            <p>• Receiving payments via WIRE has a flat fee of $20. You'll need the WIRE routing number for these payments.</p>
            <p>• Receiving payments via SWIFT is currently not supported.</p>
            <p>• USD payments can only be received from banks within the United States.</p>
            <p>• Processing time for incoming payments via ACH or Wire can take between 1-3 days, depending on the payment scheme used by the sending bank.</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
