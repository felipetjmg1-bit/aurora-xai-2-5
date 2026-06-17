// Camada de simulação determinística-aleatória para o Ecossistema Aurora XAI 2.5.0
// Gera telemetria coerente para Mineração, DREX e AURORA-KIDS.

export type MineralKey = "niobio" | "litio" | "quartzo"

export interface ComplexoMinerador {
  id: string
  nome: string
  operadora: string
  local: string
  uf: string
  mineralPrincipal: MineralKey
  status: "operacional" | "manutencao" | "expansao"
}

export const COMPLEXOS: ComplexoMinerador[] = [
  {
    id: "cmd-anglo",
    nome: "Complexo Minas-Rio",
    operadora: "Anglo American",
    local: "Conceição do Mato Dentro",
    uf: "MG",
    mineralPrincipal: "niobio",
    status: "operacional",
  },
  {
    id: "araxa",
    nome: "Unidade Araxá",
    operadora: "CBMM",
    local: "Araxá",
    uf: "MG",
    mineralPrincipal: "niobio",
    status: "expansao",
  },
  {
    id: "carajas",
    nome: "Província Carajás",
    operadora: "Vale S.A.",
    local: "Parauapebas",
    uf: "PA",
    mineralPrincipal: "quartzo",
    status: "operacional",
  },
  {
    id: "jequitinhonha",
    nome: "Vale do Jequitinhonha",
    operadora: "Sigma Lithium",
    local: "Itinga",
    uf: "MG",
    mineralPrincipal: "litio",
    status: "expansao",
  },
]

export interface TelemetriaComplexo {
  id: string
  extracaoDiariaT: number // toneladas/dia
  eficienciaRefino: number // %
  estoqueEstrategicoT: number // toneladas
  pureza: number // %
  uptime: number // %
}

function jitter(base: number, pct: number) {
  const delta = base * pct
  return base + (Math.random() * 2 - 1) * delta
}

export function gerarTelemetriaMineracao(): TelemetriaComplexo[] {
  return COMPLEXOS.map((c) => {
    const bases: Record<string, number> = {
      "cmd-anglo": 18400,
      araxa: 9200,
      carajas: 31500,
      jequitinhonha: 6100,
    }
    const base = bases[c.id] ?? 8000
    return {
      id: c.id,
      extracaoDiariaT: Math.round(jitter(base, 0.06)),
      eficienciaRefino: +jitter(c.status === "expansao" ? 91 : 96, 0.02).toFixed(1),
      estoqueEstrategicoT: Math.round(jitter(base * 14, 0.04)),
      pureza: +jitter(c.mineralPrincipal === "niobio" ? 99.2 : c.mineralPrincipal === "litio" ? 99.5 : 99.8, 0.003).toFixed(2),
      uptime: +jitter(99.4, 0.004).toFixed(2),
    }
  })
}

// Projeto Sebastian — potencial elétrico e direcionamento para VE nacional
export function calcularProjetoSebastian(telemetria: TelemetriaComplexo[]) {
  const metaGWh = 800
  const litio = telemetria
    .filter((t) => COMPLEXOS.find((c) => c.id === t.id)?.mineralPrincipal === "litio")
    .reduce((acc, t) => acc + t.estoqueEstrategicoT, 0)
  const niobio = telemetria
    .filter((t) => COMPLEXOS.find((c) => c.id === t.id)?.mineralPrincipal === "niobio")
    .reduce((acc, t) => acc + t.estoqueEstrategicoT, 0)

  // Fator de conversão simulado: t de mineral processado -> GWh de capacidade de bateria
  const potencialGWh = +((litio * 0.0072 + niobio * 0.0011) % (metaGWh * 1.2)).toFixed(1)
  const progresso = +Math.min(100, (potencialGWh / metaGWh) * 100).toFixed(1)
  // Materiais direcionados à indústria nacional de VE (toneladas/dia)
  const materiaisVE = Math.round((litio + niobio) * 0.018)

  return { metaGWh, potencialGWh, progresso, materiaisVE }
}

// Série temporal para gráficos de tendência
export function gerarSerieHistorica(pontos = 24) {
  const agora = Date.now()
  return Array.from({ length: pontos }, (_, i) => {
    const t = new Date(agora - (pontos - 1 - i) * 60 * 60 * 1000)
    return {
      hora: `${String(t.getHours()).padStart(2, "0")}:00`,
      niobio: Math.round(jitter(620, 0.12)),
      litio: Math.round(jitter(410, 0.15)),
      quartzo: Math.round(jitter(880, 0.1)),
    }
  })
}

// ---------- DREX ----------
export interface TransacaoDrex {
  id: string
  carteira: string
  valor: number
  scoreRisco: number
  classificacao: "aprovada" | "revisao" | "bloqueada"
  latenciaMs: number
  timestamp: string
}

const CARTEIRAS = ["BR-CB-0xA1", "BR-ITAU-0x4F", "BR-CEF-0x88", "BR-BB-0x2D", "BR-NU-0x9C", "BR-SAFRA-0x71"]

export function gerarTransacaoDrex(): TransacaoDrex {
  const score = +Math.random().toFixed(2)
  const classificacao = score > 0.82 ? "bloqueada" : score > 0.55 ? "revisao" : "aprovada"
  return {
    id: `DREX-${Math.random().toString(36).slice(2, 9).toUpperCase()}`,
    carteira: CARTEIRAS[Math.floor(Math.random() * CARTEIRAS.length)],
    valor: +(Math.random() * 480000 + 500).toFixed(2),
    scoreRisco: score,
    classificacao,
    latenciaMs: +(Math.random() * 6 + 9).toFixed(0),
    timestamp: new Date().toISOString(),
  }
}

export function gerarLoteDrex(n = 8): TransacaoDrex[] {
  return Array.from({ length: n }, gerarTransacaoDrex)
}

// ---------- Soberania Ambiental: Desmatamento + Clima ----------
export interface BiomaMonitorado {
  id: string
  nome: string
  uf: string
  areaTotalKm2: number
}

export const BIOMAS: BiomaMonitorado[] = [
  { id: "amazonia", nome: "Amazônia Legal", uf: "AM/PA/MT", areaTotalKm2: 5217423 },
  { id: "cerrado", nome: "Cerrado", uf: "GO/MT/MG", areaTotalKm2: 1983017 },
  { id: "mata-atlantica", nome: "Mata Atlântica", uf: "MG/SP/BA", areaTotalKm2: 1110182 },
  { id: "pantanal", nome: "Pantanal", uf: "MS/MT", areaTotalKm2: 150355 },
  { id: "caatinga", nome: "Caatinga", uf: "BA/PE/CE", areaTotalKm2: 844453 },
]

export interface AlertaDesmatamento {
  id: string
  bioma: string
  bioma_nome: string
  uf: string
  areaHa: number
  tipo: "corte raso" | "degradação" | "queimada" | "garimpo ilegal"
  satelite: "DETER/INPE" | "PRODES/INPE" | "Sentinel-2" | "Landsat-9"
  severidade: "crítico" | "alto" | "moderado"
  lat: number
  lon: number
  timestamp: string
  acao: "fiscalização despachada" | "embargo automático" | "em análise"
}

const TIPOS_DESM = ["corte raso", "degradação", "queimada", "garimpo ilegal"] as const
const SATELITES = ["DETER/INPE", "PRODES/INPE", "Sentinel-2", "Landsat-9"] as const

export function gerarAlertaDesmatamento(): AlertaDesmatamento {
  const b = BIOMAS[Math.floor(Math.random() * BIOMAS.length)]
  const areaHa = +(Math.random() * 320 + 4).toFixed(1)
  const tipo = TIPOS_DESM[Math.floor(Math.random() * TIPOS_DESM.length)]
  const severidade = areaHa > 180 ? "crítico" : areaHa > 60 ? "alto" : "moderado"
  const acao =
    severidade === "crítico"
      ? "fiscalização despachada"
      : tipo === "garimpo ilegal"
        ? "embargo automático"
        : "em análise"
  return {
    id: `DETER-${Math.random().toString(36).slice(2, 9).toUpperCase()}`,
    bioma: b.id,
    bioma_nome: b.nome,
    uf: b.uf,
    areaHa,
    tipo,
    satelite: SATELITES[Math.floor(Math.random() * SATELITES.length)],
    severidade,
    lat: +(Math.random() * -28 - 2).toFixed(3),
    lon: +(Math.random() * -28 - 44).toFixed(3),
    timestamp: new Date().toISOString(),
    acao,
  }
}

export function gerarLoteDesmatamento(n = 7): AlertaDesmatamento[] {
  return Array.from({ length: n }, gerarAlertaDesmatamento)
}

export interface IndicadorClima {
  id: string
  bioma: string
  bioma_nome: string
  tempC: number
  umidade: number // %
  riscoFogo: number // 0-100
  co2ppm: number
  precipMm: number
  qualidadeAr: "boa" | "moderada" | "ruim"
}

export function gerarClima(): IndicadorClima[] {
  return BIOMAS.map((b) => {
    const baseTemp: Record<string, number> = {
      amazonia: 28,
      cerrado: 31,
      "mata-atlantica": 24,
      pantanal: 33,
      caatinga: 35,
    }
    const temp = +jitter(baseTemp[b.id] ?? 28, 0.08).toFixed(1)
    const umidade = +jitter(b.id === "caatinga" ? 38 : 68, 0.12).toFixed(0)
    const riscoFogo = +Math.min(100, Math.max(0, (temp - 18) * 3 + (100 - umidade) * 0.6 + jitter(10, 0.5))).toFixed(0)
    const qualidadeAr = riscoFogo > 70 ? "ruim" : riscoFogo > 45 ? "moderada" : "boa"
    return {
      id: b.id,
      bioma: b.id,
      bioma_nome: b.nome,
      tempC: temp,
      umidade,
      riscoFogo,
      co2ppm: +jitter(421, 0.02).toFixed(0),
      precipMm: +jitter(b.id === "amazonia" ? 12 : 4, 0.6).toFixed(1),
      qualidadeAr,
    }
  })
}

export function calcularSoberaniaAmbiental(
  alertas: AlertaDesmatamento[],
  clima: IndicadorClima[],
) {
  const areaTotalHa = +alertas.reduce((a, x) => a + x.areaHa, 0).toFixed(1)
  const criticos = alertas.filter((a) => a.severidade === "crítico").length
  const embargos = alertas.filter((a) => a.acao !== "em análise").length
  const riscoFogoMedio = Math.round(clima.reduce((a, c) => a + c.riscoFogo, 0) / (clima.length || 1))
  // Índice de Soberania Ambiental (quanto maior, mais protegido)
  const indiceSoberania = +Math.max(
    0,
    Math.min(100, 100 - areaTotalHa * 0.05 - criticos * 3 - riscoFogoMedio * 0.15),
  ).toFixed(1)
  return { areaTotalHa, criticos, embargos, riscoFogoMedio, indiceSoberania }
}

export function gerarSerieDesmatamento(pontos = 24) {
  const agora = Date.now()
  return Array.from({ length: pontos }, (_, i) => {
    const t = new Date(agora - (pontos - 1 - i) * 60 * 60 * 1000)
    return {
      hora: `${String(t.getHours()).padStart(2, "0")}:00`,
      alertas: Math.round(jitter(14, 0.5)),
      areaHa: Math.round(jitter(120, 0.4)),
    }
  })
}
