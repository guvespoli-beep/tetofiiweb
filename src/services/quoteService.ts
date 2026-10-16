/**
 * Serviço de Cotações em Tempo Real para Fundos Imobiliários da B3 (TETOFII)
 * Suporte híbrido:
 * 1. Cache estático atualizado public/quotes.json (Zero CORS, 100% funcional no GitHub Pages / gvlab.com.br)
 * 2. Backend proxy local /api/quote/:ticker (para desenvolvimento e preview)
 * 3. Fallback dinâmico via proxies abertos de mercado financeiro
 */

export interface LiveQuoteResult {
  ticker: string;
  price: number;
  change?: number;
  changePercent?: number;
  previousClose?: number;
  vpPerShare?: number;
  cvmReportDate?: string;
  source: string;
  timestamp?: number;
  timeString: string;
}

export interface CvmVpaResult {
  ticker: string;
  vpa: number;
  dataReferencia: string;
  dataRefFormatada: string;
  versao?: number;
  cnpj?: string;
  fonte?: string;
}

let cachedQuotesFile: Record<string, LiveQuoteResult> | null = null;
let quotesFilePromise: Promise<Record<string, LiveQuoteResult>> | null = null;

let cachedCvmVpaFile: Record<string, CvmVpaResult> | null = null;
let cvmVpaPromise: Promise<Record<string, CvmVpaResult>> | null = null;

/**
 * Carrega a base de VPA oficial da CVM gerada pelo crawler de Dados Abertos (Resolução CVM 175).
 * Fonte: /api/cvm/vpa (backend) ou ./cvm_fii_vpa.json (estático GitHub Pages / fallback).
 */
export async function loadAllCvmVpa(): Promise<Record<string, CvmVpaResult>> {
  if (cachedCvmVpaFile) return cachedCvmVpaFile;
  if (cvmVpaPromise) return cvmVpaPromise;

  cvmVpaPromise = (async () => {
    // 1. Tentar endpoint de backend /api/cvm/vpa
    try {
      const res = await fetch('/api/cvm/vpa');
      if (res.ok) {
        const data = await res.json();
        if (data && data.vpa) {
          cachedCvmVpaFile = data.vpa;
          return data.vpa;
        }
      }
    } catch {
      // continua para o fallback de arquivo estático
    }

    // 2. Fallback para arquivo estático cvm_fii_vpa.json
    try {
      const res = await fetch('./cvm_fii_vpa.json?v=' + Date.now(), { cache: 'no-cache' });
      if (res.ok) {
        const data = await res.json();
        if (data && data.vpa) {
          cachedCvmVpaFile = data.vpa;
          return data.vpa;
        }
      }
    } catch {
      // ignore
    }

    return {};
  })();

  return cvmVpaPromise;
}

/**
 * Busca o VPA oficial de um FII específico na CVM (em milissegundos).
 * Rota padrão: /api/fii/vpa/:ticker
 */
export async function fetchCvmVpa(rawTicker: string): Promise<CvmVpaResult | null> {
  const cleanTicker = rawTicker.trim().toUpperCase().replace('.SA', '');
  if (!cleanTicker) return null;

  // 1. Tenta endpoint direto no backend
  try {
    const res = await fetch(`/api/fii/vpa/${cleanTicker}`);
    if (res.ok) {
      const item: CvmVpaResult = await res.json();
      if (item && item.vpa > 0) return item;
    }
  } catch {
    // continua
  }

  // 2. Consulta mapa em memória / cvm_fii_vpa.json
  try {
    const map = await loadAllCvmVpa();
    if (map[cleanTicker]) {
      return map[cleanTicker];
    }
  } catch {
    // continua
  }

  return null;
}

/**
 * Carrega a base de cotações e VPs estática /quotes.json gerada na compilação do site.
 * Funciona nativamente em qualquer hospedagem estática (GitHub Pages, Vercel, Cloudflare).
 */
export async function loadStaticQuotes(): Promise<Record<string, LiveQuoteResult>> {
  if (cachedQuotesFile) return cachedQuotesFile;
  if (quotesFilePromise) return quotesFilePromise;

  quotesFilePromise = (async () => {
    try {
      // Usa caminho relativo para suportar base URL do GitHub Pages e domínio raiz
      const res = await fetch('./quotes.json?v=' + Date.now(), { cache: 'no-cache' });
      if (res.ok) {
        const data = await res.json();
        const map: Record<string, LiveQuoteResult> = {};
        if (data && data.quotes) {
          for (const [t, item] of Object.entries<any>(data.quotes)) {
            map[t] = {
              ticker: t,
              price: item.price,
              change: item.change ?? 0,
              changePercent: item.changePercent ?? 0,
              previousClose: item.previousClose ?? item.price,
              vpPerShare: item.vpPerShare,
              cvmReportDate: item.cvmReportDate,
              source: 'B3 Oficial (Tempo Real/CVM)',
              timestamp: item.timestamp ?? Date.now(),
              timeString: new Date(item.timestamp || Date.now()).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              }),
            };
          }
        }
        cachedQuotesFile = map;
        return map;
      }
    } catch {
      // Ignora erro e continua
    }
    return {};
  })();

  return quotesFilePromise;
}

export async function fetchLiveQuote(rawTicker: string): Promise<LiveQuoteResult | null> {
  const cleanTicker = rawTicker.trim().toUpperCase().replace('.SA', '');
  if (!cleanTicker) return null;

  // 1. Tenta buscar via endpoint de backend local (/api/quote/:ticker) se existir
  try {
    const response = await fetch(`/api/quote/${cleanTicker}`);
    if (response.ok) {
      const data = await response.json();
      if (typeof data.price === 'number' && data.price > 0) {
        return {
          ticker: cleanTicker,
          price: data.price,
          change: data.change,
          changePercent: data.changePercent,
          previousClose: data.previousClose,
          vpPerShare: data.vpPerShare,
          cvmReportDate: data.cvmReportDate,
          source: data.source || 'Yahoo Finance (B3)',
          timestamp: data.timestamp,
          timeString: new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
        };
      }
    }
  } catch {
    // Backend indisponível (hospedagem estática GitHub Pages)
  }

  // 2. Consulta a base de cotações atualizadas em public/quotes.json (instantânea no GitHub Pages)
  try {
    const staticMap = await loadStaticQuotes();
    if (staticMap[cleanTicker] && staticMap[cleanTicker].price > 0) {
      return staticMap[cleanTicker];
    }
  } catch {
    // continua
  }

  // 3. Fallback: tentar buscar via proxies públicos sem CORS para qualquer FII da B3 não catalogado
  const corsProxies = [
    `https://corsproxy.io/?url=${encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${cleanTicker}.SA?interval=1d&range=1d`)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${cleanTicker}.SA?interval=1d&range=1d`)}`
  ];

  for (const proxyUrl of corsProxies) {
    try {
      const directRes = await fetch(proxyUrl, { signal: AbortSignal.timeout(3500) });
      if (directRes.ok) {
        const json = await directRes.json();
        const meta = json?.chart?.result?.[0]?.meta;
        const price = meta?.regularMarketPrice ?? meta?.chartPreviousClose;
        if (typeof price === 'number' && price > 0) {
          return {
            ticker: cleanTicker,
            price: Number(price.toFixed(2)),
            change: meta?.regularMarketChange,
            changePercent: meta?.regularMarketChangePercent,
            previousClose: meta?.chartPreviousClose,
            source: 'B3 em Tempo Real',
            timestamp: Date.now(),
            timeString: new Date().toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }),
          };
        }
      }
    } catch {
      // Tenta o próximo proxy
    }
  }

  return null;
}
