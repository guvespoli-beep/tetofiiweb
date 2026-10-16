import urllib.request
import zipfile
import io
import csv
import json
import re
import sys
import os
from datetime import datetime

# ==============================================================================
# TETOFII - Sincronização Oficial de VPA (Valor Patrimonial por Cota) via CVM
# Baseado na arquitetura do app TETOFII ANDROID (Portal de Dados Abertos da CVM)
# Fonte primária: https://dados.cvm.gov.br/dados/FII/DOC/INF_MENSAL/DADOS/inf_mensal_fii_{ano}.zip
# Resolução CVM 175 (Informe Mensal Estruturado de FIIs)
# ==============================================================================

# Aliases de códigos ISIN para fundos que mudaram de nome/ticker ou possuem raiz histórica
ALIASES = {
    'MALL': 'PMLL11', # Patria Malls FII (ex-MALL11 Malls Brasil Plural)
    'BBPO': 'TVRI11', # Tivio Renda Imobiliária FII (ex-BBPO11)
    'HFOF': 'CPSH11', # Capitânia Shoppings FII (ex-HFOF11)
    'BTLL': 'BTLG11', # BTG Pactual Logística (ex-BTLL)
    'RBRR': 'RBRP11', # Pátria Properties (ex-RBR Properties)
    'GGRC': 'GGRC11', # Zagros Renda Imobiliária (GGR Covepi)
    'VRTA': 'VRTA11',
    'BRCO': 'BRCO11', # Bresco Logística
    'HGLG': 'HGLG11', # CSHG Logística
    'HGBS': 'HGBS11', # Hedge Brasil Shopping
    'HGRU': 'HGRU11', # CSHG Renda Urbana
    'HGRE': 'HGRE11', # CSHG Real Estate
    'KNRI': 'KNRI11', # Kinea Renda Imobiliária
    'VISC': 'VISC11', # Vinci Shopping Centers
    'VILG': 'VILG11', # Vinci Logística
    'XPLG': 'XPLG11', # XP Log
    'XPML': 'XPML11', # XP Malls
    'PVBI': 'PVBI11', # VBI Prime Properties
    'TRXF': 'TRXF11', # TRX Real Estate
    'ALZR': 'ALZR11', # Alianza Trust Renda Imobiliária
    'HSML': 'HSML11', # HSI Malls
    'LVBI': 'LVBI11', # VBI Logístico
    'VINO': 'VINO11', # Vinci Offices
    'TEPP': 'TEPP11', # Tellus Properties
    'BROF': 'BROF11', # BRPR Corporate Offices
    'RECT': 'RECT11', # REC Renda Imobiliária
    'BLMG': 'BLMG11', # BlueMacaw Logística
}

# Mapeamento manual complementar de CNPJs limpos para garantir 100% de cobertura
MANUAL_CNPJS = {
    'BRCO11': '20748515000181', # Bresco Logística FII
    'TRXF11': '28548288000152', # TRX Real Estate FII
    'PVBI11': '35652102000176', # VBI Prime Properties FII
    'HSML11': '32892018000131', # HSI Malls FII
    'LVBI11': '30629603000118', # VBI Logístico FII
    'GGRC11': '26614291000100', # Zagros Renda Imobiliária
    'VINO11': '12516185000170', # Vinci Offices FII
    'RBRP11': '21408063000151', # Pátria Properties (ex-RBR Properties)
    'TEPP11': '26681370000125', # Tellus Properties FII
    'SARE11': '32903702000171', # Santander Renda de Aluguéis FII
    'RECT11': '32274163000159', # REC Renda Imobiliária FII
    'BROF11': '48978859000104', # BRPR Corporate Offices FII
    'BLMG11': '34081637000171', # BlueMacaw Logística FII
    'RBED11': '13873457000152', # Rio Bravo Renda Educacional FII
    'RZTR11': '36501128000186', # Riza Terrax FII
    'AIEC11': '35765826000126', # Autonomy Edifícios Corporativos FII
    'BBRC11': '12681340000104', # BB Renda Corporativa FII
    'FAED11': '11179118000145', # Anhanguera Educacional FII
    'PATC11': '30048651000112', # Pátria Edifícios Corporativos FII
    'FLMA11': '04141645000103', # Continental Square Faria Lima FII
    'FLRP11': '10375382000191', # Hedge Floripa Shopping FII
    'SHPH11': '03507519000159', # Shopping Pátio Higienópolis FII
    'PQDP11': '10869155000112', # Parque Dom Pedro Shopping Center FII
    'PMLL11': '26499833000132', # Patria Malls FII (ex-MALL11)
    'TVRI11': '14410722000129', # Tivio Renda Imobiliária FII (ex-BBPO11)
    'CPSH11': '47896665000199', # Capitânia Shoppings FII (ex-HFOF11)
    'ONEF11': '12948291000123', # The One FII
    'THRA11': '13966653000171', # Cyrela Thera Corporate FII
    'JRDM11': '14879856000193', # Shopping Jardim Sul FII
    'JSRE11': '13371132000171', # JS Real Estate Multigestão FII
}

MONTHS_PT = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

def format_date(d):
    if not d: return ''
    parts = d.split('-')
    if len(parts) >= 2:
        try:
            m_idx = int(parts[1]) - 1
            if 0 <= m_idx < 12:
                return f"{MONTHS_PT[m_idx]}/{parts[0]}"
        except:
            pass
    return d

def format_cnpj(c):
    c = re.sub(r'\D', '', c or '')
    if len(c) == 14:
        return f"{c[:2]}.{c[2:5]}.{c[5:8]}/{c[8:12]}-{c[12:]}"
    return c

def run_sync():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    fii_db_path = os.path.join(root_dir, 'src', 'data', 'fiiDatabase.ts')
    quotes_json_path = os.path.join(root_dir, 'public', 'quotes.json')
    dist_quotes_json_path = os.path.join(root_dir, 'dist', 'quotes.json')
    cvm_vpa_json_path = os.path.join(root_dir, 'public', 'cvm_fii_vpa.json')
    dist_cvm_vpa_json_path = os.path.join(root_dir, 'dist', 'cvm_fii_vpa.json')

    # Carrega tickers da base local
    with open(fii_db_path, 'r', encoding='utf-8') as f:
        db_content = f.read()

    db_tickers = re.findall(r"ticker:\s*'([^']+)'", db_content)
    total_db_tickers = len(db_tickers)

    cnpj_to_ticker = {}
    ticker_to_cnpj = {}

    # Insere mapeamento manual prioritário
    for t, c in MANUAL_CNPJS.items():
        ticker_to_cnpj[t] = c
        cnpj_to_ticker[c] = t

    current_year = datetime.now().year
    years_to_process = [current_year, current_year - 1]

    cnpj_to_vpa = {}
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

    for yr in years_to_process:
        url = f'https://dados.cvm.gov.br/dados/FII/DOC/INF_MENSAL/DADOS/inf_mensal_fii_{yr}.zip'
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=35) as resp:
                zip_bytes = resp.read()

            with zipfile.ZipFile(io.BytesIO(zip_bytes)) as z:
                # 1. inf_mensal_fii_geral_{ano}.csv: Mapeamento de Tickers pelo Código ISIN
                gname_candidates = [n for n in z.namelist() if 'geral' in n.lower()]
                if gname_candidates:
                    with z.open(gname_candidates[0]) as gf:
                        reader = csv.DictReader(io.TextIOWrapper(gf, encoding='latin1'), delimiter=';')
                        for r in reader:
                            raw_cnpj = re.sub(r'\D', '', r.get('CNPJ_Fundo_Classe', '') or r.get('CNPJ_FUNDO', ''))
                            isin = (r.get('Codigo_ISIN', '') or '').strip().upper()
                            m = re.match(r'^BR([A-Z0-9]{4})CTF', isin)
                            if m:
                                code4 = m.group(1)
                                ticker = ALIASES.get(code4, f"{code4}11")
                                if raw_cnpj:
                                    cnpj_to_ticker[raw_cnpj] = ticker
                                    if ticker not in ticker_to_cnpj:
                                        ticker_to_cnpj[ticker] = raw_cnpj

                # 2. inf_mensal_fii_complemento_{ano}.csv: Dados Contábeis e VPA Oficial
                cname_candidates = [n for n in z.namelist() if 'complemento' in n.lower()]
                if cname_candidates:
                    with z.open(cname_candidates[0]) as cf:
                        reader = csv.DictReader(io.TextIOWrapper(cf, encoding='latin1'), delimiter=';')
                        for r in reader:
                            raw_cnpj = re.sub(r'\D', '', r.get('CNPJ_Fundo_Classe', '') or r.get('CNPJ_FUNDO', ''))
                            data_ref = (r.get('Data_Referencia', '') or '').strip()
                            versao_str = (r.get('Versao', '1') or '1').strip()
                            try:
                                versao = int(versao_str)
                            except:
                                versao = 1
                            raw_vp = (r.get('Valor_Patrimonial_Cotas', '') or '').replace(',', '.').strip()
                            if not raw_cnpj or not raw_vp:
                                continue
                            try:
                                vpa = float(raw_vp)
                                if vpa <= 0:
                                    continue
                            except:
                                continue

                            # Ajuste específico de cota de fundo máster de varejo da B3 (desdobramento 200:1 do XPML11)
                            if raw_cnpj == '07583627000161' and vpa > 1000:
                                vpa = round(vpa / 200, 2)
                            else:
                                vpa = round(vpa, 2)

                            prev = cnpj_to_vpa.get(raw_cnpj)
                            if not prev or data_ref > prev['data_ref'] or (data_ref == prev['data_ref'] and versao > prev['versao']):
                                cnpj_to_vpa[raw_cnpj] = {
                                    'data_ref': data_ref,
                                    'versao': versao,
                                    'vpa': vpa,
                                }
        except Exception as err:
            sys.stderr.write(f"[CVM Sync] Aviso ao processar ano {yr}: {err}\n")

    # 3. Consolidação Final dos VPs por Ticker
    vpa_results = {}
    for ticker in db_tickers:
        cnpj = ticker_to_cnpj.get(ticker)
        entry = cnpj_to_vpa.get(cnpj) if cnpj else None

        if entry:
            vpa_results[ticker] = {
                'ticker': ticker,
                'vpa': entry['vpa'],
                'dataReferencia': entry['data_ref'],
                'dataRefFormatada': format_date(entry['data_ref']),
                'versao': entry['versao'],
                'cnpj': format_cnpj(cnpj),
                'fonte': 'CVM Dados Abertos (Oficial - Resolução 175)',
            }
        else:
            # Fallback para fundos em transição/incorporados registrados no banco
            pattern_fb = r"ticker:\s*'" + ticker + r"'[\s\S]*?cnpj:\s*'([^']*)'[\s\S]*?vpPerShare:\s*([0-9\.]+)[\s\S]*?cvmReportDate:\s*'([^']*)'"
            m_fb = re.search(pattern_fb, db_content)
            if m_fb:
                fb_cnpj = m_fb.group(1) or cnpj or ''
                fb_vp = float(m_fb.group(2))
                fb_date = m_fb.group(3) or 'Agosto/2026'
                vpa_results[ticker] = {
                    'ticker': ticker,
                    'vpa': fb_vp,
                    'dataReferencia': fb_date,
                    'dataRefFormatada': fb_date,
                    'versao': 1,
                    'cnpj': format_cnpj(fb_cnpj),
                    'fonte': 'Informe CVM Registrado',
                }

    # Salva arquivo oficial em public/cvm_fii_vpa.json (e dist/ se existir)
    cvm_payload = {
        'lastSync': datetime.now().isoformat(),
        'lastSyncFormatted': datetime.now().strftime('%d/%m/%Y %H:%M:%S'),
        'totalFunds': total_db_tickers,
        'fundsWithVpa': len(vpa_results),
        'vpa': vpa_results,
    }

    os.makedirs(os.path.dirname(cvm_vpa_json_path), exist_ok=True)
    with open(cvm_vpa_json_path, 'w', encoding='utf-8') as f:
        json.dump(cvm_payload, f, indent=2, ensure_ascii=False)

    if os.path.exists(os.path.dirname(dist_cvm_vpa_json_path)):
        with open(dist_cvm_vpa_json_path, 'w', encoding='utf-8') as f:
            json.dump(cvm_payload, f, indent=2, ensure_ascii=False)

    # 4. Atualizar fiiDatabase.ts com CNPJs e VPs oficiais da CVM
    for ticker, data in vpa_results.items():
        vpa_val = data['vpa']
        data_formatada = data['dataRefFormatada']
        cnpj_val = data['cnpj']

        # Atualiza CNPJ
        pattern_cnpj = r"(ticker:\s*'" + ticker + r"'[\s\S]*?cnpj:\s*')([^']+)"
        db_content = re.sub(pattern_cnpj, r"\g<1>" + cnpj_val, db_content, count=1)

        # Atualiza vpPerShare e cvmReportDate
        pattern_vp = r"(ticker:\s*'" + ticker + r"'[\s\S]*?vpPerShare:\s*)([0-9\.]+)([\s\S]*?cvmReportDate:\s*')([^']+)"
        def repl(m):
            return f"{m.group(1)}{vpa_val:.2f}{m.group(3)}{data_formatada}"
        db_content = re.sub(pattern_vp, repl, db_content, count=1)

    with open(fii_db_path, 'w', encoding='utf-8') as f:
        f.write(db_content)

    # 5. Atualizar quotes.json para compatibilidade com cotações
    quotes_payload = {'quotes': {}}
    if os.path.exists(quotes_json_path):
        try:
            with open(quotes_json_path, 'r', encoding='utf-8') as f:
                quotes_payload = json.load(f)
        except:
            pass

    for ticker, data in vpa_results.items():
        if ticker in quotes_payload.get('quotes', {}):
            quotes_payload['quotes'][ticker]['vpPerShare'] = data['vpa']
            quotes_payload['quotes'][ticker]['cvmReportDate'] = data['dataRefFormatada']
            quotes_payload['quotes'][ticker]['cvmUpdated'] = True

    quotes_payload['lastCvmSync'] = datetime.now().isoformat()
    with open(quotes_json_path, 'w', encoding='utf-8') as f:
        json.dump(quotes_payload, f, indent=2, ensure_ascii=False)

    if os.path.exists(dist_quotes_json_path):
        with open(dist_quotes_json_path, 'w', encoding='utf-8') as f:
            json.dump(quotes_payload, f, indent=2, ensure_ascii=False)

    print(json.dumps({
        'status': 'success',
        'total_db_tickers': total_db_tickers,
        'funds_with_vpa': len(vpa_results),
        'sample_brco11': vpa_results.get('BRCO11'),
        'sample_hglg11': vpa_results.get('HGLG11'),
        'sample_btlg11': vpa_results.get('BTLG11'),
        'sample_xpml11': vpa_results.get('XPML11'),
        'sample_pmll11': vpa_results.get('PMLL11'),
        'timestamp': datetime.now().isoformat(),
    }))

if __name__ == '__main__':
    run_sync()
