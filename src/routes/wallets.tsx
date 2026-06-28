import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useAppState, formatMoney } from "@/lib/store";

export const Route = createFileRoute("/wallets")({
  component: Wallets,
});

function Wallets() {
  const wallets = useAppState((s) => s.wallets);

  return (
    <AppShell>
      <div className="min-h-screen bg-zinc-50">
        <div className="px-5 pt-12">
          <h1 className="text-3xl font-semibold">Wallets</h1>
        </div>

        {/* Total Value */}
        <div className="mx-5 mt-6 bg-white rounded-3xl p-6">
          <p className="text-sm text-zinc-500">Total value</p>
          <p className="text-5xl font-bold mt-1">$0.00</p>
          <p className="text-xs text-zinc-500 mt-1">Estimated in USD at mid-market rates</p>
        </div>

        {/* Slide Horizontal Wallets */}
        <div className="mt-8 px-5">
          <p className="font-semibold mb-4">All currencies</p>
          <div className="overflow-x-auto flex gap-4 pb-8 snap-x snap-mandatory -mx-5 px-5 scroll-smooth">
            {wallets.map((w: any) => (
              <div 
                key={w.currency} 
                className="snap-start w-80 bg-white rounded-3xl p-6 shadow shrink-0 border border-zinc-100 transition-transform duration-300 hover:scale-105 active:scale-95"
              >
                <div className="flex items-center gap-4">
                  <div className="text-6xl">{w.flag}</div>
                  <div>
                    <p className="font-semibold text-xl">{w.name}</p>
                    <p className="text-sm text-zinc-500">{w.currency}</p>
                  </div>
                </div>
                <p className="mt-8 text-5xl font-bold">{formatMoney(w.balance, w.currency)}</p>
                <p className="text-xs text-zinc-500 mt-2">{w.currency} Wallet</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
