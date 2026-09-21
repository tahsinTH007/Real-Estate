import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
  className?: string;
}

const Header = ({ title, subtitle, eyebrow, actions, className }: HeaderProps) => {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div>
        {eyebrow && (
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-3xl font-medium tracking-tight text-ink">
          {title}
        </h1>
        {subtitle && <p className="mt-1.5 text-sm text-ink-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
};

export default Header;
