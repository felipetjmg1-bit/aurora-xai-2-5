import { cn } from "@/lib/utils"

export function StatBadge({
  status,
  children,
  className,
}: {
  status: "success" | "warning" | "danger" | "info" | "neutral"
  children: React.ReactNode
  className?: string
}) {
  const styles: Record<string, string> = {
    success: "bg-success/12 text-success border-success/30",
    warning: "bg-warning/12 text-warning border-warning/30",
    danger: "bg-destructive/15 text-destructive border-destructive/40",
    info: "bg-info/12 text-info border-info/30",
    neutral: "bg-muted text-muted-foreground border-border",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider",
        styles[status],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function LiveDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative flex h-2 w-2", className)}>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
    </span>
  )
}

export function MetricTile({
  label,
  value,
  unit,
  hint,
  icon,
  accent = "text-foreground",
}: {
  label: string
  value: React.ReactNode
  unit?: string
  hint?: string
  icon?: React.ReactNode
  accent?: string
}) {
  return (
    <div className="rounded-lg border border-border bg-card/60 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        {icon ? <span className="text-muted-foreground">{icon}</span> : null}
      </div>
      <p className={cn("mt-1.5 font-mono text-xl font-bold tabular-nums leading-none", accent)}>
        {value}
        {unit ? <span className="ml-1 text-sm font-medium text-muted-foreground">{unit}</span> : null}
      </p>
      {hint ? <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

export function SectionCard({
  title,
  subtitle,
  icon,
  action,
  children,
  className,
}: {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn("rounded-xl border border-border bg-card/40 backdrop-blur-sm", className)}>
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2.5">
          {icon ? <span className="text-primary">{icon}</span> : null}
          <div>
            <h2 className="text-sm font-semibold leading-tight text-foreground">{title}</h2>
            {subtitle ? <p className="text-[11px] text-muted-foreground">{subtitle}</p> : null}
          </div>
        </div>
        {action}
      </header>
      <div className="p-4">{children}</div>
    </section>
  )
}
