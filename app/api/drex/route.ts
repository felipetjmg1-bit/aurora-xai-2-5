import { NextResponse } from "next/server"
import { gerarLoteDrex } from "@/lib/simulacao"

export const dynamic = "force-dynamic"

export async function GET() {
  const transacoes = gerarLoteDrex(8)
  const bloqueadas = transacoes.filter((t) => t.classificacao === "bloqueada").length
  const latenciaMedia = +(
    transacoes.reduce((acc, t) => acc + t.latenciaMs, 0) / transacoes.length
  ).toFixed(0)

  return NextResponse.json({
    transacoes,
    metricas: {
      latenciaMs: 12,
      latenciaInstantanea: latenciaMedia,
      bloqueadasLote: bloqueadas,
      throughput: Math.round(Math.random() * 4200 + 18400),
      scoreMedio: +(
        transacoes.reduce((a, t) => a + t.scoreRisco, 0) / transacoes.length
      ).toFixed(2),
    },
    atualizadoEm: new Date().toISOString(),
  })
}
