import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// Diretório oficial simulado de autoridades locais e governamentais
const AUTORIDADES = [
  { orgao: "IBAMA — Coordenação de Fiscalização", email: "fiscalizacao@ibama.gov.br", esfera: "Federal" },
  { orgao: "ICMBio — Monitoramento Territorial", email: "monitoramento@icmbio.gov.br", esfera: "Federal" },
  { orgao: "Polícia Federal — Meio Ambiente (DELEMAPH)", email: "delemaph@pf.gov.br", esfera: "Federal" },
  { orgao: "SEMAD-MG — Secretaria de Meio Ambiente", email: "alertas@meioambiente.mg.gov.br", esfera: "Estadual" },
  { orgao: "PMMG — Batalhão de Polícia Militar de Meio Ambiente", email: "bpmamb@pmmg.mg.gov.br", esfera: "Estadual" },
  { orgao: "Defesa Civil de Minas Gerais (CEDEC-MG)", email: "cedec@defesacivil.mg.gov.br", esfera: "Estadual" },
  { orgao: "Comando de Ciberdefesa (ComDCiber)", email: "operacoes@comdciber.eb.mil.br", esfera: "Defesa" },
  { orgao: "Banco Central — Departamento de Liquidez", email: "liquidez@bcb.gov.br", esfera: "Federal" },
]

interface CorpoAlerta {
  tipo?: string
  titulo?: string
  severidade?: string
  origem?: string
  detalhe?: string
  regiaoPrioritaria?: boolean
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as CorpoAlerta
  const protocolo = `AURORA-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`

  // Seleciona destinatários conforme o tipo de evento
  let destinatarios = AUTORIDADES
  if (body.tipo === "financeiro") {
    destinatarios = AUTORIDADES.filter((a) => a.esfera === "Federal" || a.esfera === "Defesa")
  } else if (body.tipo === "ambiental") {
    destinatarios = AUTORIDADES.filter((a) => a.orgao.match(/IBAMA|ICMBio|SEMAD|PMMG|Defesa Civil|Polícia/))
  }

  // Latência simulada de transmissão segura (TLS 1.3)
  await new Promise((r) => setTimeout(r, 350))

  return NextResponse.json({
    sucesso: true,
    protocolo,
    enviadoEm: new Date().toISOString(),
    canal: "SMTP-GOV seguro · TLS 1.3 · assinatura ICP-Brasil",
    total: destinatarios.length,
    destinatarios: destinatarios.map((d) => ({
      ...d,
      status: "ENTREGUE",
      confirmacao: `R-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    })),
    assunto: `[AURORA XAI] ${body.severidade?.toUpperCase() ?? "ALERTA"} — ${body.titulo ?? "Evento de soberania nacional"}`,
  })
}
