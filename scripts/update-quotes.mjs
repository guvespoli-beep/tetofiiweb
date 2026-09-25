import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { FII_DATABASE } from '../src/data/fiiDatabase.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Mapeamento dos tickers com CNPJs limpos
const TICKERS = FII_DATABASE.map(f => f.ticker);
if (!TICKERS.includes('IFIX')) TICKERS.push('IFIX');

const cnpjToTicker = {};
for (const f of FII_DATABASE) {
  if (f.cnpj) {
    const raw = f.cnpj.replace(/\D/g, '');
    cnpjToTicker[raw] = f.ticker;
  }
}

// 2. Função para baixar informe CVM mais recente usando Python nativo (presente no Ubuntu do GitHub Actions)
function fetchCvmLatestVpData() {
  console.log('\n--- 1. Consultando Dados Abertos da CVM (Informes Mensais de FIIs) ---');
  const pythonScript = `
import urllib.request, zipfile, io, csv, json, sys
from datetime import datetime

current_year = datetime.now().year
years_to_check = [current_year, current_year - 1]

vp_results = {}
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for yr in years_to_check:
    url = f'https://dados.cvm.gov.br/dados/FII/DOC/INF_MENSAL/DADOS/inf_mensal_fii_{yr}.zip'
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as resp:
            zip_bytes = resp.read()
            with zipfile.ZipFile(io.BytesIO(zip_bytes)) as z:
                # O arquivo com Valor_Patrimonial_Cotas é o inf_mensal_fii_complemento_ANO.csv
                target_file = None
                for fname in z.namelist():
                    if 'complemento' in fname.lower():
                        target_file = fname
                        break
                
                if not target_file:
                    continue
                
                with z.open(target_file) as f:
                    reader = csv.DictReader(io.TextIOWrapper(f, encoding='latin1'), delimiter=';')
                    for row in reader:
                        cnpj = row.get('CNPJ_Fundo_Classe', '').replace('.', '').replace('/', '').replace('-', '').strip()
                        raw_vp = row.get('Valor_Patrimonial_Cotas', '').replace(',', '.').strip()
                        data_ref = row.get('Data_Referencia', '').strip()
                        versao = int(row.get('Versao', '1') or '1')
                        
                        if not cnpj or not raw_vp:
                            continue
                        
                        try:
                            vp_val = float(raw_vp)
                            if vp_val <= 0:
                                continue
                        except:
                            continue
                        
                        # Guardar se for mais recente (por Data_Referencia e Versao)
                        prev = vp_results.get(cnpj)
                        if not prev or (data_ref > prev['data_ref']) or (data_ref == prev['data_ref'] and versao > prev.get('versao', 0)):
                            vp_results[cnpj] = {
                                'vp': round(vp_val, 2),
                                'data_ref': data_ref,
                                'versao': versao
                            }
    except Exception as e:
        sys.stderr.write(f'Aviso CVM {yr}: {e}\\n')

print(json.dumps(vp_results))
`;

  try {
    const res = spawnSync('python3', ['-c', pythonScript], { encoding: 'utf-8', timeout: 45000 });
    if (res.status === 0 && res.stdout) {
      const data = JSON.parse(res.stdout);
      console.log(`✓ CVM: Encontrados dados de ${Object.keys(data).length} CNPJs no portal oficial.`);
      return data;
    } else {
      console.warn('CVM: Não foi possível obter zip via Python:', res.stderr || 'status code ' + res.status);
    }
  } catch (err) {
    console.warn('CVM aviso:', err.message);
  }
  return {};
}

// 3. Função para buscar cotação de mercado na B3
async function fetchQuote(ticker) {
  const symbol = ticker === 'IFIX' ? '%5EIFIX' : `${ticker}.SA`;
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
      },
    });

    if (!res.ok) return null;

    const data = await res.json();
    const result = data?.chart?.result?.[0];
    const meta = result?.meta;
    if (!meta) return null;

    const price = meta.regularMarketPrice ?? meta.chartPreviousClose;
    const prevClose = meta.chartPreviousClose ?? price;
    const change = meta.regularMarketChange ?? (price - prevClose);
    const changePercent = meta.regularMarketChangePercent ?? (prevClose > 0 ? (change / prevClose) * 100 : 0);

    return {
      ticker,
      price: Number(price.toFixed(2)),
      previousClose: Number(prevClose.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      high: meta.regularMarketDayHigh ? Number(meta.regularMarketDayHigh.toFixed(2)) : price,
      low: meta.regularMarketDayLow ? Number(meta.regularMarketDayLow.toFixed(2)) : price,
      timestamp: Date.now(),
      source: 'B3 Oficial (Tempo Real/Yahoo)',
    };
  } catch {
    return null;
  }
}

function formatCvmDate(isoDate) {
  if (!isoDate) return '';
  const [year, month] = isoDate.split('-');
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const mIndex = parseInt(month, 10) - 1;
  if (mIndex >= 0 && mIndex < 12) {
    return `${months[mIndex]}/${year}`;
  }
  return isoDate;
}

async function run() {
  console.log('=== Início da Sincronização Oficial TETOFII (VP CVM + Cotações B3) ===');

  // Passo A: Obter os VPs oficiais mais recentes da CVM
  const cvmMap = fetchCvmLatestVpData();

  // Passo B: Carregar quotes.json anterior para manter histórico de fallback se alguma API externa oscilar
  const outputPath = path.join(__dirname, '../public/quotes.json');
  let previousPayload = { quotes: {} };
  try {
    if (fs.existsSync(outputPath)) {
      previousPayload = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
    }
  } catch {
    // ignora
  }

  // Passo C: Atualizar cotações B3 e correlacionar com o VP da CVM
  console.log('\n--- 2. Consultando Cotações de Mercado B3 ---');
  const quotesMap = {};

  for (const ticker of TICKERS) {
    const quote = await fetchQuote(ticker);
    const prevItem = previousPayload?.quotes?.[ticker] || {};

    // Buscar dados da CVM para este ticker
    const fund = FII_DATABASE.find(f => f.ticker === ticker);
    const rawCnpj = fund?.cnpj ? fund.cnpj.replace(/\D/g, '') : null;
    const cvmRecord = rawCnpj ? cvmMap[rawCnpj] : null;

    let vpPerShare = prevItem.vpPerShare || fund?.vpPerShare || 0;
    let cvmReportDate = prevItem.cvmReportDate || fund?.cvmReportDate || '';

    if (cvmRecord && cvmRecord.vp > 0) {
      vpPerShare = cvmRecord.vp;
      cvmReportDate = formatCvmDate(cvmRecord.data_ref);
    }

    if (quote) {
      quotesMap[ticker] = {
        ...quote,
        vpPerShare,
        cvmReportDate,
        cvmUpdated: Boolean(cvmRecord),
      };
      const logVp = vpPerShare > 0 ? `| VP CVM: R$ ${vpPerShare.toFixed(2)} (${cvmReportDate})` : '';
      console.log(`✓ ${ticker.padEnd(8)}: R$ ${quote.price.toFixed(2).padStart(6)} (${quote.changePercent >= 0 ? '+' : ''}${quote.changePercent.toFixed(2)}%) ${logVp}`);
    } else if (prevItem.price) {
      quotesMap[ticker] = {
        ...prevItem,
        vpPerShare,
        cvmReportDate,
        cvmUpdated: Boolean(cvmRecord),
      };
      console.log(`~ ${ticker.padEnd(8)}: mantendo cotação anterior R$ ${prevItem.price.toFixed(2)} | VP: R$ ${vpPerShare.toFixed(2)}`);
    }

    await new Promise((r) => setTimeout(r, 100));
  }

  const payload = {
    updatedAt: new Date().toISOString(),
    updatedAtFormatted: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
    total: Object.keys(quotesMap).length,
    quotes: quotesMap,
  };

  fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2), 'utf-8');
  console.log(`\n✅ Sucesso absoluto! ${payload.total} fundos atualizados com VP CVM e Cotações B3 em ${outputPath}`);
}

run();
