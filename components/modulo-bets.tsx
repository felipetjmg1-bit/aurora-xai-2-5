"use client"

import { useState } from "react"
import useSWR from "swr"
import { Ban, Globe, Radar, ShieldAlert, ShieldCheck, Siren, Trash2 } from "lucide-react"
import { SectionCard, MetricTile, StatBadge, LiveDot } from "@/components/ui-kit"
import { Button } from "@/components/ui/button"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const TIPO_LABEL: Record<string, string> = {
  "predicao-proibida": "Predição proibida",
  "sem-licenca": "Sem licença",
  "dominio-falsificado": "Domínio falsificado",
  "clone-autorizada": "Clone de autorizada",
}

interface Suspeita {
  id: string
  dominio: string
  ip: string
  tipo: string
  risco: number
}
interface Neutralizada {
  id: string
  dominio: string
  ip: string
  tipo: string
  metodo: string
  neutralizadaEm: string
}

export function ModuloBets() {
  const { data, mutate } = useSWR("/api/bets", fetcher, { refreshInterval: 5000 })
  const [processando, setProcessando] = useState<string | null>(null)
  const [neutralizadasLocais, setNeutralizadasLocais] = useState<Neutralizada[]>([])
  const [totalLocal, setTotalLocal] = useState<number | null>(null)

  const suspeitas: Suspeita[] = data?.suspeitas ?? []
  const neutralizadas: Neutralizada[] =
    neutralizadasLocais.length > 0 ? neutralizadasLocais : (data?.neutralizadas ?? [])
  const total = totalLocal ?? data?.totalNeutralizadas ?? 0

  async function mitigar(s: Suspeita) {
    setProcessando(s.id)
    try {
      const res = await fetch("/api/bets/mitigar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dominio: s.dominio, ip: s.ip, tipo: s.tipo }),
      })
      const json = await res.json()
      if (json.sucesso) {
        setNeutralizadasLocais(json.neutralizadas)
        setTotalLocal(json.totalNeutralizadas)
        mutate()
      }
    } finally {
      setProcessando(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricTile
          label="Plataformas autorizadas"
          value={(data?.autorizadas ?? 187).toString()}
          icon={<ShieldCheck className="size-4" />}
          accent="text-success"
          hint="Lista Min. da Fazenda"
        />
        <MetricTile
          label="Bets neutralizadas"
          value={total.toLocaleString("pt-BR")}
          icon={<Ban className="size-4" />}
          accent="text-destructive"
          hint="Acumulado histórico"
        />
        <MetricTile
          label="Requisições DNS varridas"
          value={(data?.requisicoesDns ?? 0).toLocaleString("pt-BR")}
          icon={<Radar className="size-4" />}
          accent="text-info"
          hint="Motor de varredura ativo"
        />
        <MetricTile
          label="Ameaças no radar"
          value={suspeitas.length.toString()}
          icon={<ShieldAlert className="size-4" />}
          accent="text-warning"
          hint="Aguardando mitigação"
        />
      </div>

      <SectionCard
        title="Defensor Digital da Economia — Radar de Ameaças"
        subtitle="Domínios falsificados e plataformas fora da lista de 187 autorizadas"
        icon={<Siren className="size-4" />}
        action={
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <LiveDot /> Varredura ativa
          </span>
        }
      >
        {suspeitas.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Sincronizando varredura de rede DNS…</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {suspeitas.map((s) => (
              <li
                key={s.id}
                className="flex flex-col gap-2 rounded-lg border border-border bg-card/60 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Globe className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate font-mono text-sm font-semibold text-foreground">{s.dominio}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="font-mono">IP {s.ip}</span>
                    <StatBadge status="warning">{TIPO_LABEL[s.tipo] ?? s.tipo}</StatBadge>
                    <StatBadge status="danger">Risco {s.risco}</StatBadge>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  className="shrink-0 gap-1.5"
                  disabled={processando === s.id}
                  onClick={() => mitigar(s)}
                >
                  <Trash2 className="size-3.5" />
                  {processando === s.id ? "Derrubando…" : "Executar Protocolo de Mitigação"}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard
        title="Log de Apostas Ilegais Neutralizadas"
        subtitle="Sinkholing de DNS · Bloqueio no nível de operadora"
        icon={<Ban className="size-4" />}
        action={<StatBadge status="danger">{total.toLocaleString("pt-BR")} registros</StatBadge>}
      >
        {neutralizadas.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Nenhuma mitigação nesta sessão. Acione o protocolo no radar acima.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">Domínio</th>
                  <th className="py-2 pr-3 font-medium">IP Origem</th>
                  <th className="py-2 pr-3 font-medium">Método</th>
                  <th className="py-2 pr-3 font-medium">Data/Hora</th>
                </tr>
              </thead>
              <tbody>
                {neutralizadas.map((n) => (
                  <tr key={n.id} className="border-b border-border/60">
                    <td className="py-2 pr-3 font-semibold text-foreground">{n.dominio}</td>
                    <td className="py-2 pr-3 text-muted-foreground">{n.ip}</td>
                    <td className="py-2 pr-3">
                      <StatBadge status="info">{n.metodo}</StatBadge>
                    </td>
                    <td className="py-2 pr-3 text-muted-foreground">
                      {new Date(n.neutralizadaEm).toLocaleString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  )
}
