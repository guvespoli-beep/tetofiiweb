import React, { useState, useEffect } from 'react';
import {
  Calculator as CalcIcon,
  Table as TableIcon,
  ExternalLink,
  Info,
  Menu,
  X,
  Building2,
  Mail,
  Smartphone
} from 'lucide-react';
import { Calculator } from './components/Calculator';
import { RadarFiiTable } from './components/RadarFiiTable';
import { DownloadAppTab } from './components/DownloadAppTab';
import { ExplanationModal } from './components/ExplanationModal';
import { DisclaimerModal } from './components/DisclaimerModal';
import { AdsenseGuideModal } from './components/AdsenseGuideModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { AdBanner } from './components/AdBanner';
import { MarketTickerTape } from './components/MarketTickerTape';

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'calculator' | 'radar' | 'download'>('calculator');
  const [selectedFiiForCalc, setSelectedFiiForCalc] = useState<string>('');

  // Modals state
  const [explanationTopicId, setExplanationTopicId] = useState<string | null>(null);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState<boolean>(false);
  const [isAdGuideOpen, setIsAdGuideOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Check initial disclaimer acceptance from localStorage and URL param for admin guide
  useEffect(() => {
    const hasAccepted = localStorage.getItem('tetofii_disclaimer_accepted');
    if (!hasAccepted) {
      setIsDisclaimerOpen(true);
    }

    // Acesso privado ao guia de AdSense via URL (?guia=adsense)
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('guia') === 'adsense' || params.get('admin') === 'adsense') {
        setIsAdGuideOpen(true);
      }
    } catch {
      // Ignora erro de parsing em ambientes restritos
    }
  }, []);

  const handleAcceptDisclaimer = (dontShowAgain: boolean) => {
    if (dontShowAgain) {
      localStorage.setItem('tetofii_disclaimer_accepted', 'true');
    }
    setIsDisclaimerOpen(false);
  };

  const handleSelectFiiFromTable = (ticker: string) => {
    setSelectedFiiForCalc(ticker);
    setActiveTab('calculator');
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 border-b border-slate-800 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span className="truncate">
              TETOFII • Calculadora Independente de Preço Teto para Fundos Imobiliários de Tijolo
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
          <div
            onClick={() => setActiveTab('calculator')}
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
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-2 text-xs sm:text-sm font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('calculator')}
              className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'calculator'
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CalcIcon className="w-4 h-4" />
              <span>Calculadora</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('radar')}
              className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'radar'
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <TableIcon className="w-4 h-4" />
              <span>Radar de FIIs de Tijolo</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('download')}
              className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'download'
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Baixe o Aplicativo</span>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                activeTab === 'download' ? 'bg-emerald-800 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}>
                Beta
              </span>
            </button>
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
            <button
              type="button"
              onClick={() => {
                setActiveTab('calculator');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2 ${
                activeTab === 'calculator' ? 'bg-emerald-700 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <CalcIcon className="w-4 h-4" />
              <span>Calculadora de Preço Teto</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('radar');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2 ${
                activeTab === 'radar' ? 'bg-emerald-700 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <TableIcon className="w-4 h-4" />
              <span>Radar de FIIs de Tijolo</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('download');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between ${
                activeTab === 'download' ? 'bg-emerald-700 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                <span>Baixe o Aplicativo</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Beta
              </span>
            </button>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsDisclaimerOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-slate-500 font-medium hover:text-slate-800"
              >
                Ver Disclaimer de Isenção Completo
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Letreiro B3 em Tempo Real (IFIX + Top 10 Cotistas + 5 Maiores Oscilações do Radar de Tijolo) */}
      <div className="mt-2.5 sm:mt-3 shadow-xs">
        <MarketTickerTape onSelectFii={handleSelectFiiFromTable} />
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
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

        {activeTab === 'radar' && (
          <RadarFiiTable
            onSelectFii={handleSelectFiiFromTable}
            onOpenExplanation={(topicId) => setExplanationTopicId(topicId)}
          />
        )}

        {activeTab === 'download' && (
          <DownloadAppTab onOpenDisclaimer={() => setIsDisclaimerOpen(true)} />
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
                  Termo de Responsabilidade & Isenção Educativa:
                </strong>
                <p>
                  "Esta ferramenta possui caráter exclusivamente educativo e de simulação matemática. Os cálculos dependem integralmente das premissas e dados inseridos pelo usuário. Não constitui relatório de análise, indicação de compra ou venda, nem recomendação de investimentos."
                </p>
              </div>
            </div>
          </div>

          {/* Links and Disclosures */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">TETOFII</span>
              <span>• Calculadora Independente de Preço Teto para FIIs de Tijolo</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-slate-600">
              <a
                href="mailto:suporte@gvlab.com.br"
                className="hover:text-emerald-700 flex items-center gap-1.5 transition-colors font-medium text-slate-700 hover:underline"
                title="Fale conosco / Suporte"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                <span>Contato: suporte@gvlab.com.br</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('download');
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                className="text-emerald-700 hover:text-emerald-800 font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Baixe o Aplicativo (Beta)</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPrivacyOpen(true)}
                className="hover:text-emerald-700 transition-colors cursor-pointer"
              >
                Política de Privacidade & Cookies
              </button>
              <button
                type="button"
                onClick={() => setIsDisclaimerOpen(true)}
                className="hover:text-emerald-700 transition-colors cursor-pointer"
              >
                Termos de Isenção
              </button>
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
    </div>
  );
}
