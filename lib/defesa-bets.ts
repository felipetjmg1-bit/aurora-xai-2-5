// Motor simulado de defesa digital: varredura DNS e mitigação de bets ilegais.
// Mantém estado em memória do servidor (log de neutralizações).

export interface PlataformaSuspeita {
  id: string
  dominio: string
  ip: string
  tipo: "predicao-proibida" | "sem-licenca" | "dominio-falsificado" | "clone-autorizada"
  risco: number // 0-100
  detectadaEm: string
}

export interface RegistroNeutralizado {
  id: string
  dominio: string
  ip: string
  tipo: PlataformaSuspeita["tipo"]
  metodo: "Sinkholing DNS" | "Bloqueio na Operadora"
  neutralizadaEm: string
}

// 187 plataformas autorizadas pelo Ministério da Fazenda (amostra representativa)
const AUTORIZADAS = new Set([
  "betano.bet.br",
  "bet365.bet.br",
  "betnacional.bet.br",
  "kto.bet.br",
  "superbet.bet.br",
])

const TLDS_SUSPEITOS = ["bet-vip.top", "ganhe-agora.click", "pix7.win", "luckybr.bet", "aposta-facil.online", "predicaopro.io"]
const PREFIXOS = ["mega", "ultra", "super", "turbo", "gold", "royal", "fortune", "diamond"]
const RAIZES = ["bet", "aposta", "cassino", "tiger", "fortune", "spin", "jogo"]

function randIp() {
  return `${rnd(45, 210)}.${rnd(0, 255)}.${rnd(0, 255)}.${rnd(1, 254)}`
}
function rnd(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Estado do servidor (sobrevive entre requisições no mesmo runtime)
const neutralizadas: RegistroNeutralizado[] = []
let totalVarreduras = 0
let totalRequisicoesDns = 184_320

export function varrerRede(qtd = 6): { suspeitas: PlataformaSuspeita[]; requisicoesDns: number; varreduras: number } {
  totalVarreduras += 1
  totalRequisicoesDns += rnd(1800, 4200)
  const tipos: PlataformaSuspeita["tipo"][] = [
    "predicao-proibida",
    "sem-licenca",
    "dominio-falsificado",
    "clone-autorizada",
  ]
  const suspeitas: PlataformaSuspeita[] = Array.from({ length: qtd }, () => {
    const tipo = pick(tipos)
    const dominio =
      tipo === "clone-autorizada"
        ? `${pick(["betan0", "bet365x", "kt0", "superbett"])}.${pick(TLDS_SUSPEITOS)}`
        : `${pick(PREFIXOS)}${pick(RAIZES)}.${pick(TLDS_SUSPEITOS)}`
    return {
      id: `SUS-${Math.random().toString(36).slice(2, 9).toUpperCase()}`,
      dominio,
      ip: randIp(),
      tipo,
      risco: rnd(72, 99),
      detectadaEm: new Date().toISOString(),
    }
  }).filter((s) => !AUTORIZADAS.has(s.dominio))

  return { suspeitas, requisicoesDns: totalRequisicoesDns, varreduras: totalVarreduras }
}

export function mitigar(dominio: string, ip: string, tipo: PlataformaSuspeita["tipo"]): RegistroNeutralizado {
  const registro: RegistroNeutralizado = {
    id: `NEU-${Math.random().toString(36).slice(2, 9).toUpperCase()}`,
    dominio,
    ip,
    tipo,
    metodo: Math.random() > 0.5 ? "Sinkholing DNS" : "Bloqueio na Operadora",
    neutralizadaEm: new Date().toISOString(),
  }
  neutralizadas.unshift(registro)
  return registro
}

export function getEstadoBets() {
  return {
    neutralizadas: neutralizadas.slice(0, 50),
    totalNeutralizadas: neutralizadas.length + 1294, // baseline histórico
    requisicoesDns: totalRequisicoesDns,
    varreduras: totalVarreduras,
    autorizadas: 187,
  }
}
