import { NextResponse } from "next/server"
import { mitigar, getEstadoBets, type PlataformaSuspeita } from "@/lib/defesa-bets"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const body = (await req.json()) as {
    dominio?: string
    ip?: string
    tipo?: PlataformaSuspeita["tipo"]
  }

  if (!body.dominio || !body.ip) {
    return NextResponse.json({ erro: "Domínio e IP são obrigatórios." }, { status: 400 })
  }

  // Simula latência do comando de derrubada (sinkholing / bloqueio na operadora)
  await new Promise((r) => setTimeout(r, 600))

  const registro = mitigar(body.dominio, body.ip, body.tipo ?? "sem-licenca")
  const estado = getEstadoBets()

  return NextResponse.json({
    sucesso: true,
    registro,
    totalNeutralizadas: estado.totalNeutralizadas,
    neutralizadas: estado.neutralizadas,
  })
}
