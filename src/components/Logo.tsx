export function Logo({ size = 28, withText = true }: { size?: number; withText?: boolean }) {
  return (
    <div className="inline-flex items-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden
        className="text-primary"
      >
        <rect width="40" height="40" rx="12" fill="currentColor" />
        <path
          d="M11 26V14h4.5c3 0 5 1.6 5 4.3 0 1.9-1.1 3.3-2.9 3.9l3.3 3.8h-3l-2.9-3.4H13.7V26H11Zm2.7-5.7h1.9c1.6 0 2.5-.7 2.5-2 0-1.4-.9-2.1-2.5-2.1h-1.9v4.1Z"
          fill="oklch(0.96 0.04 170)"
        />
        <circle cx="28" cy="14" r="3" fill="oklch(0.85 0.16 168)" />
      </svg>
      {withText ? (
        <span className="font-display text-lg font-semibold tracking-tight">Lumen</span>
      ) : null}
    </div>
  );
}
