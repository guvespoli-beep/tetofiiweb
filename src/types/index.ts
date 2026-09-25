export type FiiSegment =
  | 'Shoppings'
  | 'Logística'
  | 'Lajes Corporativas'
  | 'Renda Urbana'
  | 'Híbrido'
  | 'Hospitalar'
  | 'Educacional'
  | 'Hotéis'
  | 'Terras Agrícolas'
  | 'Cemitérios'
  | 'Residencial'
  | 'Agências Bancárias';

export interface FiiData {
  ticker: string;
  previousTickers: string[];
  name: string;
  management: string;
  segment: FiiSegment;
  cnpj: string;
  vpPerShare: number;
  cvmReportDate: string;
  currentMarketPrice: number;
  monthlyDividend: number;
  annualDividend: number;
  dividendYield: number; // in %
  ifixWeight: number; // Peso na carteira teórica do IFIX em %
  netWorth: number; // Patrimônio Líquido em R$ bilhões
  shareholdersCount: number; // Número de cotistas
  searchPopularityScore: number; // Índice de pesquisas e volume de interesse dos investidores (0 a 100)
  relevanceScore: number; // Score composto de relevância de mercado (0 a 100)
  relevanceRank: number; // Posição ordinal no ranking de relevância
  inRadar?: boolean; // Define se aparece na tabela do Radar de Tijolo
  notes?: string;
  tickerChangeReason?: string;
  numberOfProperties?: number;
  grossLeasableAreaM2?: number;
}

export interface CalculationInput {
  ticker: string;
  currentPrice: number;
  referenceRate: number; // e.g. 6.30 (%)
  riskPremium: number; // e.g. 2.00 (%)
  monthlyDividend: number; // e.g. 0.85 (R$)
  vpPerShare: number; // e.g. 104.50 (R$)
}

export interface CalculationResult {
  discountRate: number; // Taxa de Referência + Prêmio de Risco (%)
  annualDividend: number; // Provento Mensal * 12 (R$)
  ceilingPrice: number; // Preço Teto ((Provento * 12) / (Taxa + Prêmio)) * 100
  pvp: number; // Preço Atual / VP
  pvpAnalysis: 'ABAIXO_DO_VP' | 'NO_VP' | 'ACIMA_DO_VP' | 'SEM_DADOS';
  pvpDiscountOrPremiumPercent: number; // % desconto se < 1 ou % ágio se > 1
  priceToCeilingRatio: number; // (Preço Atual / Preço Teto) * 100
  ceilingAnalysis: 'ABAIXO_DO_PRECO_TETO' | 'NO_PRECO_TETO' | 'ACIMA_DO_PRECO_TETO';
  safetyMarginPercentage: number; // Margem de segurança: ((Preço Teto - Preço Atual) / Preço Teto) * 100
  currentYield: number; // (Provento * 12 / Preço Atual) * 100
}

export interface ExplanationTopic {
  id: string;
  title: string;
  badge: string;
  summary: string;
  detailedContent: string[];
  formula?: string;
  formulaDescription?: string;
  example?: {
    title: string;
    scenario: string;
    result: string;
  };
  externalLinks?: {
    label: string;
    url: string;
    description?: string;
  }[];
}
