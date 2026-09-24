import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { FII_DATABASE } from '../data/fiiDatabase';

export interface TickerTapeItem {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  category: 'indice' | 'top_cotistas' | 'maior_oscilacao';
  shareholdersCount?: number;
}

interface MarketTickerTapeProps {
  onSelectFii?: (ticker: string) => void;
}

// Fallback inicial estático enquanto a API carrega
const INITIAL_FALLBACK_ITEMS: TickerTapeItem[] = [
  {
    ticker: 'IFIX',
    name: 'Índice de FIIs B3',
    price: 3732.49,
    change: -13.81,
    changePercent: -0.37,
    category: 'indice',
  },
  ...FII_DATABASE.filter((f) =>
    [
      'XPML11',
      'HGLG11',
      'BTLG11',
      'XPLG11',
      'VISC11',
      'KNRI11',
      'HGRU11',
      'GARE11',
      'TRXF11',
      'VILG11',
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
    ].includes(f.ticker)
  ).map((f) => ({
    ticker: f.ticker,
    name: f.name,
    price: f.currentMarketPrice,
    change: 0,
    changePercent: 0,
    category: 'top_cotistas' as const,
    shareholdersCount: f.shareholdersCount,
  })),
];

export const MarketTickerTape: React.FC<MarketTickerTapeProps> = ({ onSelectFii }) => {
  const [items, setItems] = useState<TickerTapeItem[]>(INITIAL_FALLBACK_ITEMS);

  useEffect(() => {
    let isMounted = true;

    async function loadTickerTape() {
      try {
        const response = await fetch('/api/ticker-tape');
        if (response.ok) {
          const data = await response.json();
          if (isMounted && data.items && Array.isArray(data.items) && data.items.length > 0) {
            setItems(data.items);
          }
        }
      } catch (err) {
        console.warn('Usando dados de reserva para letreiro de mercado:', err);
      }
    }

    loadTickerTape();

    // Atualização a cada 2 minutos
    const interval = setInterval(loadTickerTape, 120000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Formatação de valores
  const formatPrice = (price: number, isIndex: boolean) => {
    if (isIndex) {
      return `${Math.round(price).toLocaleString('pt-BR')} pts`;
    }
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatPercent = (pct: number) => {
    const sign = pct > 0 ? '+' : '';
    return `${sign}${pct.toFixed(2).replace('.', ',')}%`;
  };

  // Duplicar os itens para permitir rolagem contínua sem quebras
  const displayItems = [...items, ...items];

  return (
    <div
      className="bg-slate-950 text-slate-300 border-b border-slate-800 text-[11px] sm:text-xs overflow-hidden select-none relative flex items-center h-8 sm:h-9 shadow-inner"
      role="region"
      aria-label="Letreiro de cotações B3 em tempo real"
    >
      {/* Etiqueta Fixa do Radar à esquerda */}
      <div className="z-20 bg-slate-950 px-3 sm:px-3.5 h-full flex items-center gap-2 border-r border-slate-800 shrink-0 shadow-[4px_0_12px_rgba(0,0,0,0.6)] whitespace-nowrap">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-bold tracking-wider uppercase text-[10px] sm:text-[11px] text-slate-200">
          Radar B3
        </span>
      </div>

      {/* Container de Rolagem com Degradês Laterais Próprios */}
      <div className="relative flex-1 overflow-hidden h-full flex items-center">
        {/* Degradê de fade lateral esquerdo (inicia após a etiqueta fixa) */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 sm:w-8 bg-gradient-to-r from-slate-950 to-transparent z-10" />

        {/* Trilho de rolagem contínua (Marquee) */}
        <div className="ticker-marquee-track items-center py-1">
          {displayItems.map((item, index) => {
            const isIndex = item.category === 'indice';
            const isPositive = item.changePercent > 0;
            const isNegative = item.changePercent < 0;

            return (
              <div
                key={`${item.ticker}-${index}`}
                onClick={() => {
                  if (!isIndex && onSelectFii) {
                    onSelectFii(item.ticker);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1 transition-colors cursor-pointer group ${
                  !isIndex ? 'hover:bg-slate-800/80 rounded-md' : 'cursor-default'
                }`}
                title={
                  isIndex
                    ? 'IFIX: Índice de Fundos de Investimentos Imobiliários da B3'
                    : `${item.name} (${item.ticker}). Clique para calcular Preço Teto!`
                }
              >
                {/* Ticker Symbol */}
                <span
                  className={`font-mono font-bold whitespace-nowrap ${
                    isIndex ? 'text-amber-300' : 'text-slate-100 group-hover:text-emerald-400'
                  }`}
                >
                  {item.ticker}
                </span>

                {/* Preço ou Pontos (pts sempre na mesma linha ao lado do valor) */}
                <span className="font-mono text-slate-200 text-[11px] whitespace-nowrap">
                  {formatPrice(item.price, isIndex)}
                </span>

                {/* Variação Percentual */}
                <div
                  className={`flex items-center gap-0.5 text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded whitespace-nowrap ${
                    isPositive
                      ? 'text-emerald-400 bg-emerald-950/60'
                      : isNegative
                      ? 'text-rose-400 bg-rose-950/60'
                      : 'text-slate-400 bg-slate-900'
                  }`}
                >
                  {isPositive && <TrendingUp className="w-2.5 h-2.5" />}
                  {isNegative && <TrendingDown className="w-2.5 h-2.5" />}
                  <span>{formatPercent(item.changePercent)}</span>
                </div>

                {/* Separador sutil */}
                <span className="text-slate-700 ml-2 select-none">•</span>
              </div>
            );
          })}
        </div>

        {/* Degradê de fade lateral direito */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 sm:w-8 bg-gradient-to-l from-slate-950 to-transparent z-10" />
      </div>
    </div>
  );
};
