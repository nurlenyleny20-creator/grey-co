import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Globe2, ShieldCheck, Sparkles, ChevronRight } from "lucide-react";
import { actions } from "@/lib/store";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Get started — Lumen" },
      { name: "description", content: "Three things to know about your Lumen account." },
    ],
  }),
  component: Onboarding,
  ssr: false,
});

const slides = [
  {
    icon: Globe2,
    title: "One account, five currencies",
    body: "Hold and switch between USD, EUR, GBP, NGN and IDR without changing apps.",
    color: "from-teal-500/20 to-emerald-500/10",
  },
  {
    icon: Sparkles,
    title: "Send at real exchange rates",
    body: "Transparent conversion with no hidden spread. See the rate before you confirm.",
    color: "from-sky-500/20 to-cyan-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Protected end to end",
    body: "Biometric sign-in, device binding, and instant freeze if anything looks off.",
    color: "from-amber-500/20 to-rose-500/10",
  },
];

function Onboarding() {
  const [i, setI] = useState(0);
  const navigate = useNavigate();
  const last = i === slides.length - 1;
  const S = slides[i];
  const Icon = S.icon;

  const next = () => {
    if (last) {
      actions.completeOnboarding();
      navigate({ to: "/auth" });
    } else {
      setI(i + 1);
    }
  };

  const skip = () => {
    actions.completeOnboarding();
    navigate({ to: "/auth" });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex items-center justify-between p-5">
        <Logo />
        <button onClick={skip} className="text-sm text-muted-foreground hover:text-foreground">
          Skip
        </button>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <div
          key={i}
          className={`mb-10 grid h-48 w-48 place-items-center rounded-[2rem] bg-gradient-to-br ${S.color} animate-in fade-in zoom-in-95 duration-500`}
        >
          <Icon className="h-20 w-20 text-foreground/80" strokeWidth={1.4} />
        </div>
        <h2 className="max-w-xs text-balance text-center font-display text-2xl font-semibold tracking-tight">
          {S.title}
        </h2>
        <p className="mt-3 max-w-sm text-balance text-center text-[15px] leading-relaxed text-muted-foreground">
          {S.body}
        </p>
      </div>

      <div className="px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <div className="mb-8 flex justify-center gap-2">
          {slides.map((_, idx) => (
            <span
              key={idx}
              className={
                "h-1.5 rounded-full transition-all " +
                (idx === i ? "w-8 bg-primary" : "w-1.5 bg-border")
              }
            />
          ))}
        </div>
        <button
          onClick={next}
          className="tap-scale flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-semibold text-primary-foreground shadow-[var(--shadow-card)]"
        >
          {last ? "Get started" : "Continue"} <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
