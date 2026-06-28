import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import QRCode from 'react-qr-code';

const TRC20_ADDRESS = "TEJMgm44ANpkq2LZqPBXmg2an1Esk4eBWf";

const AddMoneyScreen = () => {
  const copyAddress = () => {
    navigator.clipboard.writeText(TRC20_ADDRESS);
    alert('✅ TRC20 address copied successfully!');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      <div className="max-w-md mx-auto pt-12 px-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <button className="text-4xl text-zinc-400 hover:text-white transition">←</button>
          <h1 className="text-3xl font-bold tracking-tight">Add Money</h1>
          <div className="w-8 h-8" />
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-zinc-900 text-emerald-400 text-sm px-4 py-1.5 rounded-full">
            TRC20 • USDT
          </div>
          <p className="text-zinc-400 mt-3">Tron Network • Low Fee</p>
        </div>

        {/* QR Card */}
        <div className="bg-zinc-900 rounded-3xl p-8 shadow-2xl border border-zinc-800/50">
          <div className="bg-white p-6 rounded-2xl mx-auto w-fit mb-8 shadow-inner">
            <QRCode 
              value={TRC20_ADDRESS}
              size={260}
              fgColor="#000000"
              bgColor="#ffffff"
            />
          </div>

          {/* Address Box */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 mb-8">
            <p className="text-xs text-zinc-500 mb-2 font-mono tracking-widest">TRC20 ADDRESS</p>
            <p className="font-mono text-[15px] text-emerald-300 break-all leading-relaxed">
              {TRC20_ADDRESS}
            </p>
          </div>

          {/* Copy Button */}
          <button
            onClick={copyAddress}
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 transition-all py-5 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/30 active:scale-95"
          >
            📋 Copy TRC20 Address
          </button>
        </div>

        {/* Warning */}
        <div className="mt-8 bg-zinc-900/70 border border-amber-500/30 rounded-3xl p-6 text-sm">
          <div className="flex items-center gap-3 text-amber-400 mb-3">
            ⚠️ <span className="font-semibold">IMPORTANT</span>
          </div>
          <ul className="space-y-2 text-zinc-400 text-[15px]">
            <li>• Send only <span className="text-white">USDT on TRC20 (Tron Network)</span></li>
            <li>• Minimum deposit 5 USDT</li>
            <li>• Wrong network = funds lost permanently</li>
            <li>• Balance will be credited automatically</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/add-money')({
  component: AddMoneyScreen,
});

export default AddMoneyScreen;
