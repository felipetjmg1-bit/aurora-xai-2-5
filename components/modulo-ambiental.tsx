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
import { CloudRain, Droplets, Flame, Leaf, Satellite, ShieldAlert, Thermometer, TreePine, Wind } from "lucide-react"
import { SectionCard, MetricTile, StatBadge, LiveDot } from "@/components/ui-kit"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const SEV_MAP: Record<string, "destructive" | "warning" | "info"> = {
  "crítico": "destructive",
  alto: "warning",
  moderado: "info",
}

const ACAO_MAP: Record<string, "success" | "warning" | "info"> = {
  "fiscalização despachada": "success",
  "embargo automático": "success",
  "em análise": "warning",
}

const AR_MAP: Record<string, "success" | "warning" | "destructive"> = {
  boa: "success",
  moderada: "warning",
  ruim: "destructive",
}

export function ModuloAmbiental() {
  const { data } = useSWR("/api/ambiental", fetcher, { refreshInterval: 4000 })

  const alertas = data?.alertas ?? []
  const clima = data?.clima ?? []
  const resumo = data?.resumo
  const serie = data?.serie ?? []

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricTile
          label="Índice de Soberania Ambiental"
          value={resumo ? resumo.indiceSoberania.toLocaleString("pt-BR") : "—"}
          unit="%"
          icon={<Leaf className="size-4" />}
          accent="text-success"
          hint="Proteção territorial consolidada"
        />
        <MetricTile
          label="Área sob alerta"
          value={resumo ? resumo.areaTotalHa.toLocaleString("pt-BR") : "—"}
          unit="ha"
          icon={<TreePine className="size-4" />}
          accent="text-warning"
          hint="Detecção em tempo real"
        />
        <MetricTile
          label="Alertas críticos"
          value={resumo ? resumo.criticos : "—"}
          unit="focos"
          icon={<ShieldAlert className="size-4" />}
          accent="text-destructive"
          hint="Resposta prioritária"
        />
        <MetricTile
          label="Risco de fogo médio"
          value={resumo ? resumo.riscoFogoMedio : "—"}
          unit="/100"
          icon={<Flame className="size-4" />}
          accent="text-warning"
          hint="5 biomas monitorados"
        />
      </div>

      <SectionCard
        title="Curva de Desmatamento — Detecção por Satélite"
        subtitle="Alertas e área afetada (ha) · últimas 24h · DETER/PRODES (INPE)"
        icon={<Satellite className="size-4" />}
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
                <linearGradient id="gArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gAlert" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0} />
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
              <Area type="monotone" dataKey="areaHa" stroke="var(--color-chart-1)" fill="url(#gArea)" strokeWidth={2} name="Área (ha)" />
              <Area type="monotone" dataKey="alertas" stroke="var(--color-chart-3)" fill="url(#gAlert)" strokeWidth={2} name="Alertas" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <SectionCard
        title="Alertas de Desmatamento Ativos"
        subtitle="Geolocalização e resposta automatizada de fiscalização"
        icon={<TreePine className="size-4" />}
        action={<StatBadge status="info">{alertas.length} focos</StatBadge>}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="px-2 py-2 font-medium">Bioma / UF</th>
                <th className="px-2 py-2 font-medium">Tipo</th>
                <th className="px-2 py-2 font-medium">Área</th>
                <th className="px-2 py-2 font-medium">Satélite</th>
                <th className="px-2 py-2 font-medium">Severidade</th>
                <th className="px-2 py-2 font-medium">Resposta</th>
              </tr>
            </thead>
            <tbody>
              {alertas.map((a: {
                id: string
                bioma_nome: string
                uf: string
                tipo: string
                areaHa: number
                satelite: string
                severidade: string
                acao: string
                lat: number
                lon: number
              }) => (
                <tr key={a.id} className="border-b border-border/50 last:border-0">
                  <td className="px-2 py-2">
                    <div className="font-medium text-foreground">{a.bioma_nome}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">
                      {a.uf} · {a.lat}, {a.lon}
                    </div>
                  </td>
                  <td className="px-2 py-2 capitalize text-foreground">{a.tipo}</td>
                  <td className="px-2 py-2 font-mono tabular-nums text-warning">{a.areaHa} ha</td>
                  <td className="px-2 py-2 font-mono text-[10px] text-muted-foreground">{a.satelite}</td>
                  <td className="px-2 py-2">
                    <StatBadge status={SEV_MAP[a.severidade]}>{a.severidade}</StatBadge>
                  </td>
                  <td className="px-2 py-2">
                    <StatBadge status={ACAO_MAP[a.acao]}>{a.acao}</StatBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard
        title="Monitoramento Climático por Bioma"
        subtitle="Temperatura, umidade, risco de fogo e qualidade do ar"
        icon={<CloudRain className="size-4" />}
        action={
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Wind className="size-3.5" /> CO₂ atmosférico em ppm
          </span>
        }
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {clima.map((c: {
            id: string
            bioma_nome: string
            tempC: number
            umidade: number
            riscoFogo: number
            co2ppm: number
            precipMm: number
            qualidadeAr: string
          }) => (
            <article key={c.id} className="rounded-lg border border-border bg-card/60 p-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-foreground">{c.bioma_nome}</h3>
                <StatBadge status={AR_MAP[c.qualidadeAr]}>ar {c.qualidadeAr}</StatBadge>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs">
                <Linha label={<><Thermometer className="size-3" /> Temp.</>} value={`${c.tempC}°C`} accent="text-warning" />
                <Linha label={<><Droplets className="size-3" /> Umidade</>} value={`${c.umidade}%`} accent="text-info" />
                <Linha label={<><Flame className="size-3" /> Risco fogo</>} value={`${c.riscoFogo}/100`} accent={c.riscoFogo > 70 ? "text-destructive" : "text-foreground"} />
                <Linha label={<><CloudRain className="size-3" /> Chuva</>} value={`${c.precipMm} mm`} />
              </div>
              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Risco de incêndio</span>
                  <span className="font-mono tabular-nums">{c.riscoFogo}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${c.riscoFogo > 70 ? "bg-destructive" : c.riscoFogo > 45 ? "bg-warning" : "bg-success"}`}
                    style={{ width: `${c.riscoFogo}%` }}
                  />
                </div>
                <p className="mt-2 font-mono text-[10px] text-muted-foreground">CO₂ {c.co2ppm} ppm</p>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

function Linha({ label, value, accent }: { label: React.ReactNode; value: string; accent?: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-1 text-muted-foreground">{label}</span>
      <span className={`font-semibold tabular-nums ${accent ?? "text-foreground"}`}>{value}</span>
    </div>
  )
}
