import React, { useState, useEffect, useCallback } from 'react';
import {
  Calculator as CalcIcon,
  Table as TableIcon,
  ExternalLink,
  Info,
  Menu,
  X,
  Building2,
  Mail,
  Smartphone,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { Calculator } from './components/Calculator';
import { RadarFiiTable } from './components/RadarFiiTable';
import { DownloadAppTab } from './components/DownloadAppTab';
import { EducationalGuide } from './components/EducationalGuide';
import { FiiReportsSection } from './components/FiiReportsSection';
import { MyRadarTab } from './components/MyRadarTab';
import { AboutProjectModal } from './components/AboutProjectModal';
import { ExplanationModal } from './components/ExplanationModal';
import { DisclaimerModal } from './components/DisclaimerModal';
import { AdsenseGuideModal } from './components/AdsenseGuideModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { AdBanner } from './components/AdBanner';
import { MarketTickerTape } from './components/MarketTickerTape';
import { BookOpen, FileText, Target } from 'lucide-react';
import { FII_REPORTS_DATA } from './data/fiiReports';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { AboutPage } from './pages/AboutPage';

export type TabType =
  | 'calculator'
  | 'my-radar'
  | 'radar'
  | 'reports'
  | 'guide'
  | 'download'
  | 'privacy'
  | 'terms'
  | 'about';

export const TAB_PATHS: Record<TabType, string> = {
  calculator: '/calculadora',
  'my-radar': '/meu-radar',
  radar: '/fiis-de-tijolo',
  reports: '/fiiqueinformado',
  guide: '/guia-de-precificacao',
  download: '/aplicativo',
  privacy: '/politica-de-privacidade',
  terms: '/termos-de-uso',
  about: '/sobre',
};

export function getTabFromPath(rawPath: string): TabType | null {
  const p = (rawPath || '').toLowerCase().replace(/\/$/, '');
  if (p === '' || p === '/' || p === '/calculadora' || p.endsWith('/calculadora/index.html')) return 'calculator';
  if (p === '/meu-radar' || p.endsWith('/meu-radar/index.html')) return 'my-radar';
  if (p === '/fiis-de-tijolo' || p === '/radar' || p.endsWith('/fiis-de-tijolo/index.html')) return 'radar';
  if (
    p === '/fiiqueinformado' ||
    p === '/fiiqueinfomado' ||
    p === '/fiique-informado' ||
    p === '/relatorios' ||
    p.startsWith('/fiiqueinformado/') ||
    p.startsWith('/fiiqueinfomado/') ||
    p.startsWith('/fiique-informado/') ||
    p.startsWith('/relatorios/') ||
    p.startsWith('/materia/') ||
    p.endsWith('/fiiqueinformado/index.html') ||
    p.endsWith('/fiiqueinfomado/index.html') ||
    p.endsWith('/fiique-informado/index.html') ||
    p.endsWith('/relatorios/index.html')
  ) {
    return 'reports';
  }
  if (p === '/guia-de-precificacao' || p === '/guia' || p.endsWith('/guia-de-precificacao/index.html')) return 'guide';
  if (p === '/aplicativo' || p === '/baixe-o-app' || p.endsWith('/aplicativo/index.html')) return 'download';
  if (p === '/politica-de-privacidade' || p === '/privacidade' || p.endsWith('/politica-de-privacidade/index.html')) return 'privacy';
  if (p === '/termos-de-uso' || p === '/termos' || p.endsWith('/termos-de-uso/index.html')) return 'terms';
  if (p === '/sobre' || p.endsWith('/sobre/index.html')) return 'about';
  return null;
}

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (typeof window !== 'undefined') {
      const tabFromPath = getTabFromPath(window.location.pathname);
      if (tabFromPath) return tabFromPath;
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('aba');
      if (tabParam) {
        if (['my-radar', 'meu-radar', 'meuradar'].includes(tabParam)) return 'my-radar';
        if (['calculator', 'radar', 'reports', 'guide', 'download', 'privacy', 'terms', 'about'].includes(tabParam)) {
          return tabParam as TabType;
        }
      }
    }
    return 'calculator';
  });

  const [selectedFiiForCalc, setSelectedFiiForCalc] = useState<string>('');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const match = window.location.pathname.match(/\/(?:fiiqueinformado|fiiqueinfomado|fiique-informado|relatorios|materia)\/(art-[a-z0-9-]+)/i);
      if (match) return match[1].toLowerCase();
      const params = new URLSearchParams(window.location.search);
      const r = params.get('materia') || params.get('relatorio') || params.get('artigo');
      if (r) return r.trim().toLowerCase();
    }
    return null;
  });

  // Modals state
  const [explanationTopicId, setExplanationTopicId] = useState<string | null>(null);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isAdGuideOpen, setIsAdGuideOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Navegação unificada com suporte a URLs reais e histórico do navegador
  const navigateTo = useCallback((tab: TabType, reportId: string | null = null) => {
    setActiveTab(tab);
    setSelectedReportId(reportId);
    setIsMobileMenuOpen(false);

    try {
      let targetPath = TAB_PATHS[tab] || '/';
      if (tab === 'reports' && reportId) {
        targetPath = `/fiiqueinformado/${reportId}`;
      }
      const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
      if (currentPath !== targetPath) {
        window.history.pushState({ tab, reportId }, '', targetPath);
      }
    } catch {
      // Ignora erro em iframes restritos
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Suporte aos botões Voltar / Avançar do navegador (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const tabFromPath = getTabFromPath(window.location.pathname);
      if (tabFromPath) {
        setActiveTab(tabFromPath);
      }
      const match = window.location.pathname.match(/\/(?:fiiqueinformado|fiiqueinfomado|fiique-informado|relatorios|materia)\/(art-[a-z0-9-]+)/i);
      if (match) {
        setSelectedReportId(match[1].toLowerCase());
      } else {
        const params = new URLSearchParams(window.location.search);
        const r = params.get('materia') || params.get('relatorio') || params.get('artigo');
        setSelectedReportId(r ? r.trim().toLowerCase() : null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Check initial disclaimer acceptance and URL query parameters (materia, ticker, guia admin)
  useEffect(() => {
    const hasAccepted = localStorage.getItem('tetofii_disclaimer_accepted');
    if (!hasAccepted) {
      setIsDisclaimerOpen(true);
    }

    try {
      const params = new URLSearchParams(window.location.search);
      
      // Deep link para matéria/relatório: ?materia=art-1001 ou ?relatorio=...
      const reportParam = params.get('materia') || params.get('relatorio') || params.get('artigo');
      if (reportParam) {
        setSelectedReportId(reportParam.trim().toLowerCase());
        setActiveTab('reports');
      }

      // Ticker pré-selecionado para cálculo: ?fii=HGLG11
      const fiiParam = params.get('fii') || params.get('ticker');
      if (fiiParam) {
        setSelectedFiiForCalc(fiiParam.toUpperCase());
      }

      // Acesso privado ao guia de AdSense via URL (?guia=adsense)
      if (params.get('guia') === 'adsense' || params.get('admin') === 'adsense') {
        setIsAdGuideOpen(true);
      }
    } catch {
      // Ignora erro de parsing em ambientes restritos
    }
  }, []);

  // Atualiza título, meta tags, OpenGraph e canonical tag dinamicamente a cada página
  useEffect(() => {
    try {
      let title = 'TETOFII - Calculadora de Preço Teto e Informações de FIIs de Tijolo';
      let description = 'TETOFII: Calculadora de Preço Teto, P/VP e portal informativo de Fundos Imobiliários de Tijolo. Acompanhe destaques de relatórios gerenciais e análises.';

      if (activeTab === 'my-radar') {
        title = 'Meu Radar de FIIs de Tijolo - TETOFII | Preço Teto, Margem de Segurança e P/VP';
        description = 'Personalize seu radar de Fundos Imobiliários de Tijolo: filtre por segmento, defina taxas de referência, compare Preço Teto com Preço Atual e calcule sua margem de segurança.';
      } else if (activeTab === 'radar') {
        title = 'Radar de FIIs de Tijolo - TETOFII | Cotações B3, P/VP, Vacância e VPA CVM';
        description = 'Tabela completa com indicadores dos principais FIIs de Tijolo da B3: cotações em tempo real, VPA oficial da CVM (Resolução 175), P/VP e dividend yield.';
      } else if (activeTab === 'reports') {
        if (selectedReportId) {
          const report = FII_REPORTS_DATA.find(r => r.id === selectedReportId);
          if (report) {
            title = `${report.title} | TETOFII`;
            description = `Confira os principais indicadores e destaques do relatório gerencial do ${report.ticker} (${report.fundName}): ${report.summaryBadge || report.title}`;
          } else {
            title = 'FIIque Informado - TETOFII | Destaques e Relatórios Gerenciais de FIIs';
            description = 'Resumos executivos e pontos de atenção dos relatórios gerenciais mais recentes dos maiores fundos imobiliários de tijolo do Brasil.';
          }
        } else {
          title = 'FIIque Informado - TETOFII | Destaques e Relatórios Gerenciais de FIIs';
          description = 'Resumos executivos e pontos de atenção dos relatórios gerenciais mais recentes dos maiores fundos imobiliários de tijolo do Brasil.';
        }
      } else if (activeTab === 'guide') {
        title = 'Guia de Precificação de FIIs - TETOFII | Metodologia Preço Teto e NTN-B';
        description = 'Aprenda como calcular o Preço Teto de Fundos Imobiliários de Tijolo usando o Tesouro IPCA+ (NTN-B), Gordon Growth Model e prêmio de risco adequado.';
      } else if (activeTab === 'download') {
        title = 'Baixe o Aplicativo TETOFII | App Android e PWA de Precificação de FIIs';
        description = 'Instale o aplicativo oficial do TETOFII no seu celular Android para acessar a calculadora e os radares de FIIs direto na tela inicial.';
      } else if (activeTab === 'privacy') {
        title = 'Política de Privacidade e Cookies - TETOFII | Conformidade AdSense e LGPD';
        description = 'Política de Privacidade oficial da plataforma TETOFII. Informações sobre tratamento de dados, cookies de publicidade Google AdSense (DART) e direitos LGPD.';
      } else if (activeTab === 'terms') {
        title = 'Termos de Uso e Isenção Regulatória - TETOFII | Resolução CVM 20/2021';
        description = 'Termos de uso e avisos legais da plataforma TETOFII. Esclarecimentos sobre simulações matemáticas e ausência de recomendação de investimentos.';
      } else if (activeTab === 'about') {
        title = 'Sobre o TETOFII - GVLab | Engenharia Quantitativa e Educação em FIIs';
        description = 'Conheça a história, missão e metodologia matemática por trás do TETOFII. Iniciativa do estúdio GVLab para democratização do valuation de FIIs de Tijolo.';
      }

      document.title = title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', description);
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', title);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', description);
    } catch {
      // Ignora erro em ambientes restritos
    }
  }, [activeTab, selectedReportId]);

  const handleAcceptDisclaimer = (dontShowAgain: boolean) => {
    if (dontShowAgain) {
      localStorage.setItem('tetofii_disclaimer_accepted', 'true');
    }
    setIsDisclaimerOpen(false);
  };

  const handleSelectFiiFromTable = (ticker: string) => {
    setSelectedFiiForCalc(ticker);
    navigateTo('calculator');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 border-b border-slate-800 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span className="truncate">
              TETOFII • Plataforma Independente de Precificação e Informações sobre FIIs de Tijolo
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 shrink-0 text-xs">
            <a
              href="https://www.tesourodireto.com.br/produtos/dados-sobre-titulos/rendimento-dos-titulos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium transition-colors"
            >
              <span>Tesouro IPCA+ (NTN-B)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              type="button"
              onClick={() => setIsDisclaimerOpen(true)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Termo de Isenção
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('calculator');
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl overflow-hidden shadow-xs group-hover:scale-105 transition-transform flex items-center justify-center bg-emerald-800">
              <img src="/favicon.svg" alt="TETOFII Ícone" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-slate-900 tracking-tight">
                  TETO<span className="text-emerald-700">FII</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Tijolo
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Preço Teto, P/VP e Margem de Segurança
              </p>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-2 text-xs sm:text-sm font-semibold">
            <a
              href={TAB_PATHS['calculator']}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('calculator');
              }}
              className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'calculator'
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CalcIcon className="w-4 h-4" />
              <span>Calculadora</span>
            </a>

            <a
              href={TAB_PATHS['my-radar']}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('my-radar');
              }}
              className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'my-radar'
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Meu Radar</span>
            </a>

            <a
              href={TAB_PATHS['radar']}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('radar');
              }}
              className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'radar'
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <TableIcon className="w-4 h-4" />
              <span>FIIs de Tijolo</span>
            </a>

            <a
              href={TAB_PATHS['reports']}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('reports');
              }}
              className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'reports'
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>FIIque Informado</span>
            </a>

            <a
              href={TAB_PATHS['download']}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('download');
              }}
              className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'download'
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Baixe o Aplicativo</span>
            </a>

            <a
              href={TAB_PATHS['guide']}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('guide');
              }}
              className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'guide'
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Guia de Precificação</span>
            </a>
          </nav>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Abrir menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 text-sm font-semibold">
            <a
              href={TAB_PATHS['calculator']}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('calculator');
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2 ${
                activeTab === 'calculator' ? 'bg-emerald-700 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <CalcIcon className="w-4 h-4" />
              <span>Calculadora de Preço Teto</span>
            </a>

            <a
              href={TAB_PATHS['my-radar']}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('my-radar');
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2 ${
                activeTab === 'my-radar' ? 'bg-emerald-700 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Meu Radar</span>
            </a>

            <a
              href={TAB_PATHS['radar']}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('radar');
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2 ${
                activeTab === 'radar' ? 'bg-emerald-700 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <TableIcon className="w-4 h-4" />
              <span>FIIs de Tijolo</span>
            </a>

            <a
              href={TAB_PATHS['reports']}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('reports');
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2 ${
                activeTab === 'reports' ? 'bg-emerald-700 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>FIIque Informado</span>
            </a>

            <a
              href={TAB_PATHS['download']}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('download');
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2 ${
                activeTab === 'download' ? 'bg-emerald-700 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Baixe o Aplicativo</span>
            </a>

            <a
              href={TAB_PATHS['guide']}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('guide');
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2 ${
                activeTab === 'guide' ? 'bg-emerald-700 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Guia de Precificação</span>
            </a>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-1 text-xs">
              <a
                href={TAB_PATHS['about']}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('about');
                }}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-900"
              >
                Sobre o TETOFII
              </a>
              <a
                href={TAB_PATHS['terms']}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('terms');
                }}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-900"
              >
                Termos de Uso e Isenção CVM
              </a>
              <a
                href={TAB_PATHS['privacy']}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('privacy');
                }}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-900"
              >
                Política de Privacidade e Cookies
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Letreiro B3 em Tempo Real (IFIX + Top 10 Cotistas + 5 Maiores Oscilações do Radar de Tijolo) */}
      <div className="mt-2.5 sm:mt-3 shadow-xs">
        <MarketTickerTape onSelectFii={handleSelectFiiFromTable} />
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6 w-full space-y-4 sm:space-y-6">
        {/* AdSense Slot #1: Header Top Leaderboard (Strategic Position 1) */}
        <AdBanner position="header_leaderboard" onOpenAdGuide={() => setIsAdGuideOpen(true)} />

        {/* Dynamic View Tab */}
        {activeTab === 'calculator' && (
          <Calculator
            onOpenExplanation={(topicId) => setExplanationTopicId(topicId)}
            onOpenAdGuide={() => setIsAdGuideOpen(true)}
            initialSelectedFii={selectedFiiForCalc}
          />
        )}

        {activeTab === 'my-radar' && (
          <MyRadarTab
            onOpenExplanation={(topicId) => setExplanationTopicId(topicId)}
            onGoToCalculator={(ticker) => {
              setSelectedFiiForCalc(ticker);
              navigateTo('calculator');
            }}
          />
        )}

        {activeTab === 'radar' && (
          <RadarFiiTable
            onSelectFii={handleSelectFiiFromTable}
            onOpenExplanation={(topicId) => setExplanationTopicId(topicId)}
          />
        )}

        {activeTab === 'reports' && (
          <FiiReportsSection
            initialReportId={selectedReportId}
            onSelectReportId={(id) => setSelectedReportId(id)}
            onGoToCalculatorWithTicker={(ticker) => {
              setSelectedFiiForCalc(ticker);
              navigateTo('calculator');
            }}
          />
        )}

        {activeTab === 'guide' && (
          <EducationalGuide
            onOpenTopic={(topicId) => setExplanationTopicId(topicId)}
            onGoToCalculator={() => navigateTo('calculator')}
          />
        )}

        {activeTab === 'download' && (
          <DownloadAppTab onOpenDisclaimer={() => setIsDisclaimerOpen(true)} />
        )}

        {activeTab === 'privacy' && (
          <PrivacyPolicyPage onBackToCalculator={() => navigateTo('calculator')} />
        )}

        {activeTab === 'terms' && (
          <TermsPage onBackToCalculator={() => navigateTo('calculator')} />
        )}

        {activeTab === 'about' && (
          <AboutPage
            onBackToCalculator={() => navigateTo('calculator')}
            onGoToGuide={() => navigateTo('guide')}
          />
        )}

        {/* AdSense Slot #4: Bottom Footer / In-Article Banner (Strategic Position 4) */}
        <AdBanner position="bottom_footer" onOpenAdGuide={() => setIsAdGuideOpen(true)} />
      </main>

      {/* Persistent Disclaimer & Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200 pt-10 pb-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Explicit User-Requested Disclaimer Box */}
          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-amber-950 text-xs sm:text-sm leading-relaxed">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-amber-950 mb-1">
                  Termo de Responsabilidade e Isenção Educativa:
                </strong>
                <p>
                  "Esta plataforma possui caráter exclusivamente educativo, informativo e de simulação matemática. Os cálculos dependem integralmente das premissas e dados inseridos pelo usuário. As análises, destaques de relatórios gerenciais e dados disponibilizados têm finalidade meramente informativa e não constituem relatório de análise, indicação de compra ou venda, nem recomendação de investimentos."
                </p>
              </div>
            </div>
          </div>

          {/* Links and Disclosures */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">TETOFII</span>
              <span>• Plataforma Independente de Precificação e Informações sobre FIIs de Tijolo</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-slate-600">
              <a
                href={TAB_PATHS['about']}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('about');
                }}
                className="hover:text-emerald-700 transition-colors cursor-pointer font-medium"
              >
                Sobre o TETOFII
              </a>
              <a
                href={TAB_PATHS['my-radar']}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('my-radar');
                }}
                className="hover:text-emerald-700 transition-colors cursor-pointer font-medium"
              >
                Meu Radar
              </a>
              <a
                href={TAB_PATHS['reports']}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('reports');
                }}
                className="hover:text-emerald-700 transition-colors cursor-pointer font-medium"
              >
                FIIque Informado
              </a>
              <a
                href={TAB_PATHS['guide']}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('guide');
                }}
                className="hover:text-emerald-700 transition-colors cursor-pointer font-medium"
              >
                Guia de Precificação (FAQ)
              </a>
              <a
                href="mailto:suporte@gvlab.com.br"
                className="hover:text-emerald-700 flex items-center gap-1.5 transition-colors font-medium text-slate-700 hover:underline"
                title="Fale conosco / Suporte"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                <span>Contato: suporte@gvlab.com.br</span>
              </a>
              <a
                href={TAB_PATHS['download']}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('download');
                }}
                className="text-emerald-700 hover:text-emerald-800 font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Baixe o Aplicativo</span>
              </a>
              <a
                href={TAB_PATHS['privacy']}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('privacy');
                }}
                className="hover:text-emerald-700 transition-colors cursor-pointer font-medium"
              >
                Política de Privacidade e Cookies
              </a>
              <a
                href={TAB_PATHS['terms']}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('terms');
                }}
                className="hover:text-emerald-700 transition-colors cursor-pointer font-medium"
              >
                Termos de Isenção CVM
              </a>
              <a
                href="https://www.tesourodireto.com.br/produtos/dados-sobre-titulos/rendimento-dos-titulos"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-700 flex items-center gap-1 transition-colors"
              >
                <span>Taxas Oficiais do Tesouro</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-400">
            © {new Date().getFullYear()} TETOFII • Desenvolvido por <strong className="text-slate-500 font-semibold">GVLab</strong> (Contato:{' '}
            <a href="mailto:suporte@gvlab.com.br" className="underline hover:text-slate-600">
              suporte@gvlab.com.br
            </a>
            ). Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
        onAccept={handleAcceptDisclaimer}
      />

      <ExplanationModal
        topicId={explanationTopicId}
        onClose={() => setExplanationTopicId(null)}
      />

      <AdsenseGuideModal
        isOpen={isAdGuideOpen}
        onClose={() => setIsAdGuideOpen(false)}
      />

      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      <AboutProjectModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onGoToGuide={() => {
          setActiveTab('guide');
          window.scrollTo({ top: 120, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
