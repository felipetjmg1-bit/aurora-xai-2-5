import { NextResponse } from "next/server"
import { varrerRede, getEstadoBets } from "@/lib/defesa-bets"

export const dynamic = "force-dynamic"

export async function GET() {
  const varredura = varrerRede(6)
  const estado = getEstadoBets()
  return NextResponse.json({ ...varredura, ...estado, atualizadoEm: new Date().toISOString() })
}
