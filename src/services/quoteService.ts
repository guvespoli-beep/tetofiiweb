/**
 * Serviço de Cotações em Tempo Real para Fundos Imobiliários da B3 (TETOFII)
 * Integração com Yahoo Finance / Google Finance (BVMF)
 */

export interface LiveQuoteResult {
  ticker: string;
  price: number;
  change?: number;
  changePercent?: number;
  previousClose?: number;
  source: string;
  timestamp?: number;
  timeString: string;
}

export async function fetchLiveQuote(rawTicker: string): Promise<LiveQuoteResult | null> {
  const cleanTicker = rawTicker.trim().toUpperCase().replace('.SA', '');
  if (!cleanTicker) return null;

  try {
    // 1. Tenta buscar via endpoint de backend local (/api/quote/:ticker)
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
    // Continua para fallback se o backend estiver inacessível
  }

  // 2. Fallback: tentar buscar diretamente caso esteja em ambiente com proxy ou CORS liberado
  try {
    const directUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${cleanTicker}.SA?interval=1d&range=1d`;
    const directRes = await fetch(directUrl);
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
          source: 'Yahoo Finance (B3)',
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
    // Fallback silencioso
  }

  return null;
}
