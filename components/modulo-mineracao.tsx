"use client"

import useSWR from "swr"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Activity, Battery, Factory, Gauge, Mountain, Pickaxe, Zap } from "lucide-react"
import { SectionCard, MetricTile, StatBadge, LiveDot } from "@/components/ui-kit"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const MINERAL_LABEL: Record<string, string> = {
  niobio: "Nióbio",
  litio: "Lítio",
  quartzo: "Quartzo",
}

const STATUS_MAP: Record<string, "success" | "warning" | "info"> = {
  operacional: "success",
  manutencao: "warning",
  expansao: "info",
}

export function ModuloMineracao() {
  const { data } = useSWR("/api/mineracao", fetcher, { refreshInterval: 3000 })

  const complexos = data?.complexos ?? []
  const telemetria = data?.telemetria ?? []
  const sebastian = data?.sebastian
  const serie = data?.serie ?? []

  const tel = (id: string) => telemetria.find((t: { id: string }) => t.id === id)
  const extracaoTotal = telemetria.reduce(
    (a: number, t: { extracaoDiariaT: number }) => a + t.extracaoDiariaT,
    0,
  )
  const estoqueTotal = telemetria.reduce(
    (a: number, t: { estoqueEstrategicoT: number }) => a + t.estoqueEstrategicoT,
    0,
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricTile
          label="Extração agregada"
          value={extracaoTotal.toLocaleString("pt-BR")}
          unit="t/dia"
          icon={<Pickaxe className="size-4" />}
          accent="text-info"
          hint="4 complexos ativos"
        />
        <MetricTile
          label="Estoque estratégico"
          value={(estoqueTotal / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}
          unit="kt"
          icon={<Factory className="size-4" />}
          hint="Minerais de alta tecnologia"
        />
        <MetricTile
          label="Potencial elétrico"
          value={sebastian ? sebastian.potencialGWh.toLocaleString("pt-BR") : "—"}
          unit="GWh"
          icon={<Zap className="size-4" />}
          accent="text-warning"
          hint={sebastian ? `Meta ${sebastian.metaGWh} GWh` : "Projeto Sebastian"}
        />
        <MetricTile
          label="Material p/ VE nacional"
          value={sebastian ? sebastian.materiaisVE.toLocaleString("pt-BR") : "—"}
          unit="t/dia"
          icon={<Battery className="size-4" />}
          accent="text-success"
          hint="Indústria de veículos elétricos"
        />
      </div>

      <SectionCard
        title="Projeto Sebastian — Soberania em Veículos Elétricos"
        subtitle="Conversão de minerais estratégicos em capacidade nacional de baterias"
        icon={<Battery className="size-4" />}
        action={<StatBadge status="info">Meta 800 GWh</StatBadge>}
      >
        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="font-mono font-bold tabular-nums text-warning">
            {sebastian ? sebastian.potencialGWh.toLocaleString("pt-BR") : "0"} GWh
          </span>
          <span className="text-xs text-muted-foreground">
            {sebastian ? `${sebastian.progresso}% da meta soberana` : ""}
          </span>
        </div>
        <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-warning transition-all duration-700 ease-out"
            style={{ width: `${sebastian?.progresso ?? 0}%` }}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Telemetria de Refino — Fluxo Horário"
        subtitle="Volume processado por mineral (t/h) · últimas 24h"
        icon={<Activity className="size-4" />}
        action={
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <LiveDot /> Tempo real
          </span>
        }
      >
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={serie} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="gNio" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gLit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gQua" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="hora"
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }}
                interval={5}
                stroke="var(--color-border)"
              />
              <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }} stroke="var(--color-border)" />
              <Tooltip
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "var(--color-popover-foreground)",
                }}
              />
              <Area type="monotone" dataKey="quartzo" stroke="var(--color-chart-2)" fill="url(#gQua)" strokeWidth={2} name="Quartzo" />
              <Area type="monotone" dataKey="niobio" stroke="var(--color-chart-1)" fill="url(#gNio)" strokeWidth={2} name="Nióbio" />
              <Area type="monotone" dataKey="litio" stroke="var(--color-chart-3)" fill="url(#gLit)" strokeWidth={2} name="Lítio" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <SectionCard
        title="Complexos Mineradores Monitorados"
        subtitle="Anglo American · CBMM · Vale · Sigma Lithium"
        icon={<Mountain className="size-4" />}
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {complexos.map((c: {
            id: string
            nome: string
            operadora: string
            local: string
            uf: string
            mineralPrincipal: string
            status: string
          }) => {
            const t = tel(c.id)
            return (
              <article key={c.id} className="rounded-lg border border-border bg-card/60 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{c.nome}</h3>
                    <p className="text-[11px] text-muted-foreground">
                      {c.operadora} · {c.local}/{c.uf}
                    </p>
                  </div>
                  <StatBadge status={STATUS_MAP[c.status]}>{c.status}</StatBadge>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs">
                  <Linha label="Mineral" value={MINERAL_LABEL[c.mineralPrincipal]} />
                  <Linha label="Pureza" value={t ? `${t.pureza}%` : "—"} accent="text-info" />
                  <Linha label="Extração" value={t ? `${t.extracaoDiariaT.toLocaleString("pt-BR")} t/d` : "—"} />
                  <Linha
                    label="Refino"
                    value={t ? `${t.eficienciaRefino}%` : "—"}
                    accent={t && t.eficienciaRefino >= 95 ? "text-success" : "text-warning"}
                  />
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Gauge className="size-3.5" /> Uptime {t ? `${t.uptime}%` : "—"}
                </div>
              </article>
            )
          })}
        </div>
      </SectionCard>
    </div>
  )
}

function Linha({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-semibold tabular-nums ${accent ?? "text-foreground"}`}>{value}</span>
    </div>
  )
}
