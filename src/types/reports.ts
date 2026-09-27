export interface FiiReportHighlight {
  id: string;
  ticker: string;
  fundName: string;
  segment: string;
  reportMonth: string; // e.g. "Agosto de 2026"
  publishedAt: string; // ISO "2026-09-26"
  publishedAtFormatted: string; // "26/09/2026"
  title: string;
  summaryBadge?: string;
  pdfUrl?: string; // Link direto para o PDF oficial
  pdfFilename?: string; // Nome sugerido do arquivo para download
  
  // Dados estruturados
  gestor: string;
  administrador: string;
  taxaAdmTotal: string;
  guidance?: string;
  
  indicadores: {
    label: string;
    value: string;
    sublabel?: string;
    highlight?: boolean;
  }[];

  outrosPontosRelevantes: string[];
  
  principaisInquilinos?: string[];
  observacaoTetoFii?: string;
}
