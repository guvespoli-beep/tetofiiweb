import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Calculator as CalcIcon,
  Search,
  ExternalLink,
  RotateCcw,
  TrendingUp,
  AlertCircle,
  Building2,
  Percent,
  Copy,
  Check,
  ArrowRight,
  TrendingDown,
  Lock,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import {
  searchFii,
  formatCurrency,
  formatPercent,
  formatDecimal,
  parseCurrencyInput,
} from '../data/fiiDatabase';
import { CalculationResult, FiiData } from '../types';
import { QuestionButton } from './ExplanationModal';
import { AdBanner } from './AdBanner';
import { fetchLiveQuote } from '../services/quoteService';

interface CalculatorProps {
  onOpenExplanation: (topicId: string) => void;
  onOpenAdGuide: () => void;
  initialSelectedFii?: string;
}

export const Calculator: React.FC<CalculatorProps> = ({
  onOpenExplanation,
  onOpenAdGuide,
  initialSelectedFii,
}) => {
  // Input states - Starts blank unless a ticker was chosen
  const [tickerQuery, setTickerQuery] = useState(initialSelectedFii || '');
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [referenceRate, setReferenceRate] = useState<number | ''>('');
  const [riskPremium, setRiskPremium] = useState<number | ''>('');
  const [monthlyDividend, setMonthlyDividend] = useState<number | ''>('');
  const [vpPerShare, setVpPerShare] = useState<number | ''>('');
  const [activeFii, setActiveFii] = useState<FiiData | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [aliasNotification, setAliasNotification] = useState<string | null>(null);
  const [isVpManuallyEdited, setIsVpManuallyEdited] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [lastQuoteTime, setLastQuoteTime] = useState<string>('');
  const [quoteSource, setQuoteSource] = useState<string>('Yahoo Finance (B3)');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Load fund data with real-time market quote from Yahoo Finance
  const loadFiiData = useCallback(async (ticker: string, notifyIfAlias: boolean = true) => {
    const clean = ticker.trim().toUpperCase();
    if (!clean) {
      setSearchError(null);
      return;
    }
    const searchResult = searchFii(clean);
    if (searchResult) {
      const { fund, isAliasMatch, aliasMessage } = searchResult;
      setActiveFii(fund);
      setCurrentPrice(fund.currentMarketPrice);
      setVpPerShare(fund.vpPerShare);
      setIsVpManuallyEdited(false);
      setTickerQuery(fund.ticker);
      setSearchError(null);
      setLastQuoteTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

      if (isAliasMatch && aliasMessage && notifyIfAlias) {
        setAliasNotification(aliasMessage);
      } else {
        setAliasNotification(null);
      }

      // Busca a cotação real atualizada na B3 via Yahoo Finance / Google Finance
      try {
        const live = await fetchLiveQuote(fund.ticker);
        if (live && live.price > 0) {
          setCurrentPrice(live.price);
          setLastQuoteTime(live.timeString);
          if (live.source) setQuoteSource(live.source);
        }
      } catch {
        // Mantém a cotação base da tabela
      }
    } else {
      // Tentar buscar cotação diretamente via Yahoo Finance para outros FIIs da B3
      try {
        const live = await fetchLiveQuote(clean);
        if (live && live.price > 0) {
          const dynamicFund: FiiData = {
            ticker: clean,
            previousTickers: [],
            name: `Fundo Imobiliário ${clean}`,
            management: 'Administrador B3',
            segment: 'Híbrido',
            cnpj: '00.000.000/0001-00',
            vpPerShare: live.price,
            cvmReportDate: 'Recente',
            currentMarketPrice: live.price,
            monthlyDividend: 0,
            annualDividend: 0,
            dividendYield: 0,
            ifixWeight: 0,
            netWorth: 0,
            shareholdersCount: 0,
            searchPopularityScore: 50,
            relevanceScore: 50,
            relevanceRank: 99,
          };
          setActiveFii(dynamicFund);
          setCurrentPrice(live.price);
          setVpPerShare(live.price);
          setIsVpManuallyEdited(false);
          setTickerQuery(clean);
          setSearchError(null);
          setLastQuoteTime(live.timeString);
          if (live.source) setQuoteSource(live.source);
          return;
        }
      } catch {
        // ignore
      }
      setSearchError(`Fundo "${clean}" não encontrado na base. Digite o ticker do FII que quer consultar (ex: TRXF11, HGLG11, PMLL11).`);
    }
  }, []);

  // Initialize
  useEffect(() => {
    if (initialSelectedFii) {
      loadFiiData(initialSelectedFii, false);
      setTickerQuery(initialSelectedFii);
      setLastQuoteTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }
  }, [initialSelectedFii, loadFiiData]);

  // Auto-refresh quote every 5 minutes (300.000 ms) via Yahoo Finance
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const target = activeFii?.ticker || tickerQuery;
      if (target) {
        const live = await fetchLiveQuote(target);
        if (live && live.price > 0) {
          setCurrentPrice(live.price);
          setLastQuoteTime(live.timeString);
          if (live.source) setQuoteSource(live.source);
        }
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(intervalId);
  }, [activeFii, tickerQuery]);

  // Manual refresh trigger
  const handleManualRefresh = async () => {
    const target = activeFii?.ticker || tickerQuery;
    if (!target) return;
    setIsRefreshing(true);
    try {
      const live = await fetchLiveQuote(target);
      if (live && live.price > 0) {
        setCurrentPrice(live.price);
        setLastQuoteTime(live.timeString);
        if (live.source) setQuoteSource(live.source);
      } else {
        const fresh = searchFii(target);
        if (fresh) {
          setCurrentPrice(fresh.fund.currentMarketPrice);
          if (!isVpManuallyEdited) {
            setVpPerShare(fresh.fund.vpPerShare);
          }
        }
        setLastQuoteTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleTickerSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (tickerQuery) {
      loadFiiData(tickerQuery, true);
    }
  };

  const handleResetVpToCvm = () => {
    if (activeFii) {
      setVpPerShare(activeFii.vpPerShare);
      setIsVpManuallyEdited(false);
    }
  };

  // Calculations
  const result: CalculationResult = useMemo(() => {
    const numRefRate = typeof referenceRate === 'number' ? referenceRate : 0;
    const numRiskPrem = typeof riskPremium === 'number' ? riskPremium : 0;
    const numMonthlyDiv = typeof monthlyDividend === 'number' ? monthlyDividend : 0;

    const discountRate = numRefRate + numRiskPrem; // in %
    const annualDividend = numMonthlyDiv * 12;

    // Preço Teto Bazin: ((Provento Mensal x 12)/(Taxa de Referência + Prêmio de Risco)) * 100
    const ceilingPrice = discountRate > 0 && annualDividend > 0 ? (annualDividend / discountRate) * 100 : 0;

    // P/VP
    const numVp = typeof vpPerShare === 'number' ? vpPerShare : 0;
    const pvp = numVp > 0 && currentPrice > 0 ? currentPrice / numVp : 0;
    let pvpAnalysis: CalculationResult['pvpAnalysis'] = 'SEM_DADOS';
    let pvpDiscountOrPremiumPercent = 0;

    if (numVp > 0 && currentPrice > 0) {
      if (pvp < 0.995) {
        pvpAnalysis = 'ABAIXO_DO_VP';
        pvpDiscountOrPremiumPercent = ((numVp - currentPrice) / numVp) * 100;
      } else if (pvp > 1.005) {
        pvpAnalysis = 'ACIMA_DO_VP';
        pvpDiscountOrPremiumPercent = ((currentPrice - numVp) / numVp) * 100;
      } else {
        pvpAnalysis = 'NO_VP';
        pvpDiscountOrPremiumPercent = 0;
      }
    }

    // Preço Atual / Preço Teto
    const priceToCeilingRatio = ceilingPrice > 0 && currentPrice > 0 ? (currentPrice / ceilingPrice) * 100 : 0;
    let ceilingAnalysis: CalculationResult['ceilingAnalysis'] = 'NO_PRECO_TETO';
    let safetyMarginPercentage = 0;

    if (ceilingPrice > 0 && currentPrice > 0) {
      if (currentPrice < ceilingPrice * 0.999) {
        ceilingAnalysis = 'ABAIXO_DO_PRECO_TETO';
        safetyMarginPercentage = ((ceilingPrice - currentPrice) / ceilingPrice) * 100;
      } else if (currentPrice > ceilingPrice * 1.001) {
        ceilingAnalysis = 'ACIMA_DO_PRECO_TETO';
        safetyMarginPercentage = ((currentPrice - ceilingPrice) / ceilingPrice) * 100;
      } else {
        ceilingAnalysis = 'NO_PRECO_TETO';
        safetyMarginPercentage = 0;
      }
    }

    const currentYield = currentPrice > 0 && annualDividend > 0 ? (annualDividend / currentPrice) * 100 : 0;

    return {
      discountRate,
      annualDividend,
      ceilingPrice,
      pvp,
      pvpAnalysis,
      pvpDiscountOrPremiumPercent,
      priceToCeilingRatio,
      ceilingAnalysis,
      safetyMarginPercentage,
      currentYield,
    };
  }, [referenceRate, riskPremium, monthlyDividend, currentPrice, vpPerShare]);

  // Copy Summary
  const handleCopySummary = () => {
    const numVp = typeof vpPerShare === 'number' ? vpPerShare : 0;
    const summaryText = `📊 Análise de Preço Teto • FII ${activeFii?.ticker || tickerQuery || 'FII'} (${activeFii?.name || 'FII de Tijolo'})
Preço Atual (B3): ${formatCurrency(currentPrice)} (atualizado a cada 5 min)
Preço Teto Calculado: ${result.ceilingPrice > 0 ? formatCurrency(result.ceilingPrice) : 'Aguardando parâmetros'}
Relação Preço/Teto: ${result.ceilingPrice > 0 ? formatPercent(result.priceToCeilingRatio) : '-'}
Status do Teto: ${result.ceilingPrice > 0 ? (result.ceilingAnalysis === 'ABAIXO_DO_PRECO_TETO' ? `Abaixo do Teto (Margem de Segurança de ${formatPercent(result.safetyMarginPercentage)})` : `Acima do Teto (Sobrepreço de ${formatPercent(result.safetyMarginPercentage)})`) : 'Parâmetros incompletos'}
P/VP: ${result.pvp > 0 ? formatDecimal(result.pvp, 2) : '-'} (${result.pvpAnalysis === 'SEM_DADOS' ? '-' : result.pvpAnalysis === 'ABAIXO_DO_VP' ? `Desconto de ${formatPercent(result.pvpDiscountOrPremiumPercent)}` : result.pvpAnalysis === 'ACIMA_DO_VP' ? `Ágio de ${formatPercent(result.pvpDiscountOrPremiumPercent)}` : 'Paridade'})
Premissas: Taxa de Referência ${referenceRate ? formatPercent(Number(referenceRate)) : 'não informada'} + Prêmio ${riskPremium ? formatPercent(Number(riskPremium)) : 'não informado'}
Provento Mensal: ${monthlyDividend ? formatCurrency(Number(monthlyDividend)) : 'não informado'} (Anual: ${formatCurrency(result.annualDividend)})
VP por Cota: ${formatCurrency(numVp)} (Informe de ${activeFii?.cvmReportDate || 'Agosto/2026'})
Calculado no TETOFII`;

    navigator.clipboard.writeText(summaryText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const hasCompleteInputs = typeof referenceRate === 'number' && typeof riskPremium === 'number' && typeof monthlyDividend === 'number' && result.ceilingPrice > 0;

  return (
    <div className="space-y-8">
      {/* Search and Header Section */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80">
        <div className="pb-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              FIIs de Tijolo
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5">
            Simulador de Preço Teto
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pesquise o código de qualquer fundo imobiliário de tijolo listado na B3 para carregar a cotação e o valor patrimonial oficial.
          </p>
        </div>

        {/* Ticker Search Form */}
        <form onSubmit={handleTickerSearch} className="mt-5">
          <div className="relative flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={tickerQuery}
                onChange={(e) => setTickerQuery(e.target.value.toUpperCase())}
                placeholder="(digite o ticker do FII que quer consultar)"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 font-mono font-semibold placeholder:font-sans placeholder:text-slate-400 text-sm transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Buscar Fundo</span>
            </button>
          </div>
        </form>

        {/* Error notification when ticker not found */}
        {searchError && (
          <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block text-rose-950 mb-0.5">
                Código não localizado
              </strong>
              <p>{searchError}</p>
            </div>
          </div>
        )}

        {/* Notification when old ticker was detected */}
        {aliasNotification && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block text-amber-950 mb-0.5">
                Aviso de Migração de Ticker na B3
              </strong>
              <p>{aliasNotification}</p>
            </div>
          </div>
        )}

        {/* Active FII Info Bar */}
        {activeFii && (
          <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-700 text-white rounded-xl shadow-xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-base text-slate-900">
                    {activeFii.ticker}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-semibold rounded text-[11px]">
                    {activeFii.segment}
                  </span>
                  {activeFii.previousTickers.length > 0 && (
                    <span className="text-[11px] text-slate-500 font-mono bg-slate-200/80 px-1.5 py-0.5 rounded">
                      Antigo: {activeFii.previousTickers.join(', ')}
                    </span>
                  )}
                </div>
                <p className="text-slate-600 text-xs mt-0.5 font-medium">
                  {activeFii.name} • Gestão: {activeFii.management}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-slate-600 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
              <div>
                <span className="text-[11px] text-slate-400 block">Cotação Atual:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{formatCurrency(currentPrice)}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">VP por Cota:</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">{formatCurrency(activeFii.vpPerShare)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Input Form (Left 65%) + Lateral Summary / AdSlot (Right 35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Input Parameters Card */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <CalcIcon className="w-5 h-5 text-emerald-700" />
              <span>Parâmetros e Premissas de Cálculo</span>
            </h3>
            <span className="text-xs text-slate-500">
              Preencha suas premissas de investimento
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Campo 1: Preço Atual (NÃO EDITÁVEL + Atualizado a cada 5 min + Máscara Monetária) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span>Preço Atual da Cota</span>
                  <QuestionButton topicId="relacao-preco-teto" onClick={onOpenExplanation} />
                </label>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                  {currentPrice > 0 ? formatCurrency(currentPrice) : 'R$ 0,00'}
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  disabled
                  value={currentPrice > 0 ? formatCurrency(currentPrice) : 'R$ 0,00'}
                  className="w-full px-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-100/90 text-slate-800 font-mono font-bold text-sm cursor-not-allowed select-none"
                  title="Cotação oficial de mercado (não editável, atualizada automaticamente a cada 5 min)"
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400" title="Cotação oficial automática">
                  <Lock className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-medium text-slate-700">
                    B3 em tempo real {lastQuoteTime ? `(${lastQuoteTime})` : ''}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={handleManualRefresh}
                  disabled={isRefreshing || !currentPrice}
                  className="text-[11px] text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-semibold cursor-pointer disabled:opacity-50"
                  title="Consultar cotação oficial em tempo real via Yahoo Finance / Google Finance"
                >
                  <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
                  <span>{isRefreshing ? 'Consultando...' : 'Checar cotação'}</span>
                </button>
              </div>
              <div className="text-[10px] text-slate-400 font-sans flex items-center justify-between pt-0.5">
                <span>Fonte: {quoteSource} • Auto-refresh a cada 5 min</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Conectado</span>
                </span>
              </div>
            </div>

            {/* Campo 2: VP por Cota (Buscado do relatório CVM e editável com máscara monetária) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span>VP por Cota (Valor Patrimonial)</span>
                  <QuestionButton topicId="vp-cota" onClick={onOpenExplanation} />
                </label>
                {isVpManuallyEdited ? (
                  <button
                    type="button"
                    onClick={handleResetVpToCvm}
                    className="text-[11px] text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-medium cursor-pointer"
                    title="Restaurar valor do relatório oficial da CVM"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restaurar CVM</span>
                  </button>
                ) : (
                  <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                    {typeof vpPerShare === 'number' && vpPerShare > 0 ? formatCurrency(vpPerShare) : 'R$ 0,00'}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="R$ 0,00"
                  value={typeof vpPerShare === 'number' && vpPerShare > 0 ? formatCurrency(vpPerShare) : ''}
                  onChange={(e) => {
                    const rawDigits = e.target.value.replace(/\D/g, '');
                    if (!rawDigits) {
                      setVpPerShare('');
                    } else {
                      setVpPerShare(Number(rawDigits) / 100);
                    }
                    setIsVpManuallyEdited(true);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 font-mono font-bold text-sm bg-white transition-colors"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                <span className="font-medium text-slate-600">
                  {activeFii ? `Informe de ${activeFii.cvmReportDate}` : 'Informe oficial CVM'}{isVpManuallyEdited ? ' (Editado)' : ''}
                </span>
                <span className="font-mono text-slate-700 font-semibold">
                  {typeof vpPerShare === 'number' && vpPerShare > 0 ? formatCurrency(vpPerShare) : 'R$ 0,00'}
                </span>
              </div>
            </div>

            {/* Campo 3: Taxa de Referência (SEM 'Livre de Risco', SEM sugestões, usuário preenche) */}
            <div className="space-y-1.5 sm:col-span-2 p-4 bg-slate-50/70 rounded-xl border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>Taxa de Referência (% a.a.)</span>
                  <QuestionButton topicId="taxa-referencia" onClick={onOpenExplanation} />
                </label>
                <a
                  href="https://www.tesourodireto.com.br/produtos/dados-sobre-titulos/rendimento-dos-titulos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-emerald-800 hover:text-emerald-950 font-semibold underline decoration-emerald-400 underline-offset-2"
                >
                  <span>Consultar taxas no site do Tesouro Direto</span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                </a>
              </div>

              <div className="relative pt-1">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="30"
                  placeholder="(consulte a taxa do Tesouro IPCA+)"
                  value={referenceRate}
                  onChange={(e) => setReferenceRate(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full pl-3 pr-12 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 font-mono font-bold text-sm bg-white"
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 font-bold text-xs pt-1">
                  % a.a.
                </span>
              </div>
              <p className="text-[11px] text-slate-500 pt-0.5">
                Rendimento real da taxa de referência (juro acima do IPCA) pago pelo Tesouro Nacional para títulos públicos de longo prazo (NTN-B).
              </p>
            </div>

            {/* Campo 4: Prêmio de Risco (SEM sugestões, SEM "Risco do Imóvel Físico", usuário preenche) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span>Prêmio de Risco (% a.a.)</span>
                  <QuestionButton topicId="premio-risco" onClick={onOpenExplanation} />
                </label>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={riskPremium}
                  onChange={(e) => setRiskPremium(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full pl-3 pr-12 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 font-mono font-bold text-sm bg-white"
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 font-bold text-xs">
                  % a.a.
                </span>
              </div>
              <p className="text-[11px] text-slate-500 pt-0.5">
                Retorno adicional exigido pelo investidor para assumir os riscos de mercado.
              </p>
            </div>

            {/* Campo 5: Provento Mensal Estimado (com máscara monetária) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span>Provento Mensal Estimado</span>
                  <QuestionButton topicId="provento-mensal" onClick={onOpenExplanation} />
                </label>
                {typeof monthlyDividend === 'number' && monthlyDividend > 0 && (
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                    {formatCurrency(monthlyDividend)}/mês
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="R$ 0,00"
                  value={typeof monthlyDividend === 'number' && monthlyDividend > 0 ? formatCurrency(monthlyDividend) : ''}
                  onChange={(e) => {
                    const rawDigits = e.target.value.replace(/\D/g, '');
                    if (!rawDigits) {
                      setMonthlyDividend('');
                    } else {
                      setMonthlyDividend(Number(rawDigits) / 100);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 font-mono font-bold text-sm bg-white transition-colors"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                <span>Provento Anual (× 12):</span>
                <span className="font-mono font-bold text-emerald-700">
                  {typeof monthlyDividend === 'number' && monthlyDividend > 0 ? formatCurrency(result.annualDividend) : 'R$ 0,00'}
                </span>
              </div>
            </div>
          </div>

          {/* Combined discount rate badge */}
          <div className="p-3.5 bg-slate-900 text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-emerald-400" />
              <span>Taxa de Desconto Total (Yield Requerido):</span>
              <strong className="font-mono text-emerald-300 font-bold text-sm">
                {result.discountRate > 0 ? `${formatPercent(result.discountRate)} a.a.` : 'Aguardando preenchimento'}
              </strong>
            </div>
            {result.discountRate > 0 && (
              <span className="text-slate-400 text-[11px]">
                ({formatPercent(Number(referenceRate || 0))} Taxa Ref. + {formatPercent(Number(riskPremium || 0))} Prêmio)
              </span>
            )}
          </div>
        </div>

        {/* Sidebar: AdSlot #2 (Medium Rectangle 300x250) + Dicas de Tijolo */}
        <div className="lg:col-span-4 space-y-4">
          <AdBanner position="incontent_sidebar" onOpenAdGuide={onOpenAdGuide} />

          {/* Educational Quick Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Regra de Ouro em FII de Tijolo</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              O patrimônio de um FII de tijolo é formado por <strong>imóveis físicos de concreto</strong>. Seus aluguéis são reajustados pela inflação ao longo dos contratos, oferecendo uma proteção intrínseca no longo prazo.
            </p>
            <button
              type="button"
              onClick={() => onOpenExplanation('preco-teto')}
              className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Entenda o Método de Bazin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Results Section: 4 High-Impact KPI Cards */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Resultado Matemático
              </span>
              <span className="text-xs text-slate-400">
                Ticker Ativo: {activeFii?.ticker || tickerQuery}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight mt-1 text-white">
              Análise de Valuation & Margem de Segurança
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{isCopied ? 'Resumo Copiado!' : 'Copiar Resumo'}</span>
            </button>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* Card 1: Preço Teto Bazin */}
          <div className="bg-slate-800/80 backdrop-blur-xs p-5 rounded-2xl border border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
                <span className="flex items-center gap-1">
                  Preço Teto Máximo
                  <QuestionButton topicId="preco-teto" onClick={onOpenExplanation} className="bg-slate-700 text-slate-300 hover:bg-emerald-600 hover:text-white" />
                </span>
                <span className="text-[10px] font-mono text-emerald-400">Método Bazin</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                {result.ceilingPrice > 0 ? formatCurrency(result.ceilingPrice) : 'R$ 0,00'}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-700/60 text-xs text-slate-400">
              <span>
                {result.discountRate > 0
                  ? `Para Yield de ${formatPercent(result.discountRate)} a.a.`
                  : 'Preencha taxa e provento'}
              </span>
            </div>
          </div>

          {/* Card 2: Relação Preço Atual / Preço Teto */}
          <div className="bg-slate-800/80 backdrop-blur-xs p-5 rounded-2xl border border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
                <span className="flex items-center gap-1">
                  Preço Atual / Teto
                  <QuestionButton topicId="relacao-preco-teto" onClick={onOpenExplanation} className="bg-slate-700 text-slate-300 hover:bg-emerald-600 hover:text-white" />
                </span>
                <span className="text-[10px] font-mono text-slate-400">Relação %</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-white">
                {result.ceilingPrice > 0 ? formatPercent(result.priceToCeilingRatio, 1) : '-'}
              </div>
            </div>

            {/* Coluna / Badge Informando Acima ou Abaixo do Preço Teto */}
            <div className="mt-3 pt-3 border-t border-slate-700/60">
              {result.ceilingPrice > 0 ? (
                result.ceilingAnalysis === 'ABAIXO_DO_PRECO_TETO' ? (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>Abaixo do Preço Teto ({formatPercent(result.safetyMarginPercentage)} margem)</span>
                  </div>
                ) : result.ceilingAnalysis === 'ACIMA_DO_PRECO_TETO' ? (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Acima do Preço Teto (+{formatPercent(result.safetyMarginPercentage)})</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                    <span>No Preço Teto (Paridade)</span>
                  </div>
                )
              ) : (
                <span className="text-xs text-slate-400">Aguardando parâmetros</span>
              )}
            </div>
          </div>

          {/* Card 3: P/VP */}
          <div className="bg-slate-800/80 backdrop-blur-xs p-5 rounded-2xl border border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
                <span className="flex items-center gap-1">
                  Indicador P/VP
                  <QuestionButton topicId="pvp" onClick={onOpenExplanation} className="bg-slate-700 text-slate-300 hover:bg-emerald-600 hover:text-white" />
                </span>
                <span className="text-[10px] font-mono text-slate-400">CVM</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-white">
                {result.pvp > 0 ? formatDecimal(result.pvp, 2) : '-'}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-700/60">
              <span className="text-xs text-slate-400">
                VP Cota: <strong className="text-slate-200">{typeof vpPerShare === 'number' && vpPerShare > 0 ? formatCurrency(vpPerShare) : '-'}</strong>
              </span>
            </div>
          </div>

          {/* Card 4: Análise do P/VP (Acima ou Abaixo do VP) */}
          <div className="bg-slate-800/80 backdrop-blur-xs p-5 rounded-2xl border border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
                <span>Análise do P/VP</span>
                <span className="text-[10px] font-mono text-slate-400">Status</span>
              </div>
              <div className="mt-1">
                {result.pvpAnalysis === 'SEM_DADOS' ? (
                  <div className="text-2xl sm:text-3xl font-black font-mono text-slate-400">
                    -
                  </div>
                ) : result.pvpAnalysis === 'ABAIXO_DO_VP' ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-sm border border-emerald-500/30">
                    <span>Abaixo do VP</span>
                    <span className="text-xs font-mono font-normal">(-{formatPercent(result.pvpDiscountOrPremiumPercent, 1)})</span>
                  </div>
                ) : result.pvpAnalysis === 'ACIMA_DO_VP' ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 font-bold text-sm border border-amber-500/30">
                    <span>Acima do VP (Ágio)</span>
                    <span className="text-xs font-mono font-normal">(+{formatPercent(result.pvpDiscountOrPremiumPercent, 1)})</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-300 font-bold text-sm border border-blue-500/30">
                    <span>No VP (Paridade 1,00)</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-700/60 text-xs text-slate-400">
              <span>
                {result.pvpAnalysis === 'SEM_DADOS'
                  ? '-'
                  : result.pvpAnalysis === 'ABAIXO_DO_VP'
                  ? 'Negociando com desconto sobre laudo CVM'
                  : result.pvpAnalysis === 'ACIMA_DO_VP'
                  ? 'Negociando acima do valor contábil'
                  : 'Preço em linha com o laudo pericial'}
              </span>
            </div>
          </div>
        </div>

        {/* Parecer Detalhado Pedagógico */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              Diagnóstico Matemático Consolidado:
            </span>
            {hasCompleteInputs ? (
              <p className="text-slate-200">
                No preço atual de <strong>{formatCurrency(currentPrice)}</strong>, o fundo entrega um Dividend Yield projetado de <strong>{formatPercent(result.currentYield)} ao ano</strong> contra um retorno mínimo requerido de <strong>{formatPercent(result.discountRate)} ao ano</strong>.
                {result.ceilingAnalysis === 'ABAIXO_DO_PRECO_TETO' ? (
                  <span className="text-emerald-300 font-semibold ml-1">
                    O ativo encontra-se na zona de oportunidade matemática com {formatPercent(result.safetyMarginPercentage)} de margem de proteção.
                  </span>
                ) : (
                  <span className="text-rose-300 font-semibold ml-1">
                    O ativo está negociando acima do limite estabelecido para a sua rentabilidade exigida.
                  </span>
                )}
              </p>
            ) : (
              <p className="text-slate-300">
                Preencha a <strong>Taxa de Referência</strong>, o <strong>Prêmio de Risco</strong> e o <strong>Provento Mensal</strong> para visualizar o cálculo do Preço Teto Bazin e a margem de segurança {activeFii?.ticker || tickerQuery ? `para o fundo ${activeFii?.ticker || tickerQuery}` : 'para o ativo desejado'}.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* AdSlot #3: Banner Pós-Resultados (Strategic Position 3) */}
      <AdBanner position="post_results" onOpenAdGuide={onOpenAdGuide} />
    </div>
  );
};
