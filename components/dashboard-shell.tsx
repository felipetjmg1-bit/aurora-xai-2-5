"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
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
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-primary/40 shadow-[0_0_22px_-4px] shadow-primary/60">
              <Image
                src="/impulso-logo.jpg"
                alt="Logomarca Impulso Digital - hexágono neon"
                fill
                sizes="48px"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <h1 className="text-balance text-base font-bold leading-tight text-foreground">
                Impulso Digital{" "}
                <span className="text-muted-foreground">·</span>{" "}
                <span className="font-mono text-primary">Aurora XAI 2.5.0</span>
              </h1>
              <p className="text-[11px] text-muted-foreground">Soluções em I.A · Ecossistema de Soberania Nacional</p>
              <p className="text-[10px] text-muted-foreground/80">CEO &amp; Idealizador: Felipe Marcos de Abreu Aquino</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Image
              src="/bandeira-brasil-mg.webp"
              alt="Bandeiras do Brasil e de Minas Gerais"
              width={72}
              height={48}
              className="hidden h-9 w-auto rounded-sm border border-border object-contain sm:block"
            />
            <div className="flex flex-col items-end gap-1">
              <span className="flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success">
                <LiveDot /> Sistemas online
              </span>
              <span className="hidden font-mono text-xs text-muted-foreground sm:inline">{hora}</span>
            </div>
          </div>
        </div>

        <div
          className="h-0.5 w-full"
          style={{
            background:
              "linear-gradient(90deg, var(--neon-red), var(--neon-yellow), var(--neon-green), var(--neon-blue), var(--neon-magenta))",
          }}
        />

        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 py-2">
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
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
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
            <Image
              src="/bandeira-brasil-mg.webp"
              alt="Bandeiras do Brasil e de Minas Gerais"
              width={88}
              height={56}
              className="h-10 w-auto rounded-sm border border-border object-contain"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3">
            <p className="text-[11px] text-muted-foreground">
              <span className="font-semibold text-foreground">Impulso Digital — Soluções em I.A</span> · Conformidade
              técnica e jurídica · Soberania de dados nacionais
            </p>
            <p className="text-[11px] text-muted-foreground/80">
              Idealizado e desenvolvido por Felipe Marcos de Abreu Aquino
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
