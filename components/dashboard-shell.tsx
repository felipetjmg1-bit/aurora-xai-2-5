"use client"

import { useEffect, useState } from "react"
import { Battery, Lock, ShieldCheck, Siren } from "lucide-react"
import { cn } from "@/lib/utils"
import { LiveDot } from "@/components/ui-kit"
import { ModuloMineracao } from "@/components/modulo-mineracao"
import { ModuloBets } from "@/components/modulo-bets"
import { ModuloDrex } from "@/components/modulo-drex"

type Aba = "mineracao" | "bets" | "drex"

const ABAS: { id: Aba; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: "mineracao", label: "Mineração", icon: <Battery className="size-4" />, desc: "Matérias-primas estratégicas" },
  { id: "bets", label: "Defesa Econômica", icon: <Siren className="size-4" />, desc: "Bloqueio de bets ilegais" },
  { id: "drex", label: "DREX & KIDS", icon: <ShieldCheck className="size-4" />, desc: "Auditoria e proteção" },
]

const SELOS = ["TLS 1.3", "AES-256", "LGPD", "TCU/CGU"]

export function DashboardShell() {
  const [aba, setAba] = useState<Aba>("mineracao")
  const [hora, setHora] = useState("")

  useEffect(() => {
    const t = setInterval(() => setHora(new Date().toLocaleTimeString("pt-BR")), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg border border-primary/40 bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h1 className="text-balance text-base font-bold leading-tight text-foreground">
                Aurora XAI <span className="font-mono text-primary">2.5.0</span>
              </h1>
              <p className="text-[11px] text-muted-foreground">Ecossistema de Soberania Nacional</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success">
              <LiveDot /> Sistemas online
            </span>
            <span className="hidden font-mono text-xs text-muted-foreground sm:inline">{hora}</span>
          </div>
        </div>

        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 pb-2">
          {ABAS.map((a) => (
            <button
              key={a.id}
              onClick={() => setAba(a.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors",
                aba === a.id
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              {a.icon}
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-semibold">{a.label}</span>
                <span className="text-[10px] opacity-80">{a.desc}</span>
              </span>
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-5">
        {aba === "mineracao" && <ModuloMineracao />}
        {aba === "bets" && <ModuloBets />}
        {aba === "drex" && <ModuloDrex />}
      </main>

      <footer className="border-t border-border bg-card/30">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div className="flex flex-wrap items-center gap-2">
            {SELOS.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/60 px-2.5 py-1 font-mono text-[11px] font-semibold text-foreground"
              >
                <Lock className="size-3 text-success" /> {s}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Conformidade técnica e jurídica · Soberania de dados nacionais
          </p>
        </div>
      </footer>
    </div>
  )
}
