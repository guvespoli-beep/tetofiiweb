import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { FII_DATABASE } from './src/data/fiiDatabase.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

function getPort(): number {
  const portArgIndex = process.argv.indexOf('--port');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    return parseInt(process.argv[portArgIndex + 1], 10);
  }
  return parseInt(process.env.PORT || '3000', 10);
}

const PORT = getPort();
const isProd = process.env.NODE_ENV === 'production';

interface CachedQuote {
  price: number;
  change?: number;
  changePercent?: number;
  previousClose?: number;
  timestamp: number;
  source: string;
}

const quoteCache = new Map<string, CachedQuote>();
const CACHE_TTL_MS = 60 * 1000; // 1 minuto de cache

async function fetchYahooQuote(rawTicker: string): Promise<CachedQuote | null> {
  const cleanTicker = rawTicker.trim().toUpperCase().replace('.SA', '');
  const yahooSymbol = `${cleanTicker}.SA`;

  const cached = quoteCache.get(cleanTicker);
  const now = Date.now();
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached;
  }

  const endpoints = [
    `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=1d`,
    `https://query2.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=1d`,
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(6000),
      });

      if (!response.ok) continue;

      const data = await response.json();
      const meta = data?.chart?.result?.[0]?.meta;
      const price = meta?.regularMarketPrice ?? meta?.chartPreviousClose;

      if (typeof price === 'number' && price > 0) {
        const quote: CachedQuote = {
          price: Number(price.toFixed(2)),
          change:
            meta?.regularMarketChange ??
            (price - (meta?.chartPreviousClose || price)),
          changePercent: meta?.regularMarketChangePercent ?? 0,
          previousClose: meta?.chartPreviousClose,
          timestamp: now,
          source: 'Yahoo Finance (B3 BVMF)',
        };
        quoteCache.set(cleanTicker, quote);
        return quote;
      }
    } catch {
      // Tentar próximo endpoint
    }
  }

  return null;
}

interface CvmVpaItem {
  ticker: string;
  vpa: number;
  dataReferencia: string;
  dataRefFormatada: string;
  versao?: number;
  cnpj?: string;
  fonte?: string;
}

let cvmVpaMemoryMap: Record<string, CvmVpaItem> = {};

function loadCvmVpaCacheFromDisk() {
  try {
    const vpaPath = path.resolve(__dirname, 'public', 'cvm_fii_vpa.json');
    if (fs.existsSync(vpaPath)) {
      const content = fs.readFileSync(vpaPath, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && parsed.vpa) {
        cvmVpaMemoryMap = parsed.vpa;
        console.log(`[CVM Cache] Carregados ${Object.keys(cvmVpaMemoryMap).length} VPs oficiais da CVM em memória.`);
      }
    }
  } catch (err: any) {
    console.warn('[CVM Cache] Aviso ao ler cvm_fii_vpa.json:', err.message);
  }
}

// Carregamento inicial síncrono do cache de VPs
loadCvmVpaCacheFromDisk();

// API de consulta direta do VPA oficial da CVM por ticker (padrão TETOFII Android)
app.get('/api/fii/vpa/:ticker', (req: Request, res: Response) => {
  const rawTicker = req.params.ticker;
  if (!rawTicker) {
    res.status(400).json({ error: 'Ticker obrigatório' });
    return;
  }
  const cleanTicker = rawTicker.trim().toUpperCase().replace('.SA', '');
  const item = cvmVpaMemoryMap[cleanTicker];
  if (item) {
    res.json(item);
  } else {
    const fund = FII_DATABASE.find((f) => f.ticker === cleanTicker);
    if (fund) {
      res.json({
        ticker: fund.ticker,
        vpa: fund.vpPerShare,
        dataReferencia: fund.cvmReportDate,
        dataRefFormatada: fund.cvmReportDate,
        cnpj: fund.cnpj,
        fonte: 'Base Cadastral CVM',
      });
    } else {
      res.status(404).json({ error: `VPA oficial não encontrado para ${cleanTicker}` });
    }
  }
});

// API para carregar o mapa completo de VPAs da CVM
app.get('/api/cvm/vpa', (_req: Request, res: Response) => {
  res.json({
    lastSync: cvmSyncState.lastSync ? new Date(cvmSyncState.lastSync).toISOString() : new Date().toISOString(),
    lastSyncFormatted: cvmSyncState.lastSync ? new Date(cvmSyncState.lastSync).toLocaleString('pt-BR') : 'Hoje',
    totalFunds: Object.keys(cvmVpaMemoryMap).length,
    vpa: cvmVpaMemoryMap,
  });
});

// API de cotação em tempo real B3 cruzada com VP oficial da CVM
app.get('/api/quote/:ticker', async (req: Request, res: Response) => {
  const rawTicker = req.params.ticker;
  if (!rawTicker) {
    res.status(400).json({ error: 'Ticker obrigatório' });
    return;
  }

  const cleanTicker = rawTicker.trim().toUpperCase().replace('.SA', '');
  const quote = await fetchYahooQuote(cleanTicker);
  const fund = FII_DATABASE.find((f) => f.ticker === cleanTicker);
  const cvmInfo = cvmVpaMemoryMap[cleanTicker];

  const officialVp = cvmInfo?.vpa ?? fund?.vpPerShare;
  const officialDate = cvmInfo?.dataRefFormatada ?? fund?.cvmReportDate;

  if (quote) {
    res.json({
      ticker: cleanTicker,
      price: quote.price,
      change: quote.change,
      changePercent: quote.changePercent,
      previousClose: quote.previousClose,
      vpPerShare: officialVp,
      cvmReportDate: officialDate,
      source: quote.source,
      timestamp: quote.timestamp,
    });
  } else {
    res.status(404).json({
      error: `Cotação não encontrada para ${cleanTicker}`,
      ticker: cleanTicker,
      vpPerShare: officialVp,
      cvmReportDate: officialDate,
    });
  }
});

interface TickerTapeItem {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  category: 'indice' | 'top_cotistas' | 'maior_oscilacao';
  shareholdersCount?: number;
}

let tickerTapeCache: { items: TickerTapeItem[]; timestamp: number } | null = null;
const TAPE_CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutos

app.get('/api/ticker-tape', async (_req: Request, res: Response) => {
  const now = Date.now();
  if (tickerTapeCache && now - tickerTapeCache.timestamp < TAPE_CACHE_TTL_MS) {
    res.json({ items: tickerTapeCache.items, timestamp: tickerTapeCache.timestamp, cached: true });
    return;
  }

  try {
    // 1. Obter IFIX
    const ifixQuote = await fetchYahooQuote('IFIX');
    const ifixItem: TickerTapeItem = {
      ticker: 'IFIX',
      name: 'Índice de FIIs B3',
      price: ifixQuote?.price ?? 3732.49,
      change: ifixQuote?.change ?? 0,
      changePercent: ifixQuote?.changePercent ?? 0,
      category: 'indice',
    };

    // 2. Ordenar FIIs de tijolo pelo número de cotistas
    const sortedByShareholders = [...FII_DATABASE].sort(
      (a, b) => b.shareholdersCount - a.shareholdersCount
    );

    const top10Fiis = sortedByShareholders.slice(0, 10);
    const top10Tickers = new Set(top10Fiis.map((f) => f.ticker));

    // FIIs adicionais solicitados explicitamente (10 fundos)
    const EXPLICIT_TICKERS = [
      'HGBS11',
      'PVBI11',
      'TGAR11',
      'PMLL11',
      'ALZR11',
      'GGRC11',
      'BRCO11',
      'HSML11',
      'HGRE11',
      'FATN11',
    ];
    const explicitFiis = FII_DATABASE.filter(
      (f) => EXPLICIT_TICKERS.includes(f.ticker) && !top10Tickers.has(f.ticker)
    );
    const featuredTickers = new Set([...top10Tickers, ...EXPLICIT_TICKERS]);

    // FIIs restantes do Radar para cálculo das maiores oscilações do dia
    const remainingFiis = FII_DATABASE.filter((f) => !featuredTickers.has(f.ticker));

    // 3. Buscar cotações do top 10
    const top10Items: TickerTapeItem[] = await Promise.all(
      top10Fiis.map(async (fii) => {
        const quote = await fetchYahooQuote(fii.ticker);
        return {
          ticker: fii.ticker,
          name: fii.name,
          price: quote?.price ?? fii.currentMarketPrice,
          change: quote?.change ?? 0,
          changePercent: quote?.changePercent ?? 0,
          category: 'top_cotistas',
          shareholdersCount: fii.shareholdersCount,
        };
      })
    );

    // 4. Buscar cotações dos fundos solicitados (HGBS11, PVBI11, TGAR11, PMLL11)
    const explicitItems: TickerTapeItem[] = await Promise.all(
      explicitFiis.map(async (fii) => {
        const quote = await fetchYahooQuote(fii.ticker);
        return {
          ticker: fii.ticker,
          name: fii.name,
          price: quote?.price ?? fii.currentMarketPrice,
          change: quote?.change ?? 0,
          changePercent: quote?.changePercent ?? 0,
          category: 'top_cotistas',
          shareholdersCount: fii.shareholdersCount,
        };
      })
    );

    // 5. Buscar cotações dos restantes do Radar de FIIs de tijolo e eleger as 5 maiores oscilações do dia
    const remainingWithQuotes = await Promise.all(
      remainingFiis.map(async (fii) => {
        const quote = await fetchYahooQuote(fii.ticker);
        const changePercent = quote?.changePercent ?? 0;
        return {
          ticker: fii.ticker,
          name: fii.name,
          price: quote?.price ?? fii.currentMarketPrice,
          change: quote?.change ?? 0,
          changePercent,
          absOscillation: Math.abs(changePercent),
          category: 'maior_oscilacao' as const,
          shareholdersCount: fii.shareholdersCount,
        };
      })
    );

    // Ordenar pelas maiores oscilações absolutas (|changePercent| decrescente)
    remainingWithQuotes.sort((a, b) => b.absOscillation - a.absOscillation);
    const top5Movers: TickerTapeItem[] = remainingWithQuotes.slice(0, 5).map((item) => ({
      ticker: item.ticker,
      name: item.name,
      price: item.price,
      change: item.change,
      changePercent: item.changePercent,
      category: 'maior_oscilacao',
      shareholdersCount: item.shareholdersCount,
    }));

    // Lista final: IFIX + Top 10 Cotistas + HGBS11, PVBI11, TGAR11, PMLL11 + 5 Maiores Oscilações (todos FIIs de Tijolo do Radar)
    const combinedItems = [ifixItem, ...top10Items, ...explicitItems, ...top5Movers];

    tickerTapeCache = {
      items: combinedItems,
      timestamp: now,
    };

    res.json({ items: combinedItems, timestamp: now, cached: false });
  } catch (error) {
    console.error('Erro ao gerar ticker-tape:', error);
    if (tickerTapeCache) {
      res.json({ items: tickerTapeCache.items, timestamp: tickerTapeCache.timestamp, cached: true });
    } else {
      res.status(500).json({ error: 'Erro ao gerar letreiro' });
    }
  }
});

// =======================================================================
// SINCRONIZAÇÃO AUTOMATIZADA E PERIÓDICA DE VPs COM A CVM
// =======================================================================
interface CvmSyncState {
  lastSync: number;
  lastStatus: string;
  totalSynced: number;
  fundsWithVp: number;
  lastDetails?: any;
}

let cvmSyncState: CvmSyncState = {
  lastSync: 0,
  lastStatus: 'pending',
  totalSynced: 0,
  fundsWithVp: 0,
};

function executeCvmSync() {
  console.log('[CVM Sync] Iniciando verificação e sincronização periódica de VPs com a CVM...');
  try {
    const scriptPath = path.resolve(__dirname, 'scripts', 'cvm-sync.py');
    const result = spawnSync('python3', [scriptPath], {
      encoding: 'utf-8',
      timeout: 60000,
    });

    if (result.status === 0 && result.stdout) {
      const data = JSON.parse(result.stdout.trim());
      loadCvmVpaCacheFromDisk();
      cvmSyncState = {
        lastSync: Date.now(),
        lastStatus: 'success',
        totalSynced: data.total_db_tickers || data.total_synced || 0,
        fundsWithVp: data.funds_with_vpa || data.funds_with_vp || 0,
        lastDetails: data,
      };
      console.log(`[CVM Sync] Sincronização CVM concluída! ${cvmSyncState.fundsWithVp} fundos com VP oficial atualizados.`);
    } else {
      console.warn('[CVM Sync] Aviso no script de sincronização:', result.stderr || result.stdout);
      cvmSyncState.lastStatus = 'error';
    }
  } catch (err: any) {
    console.error('[CVM Sync] Erro ao sincronizar CVM:', err.message);
    cvmSyncState.lastStatus = 'error';
  }
}

// Endpoint para consultar status da sincronização CVM
app.get('/api/cvm/status', (_req: Request, res: Response) => {
  res.json({
    ...cvmSyncState,
    lastSyncFormatted: cvmSyncState.lastSync ? new Date(cvmSyncState.lastSync).toLocaleString('pt-BR') : 'Nunca',
  });
});

// Endpoint para disparar sincronização manual da CVM sob demanda
app.all('/api/cvm/sync', (_req: Request, res: Response) => {
  executeCvmSync();
  res.json({
    success: cvmSyncState.lastStatus === 'success',
    ...cvmSyncState,
    lastSyncFormatted: new Date(cvmSyncState.lastSync).toLocaleString('pt-BR'),
  });
});

// API de health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Servir arquivos estáticos da pasta public (incluindo PDFs oficiais de relatórios)
app.use(express.static(path.resolve(__dirname, 'public')));

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TETOFII Server running on http://0.0.0.0:${PORT}`);
    // Executa sincronização inicial 3 segundos após boot do servidor
    setTimeout(executeCvmSync, 3000);
    // Agenda checagem periódica a cada 4 horas
    setInterval(executeCvmSync, 4 * 60 * 60 * 1000);
  });
}

startServer();
