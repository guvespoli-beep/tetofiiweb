import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  ArrowUpDown,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  HelpCircle,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  X,
  Target,
  Share2,
  Loader2,
  Calendar,
  Percent,
} from 'lucide-react';
import { toBlob, toPng } from 'html-to-image';
import {
  FII_DATABASE,
  formatCurrency,
  formatDecimal,
  formatPercent,
  searchFii,
} from '../data/fiiDatabase';
import { fetchLiveQuote, loadStaticQuotes, loadAllCvmVpa } from '../services/quoteService';
import { MyRadarItem, FiiData } from '../types/index';

interface MyRadarTabProps {
  onOpenExplanation: (topicId: string) => void;
  onGoToCalculator?: (ticker: string) => void;
}

type SortField =
  | 'ticker'
  | 'price'
  | 'vp'
  | 'pvp'
  | 'riskPremium'
  | 'monthlyDividend'
  | 'ceilingPrice'
  | 'ratio'
  | 'dy';

const LOCAL_STORAGE_RATE_KEY = 'tetofii_my_radar_ref_rate';
const LOCAL_STORAGE_ITEMS_KEY = 'tetofii_my_radar_portfolio_items';

/**
 * Função utilitária para converter entrada de texto em número
 * Aceita tanto vírgula (padrão brasileiro: "2,5") quanto ponto ("2.5")
 */
const parseNumberInput = (val: string | number): number => {
  if (typeof val === 'number') return val;
  if (!val) return NaN;
  const normalized = val.toString().replace(',', '.').trim();
  return parseFloat(normalized);
};

export const MyRadarTab: React.FC<MyRadarTabProps> = ({
  onOpenExplanation,
  onGoToCalculator,
}) => {
  // Taxa de referência global para o radar
  const [referenceRate, setReferenceRate] = useState<number | ''>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_RATE_KEY);
      if (saved !== null && saved !== '') {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed >= 0) return parsed;
      }
    } catch {
      // ignore
    }
    return ''; // Inicia em branco quando nunca foi preenchido
  });

  // Lista de ativos do radar
  const [items, setItems] = useState<MyRadarItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ITEMS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortField>('ticker');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filtros rápidos da tabela: Abaixo do Preço Teto e Abaixo do VP
  const [filterBelowCeiling, setFilterBelowCeiling] = useState(false);
  const [filterBelowVp, setFilterBelowVp] = useState(false);

  // Cotações e VPs atualizados em tempo real
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});
  const [liveVps, setLiveVps] = useState<Record<string, { vp: number; date?: string }>>({});

  // Estado do Modal de Inclusão / Edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingTicker, setEditingTicker] = useState<string>('');

  // Campos do formulário no modal
  const [formTicker, setFormTicker] = useState('');
  const [formRiskPremium, setFormRiskPremium] = useState<string>('');
  const [formMonthlyDividend, setFormMonthlyDividend] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  // Modais in-app de confirmação de exclusão (evita window.confirm que falha em iframes)
  const [deleteConfirmTicker, setDeleteConfirmTicker] = useState<string | null>(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

  // Notificação de sucesso / feedback
  const [notification, setNotification] = useState<string | null>(null);

  // Salvar Taxa de Referência no localStorage
  useEffect(() => {
    try {
      if (referenceRate === '') {
        localStorage.removeItem(LOCAL_STORAGE_RATE_KEY);
      } else {
        localStorage.setItem(LOCAL_STORAGE_RATE_KEY, referenceRate.toString());
      }
    } catch {
      // ignore
    }
  }, [referenceRate]);

  // Salvar Itens da Carteira no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_ITEMS_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  // Sincronizar dados caso outra aba ou a Calculadora atualize o localStorage
  useEffect(() => {
    const handleSync = () => {
      try {
        const savedRate = localStorage.getItem(LOCAL_STORAGE_RATE_KEY);
        if (savedRate !== null && savedRate !== '') {
          const parsed = parseFloat(savedRate);
          if (!isNaN(parsed) && parsed >= 0) {
            setReferenceRate(parsed);
          }
        }
        const savedItems = localStorage.getItem(LOCAL_STORAGE_ITEMS_KEY);
        if (savedItems) {
          const parsedItems = JSON.parse(savedItems);
          if (Array.isArray(parsedItems)) {
            setItems(parsedItems);
          }
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('tetofii_my_radar_updated', handleSync);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('tetofii_my_radar_updated', handleSync);
    };
  }, []);

  // Carregar cotações e atualizar automaticamente a cada 5 minutos
  useEffect(() => {
    let isMounted = true;
    const updateQuotes = async () => {
      try {
        const [staticQuotes, cvmVpas] = await Promise.all([
          loadStaticQuotes(),
          loadAllCvmVpa(),
        ]);

        if (isMounted) {
          const map: Record<string, number> = {};
          const vps: Record<string, { vp: number; date?: string }> = {};

          if (staticQuotes && Object.keys(staticQuotes).length > 0) {
            for (const [t, item] of Object.entries(staticQuotes)) {
              if (item.price > 0) map[t] = item.price;
              if (item.vpPerShare && item.vpPerShare > 0) {
                vps[t] = { vp: item.vpPerShare, date: item.cvmReportDate };
              }
            }
          }

          // Prioridade para os dados oficiais da CVM
          if (cvmVpas && Object.keys(cvmVpas).length > 0) {
            for (const [t, item] of Object.entries(cvmVpas)) {
              if (item.vpa > 0) {
                vps[t] = { vp: item.vpa, date: item.dataRefFormatada };
              }
            }
          }

          setLivePrices((prev) => ({ ...prev, ...map }));
          setLiveVps((prev) => ({ ...prev, ...vps }));
        }
      } catch {
        // ignore
      }

      // Buscar cotações em tempo real para os ativos da carteira
      for (const item of items) {
        try {
          const live = await fetchLiveQuote(item.ticker);
          if (live && live.price > 0 && isMounted) {
            setLivePrices((prev) => ({ ...prev, [item.ticker]: live.price }));
            if (live.vpPerShare && live.vpPerShare > 0) {
              setLiveVps((prev) => ({
                ...prev,
                [item.ticker]: { vp: live.vpPerShare!, date: live.cvmReportDate },
              }));
            }
          }
        } catch {
          // ignore
        }
      }
    };

    updateQuotes();

    // Atualiza cotações a cada 5 minutos (300.000 ms)
    const intervalId = setInterval(() => {
      if (isMounted) {
        updateQuotes();
      }
    }, 5 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [items]);

  // Feedback com timeout
  const showFeedback = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Abrir Modal de Adição
  const handleOpenAddModal = () => {
    setModalMode('add');
    setEditingTicker('');
    setFormTicker('');
    setFormRiskPremium('');
    setFormMonthlyDividend('');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Abrir Modal de Edição
  const handleOpenEditModal = (item: MyRadarItem) => {
    setModalMode('edit');
    setEditingTicker(item.ticker);
    setFormTicker(item.ticker);
    setFormRiskPremium(item.riskPremium.toString().replace('.', ','));
    setFormMonthlyDividend(item.monthlyDividend.toString().replace('.', ','));
    setFormError(null);
    setIsModalOpen(true);
  };

  // Ao digitar o Ticker no modal, apenas atualiza o ticker sem preencher campos
  const handleTickerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.toUpperCase().trim();
    setFormTicker(raw);
    setFormError(null);
  };

  // Salvar no Modal (Adicionar ou Editar)
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTicker = formTicker.trim().toUpperCase();

    if (!cleanTicker) {
      setFormError('Por favor, informe o ticker do fundo imobiliário.');
      return;
    }

    const numRisk = parseNumberInput(formRiskPremium);
    if (isNaN(numRisk) || numRisk < 0) {
      setFormError('Informe um valor válido para o Prêmio de Risco (% a.a.).');
      return;
    }

    const numDividend = parseNumberInput(formMonthlyDividend);
    if (isNaN(numDividend) || numDividend <= 0) {
      setFormError('Informe um valor válido e positivo para o Provento Mensal Estimado (R$).');
      return;
    }

    if (modalMode === 'add') {
      const exists = items.some((it) => it.ticker === cleanTicker);
      if (exists) {
        setFormError(`O fundo ${cleanTicker} já está no seu Meu Radar. Clique em Editar na tabela para alterar suas premissas.`);
        return;
      }

      const newItem: MyRadarItem = {
        ticker: cleanTicker,
        riskPremium: numRisk,
        monthlyDividend: numDividend,
        addedAt: Date.now(),
        updatedAt: Date.now(),
      };

      setItems((prev) => [newItem, ...prev]);
      setIsModalOpen(false);
      showFeedback(`Fundo ${cleanTicker} adicionado com sucesso ao seu Meu Radar!`);

      // Atualiza cotação logo após adicionar
      fetchLiveQuote(cleanTicker)
        .then((live) => {
          if (live && live.price > 0) {
            setLivePrices((prev) => ({ ...prev, [cleanTicker]: live.price }));
          }
        })
        .catch(() => {});
    } else {
      // Modo de Edição: o ticker é fixo, atualizando apenas o Prêmio de Risco e o Provento Mensal Estimado
      setItems((prev) =>
        prev.map((it) => {
          if (it.ticker === editingTicker) {
            return {
              ...it,
              riskPremium: numRisk,
              monthlyDividend: numDividend,
              updatedAt: Date.now(),
            };
          }
          return it;
        })
      );
      setIsModalOpen(false);
      showFeedback(`Premissas do fundo ${editingTicker} atualizadas com sucesso!`);
    }
  };

  // Confirmar exclusão de um fundo
  const handleConfirmDelete = () => {
    if (!deleteConfirmTicker) return;
    const ticker = deleteConfirmTicker;
    setItems((prev) => prev.filter((it) => it.ticker !== ticker));
    setDeleteConfirmTicker(null);
    showFeedback(`Fundo ${ticker} removido do seu Meu Radar.`);
  };

  // Confirmar limpeza de todos os fundos
  const handleConfirmClearAll = () => {
    setItems([]);
    setShowClearAllConfirm(false);
    showFeedback('Todos os fundos foram removidos do seu Meu Radar.');
  };

  // Calcular linhas com dados de mercado e cálculos do Preço Teto
  const calculatedRows = useMemo(() => {
    const numRefRate = typeof referenceRate === 'number' ? referenceRate : 0;

    return items.map((item) => {
      const dbMatch = FII_DATABASE.find((f) => f.ticker === item.ticker);
      const name = dbMatch ? dbMatch.name : `Fundo Imobiliário ${item.ticker}`;
      const segment = dbMatch ? dbMatch.segment : 'Outros';
      const management = dbMatch ? dbMatch.management : 'B3';

      const currentPrice = livePrices[item.ticker] ?? (dbMatch ? dbMatch.currentMarketPrice : 0);
      const vp = liveVps[item.ticker]?.vp ?? (dbMatch ? dbMatch.vpPerShare : 0);
      const vpDate = liveVps[item.ticker]?.date || dbMatch?.cvmReportDate || 'Recente';

      const pvp = vp > 0 && currentPrice > 0 ? currentPrice / vp : 0;

      // Taxa de Desconto = Taxa de Referência + Prêmio de Risco do ativo
      const hasRefRate = typeof referenceRate === 'number' && !isNaN(referenceRate) && referenceRate >= 0;
      const discountRate = hasRefRate ? numRefRate + item.riskPremium : 0;
      const annualDividend = item.monthlyDividend * 12;

      // Preço Teto = ((Provento Mensal * 12) / (Taxa Ref + Prêmio Risco)) * 100
      // Calculado apenas quando a Taxa de Referência estiver preenchida
      const ceilingPrice =
        hasRefRate && discountRate > 0 && annualDividend > 0
          ? (annualDividend / discountRate) * 100
          : 0;

      // Preço Atual / Preço Teto
      const priceToCeilingRatio =
        ceilingPrice > 0 && currentPrice > 0 ? currentPrice / ceilingPrice : 0;

      // DY Anual no Preço Atual = (Provento Mensal * 12 / Preço Atual) * 100
      const currentYield =
        currentPrice > 0 && annualDividend > 0
          ? (annualDividend / currentPrice) * 100
          : 0;

      return {
        item,
        name,
        segment,
        management,
        currentPrice,
        vp,
        vpDate,
        pvp,
        discountRate,
        annualDividend,
        ceilingPrice,
        priceToCeilingRatio,
        currentYield,
      };
    });
  }, [items, referenceRate, livePrices, liveVps]);

  // Funções de verificação de condições para os filtros
  const isBelowCeiling = (row: (typeof calculatedRows)[number]) => {
    return row.ceilingPrice > 0 && row.currentPrice > 0 && row.currentPrice <= row.ceilingPrice;
  };

  const isBelowVp = (row: (typeof calculatedRows)[number]) => {
    return row.vp > 0 && row.currentPrice > 0 && (row.pvp < 1.0 || row.currentPrice < row.vp);
  };

  // Base filtrada pelo termo de busca
  const searchFilteredRows = useMemo(() => {
    return calculatedRows.filter((row) => {
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      return (
        row.item.ticker.toLowerCase().includes(q) ||
        row.name.toLowerCase().includes(q) ||
        row.segment.toLowerCase().includes(q)
      );
    });
  }, [calculatedRows, searchTerm]);

  // Contagens dinâmicas dos botões de filtro
  // As quantidades exibidas são atualizadas de acordo com o filtro já inserido
  const { countBelowCeiling, countBelowVp } = useMemo(() => {
    // Base para o botão "Abaixo do Preço Teto":
    // Se o filtro "Abaixo do VP" estiver ativo, reflete os fundos desse conjunto que também estão abaixo do teto
    const baseForCeiling = filterBelowVp
      ? searchFilteredRows.filter(isBelowVp)
      : searchFilteredRows;
    const ceilingCount = baseForCeiling.filter(isBelowCeiling).length;

    // Base para o botão "Abaixo do VP":
    // Se o filtro "Abaixo do Preço Teto" estiver ativo, reflete os fundos desse conjunto que também estão abaixo do VP
    const baseForVp = filterBelowCeiling
      ? searchFilteredRows.filter(isBelowCeiling)
      : searchFilteredRows;
    const vpCount = baseForVp.filter(isBelowVp).length;

    return {
      countBelowCeiling: ceilingCount,
      countBelowVp: vpCount,
    };
  }, [searchFilteredRows, filterBelowCeiling, filterBelowVp]);

  // Filtragem final combinada e Ordenação
  const filteredRows = useMemo(() => {
    return searchFilteredRows
      .filter((row) => {
        if (filterBelowCeiling && !isBelowCeiling(row)) {
          return false;
        }
        if (filterBelowVp && !isBelowVp(row)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        let diff = 0;
        switch (sortBy) {
          case 'ticker':
            diff = a.item.ticker.localeCompare(b.item.ticker);
            break;
          case 'price':
            diff = a.currentPrice - b.currentPrice;
            break;
          case 'vp':
            diff = a.vp - b.vp;
            break;
          case 'pvp':
            diff = a.pvp - b.pvp;
            break;
          case 'riskPremium':
            diff = a.item.riskPremium - b.item.riskPremium;
            break;
          case 'monthlyDividend':
            diff = a.item.monthlyDividend - b.item.monthlyDividend;
            break;
          case 'ceilingPrice':
            diff = a.ceilingPrice - b.ceilingPrice;
            break;
          case 'ratio':
            diff = a.priceToCeilingRatio - b.priceToCeilingRatio;
            break;
          case 'dy':
            diff = a.currentYield - b.currentYield;
            break;
          default:
            diff = 0;
        }
        return sortOrder === 'asc' ? diff : -diff;
      });
  }, [searchFilteredRows, filterBelowCeiling, filterBelowVp, sortBy, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder(field === 'ticker' ? 'asc' : 'desc');
    }
  };

  // Dados auxiliares para o modal ativo
  const modalMatchedFii: FiiData | undefined = useMemo(() => {
    if (!formTicker) return undefined;
    const match = searchFii(formTicker.trim().toUpperCase());
    return match ? match.fund : undefined;
  }, [formTicker]);

  // Cálculo prévio dinâmico no modal
  const modalPreview = useMemo(() => {
    const hasRef = typeof referenceRate === 'number' && !isNaN(referenceRate) && referenceRate >= 0;
    const numRef = hasRef ? referenceRate : 0;
    const numRisk = parseNumberInput(formRiskPremium);
    const numDiv = parseNumberInput(formMonthlyDividend);

    const safeRisk = isNaN(numRisk) || numRisk < 0 ? 0 : numRisk;
    const safeDiv = isNaN(numDiv) || numDiv < 0 ? 0 : numDiv;

    const totalRate = hasRef ? numRef + safeRisk : 0;
    const annual = safeDiv * 12;
    const ceiling = hasRef && totalRate > 0 && annual > 0 ? (annual / totalRate) * 100 : 0;
    return {
      totalRate,
      annual,
      ceiling,
      hasRef,
    };
  }, [referenceRate, formRiskPremium, formMonthlyDividend]);

  const shareRadarCardRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState<boolean>(false);

  // Validação: Preço Teto existe no Meu Radar se houver Taxa de Referência preenchida e pelo menos um ativo com Preço Teto calculado
  const hasRefRate = typeof referenceRate === 'number' && !isNaN(referenceRate) && referenceRate >= 0;
  const hasCeilingPriceInRadar = hasRefRate && filteredRows.some((row) => row.ceilingPrice > 0);

  // Compartilhar Tabela do Meu Radar (Gera Imagem com as 6 colunas especificadas + Taxa de Referência)
  const handleShareRadarTable = async () => {
    if (!shareRadarCardRef.current || filteredRows.length === 0 || !hasCeilingPriceInRadar) return;
    setIsSharing(true);

    const shareText = 'Veja Meu Radar em TETOFII. Crie o seu também em https://gvlab.com.br';
    const siteUrl = 'https://gvlab.com.br';

    try {
      const exportOptions = {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#020617',
        skipFonts: true,
        filter: (domNode: HTMLElement) => {
          if (domNode.tagName === 'LINK' && (domNode as HTMLLinkElement).rel === 'stylesheet') {
            return false;
          }
          return true;
        },
      };

      const blob = await toBlob(shareRadarCardRef.current, exportOptions);

      if (blob) {
        const file = new File([blob], 'TETOFII_Meu_Radar.png', {
          type: 'image/png',
        });

        // 1. Suporte completo a Web Share com arquivos (WhatsApp / Telegram / Mobile)
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Meu Radar | TETOFII',
            text: shareText,
            files: [file],
          });
          setNotification('Radar compartilhado com sucesso!');
          setTimeout(() => setNotification(null), 3500);
          return;
        }

        // 2. Web Share nativo sem arquivos
        if (navigator.share) {
          await navigator.share({
            title: 'Meu Radar | TETOFII',
            text: shareText,
            url: siteUrl,
          });
          const dataUrl = await toPng(shareRadarCardRef.current, exportOptions);
          const link = document.createElement('a');
          link.download = 'TETOFII_Meu_Radar.png';
          link.href = dataUrl;
          link.click();
          setNotification('Imagem baixada e link compartilhado!');
          setTimeout(() => setNotification(null), 3500);
          return;
        }

        // 3. Fallback Desktop sem Web Share API: baixa imagem e copia texto
        const dataUrl = await toPng(shareRadarCardRef.current, exportOptions);
        const link = document.createElement('a');
        link.download = 'TETOFII_Meu_Radar.png';
        link.href = dataUrl;
        link.click();

        await navigator.clipboard.writeText(shareText);
        setNotification('Imagem baixada e mensagem copiada para a área de transferência!');
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (err) {
      console.warn('Erro ao compartilhar tabela do Meu Radar:', err);
      try {
        await navigator.clipboard.writeText(shareText);
        setNotification('Mensagem copiada para a área de transferência!');
        setTimeout(() => setNotification(null), 3000);
      } catch {
        // ignore
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-medium">{notification}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-emerald-700 hover:text-emerald-900 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header do Meu Radar */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-6 shadow-xs border border-slate-200/80">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Meu Radar
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Acompanhe sua seleção de fundos imobiliários com seus próprios parâmetros de risco e proventos estimados.
              Todos os cálculos de Preço Teto são gerados localmente e salvos exclusivamente no seu navegador.
            </p>
          </div>

          {/* Botão de Adicionar Fundo em Destaque */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Incluir Fundo no Radar</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CAMPO DA TAXA DE REFERÊNCIA (CONFORME A IMAGEM ANEXADA) */}
        {/* ========================================================= */}
        <div className="mt-5 p-4 sm:p-5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>Taxa de Referência (% a.a.)</span>
              <button
                type="button"
                onClick={() => onOpenExplanation('taxa-referencia')}
                className="text-slate-400 hover:text-emerald-700 transition-colors p-0.5 rounded cursor-pointer"
                title="Entenda como funciona a Taxa de Referência do Tesouro IPCA+"
              >
                <HelpCircle className="w-4 h-4 text-slate-400 hover:text-emerald-700" />
              </button>
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
              onChange={(e) =>
                setReferenceRate(e.target.value === '' ? '' : parseFloat(e.target.value))
              }
              className="w-full pl-3.5 pr-14 py-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 font-mono font-bold text-sm bg-white shadow-xs"
            />
            <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 font-bold text-xs pt-1 pointer-events-none">
              % a.a.
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-500 pt-0.5">
            <p>
              Rendimento real da taxa de referência (juro acima do IPCA) pago pelo Tesouro Nacional para títulos públicos de longo prazo (NTN-B).
            </p>
            <span className="text-emerald-700 font-semibold whitespace-nowrap">
              Aplicada a todos os fundos da carteira
            </span>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal: Tabela do Meu Radar ou Empty State */}
      <div className="bg-white rounded-2xl p-3 sm:p-6 shadow-xs border border-slate-200/80 space-y-4 sm:space-y-5">
        {/* Barra superior de ações, filtros e busca */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
            {/* Campo de Busca */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filtrar por ticker..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 font-sans"
              />
            </div>

            {/* Filtros: Abaixo do Preço Teto e Abaixo do VP */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setFilterBelowCeiling((prev) => !prev)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border ${
                  filterBelowCeiling
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200/80'
                }`}
                title="Filtrar fundos cotando abaixo do Preço Teto calculado"
              >
                <span>Abaixo do Preço Teto</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    filterBelowCeiling
                      ? 'bg-emerald-800 text-white'
                      : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  {countBelowCeiling}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFilterBelowVp((prev) => !prev)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border ${
                  filterBelowVp
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200/80'
                }`}
                title="Filtrar fundos cotando abaixo do Valor Patrimonial (P/VP < 1,00)"
              >
                <span>Abaixo do VP</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    filterBelowVp
                      ? 'bg-emerald-800 text-white'
                      : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  {countBelowVp}
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-3.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-200/80"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-700" />
              <span>Novo Fundo</span>
            </button>

            {items.length > 0 && (
              <button
                type="button"
                onClick={() => setShowClearAllConfirm(true)}
                className="px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold text-xs transition-colors cursor-pointer"
                title="Limpar todos os fundos do Meu Radar"
              >
                Limpar Tudo
              </button>
            )}

            {items.length > 0 && (
              <button
                type="button"
                onClick={handleShareRadarTable}
                disabled={isSharing || !hasCeilingPriceInRadar}
                className={`px-3.5 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all ${
                  !isSharing && hasCeilingPriceInRadar
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs cursor-pointer'
                    : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed opacity-60 shadow-none'
                }`}
                title={
                  !hasRefRate
                    ? 'Preencha a Taxa de Referência (% a.a.) no topo para calcular o Preço Teto e liberar o compartilhamento'
                    : filteredRows.length === 0
                    ? 'Nenhum fundo para compartilhar com os filtros atuais'
                    : !hasCeilingPriceInRadar
                    ? 'Preencha os dados dos fundos para calcular o Preço Teto e liberar o compartilhamento'
                    : 'Compartilhar imagem do Meu Radar com as cotações e preços teto'
                }
              >
                {isSharing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Share2 className={`w-3.5 h-3.5 ${!isSharing && hasCeilingPriceInRadar ? 'text-white' : 'text-slate-400'}`} />
                )}
                <span>Compartilhar</span>
              </button>
            )}
          </div>
        </div>

        {/* Tabela ou Estado Vazio */}
        {items.length === 0 ? (
          <div className="py-12 px-4 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Target className="w-7 h-7 text-emerald-700" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Seu Radar está vazio
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Adicione os fundos imobiliários que você deseja acompanhar com sua própria taxa de referência,
                prêmio de risco e provento mensal estimado.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Incluir Meu Primeiro Fundo</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
            <table className="w-full text-center text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold select-none">
                  {/* 1. Ativo */}
                  <th
                    onClick={() => handleSort('ticker')}
                    className="p-2 sm:p-3.5 text-center cursor-pointer hover:bg-slate-100 transition-colors min-w-[75px] sm:min-w-[100px]"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Ativo</span>
                      <ArrowUpDown
                        className={`w-3 h-3 ${
                          sortBy === 'ticker' ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      />
                    </div>
                  </th>

                  {/* 2. Preço Atual */}
                  <th
                    onClick={() => handleSort('price')}
                    className="p-2 sm:p-3.5 text-center cursor-pointer hover:bg-slate-100 transition-colors min-w-[95px] sm:min-w-[110px]"
                    title="Cotação oficial de mercado B3"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Preço Atual</span>
                      <ArrowUpDown
                        className={`w-3 h-3 ${
                          sortBy === 'price' ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      />
                    </div>
                  </th>

                  {/* 3. Prêmio de Risco */}
                  <th
                    onClick={() => handleSort('riskPremium')}
                    className="p-2 sm:p-3.5 text-center cursor-pointer hover:bg-slate-100 transition-colors min-w-[95px] sm:min-w-[110px]"
                    title="Prêmio de Risco definido pelo usuário (% a.a.)"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Prêmio de Risco</span>
                      <ArrowUpDown
                        className={`w-3 h-3 ${
                          sortBy === 'riskPremium' ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      />
                    </div>
                  </th>

                  {/* 4. Preço Teto */}
                  <th
                    onClick={() => handleSort('ceilingPrice')}
                    className="p-2 sm:p-3.5 text-center cursor-pointer hover:bg-slate-100 transition-colors min-w-[95px] sm:min-w-[110px] bg-emerald-50/60"
                    title="Preço Teto calculado com a Taxa de Referência + Prêmio de Risco"
                  >
                    <div className="flex items-center justify-center gap-1 text-emerald-950 font-bold">
                      <span>Preço Teto</span>
                      <ArrowUpDown
                        className={`w-3 h-3 ${
                          sortBy === 'ceilingPrice' ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      />
                    </div>
                  </th>

                  {/* 5. Preço Atual / Preço Teto */}
                  <th
                    onClick={() => handleSort('ratio')}
                    className="p-2 sm:p-3.5 text-center cursor-pointer hover:bg-slate-100 transition-colors min-w-[110px] sm:min-w-[130px]"
                    title="Relação Preço Atual ÷ Preço Teto"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Preço Atual / Preço Teto</span>
                      <ArrowUpDown
                        className={`w-3 h-3 ${
                          sortBy === 'ratio' ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      />
                    </div>
                  </th>

                  {/* 6. Provento Mensal Estimado */}
                  <th
                    onClick={() => handleSort('monthlyDividend')}
                    className="p-2 sm:p-3.5 text-center cursor-pointer hover:bg-slate-100 transition-colors min-w-[110px] sm:min-w-[130px]"
                    title="Provento Mensal Estimado por cota definido pelo usuário (R$)"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Provento Mensal Estimado</span>
                      <ArrowUpDown
                        className={`w-3 h-3 ${
                          sortBy === 'monthlyDividend' ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      />
                    </div>
                  </th>

                  {/* 7. DY Anual Estimado */}
                  <th
                    onClick={() => handleSort('dy')}
                    className="p-2 sm:p-3.5 text-center cursor-pointer hover:bg-slate-100 transition-colors min-w-[110px] sm:min-w-[125px]"
                    title="Dividend Yield Anual no Preço Atual com base no Provento Estimado"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>DY Anual Estimado</span>
                      <ArrowUpDown
                        className={`w-3 h-3 ${
                          sortBy === 'dy' ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      />
                    </div>
                  </th>

                  {/* 8. VP por Cota */}
                  <th
                    onClick={() => handleSort('vp')}
                    className="p-2 sm:p-3.5 text-center cursor-pointer hover:bg-slate-100 transition-colors min-w-[95px] sm:min-w-[110px]"
                    title="Valor Patrimonial por Cota"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>VP por Cota</span>
                      <ArrowUpDown
                        className={`w-3 h-3 ${
                          sortBy === 'vp' ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      />
                    </div>
                  </th>

                  {/* 9. P/VP */}
                  <th
                    onClick={() => handleSort('pvp')}
                    className="p-2 sm:p-3.5 text-center cursor-pointer hover:bg-slate-100 transition-colors w-20 sm:w-24"
                    title="Preço de Mercado ÷ VP por Cota"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>P/VP</span>
                      <ArrowUpDown
                        className={`w-3 h-3 ${
                          sortBy === 'pvp' ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      />
                    </div>
                  </th>

                  {/* 10. Ação */}
                  <th className="p-2 sm:p-3.5 text-center min-w-[95px] sm:min-w-[110px]">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 px-4 text-center text-slate-500 text-xs">
                      <p className="font-semibold text-slate-700">Nenhum fundo atende aos filtros selecionados</p>
                      <p className="text-slate-400 mt-1">Experimente desativar os filtros ou alterar a busca por ticker.</p>
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row) => {
                  const { item, currentPrice, vp, vpDate, pvp, ceilingPrice, priceToCeilingRatio, currentYield } = row;
                  const isDiscount = priceToCeilingRatio > 0 && priceToCeilingRatio < 0.999;
                  const isFair = priceToCeilingRatio >= 0.999 && priceToCeilingRatio <= 1.005;

                  return (
                    <tr
                      key={item.ticker}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* 1. Ativo */}
                      <td className="p-2 sm:p-3.5 text-center">
                        <span className="font-mono font-black text-slate-900 text-xs sm:text-sm">
                          {item.ticker}
                        </span>
                      </td>

                      {/* 2. Preço Atual */}
                      <td className="p-2 sm:p-3.5 text-center font-mono font-bold text-slate-900 text-xs sm:text-sm">
                        {currentPrice > 0 ? formatCurrency(currentPrice) : 'R$ 0,00'}
                      </td>

                      {/* 3. Prêmio de Risco */}
                      <td className="p-2 sm:p-3.5 text-center font-mono text-slate-700 font-semibold text-xs">
                        {formatPercent(item.riskPremium, 2)}
                      </td>

                      {/* 4. Preço Teto */}
                      <td className="p-2 sm:p-3.5 text-center font-mono font-black text-emerald-800 text-xs sm:text-sm bg-emerald-50/40">
                        {ceilingPrice > 0 ? formatCurrency(ceilingPrice) : '-'}
                      </td>

                      {/* 5. Preço Atual / Preço Teto */}
                      <td className="p-2 sm:p-3.5 text-center font-mono">
                        {priceToCeilingRatio > 0 ? (
                          <span
                            className={`inline-block px-1.5 sm:px-2 py-0.5 rounded text-[11px] sm:text-xs font-black ${
                              isDiscount
                                ? 'bg-emerald-100 text-emerald-800'
                                : isFair
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {formatDecimal(priceToCeilingRatio, 2)}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* 6. Provento Mensal Estimado */}
                      <td className="p-2 sm:p-3.5 text-center font-mono text-slate-900 font-bold text-xs">
                        {formatCurrency(item.monthlyDividend)}
                      </td>

                      {/* 7. DY Anual Estimado */}
                      <td className="p-2 sm:p-3.5 text-center font-mono font-bold text-slate-800 text-xs">
                        {currentYield > 0 ? formatPercent(currentYield, 2) : '-'}
                      </td>

                      {/* 8. VP por Cota */}
                      <td className="p-2 sm:p-3.5 text-center font-mono font-semibold text-slate-700 text-xs">
                        {vp > 0 ? formatCurrency(vp) : '-'}
                      </td>

                      {/* 9. P/VP */}
                      <td className="p-2 sm:p-3.5 text-center font-mono">
                        {pvp > 0 ? (
                          <span
                            className={`inline-block px-1.5 sm:px-2 py-0.5 rounded text-[11px] sm:text-xs font-bold ${
                              pvp < 0.98
                                ? 'bg-emerald-100 text-emerald-800'
                                : pvp > 1.02
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {formatDecimal(pvp, 2)}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* 10. Ação: Editar e Remover */}
                      <td className="p-2 sm:p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(item)}
                            className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                            title={`Editar premissas de ${item.ticker}`}
                          >
                            <Edit3 className="w-3 h-3" />
                            <span className="hidden sm:inline">Editar</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmTicker(item.ticker)}
                            className="p-1 sm:p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title={`Remover ${item.ticker} do Meu Radar`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }))}
              </tbody>
            </table>
          </div>
        )}

        {/* Rodapé Informativo */}
        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-400 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Privacidade Garantida: Seus dados estão salvos apenas no seu navegador. Nenhuma informação é transmitida.
            </span>
          </div>
          <span className="font-mono text-slate-500">
            Total: {items.length} {items.length === 1 ? 'ativo' : 'ativos'} no Meu Radar
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL DE INCLUSÃO / EDIÇÃO DO FUNDO NO RADAR */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200/80 space-y-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-800">
                  {modalMode === 'add' ? (
                    <Plus className="w-5 h-5 text-emerald-700" />
                  ) : (
                    <Edit3 className="w-5 h-5 text-emerald-700" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {modalMode === 'add'
                      ? 'Incluir Novo Fundo no Meu Radar'
                      : `Editar Premissas de ${editingTicker}`}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {modalMode === 'add'
                      ? 'Cadastre o fundo com seu prêmio de risco e provento mensal estimado'
                      : 'Altere o prêmio de risco ou o provento mensal estimado'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error in Modal */}
            {formError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveModal} className="space-y-4">
              {/* Campo 1: Ticker (Apenas na inclusão de novo fundo) */}
              {modalMode === 'add' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">
                    Ticker do Fundo Imobiliário
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formTicker}
                      onChange={handleTickerInputChange}
                      placeholder=""
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 bg-white font-mono font-bold text-sm uppercase"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Digite o código negociado na B3.
                  </p>
                </div>
              )}

              {/* Campo 2: Prêmio de Risco (% a.a.) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>Prêmio de Risco (% a.a.)</span>
                    <button
                      type="button"
                      onClick={() => onOpenExplanation('premio-risco')}
                      className="text-slate-400 hover:text-emerald-700 cursor-pointer"
                      title="Entenda o Prêmio de Risco"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={formRiskPremium}
                    onChange={(e) => setFormRiskPremium(e.target.value)}
                    placeholder=""
                    className="w-full pl-3.5 pr-14 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 font-mono font-bold text-sm bg-white"
                  />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 font-bold text-xs pointer-events-none">
                    % a.a.
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Retorno adicional exigido por você para o risco do fundo acima do Tesouro IPCA+.
                </p>
              </div>

              {/* Campo 3: Provento Mensal Estimado (R$) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>Provento Mensal Estimado (R$)</span>
                    <button
                      type="button"
                      onClick={() => onOpenExplanation('provento-mensal')}
                      className="text-slate-400 hover:text-emerald-700 cursor-pointer"
                      title="Entenda o Provento Mensal Estimado"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-xs pointer-events-none">
                    R$
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={formMonthlyDividend}
                    onChange={(e) => setFormMonthlyDividend(e.target.value)}
                    placeholder=""
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 font-mono font-bold text-sm bg-white"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Estimativa de dividendo mensal por cota esperado para os próximos 12 meses.
                </p>
              </div>

              {/* Prévia de Cálculo Dinâmica no Modal */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-1.5 text-xs text-emerald-950">
                <div className="flex items-center justify-between font-medium">
                  <span className="text-slate-600">Provento Anual Estimado:</span>
                  <span className="font-mono font-bold">
                    {formatCurrency(modalPreview.annual)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-emerald-200/60 font-bold text-emerald-950">
                  <span>Preço Teto Estimado:</span>
                  <span className="font-mono text-base font-black text-emerald-800">
                    {modalPreview.ceiling > 0
                      ? formatCurrency(modalPreview.ceiling)
                      : '-'}
                  </span>
                </div>
              </div>

              {/* Botões do Modal */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  {modalMode === 'add' ? 'Salvar no Meu Radar' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO DE UM FUNDO */}
      {/* ========================================================= */}
      {deleteConfirmTicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200/80 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-rose-100 rounded-2xl text-rose-700 shrink-0">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900">
                  Remover {deleteConfirmTicker} do Meu Radar?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tem certeza de que deseja remover o fundo <span className="font-mono font-bold text-slate-800">{deleteConfirmTicker}</span> da sua lista de acompanhamento salva no navegador?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmTicker(null)}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                Sim, Remover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL DE CONFIRMAÇÃO PARA LIMPAR TODO O RADAR */}
      {/* ========================================================= */}
      {showClearAllConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200/80 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-rose-100 rounded-2xl text-rose-700 shrink-0">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900">
                  Limpar Todo o Meu Radar?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Esta ação removerá todos os <span className="font-bold text-slate-800">{items.length} fundos</span> cadastrados na sua carteira local. Os dados serão apagados deste navegador.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowClearAllConfirm(false)}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmClearAll}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                Sim, Limpar Tudo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================================
          TEMPLATE EXCLUSIVO DE COMPARTILHAMENTO DA TABELA DO MEU RADAR
          Contém apenas as 6 colunas especificadas + Taxa de Referência
         ======================================================================= */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none select-none z-[-100]">
        <div
          ref={shareRadarCardRef}
          style={{ width: '720px' }}
          className="bg-slate-950 p-6 text-white rounded-3xl border-2 border-slate-800 shadow-2xl space-y-4 font-sans"
        >
          {/* Cabeçalho */}
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Meu Radar
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  TETOFII • gvlab.com.br
                </span>
              </div>
              <h2 className="text-lg font-black tracking-tight text-white mt-1">
                Radar de FIIs & Precificação
              </h2>
            </div>

            {/* Logo da Marca */}
            <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-black text-xs">
                T
              </div>
              <div className="text-left leading-tight">
                <span className="text-sm font-black tracking-tight text-white">
                  TETO<span className="text-emerald-400">FII</span>
                </span>
                <span className="block text-[9px] text-slate-400 font-mono">gvlab.com.br</span>
              </div>
            </div>
          </div>

          {/* Faixa da Taxa de Referência Utilizada */}
          <div className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-200 font-medium">
              <Percent className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Taxa de Referência Utilizada:{' '}
                <strong className="text-emerald-400 font-mono font-bold text-sm">
                  {typeof referenceRate === 'number' && !isNaN(referenceRate)
                    ? `${formatPercent(referenceRate, 2)} a.a.`
                    : '-'}
                </strong>
              </span>
            </div>
            <div className="text-slate-400 text-[11px] font-mono">
              {filteredRows.length} {filteredRows.length === 1 ? 'fundo listado' : 'fundos listados'}
            </div>
          </div>

          {/* Tabela com EXATAMENTE as 6 colunas da imagem do usuário */}
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40">
            <table className="w-full text-center text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-300 font-semibold border-b border-slate-800">
                  <th className="p-3 text-center min-w-[95px]">Ativo</th>
                  <th className="p-3 text-center min-w-[100px]">Preço Atual</th>
                  <th className="p-3 text-center min-w-[110px]">Prêmio de Risco</th>
                  <th className="p-3 text-center min-w-[105px] text-emerald-400 font-bold bg-emerald-950/30">
                    Preço Teto
                  </th>
                  <th className="p-3 text-center min-w-[140px]">Preço Atual / Preço Teto</th>
                  <th className="p-3 text-center min-w-[95px]">P/VP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredRows.map((row, idx) => {
                  const { item, currentPrice, ceilingPrice, priceToCeilingRatio, pvp } = row;
                  const isDiscount = ceilingPrice > 0 && currentPrice > 0 && currentPrice <= ceilingPrice;
                  const isFair =
                    ceilingPrice > 0 && currentPrice > 0 && Math.abs(currentPrice - ceilingPrice) <= 0.05;

                  return (
                    <tr
                      key={item.ticker}
                      className={idx % 2 === 0 ? 'bg-slate-950' : 'bg-slate-900/50'}
                    >
                      {/* 1. Ativo */}
                      <td className="p-3 text-center">
                        <span className="font-bold text-emerald-400 text-sm">
                          {item.ticker}
                        </span>
                      </td>

                      {/* 2. Preço Atual */}
                      <td className="p-3 text-center font-bold text-white text-xs">
                        {currentPrice > 0 ? formatCurrency(currentPrice) : 'R$ 0,00'}
                      </td>

                      {/* 3. Prêmio de Risco */}
                      <td className="p-3 text-center text-slate-300 text-xs font-semibold">
                        {formatPercent(item.riskPremium, 2)}
                      </td>

                      {/* 4. Preço Teto */}
                      <td className="p-3 text-center font-bold text-emerald-300 text-xs bg-emerald-950/20">
                        {ceilingPrice > 0 ? formatCurrency(ceilingPrice) : '-'}
                      </td>

                      {/* 5. Preço Atual / Preço Teto */}
                      <td className="p-3 text-center">
                        {priceToCeilingRatio > 0 ? (
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                              isDiscount
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : isFair
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {formatDecimal(priceToCeilingRatio, 2)}
                          </span>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>

                      {/* 6. P/VP */}
                      <td className="p-3 text-center font-mono">
                        {pvp > 0 ? (
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold ${
                              pvp < 0.98
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : pvp > 1.02
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-200 border border-slate-700'
                            }`}
                          >
                            {formatDecimal(pvp, 2)}
                          </span>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Rodapé da imagem com link e mensagem */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center font-black text-[10px]">
                T
              </div>
              <span className="text-slate-300 font-medium">
                Veja Meu Radar em <strong className="text-white">TETOFII</strong>. Crie o seu também em{' '}
                <span className="text-emerald-400 font-mono">https://gvlab.com.br</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
