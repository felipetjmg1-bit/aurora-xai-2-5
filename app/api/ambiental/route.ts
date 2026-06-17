import { NextResponse } from "next/server"
import {
  BIOMAS,
  gerarLoteDesmatamento,
  gerarClima,
  calcularSoberaniaAmbiental,
  gerarSerieDesmatamento,
} from "@/lib/simulacao"

export const dynamic = "force-dynamic"

export async function GET() {
  const alertas = gerarLoteDesmatamento(8)
  const clima = gerarClima()
  const resumo = calcularSoberaniaAmbiental(alertas, clima)
  const serie = gerarSerieDesmatamento(24)

  return NextResponse.json({
    biomas: BIOMAS,
    alertas,
    clima,
    resumo,
    serie,
    geradoEm: new Date().toISOString(),
  })
}
