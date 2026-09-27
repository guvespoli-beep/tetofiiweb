import React, { useState, useMemo, useEffect } from 'react';
import {
  FileText,
  Calendar,
  Building2,
  ExternalLink,
  ArrowLeft,
  Filter,
  CheckCircle2,
  TrendingUp,
  Percent,
  Layers,
  Users,
  AlertCircle,
  Clock,
  Sparkles,
  Search,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Share2,
  Check,
  Copy
} from 'lucide-react';
import { FII_REPORTS_DATA } from '../data/fiiReports';
import { FiiReportHighlight } from '../types/reports';

interface FiiReportsSectionProps {
  initialReportId?: string | null;
  onSelectReportId?: (id: string | null) => void;
  onGoToCalculatorWithTicker?: (ticker: string) => void;
}

export const FiiReportsSection: React.FC<FiiReportsSectionProps> = ({
  initialReportId = null,
  onSelectReportId,
  onGoToCalculatorWithTicker,
}) => {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(initialReportId);
  const [selectedTickerFilter, setSelectedTickerFilter] = useState<string>('TODOS');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Sincroniza estado se a prop inicial mudar (ex: link vindo de fora)
  useEffect(() => {
    if (initialReportId) {
      setSelectedReportId(initialReportId);
    }
  }, [initialReportId]);

  // Função interna para atualizar relatório selecionado e manter a URL sincronizada (?materia=id)
  const handleOpenReport = (id: string | null) => {
    setSelectedReportId(id);
    if (onSelectReportId) {
      onSelectReportId(id);
    }
    try {
      const url = new URL(window.location.href);
      if (id) {
        url.searchParams.set('materia', id);
        url.searchParams.delete('relatorio');
        url.searchParams.delete('artigo');
      } else {
        url.searchParams.delete('materia');
        url.searchParams.delete('relatorio');
        url.searchParams.delete('artigo');
      }
      window.history.replaceState({}, '', url.toString());
    } catch {
      // fallback
    }
  };

  // Ordenados do mais recente para o mais antigo pela data de publicação (publishedAt)
  const sortedReports = useMemo(() => {
    return [...FII_REPORTS_DATA].sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, []);

  // Lista dinâmica de tickers presentes nas publicações
  const availableTickers = useMemo(() => {
    const set = new Set<string>();
    FII_REPORTS_DATA.forEach(r => set.add(r.ticker));
    return Array.from(set).sort();
  }, []);

  // Filtragem
  const filteredReports = useMemo(() => {
    return sortedReports.filter(report => {
      const matchTicker =
        selectedTickerFilter === 'TODOS' || report.ticker === selectedTickerFilter;
      const matchSearch =
        searchQuery.trim() === '' ||
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.fundName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTicker && matchSearch;
    });
  }, [sortedReports, selectedTickerFilter, searchQuery]);

  const activeReport = useMemo(() => {
    if (!selectedReportId) return null;
    return sortedReports.find(r => r.id === selectedReportId) || null;
  }, [selectedReportId, sortedReports]);

  // Compartilhar link da matéria
  const handleShareReport = async () => {
    if (!activeReport) return;
    const shareUrl = `${window.location.origin}${window.location.pathname}?materia=${activeReport.id}`;
    const shareTitle = `${activeReport.title} | TETOFII`;
    const shareText = activeReport.title;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err: any) {
        // Se usuário cancelou o share nativo, não faz nada
        if (err?.name === 'AbortError') return;
      }
    }

    // Fallback para Clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch {
      // Prompt manual se clipboard falhar
      window.prompt('Copie o link desta matéria:', shareUrl);
    }
  };

  // Se o usuário clicou em um relatório, exibe a página detalhada
  if (activeReport) {
    const reportShareUrl = `${window.location.origin}${window.location.pathname}?materia=${activeReport.id}`;

    return (
      <article className="space-y-6 text-slate-800 animate-in fade-in duration-200">
        {/* Barra superior de navegação com botão Voltar, Compartilhar e Calculadora */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              handleOpenReport(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200/90 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 font-bold text-sm shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Botão de Compartilhar */}
            <button
              type="button"
              onClick={handleShareReport}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm border transition-all cursor-pointer shadow-2xs ${
                copiedLink
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:text-emerald-700 hover:border-emerald-300'
              }`}
              title="Compartilhar"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Link Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-emerald-600" />
                  <span>Compartilhar</span>
                </>
              )}
            </button>

            {onGoToCalculatorWithTicker && (
              <button
                type="button"
                onClick={() => onGoToCalculatorWithTicker(activeReport.ticker)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
              >
                <span>Calcular Preço Teto de {activeReport.ticker}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Cabeçalho Profissional e Harmonioso */}
        <header className="bg-white rounded-3xl p-6 sm:p-10 shadow-xs border border-slate-200/90 relative overflow-hidden space-y-4">
          <div className="absolute top-0 right-0 w-72 h-72 bg-radial from-emerald-100/60 to-transparent pointer-events-none rounded-bl-full" />
          
          <div className="relative z-10 space-y-3">
            {/* Metadados: Ticker Badge, Data de Postagem e Segmento */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <span className="px-3 py-1 rounded-lg font-black bg-emerald-800 text-white text-sm tracking-wide shadow-2xs">
                {activeReport.ticker}
              </span>
              <span className="px-2.5 py-1 rounded-lg font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200">
                #{activeReport.id.toUpperCase()}
              </span>
              <span className="px-3 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800">
                {activeReport.segment}
              </span>
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Publicado em: <strong>{activeReport.publishedAtFormatted}</strong></span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-medium">Competência: <strong>{activeReport.reportMonth}</strong></span>
            </div>

            {/* Título Principal */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {activeReport.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-medium max-w-3xl">
              Fundo: <strong className="text-slate-800">{activeReport.fundName}</strong> • Gestão: <strong className="text-slate-800">{activeReport.gestor}</strong>
            </p>

            {/* Ações: Compartilhar no cabeçalho */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleShareReport}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-bold text-sm transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-emerald-700" />
                <span>{copiedLink ? 'Link Copiado!' : 'Compartilhar'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Bloco 1: Ficha Institucional da Gestão e Guidance */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/90 space-y-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-700" />
            <span>Dados da Gestão e Diretrizes (Guidance)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Gestor
              </span>
              <p className="font-bold text-slate-900 text-sm">{activeReport.gestor}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Administrador
              </span>
              <p className="font-bold text-slate-900 text-sm">{activeReport.administrador}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Taxa de Adm Total
              </span>
              <p className="font-bold text-slate-900 text-sm">{activeReport.taxaAdmTotal}</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                Guidance 2º Semestre
              </span>
              <p className="font-black text-emerald-900 text-sm">{activeReport.guidance || 'Consulte o relatório'}</p>
            </div>
          </div>
        </section>

        {/* Bloco 2: Indicadores Financeiros e Operacionais do Relatório */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/90 space-y-6">
          <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Principais Indicadores do Mês ({activeReport.reportMonth})
              </h2>
              <p className="text-xs text-slate-500">
                Compilação das métricas reportadas no documento original da gestora
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              {activeReport.indicadores.length} Métricas Extraídas
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {activeReport.indicadores.map((ind) => (
              <div
                key={ind.label}
                className={`p-4 rounded-2xl border transition-all ${
                  ind.highlight
                    ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-200'
                    : 'bg-slate-50/70 border-slate-200/80'
                }`}
              >
                <span className="text-[11px] font-bold text-slate-500 block leading-tight">
                  {ind.label}
                </span>
                <p
                  className={`text-lg sm:text-xl font-black mt-1 ${
                    ind.highlight ? 'text-emerald-900' : 'text-slate-900'
                  }`}
                >
                  {ind.value}
                </p>
                {ind.sublabel && (
                  <span className="text-[11px] text-slate-400 block mt-0.5 font-medium">
                    {ind.sublabel}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Principais Inquilinos */}
          {activeReport.principaisInquilinos && activeReport.principaisInquilinos.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Principais Inquilinos no Portfólio:
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {activeReport.principaisInquilinos.map((loc) => (
                  <span
                    key={loc}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs"
                  >
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Bloco 3: Outros Pontos Relevantes */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/90 space-y-4">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <span>Outros Pontos Relevantes do Relatório</span>
          </h2>

          <div className="space-y-3 pt-2">
            {activeReport.outrosPontosRelevantes.map((ponto, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/50 transition-colors"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  {ponto}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Rodapé da Página do Artigo com CTA em Destaque para o Relatório Completo */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-100 border border-slate-200/80 flex flex-col items-center justify-center text-center gap-5">
          <div className="space-y-1 max-w-xl">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Documento Oficial na Íntegra
            </p>
            <p className="text-sm text-slate-700 font-medium">
              Relatório publicado pela Gestora ({activeReport.gestor}) e registrado oficialmente na CVM / B3.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            {/* Botão com o layout e destaque exato da imagem */}
            <a
              href={activeReport.pdfUrl || 'https://fnet.bmfbovespa.com.br/fnet/publico/exibirDocumento?id=1327262&cvm=true'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#03442c] hover:bg-[#023321] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
            >
              <FileText className="w-5 h-5 text-emerald-400" />
              <span>Clique Aqui para ler o relatório completo</span>
              <ExternalLink className="w-4 h-4 text-emerald-300/80 ml-0.5" />
            </a>

            <button
              type="button"
              onClick={handleShareReport}
              className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border font-bold text-sm shadow-xs transition-all cursor-pointer ${
                copiedLink
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 hover:text-emerald-700'
              }`}
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Link Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-emerald-600" />
                  <span>Compartilhar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </article>
    );
  }

  // Visualização da Lista de Publicações
  return (
    <div className="space-y-8 text-slate-800">
      {/* Hero Header da Seção */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xs border border-slate-200/90 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-emerald-100/50 to-transparent pointer-events-none rounded-bl-full" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            FIIque Informado
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Acompanhe as principais informações dos Fundos Imobiliários de Tijolos
          </p>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/90 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Filtro por Tickers Disponíveis */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 pr-1">
            <Filter className="w-3.5 h-3.5 text-emerald-700" />
            <span>Filtrar por Fundo:</span>
          </div>

          <button
            type="button"
            onClick={() => setSelectedTickerFilter('TODOS')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              selectedTickerFilter === 'TODOS'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            Todos ({sortedReports.length})
          </button>

          {availableTickers.map((ticker) => {
            const count = sortedReports.filter(r => r.ticker === ticker).length;
            const isSelected = selectedTickerFilter === ticker;
            return (
              <button
                key={ticker}
                type="button"
                onClick={() => setSelectedTickerFilter(ticker)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {ticker} ({count})
              </button>
            );
          })}
        </div>

        {/* Campo de Busca Rápida */}
        <div className="relative shrink-0 w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por fundo ou mês..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Lista de Postagens (Organizadas do mais recente para o mais antigo) */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">Nenhum relatório encontrado</h3>
            <p className="text-xs text-slate-500">
              Tente selecionar outro filtro ou limpar sua busca.
            </p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              onClick={() => {
                handleOpenReport(report.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/90 hover:border-emerald-500/80 hover:shadow-md transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                {/* Linha de Metadados: Data de Publicação e Badges */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2.5 py-0.5 rounded-lg font-black bg-emerald-800 text-white text-xs tracking-wide">
                    {report.ticker}
                  </span>
                  <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    #{report.id.toUpperCase()}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                    {report.segment}
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-xs">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Publicado em: {report.publishedAtFormatted}</span>
                  </div>
                </div>

                {/* Título da Postagem */}
                <h2 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                  {report.title}
                </h2>
              </div>

              {/* Botão de Ação / Seta */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span className="hidden sm:inline-block text-xs font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                  Ver Destaques e PDF
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition-all flex items-center justify-center shadow-2xs">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
