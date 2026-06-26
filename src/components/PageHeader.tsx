import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  back,
  right,
}: {
  title: string;
  back?: string;
  right?: ReactNode;
}) {
  return (
    <header className="glass sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 px-4">
      {back ? (
        <Link
          to={back}
          aria-label="Back"
          className="tap-scale -ml-2 grid h-10 w-10 place-items-center rounded-full text-foreground hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      ) : (
        <span className="w-2" />
      )}
      <h1 className="flex-1 truncate text-base font-semibold tracking-tight">{title}</h1>
      {right}
    </header>
  );
}
