// Lightweight client-side store using localStorage.
// Real backend wiring goes here once Lovable Cloud is enabled.
import { useEffect, useState, useSyncExternalStore } from "react";

export type CurrencyCode = "USD" | "EUR" | "GBP" | "NGN" | "IDR";

export interface Wallet {
  currency: CurrencyCode;
  balance: number;
  name: string;
  flag: string;
}

export interface Transaction {
  id: string;
  type: "send" | "receive" | "convert" | "topup";
  amount: number;
  currency: CurrencyCode;
  counterparty: string;
  note?: string;
  status: "completed" | "pending" | "failed";
  date: string; // ISO
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  country: string;
  kycVerified: boolean;
  createdAt: string;
}

interface AppState {
  user: User | null;
  onboarded: boolean;
  wallets: Wallet[];
  transactions: Transaction[];
  notifications: NotificationItem[];
  settings: {
    biometric: boolean;
    pushEnabled: boolean;
    emailUpdates: boolean;
    language: "en" | "id";
    theme: "system" | "light" | "dark";
  };
}

const STORAGE_KEY = "lumen.state.v1";

const defaultState: AppState = {
  user: null,
  onboarded: false,
  wallets: [
    { currency: "USD", balance: 0, name: "US Dollar", flag: "🇺🇸" },
    { currency: "EUR", balance: 0, name: "Euro", flag: "🇪🇺" },
    { currency: "GBP", balance: 0, name: "British Pound", flag: "🇬🇧" },
    { currency: "NGN", balance: 0, name: "Nigerian Naira", flag: "🇳🇬" },
    { currency: "IDR", balance: 0, name: "Indonesian Rupiah", flag: "🇮🇩" },
  ],
  transactions: [],
  notifications: [],
  settings: {
    biometric: false,
    pushEnabled: true,
    emailUpdates: true,
    language: "en",
    theme: "system",
  },
};

let state: AppState = defaultState;
const listeners = new Set<() => void>();

function load() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...defaultState, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
}
function persist() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}
function emit() {
  listeners.forEach((l) => l());
}
function set(updater: (s: AppState) => AppState) {
  state = updater(state);
  persist();
  emit();
}

// Initial load (client-side only)
if (typeof window !== "undefined") load();

export function useAppState<T>(selector: (s: AppState) => T): T {
  const subscribe = (cb: () => void) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  };
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(defaultState),
  );
}

export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}

// ---------- Actions ----------

export const actions = {
  completeOnboarding: () => set((s) => ({ ...s, onboarded: true })),

  signUp: (data: { fullName: string; email: string; country: string }) => {
    const user: User = {
      id: crypto.randomUUID(),
      fullName: data.fullName,
      email: data.email,
      country: data.country,
      kycVerified: false,
      createdAt: new Date().toISOString(),
    };
    // Seed demo balances so the dashboard looks alive
    const seeded: Wallet[] = [
      { currency: "USD", balance: 2480.55, name: "US Dollar", flag: "🇺🇸" },
      { currency: "EUR", balance: 1120.0, name: "Euro", flag: "🇪🇺" },
      { currency: "GBP", balance: 540.2, name: "British Pound", flag: "🇬🇧" },
      { currency: "NGN", balance: 320000, name: "Nigerian Naira", flag: "🇳🇬" },
      { currency: "IDR", balance: 4250000, name: "Indonesian Rupiah", flag: "🇮🇩" },
    ];
    const seedTx: Transaction[] = [
      {
        id: crypto.randomUUID(),
        type: "receive",
        amount: 1500,
        currency: "USD",
        counterparty: "Acme Studio",
        note: "October retainer",
        status: "completed",
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: crypto.randomUUID(),
        type: "convert",
        amount: 200,
        currency: "EUR",
        counterparty: "USD → EUR",
        status: "completed",
        date: new Date(Date.now() - 86400000 * 4).toISOString(),
      },
      {
        id: crypto.randomUUID(),
        type: "send",
        amount: 75,
        currency: "GBP",
        counterparty: "Sarah Bennett",
        note: "Dinner split",
        status: "completed",
        date: new Date(Date.now() - 86400000 * 6).toISOString(),
      },
    ];
    const seedNotif: NotificationItem[] = [
      {
        id: crypto.randomUUID(),
        title: "Welcome to Lumen",
        body: "Your multi-currency account is ready. Verify your ID to unlock higher limits.",
        date: new Date().toISOString(),
        read: false,
      },
    ];
    set((s) => ({
      ...s,
      user,
      wallets: seeded,
      transactions: seedTx,
      notifications: seedNotif,
    }));
  },

  signIn: (email: string) => {
    set((s) => ({
      ...s,
      user: s.user ?? {
        id: crypto.randomUUID(),
        fullName: email.split("@")[0] ?? "Friend",
        email,
        country: "US",
        kycVerified: false,
        createdAt: new Date().toISOString(),
      },
    }));
  },

  signOut: () => set((s) => ({ ...s, user: null })),

  updateProfile: (patch: Partial<User>) =>
    set((s) => ({ ...s, user: s.user ? { ...s.user, ...patch } : s.user })),

  updateSettings: (patch: Partial<AppState["settings"]>) =>
    set((s) => ({ ...s, settings: { ...s.settings, ...patch } })),

  send: (input: { from: CurrencyCode; amount: number; to: string; note?: string }) => {
    const wallet = state.wallets.find((w) => w.currency === input.from);
    if (!wallet || wallet.balance < input.amount) {
      throw new Error("Insufficient balance");
    }
    const tx: Transaction = {
      id: crypto.randomUUID(),
      type: "send",
      amount: input.amount,
      currency: input.from,
      counterparty: input.to,
      note: input.note,
      status: "completed",
      date: new Date().toISOString(),
    };
    set((s) => ({
      ...s,
      wallets: s.wallets.map((w) =>
        w.currency === input.from ? { ...w, balance: w.balance - input.amount } : w,
      ),
      transactions: [tx, ...s.transactions],
      notifications: [
        {
          id: crypto.randomUUID(),
          title: `Sent ${formatMoney(input.amount, input.from)}`,
          body: `Transfer to ${input.to} completed.`,
          date: new Date().toISOString(),
          read: false,
        },
        ...s.notifications,
      ],
    }));
    return tx;
  },

  topup: (currency: CurrencyCode, amount: number) => {
    const tx: Transaction = {
      id: crypto.randomUUID(),
      type: "topup",
      amount,
      currency,
      counterparty: "Card top-up",
      status: "completed",
      date: new Date().toISOString(),
    };
    set((s) => ({
      ...s,
      wallets: s.wallets.map((w) =>
        w.currency === currency ? { ...w, balance: w.balance + amount } : w,
      ),
      transactions: [tx, ...s.transactions],
    }));
    return tx;
  },

  markNotificationRead: (id: string) =>
    set((s) => ({
      ...s,
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),

  markAllRead: () =>
    set((s) => ({
      ...s,
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    })),

  reset: () => {
    state = defaultState;
    persist();
    emit();
  },
};

// ---------- Helpers ----------

const symbols: Record<CurrencyCode, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  NGN: "₦",
  IDR: "Rp",
};

export function formatMoney(amount: number, currency: CurrencyCode) {
  const symbol = symbols[currency];
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: currency === "IDR" || currency === "NGN" ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${symbol}${formatted}`;
}

// Static demo rates: 1 unit of key -> value in USD
const usdRates: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 1.08,
  GBP: 1.27,
  NGN: 0.00067,
  IDR: 0.000063,
};

export function convert(amount: number, from: CurrencyCode, to: CurrencyCode) {
  if (from === to) return amount;
  const usd = amount * usdRates[from];
  return usd / usdRates[to];
}

export function totalInUsd(wallets: Wallet[]) {
  return wallets.reduce((acc, w) => acc + w.balance * usdRates[w.currency], 0);
}
