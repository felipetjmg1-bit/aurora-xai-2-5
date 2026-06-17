import { NextResponse } from "next/server"
import {
  COMPLEXOS,
  gerarTelemetriaMineracao,
  calcularProjetoSebastian,
  gerarSerieHistorica,
} from "@/lib/simulacao"

export const dynamic = "force-dynamic"

export async function GET() {
  const telemetria = gerarTelemetriaMineracao()
  const sebastian = calcularProjetoSebastian(telemetria)
  const serie = gerarSerieHistorica(24)

  return NextResponse.json({
    complexos: COMPLEXOS,
    telemetria,
    sebastian,
    serie,
    atualizadoEm: new Date().toISOString(),
  })
}
