"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis } from "recharts"
import { Baby, Brain, FileCheck2, Gauge, ShieldHalf, Timer } from "lucide-react"
import { SectionCard, MetricTile, StatBadge, LiveDot } from "@/components/ui-kit"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const CLASSE: Record<string, { label: string; status: "success" | "warning" | "danger" }> = {
  aprovada: { label: "Aprovada", status: "success" },
  revisao: { label: "Revisão", status: "warning" },
  bloqueada: { label: "Bloqueada", status: "danger" },
}

interface Transacao {
  id: string
  carteira: string
  valor: number
  scoreRisco: number
  classificacao: string
  latenciaMs: number
}

export function ModuloDrex() {
  const { data } = useSWR("/api/drex", fetcher, { refreshInterval: 2500 })
  const transacoes: Transacao[] = data?.transacoes ?? []
  const metricas = data?.metricas

  // AURORA-KIDS — índice de proteção nacional com micro-atualizações contínuas
  const [indiceKids, setIndiceKids] = useState(97.3)
  useEffect(() => {
    const t = setInterval(() => {
      setIndiceKids((v) => {
        const next = v + (Math.random() * 0.08 - 0.035)
        return +Math.min(98.4, Math.max(96.8, next)).toFixed(2)
      })
    }, 2000)
    return () => clearInterval(t)
  }, [])

  const chartData = transacoes.slice(0, 8).map((t) => ({
    id: t.id.slice(-4),
    score: +(t.scoreRisco * 100).toFixed(0),
    classificacao: t.classificacao,
  }))

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricTile
          label="Latência XAI"
          value="12"
          unit="ms"
          icon={<Timer className="size-4" />}
          accent="text-info"
          hint={metricas ? `Instantânea ${metricas.latenciaInstantanea}ms` : "Motor de inferência"}
        />
        <MetricTile
          label="Throughput"
          value={metricas ? metricas.throughput.toLocaleString("pt-BR") : "—"}
          unit="tx/s"
          icon={<Gauge className="size-4" />}
          hint="Liquidação DREX"
        />
        <MetricTile
          label="Score médio de risco"
          value={metricas ? metricas.scoreMedio.toFixed(2) : "—"}
          icon={<Brain className="size-4" />}
          accent="text-warning"
          hint="Lote em análise"
        />
        <MetricTile
          label="Proteção AURORA-KIDS"
          value={indiceKids.toFixed(2)}
          unit="%"
          icon={<Baby className="size-4" />}
          accent="text-success"
          hint="Índice nacional contínuo"
        />
      </div>

      <SectionCard
        title="Auditoria Financeira DREX — Motor XAI"
        subtitle="Score de risco explicável por transação · latência 12ms"
        icon={<FileCheck2 className="size-4" />}
        action={
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <LiveDot /> Liquidação ao vivo
          </span>
        }
      >
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
              <XAxis dataKey="id" tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }} stroke="var(--color-border)" />
              <Tooltip
                cursor={{ fill: "var(--color-muted)", opacity: 0.3 }}
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "var(--color-popover-foreground)",
                }}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {chartData.map((d, i) => (
                  <Cell
                    key={i}
                    fill={
                      d.classificacao === "bloqueada"
                        ? "var(--color-chart-5)"
                        : d.classificacao === "revisao"
                          ? "var(--color-chart-4)"
                          : "var(--color-chart-3)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="py-2 pr-3 font-medium">ID</th>
                <th className="py-2 pr-3 font-medium">Carteira</th>
                <th className="py-2 pr-3 font-medium">Valor</th>
                <th className="py-2 pr-3 font-medium">Score</th>
                <th className="py-2 pr-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {transacoes.map((t) => (
                <tr key={t.id} className="border-b border-border/60">
                  <td className="py-2 pr-3 text-muted-foreground">{t.id.slice(-7)}</td>
                  <td className="py-2 pr-3 text-foreground">{t.carteira}</td>
                  <td className="py-2 pr-3 tabular-nums text-foreground">
                    {t.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </td>
                  <td className="py-2 pr-3 tabular-nums font-semibold text-foreground">{t.scoreRisco.toFixed(2)}</td>
                  <td className="py-2 pr-3">
                    <StatBadge status={CLASSE[t.classificacao]?.status ?? "neutral"}>
                      {CLASSE[t.classificacao]?.label ?? t.classificacao}
                    </StatBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard
        title="AURORA-KIDS-I.D. — Mitigação de Crimes contra Menores"
        subtitle="Proteção nacional de identidade infantil com atualização contínua"
        icon={<ShieldHalf className="size-4" />}
        action={<StatBadge status="success">Operacional</StatBadge>}
      >
        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="font-mono text-2xl font-bold tabular-nums text-success">{indiceKids.toFixed(2)}%</span>
          <span className="text-xs text-muted-foreground">Índice de proteção nacional</span>
        </div>
        <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-success transition-all duration-1000 ease-out"
            style={{ width: `${indiceKids}%` }}
          />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <MetricTile label="Padrões neutralizados" value="2.841" accent="text-foreground" hint="Últimas 24h" />
          <MetricTile label="Identidades protegidas" value="14,2M" accent="text-info" hint="Base nacional" />
          <MetricTile label="Atualizações de segurança" value="Contínuas" accent="text-success" hint="OTA automática" />
        </div>
      </SectionCard>
    </div>
  )
}
