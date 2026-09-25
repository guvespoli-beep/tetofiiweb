import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  ArrowUpDown,
  Calculator,
  Building2,
  Sparkles,
} from 'lucide-react';
import {
  FII_DATABASE,
  formatCurrency,
  formatDecimal,
  formatPercent,
} from '../data/fiiDatabase';
import { fetchLiveQuote } from '../services/quoteService';

interface RadarFiiTableProps {
  onSelectFii: (ticker: string) => void;
  onOpenExplanation: (topicId: string) => void;
}

type SortField = 'default' | 'ticker' | 'price' | 'vp' | 'pvp';

export const RadarFiiTable: React.FC<RadarFiiTableProps> = ({
  onSelectFii,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<string>('TODOS');
  const [sortBy, setSortBy] = useState<SortField>('default');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});
  const [liveVps, setLiveVps] = useState<Record<string, { vp: number; date?: string }>>({});

  const segments: string[] = [
    'TODOS',
    'Logística',
    'Shoppings',
    'Lajes Corporativas',
    'Renda Urbana',
    'Híbrido',
    'Hospitalar',
    'Educacional',
    'Hotéis'
  ];

  // Atualização das cotações em tempo real para todos os fundos
  useEffect(() => {
    let isMounted = true;
    const updateQuotes = async () => {
      try {
        const { loadStaticQuotes } = await import('../services/quoteService');
        const staticQuotes = await loadStaticQuotes();
        if (isMounted && staticQuotes && Object.keys(staticQuotes).length > 0) {
          const map: Record<string, number> = {};
          const vps: Record<string, { vp: number; date?: string }> = {};
          for (const [t, item] of Object.entries(staticQuotes)) {
            if (item.price > 0) {
              map[t] = item.price;
            }
            if (item.vpPerShare && item.vpPerShare > 0) {
              vps[t] = { vp: item.vpPerShare, date: item.cvmReportDate };
            }
          }
          setLivePrices(prev => ({ ...prev, ...map }));
          setLiveVps(prev => ({ ...prev, ...vps }));
        }
      } catch {
        // ignore
      }

      for (const fii of FII_DATABASE.slice(0, 15)) {
        try {
          const live = await fetchLiveQuote(fii.ticker);
          if (live && live.price > 0 && isMounted) {
            setLivePrices(prev => ({ ...prev, [fii.ticker]: live.price }));
          }
        } catch {
          // ignore
        }
      }
    };
    updateQuotes();
    return () => { isMounted = false; };
  }, []);

  const filteredFiiList = useMemo(() => {
    return FII_DATABASE.filter((fii) => {
      const matchesSearch =
        fii.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fii.previousTickers.some(p => p.toLowerCase().includes(searchTerm.toLowerCase())) ||
        fii.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fii.management.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSegment =
        selectedSegment === 'TODOS' || fii.segment === selectedSegment;

      return matchesSearch && matchesSegment;
    }).sort((a, b) => {
      const priceA = livePrices[a.ticker] ?? a.currentMarketPrice;
      const priceB = livePrices[b.ticker] ?? b.currentMarketPrice;
      const vpA = liveVps[a.ticker]?.vp ?? a.vpPerShare;
      const vpB = liveVps[b.ticker]?.vp ?? b.vpPerShare;
      const pvpA = vpA > 0 ? priceA / vpA : 0;
      const pvpB = vpB > 0 ? priceB / vpB : 0;

      let comparison = 0;
      if (sortBy === 'default') {
        // Ordenação padrão: principais fundos exibidos no topo de acordo com relevância
        comparison = a.relevanceScore - b.relevanceScore;
      } else if (sortBy === 'ticker') {
        comparison = a.ticker.localeCompare(b.ticker);
      } else if (sortBy === 'price') {
        comparison = priceA - priceB;
      } else if (sortBy === 'vp') {
        comparison = vpA - vpB;
      } else if (sortBy === 'pvp') {
        comparison = pvpA - pvpB;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [searchTerm, selectedSegment, sortBy, sortOrder, livePrices, liveVps]);

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder(field === 'ticker' ? 'asc' : 'desc');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-700" />
              <span>Fundos de Tijolo</span>
            </span>
            <span className="text-xs text-slate-400">
              {filteredFiiList.length} fundos listados
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5">
            Radar de FIIs de Tijolo
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Fundos Imobiliários de Tijolo listados na B3 com cotação de mercado e valor patrimonial oficial.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrar por ticker ou nome do fundo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 font-sans"
          />
        </div>

        {/* Segment Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {segments.map((seg) => (
            <button
              key={seg}
              type="button"
              onClick={() => setSelectedSegment(seg)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedSegment === seg
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {seg}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold select-none">
              <th
                onClick={() => handleSort('ticker')}
                className="p-3.5 cursor-pointer hover:bg-slate-100 transition-colors min-w-[220px]"
              >
                <div className="flex items-center gap-1">
                  <span>Ticker & Fundo</span>
                  <ArrowUpDown className={`w-3 h-3 ${sortBy === 'ticker' ? 'text-emerald-700' : 'text-slate-400'}`} />
                </div>
              </th>

              <th className="p-3.5 min-w-[130px]">
                <span>Segmento</span>
              </th>

              <th
                onClick={() => handleSort('price')}
                className="p-3.5 text-right cursor-pointer hover:bg-slate-100 transition-colors min-w-[120px]"
                title="Cotação oficial de mercado B3"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Preço Atual</span>
                  <ArrowUpDown className={`w-3 h-3 ${sortBy === 'price' ? 'text-emerald-700' : 'text-slate-400'}`} />
                </div>
              </th>

              <th
                onClick={() => handleSort('vp')}
                className="p-3.5 text-right cursor-pointer hover:bg-slate-100 transition-colors min-w-[140px]"
                title="Valor Patrimonial por Cota"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>VP por Cota</span>
                  <ArrowUpDown className={`w-3 h-3 ${sortBy === 'vp' ? 'text-emerald-700' : 'text-slate-400'}`} />
                </div>
              </th>

              <th
                onClick={() => handleSort('pvp')}
                className="p-3.5 text-center cursor-pointer hover:bg-slate-100 transition-colors w-28"
                title="Preço de Mercado ÷ Valor Patrimonial por Cota"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>P/VP</span>
                  <ArrowUpDown className={`w-3 h-3 ${sortBy === 'pvp' ? 'text-emerald-700' : 'text-slate-400'}`} />
                </div>
              </th>

              <th className="p-3.5 text-center w-28">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {filteredFiiList.map((fii) => {
              const currentPrice = livePrices[fii.ticker] ?? fii.currentMarketPrice;
              const currentVp = liveVps[fii.ticker]?.vp ?? fii.vpPerShare;
              const currentVpDate = liveVps[fii.ticker]?.date || fii.cvmReportDate;
              const pvp = currentVp > 0 ? currentPrice / currentVp : 0;
              const hasOldTickers = fii.previousTickers.length > 0;

              return (
                <tr key={fii.ticker} className="hover:bg-slate-50/80 transition-colors">
                  {/* Ticker & Fundo */}
                  <td className="p-3.5">
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 bg-slate-100 rounded-lg shrink-0 mt-0.5">
                        <Building2 className="w-4 h-4 text-emerald-700" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-slate-900 text-sm">
                            {fii.ticker}
                          </span>
                          {hasOldTickers && (
                            <span
                              className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-mono text-[10px] font-bold"
                              title={fii.tickerChangeReason || 'Fundo com ticker antigo na B3'}
                            >
                              ex: {fii.previousTickers.join(', ')}
                            </span>
                          )}
                        </div>
                        <span className="text-slate-600 text-xs block font-medium mt-0.5 line-clamp-1">
                          {fii.name}
                        </span>
                        <span className="text-slate-400 text-[10px] block mt-0.5">
                          Gestão: {fii.management}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Segmento */}
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {fii.segment}
                    </span>
                  </td>

                  {/* Preço Atual */}
                  <td className="p-3.5 text-right font-mono font-bold text-slate-900 text-sm">
                    {formatCurrency(currentPrice)}
                  </td>

                  {/* VP por Cota */}
                  <td className="p-3.5 text-right font-mono text-slate-700 text-xs">
                    <div className="font-semibold">{formatCurrency(currentVp)}</div>
                    <span className="text-[10px] text-slate-400 block font-sans">
                      Informe de {currentVpDate}
                    </span>
                  </td>

                  {/* P/VP Atual */}
                  <td className="p-3.5 text-center font-mono">
                    <span
                      className={`inline-block px-2.5 py-1 rounded text-xs font-bold ${
                        pvp < 0.98
                          ? 'bg-emerald-100 text-emerald-800'
                          : pvp > 1.02
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                      title={
                        pvp < 1
                          ? `Desconto patrimonial de ${formatPercent((1 - pvp) * 100, 1)}`
                          : `Ágio patrimonial de ${formatPercent((pvp - 1) * 100, 1)}`
                      }
                    >
                      {formatDecimal(pvp, 2)}
                    </span>
                  </td>

                  {/* Ação */}
                  <td className="p-3.5 text-center">
                    <button
                      type="button"
                      onClick={() => onSelectFii(fii.ticker)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                      title={`Simular Preço Teto para ${fii.ticker}`}
                    >
                      <Calculator className="w-3.5 h-3.5" />
                      <span>Simular</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Informational Legend */}
      <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-400 border-t border-slate-100">
        <span>
          Fonte: Informes Estruturados CVM e B3. Cotações de mercado atualizadas. Valores formatados em R$.
        </span>
        <span className="font-mono text-slate-500">
          Total: {filteredFiiList.length} FIIs de Tijolo
        </span>
      </div>
    </div>
  );
};
