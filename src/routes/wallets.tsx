import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/cards")({
  component: Cards,
});

function Cards() {
  return (
    <AppShell>
      <div className="min-h-screen bg-zinc-50 pb-20">
        <div className="px-5 pt-12 flex justify-between items-center">
          <h1 className="text-3xl font-semibold">Cards</h1>
          <p className="text-blue-600 font-medium">+ Add new card</p>
        </div>

        {/* Grey Visa Card */}
        <div className="mx-5 mt-8 bg-gradient-to-br from-black via-purple-900 to-black rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden h-56">
          <div className="flex justify-between">
            <div className="text-2xl font-bold">Grey</div>
            <div className="text-right">
              <div className="text-3xl font-bold">VISA</div>
              <p className="text-xs">Platinum</p>
            </div>
          </div>
          <div className="mt-12 text-2xl tracking-widest">•••• 1581</div>
          <div className="absolute bottom-6 left-6 text-sm">MUHAMMAD</div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-8 mt-8">
          <button className="flex flex-col items-center">
            <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center text-white">ℹ️</div>
            <p className="text-xs mt-2">Details</p>
          </button>
          <button className="flex flex-col items-center">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">❄️</div>
            <p className="text-xs mt-2">Freeze</p>
          </button>
          <button className="flex flex-col items-center">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">🔒</div>
            <p className="text-xs mt-2">Show PIN</p>
          </button>
        </div>

        {/* Fund Account */}
        <div className="mx-5 mt-8 bg-gradient-to-r from-purple-700 to-pink-600 rounded-3xl p-6 text-white">
          <p className="font-medium">Fund your account and spend globally with your card.</p>
          <button className="mt-4 bg-black text-white px-6 py-3 rounded-full">Add money</button>
        </div>

        {/* Google Wallet */}
        <div className="mx-5 mt-6 bg-white rounded-3xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-green-500 rounded-xl flex items-center justify-center text-white text-2xl">G</div>
          <div>
            <p className="font-medium">Add to Google Wallet</p>
            <p className="text-sm text-zinc-500">Start spending using Google Pay</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
