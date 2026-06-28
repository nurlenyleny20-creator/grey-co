import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/wallets/$currency")({
  component: WalletDetail,
});

function WalletDetail() {
  const { currency } = Route.useParams();
  const user = useAppState((s) => s.user);
  const navigate = useNavigate();

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <AppShell>
      <div className="min-h-screen bg-zinc-50">
        {/* Header */}
        <div className="px-5 pt-12 flex items-center justify-between">
          <button onClick={() => window.history.back()} className="text-3xl">←</button>
          <div>
            <p className="text-center text-2xl font-bold">$0</p>
            <p className="text-center text-sm text-zinc-500">USD Balance</p>
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
        </div>

        {/* About this account */}
        <div className="mx-5 mt-8">
          <p className="font-semibold mb-4">About this account</p>
          <div className="text-sm text-zinc-600 space-y-4">
            <p>• You can receive payments instantly via FedNow...</p>
            <p>• Receiving payments via ACH has a 0.8% fee...</p>
            <p>• Receiving payments via WIRE has a flat fee of $20...</p>
            <p>• Receiving payments via SWIFT is currently not supported.</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
