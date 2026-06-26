import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAppState } from "@/lib/store";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumen — Multi-currency account" },
      {
        name: "description",
        content:
          "Hold, send, and convert USD, EUR, GBP, NGN and IDR from one borderless account. Built for people who live across currencies.",
      },
      { property: "og:title", content: "Lumen — Multi-currency account" },
      {
        property: "og:description",
        content: "Borderless multi-currency account for USD, EUR, GBP, NGN, IDR.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Splash,
  ssr: false,
});

function Splash() {
  const user = useAppState((s) => s.user);
  const onboarded = useAppState((s) => s.onboarded);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 900);
    return () => clearTimeout(t);
  }, []);

  if (ready) {
    if (user) return <Navigate to="/home" replace />;
    if (onboarded) return <Navigate to="/auth" replace />;
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-[var(--gradient-brand)] text-primary-foreground">
      <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-700">
        <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
          <Logo size={48} withText={false} />
        </div>
        <div className="text-center">
          <h1 className="font-display text-3xl font-semibold tracking-tight">Lumen</h1>
          <p className="mt-1 text-sm text-primary-foreground/70">Money without borders</p>
        </div>
        <div className="mt-4 h-1 w-24 overflow-hidden rounded-full bg-white/15">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-white/70" />
        </div>
      </div>
    </div>
  );
}
