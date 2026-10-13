import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  Zap,
  BellRing,
  HeartHandshake,
  Lightbulb,
  BookmarkCheck,
  SlidersHorizontal,
  TrendingDown,
} from 'lucide-react';
import { RealAppScreenshotMockup } from './RealAppScreenshotMockup';

interface DownloadAppTabProps {
  onOpenDisclaimer?: () => void;
}

export const DownloadAppTab: React.FC<DownloadAppTabProps> = () => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [useScreenshotImage, setUseScreenshotImage] = useState(true);
  const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.tetofiitijolo.app';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(playStoreUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Hero Banner com Ícone Oficial & Mockup Real do Celular */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-10 border border-slate-700/60 shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 -mb-12 w-64 h-64 bg-teal-400/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-3.5">
              {/* Ícone Oficial do App - Tamanho exato do quadrado 100% preenchido */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-xl overflow-hidden shrink-0 border border-slate-700/80 bg-[#0c121e]">
                <img
                  src="./app-icon.png"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = './app-icon.jpg';
                  }}
                  alt="Ícone Oficial do Aplicativo TETO FII"
                  className="w-full h-full object-cover block"
                />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-semibold">
                  <Sparkles className="w-3 h-3 text-emerald-300" />
                  <span>Aplicativo Oficial • Google Play Store</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white mt-1">
                  Aplicativo <span className="text-emerald-400">TETO FII</span>
                </h1>
              </div>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              O aplicativo oficial <strong>TETO FII</strong> está disponível para smartphones Android. Instale agora para salvar sua própria carteira personalizada de ativos e monitorar Preço Teto, valor patrimonial e cotações da B3 com praticidade na palma da mão!
            </p>

            {/* Botão de Ação Direta para a Loja */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href={playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm sm:text-base shadow-lg hover:shadow-emerald-500/25 transition-all hover:scale-[1.02] cursor-pointer group"
              >
                <Download className="w-5 h-5 text-slate-950 group-hover:translate-y-0.5 transition-transform" />
                <span>Instalar pelo Google Play</span>
                <ExternalLink className="w-4 h-4 text-slate-900/80 ml-0.5" />
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                title="Copiar link da Play Store"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Link Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-400" />
                    <span>Copiar Link do App</span>
                  </>
                )}
              </button>
            </div>

            <div className="pt-1 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Gratuito</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Instalação Oficial Direta</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-teal-300" />
                <span>Disponível para Todos</span>
              </div>
            </div>
          </div>

          {/* Smartphone com a Tela REAL do Aplicativo (HGBS11 + FATN11) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-64 sm:w-72 bg-slate-950 rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-700/80 transition-transform hover:scale-[1.01] duration-300">
              {/* Entalhe / Speaker do Celular */}
              <div className="w-20 h-3.5 bg-slate-800 rounded-full mx-auto mb-2.5 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-slate-900 mr-2"></div>
                <div className="w-8 h-1 rounded-full bg-slate-900"></div>
              </div>

              {/* Tela Exata do Aplicativo em Execução */}
              <div className="rounded-2xl overflow-hidden shadow-inner border border-slate-800 bg-[#0a0f1d] max-h-[440px] overflow-y-auto scrollbar-none">
                {useScreenshotImage ? (
                  <img
                    src="./Screenshot_20260924_222402.jpg"
                    onError={() => setUseScreenshotImage(false)}
                    alt="Tela real do aplicativo móvel TETO FII com carteira personalizada e ativos cadastrados"
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <RealAppScreenshotMockup />
                )}
              </div>

              {/* Barra inferior do smartphone */}
              <div className="w-14 h-1 bg-slate-700 rounded-full mx-auto mt-2.5"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Card de Download Rápido e Direto na Play Store */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-1 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
              Download Oficial
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              Baixe agora direto na Google Play Store
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              O aplicativo está em produção oficial. Basta um toque para acessar a página na loja, clicar em <strong>"Instalar"</strong> e começar a usar imediatamente no seu smartphone Android, sem necessidade de inscrição em grupos ou convites.
            </p>
          </div>

          <div className="w-full md:w-auto shrink-0 flex flex-col items-center sm:items-end gap-2">
            <a
              href={playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-base rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer group"
            >
              <Download className="w-5 h-5 text-emerald-400 group-hover:translate-y-0.5 transition-transform" />
              <span>Acessar Google Play Store</span>
              <ExternalLink className="w-4 h-4 text-emerald-300 ml-0.5" />
            </a>
            <span className="text-[11px] text-slate-400">
              Identificador: <code className="font-mono text-slate-600 font-bold">com.tetofiitijolo.app</code>
            </span>
          </div>
        </div>

        {/* 3 Passos Simples para Começar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white font-black text-sm flex items-center justify-center">
              1
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Abra a Loja</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Toque no botão para abrir a página oficial do <strong>TETO FII</strong> na Google Play Store.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white font-black text-sm flex items-center justify-center">
              2
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Toque em Instalar</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instale o aplicativo gratuitamente com total segurança e verificação pelo Google Play Protect.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white font-black text-sm flex items-center justify-center">
              3
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Cadastre seus Ativos</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Monte sua carteira com seus FIIs favoritos e acompanhe seu Preço Teto e P/VP em tempo real.
            </p>
          </div>
        </div>
      </div>

      {/* Vantagens do App Móvel com DESTAQUE PRINCIPAL na CARTEIRA PERSONALIZADA */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Diferenciais da versão mobile
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            Por que usar o aplicativo no seu dia a dia?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Recursos projetados para agilizar suas análises e manter seu portfólio sempre sob controle.
          </p>
        </div>

        {/* Card Destaque Principal: Carteira Personalizada */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white border border-emerald-600/40 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/70">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                <BookmarkCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700/50">
                  Principal Vantagem
                </span>
                <h4 className="text-lg sm:text-xl font-bold text-white mt-1">
                  Carteira Personalizada e Monitoramento Contínuo
                </h4>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-mono bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700">
              Botão "+ Cadastrar Ativo"
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs sm:text-sm">
            <div className="space-y-1">
              <strong className="text-emerald-300 font-bold block flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                Premissas Individuais por Fundo
              </strong>
              <p className="text-slate-300 text-xs leading-relaxed">
                Cadastre cada FII da sua carteira e personalize seu próprio prêmio de risco exigido e provento mensal estimado para cada um deles.
              </p>
            </div>

            <div className="space-y-1">
              <strong className="text-emerald-300 font-bold block flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                Alerta Visual de Oportunidades
              </strong>
              <p className="text-slate-300 text-xs leading-relaxed">
                Veja na hora se a cota está <em>"Abaixo do Preço Teto"</em> e <em>"Abaixo do VP por Cota"</em>, com indicador de P/VP sempre atualizado.
              </p>
            </div>

            <div className="space-y-1">
              <strong className="text-emerald-300 font-bold block flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-400" />
                Tudo Salvo no seu Celular
              </strong>
              <p className="text-slate-300 text-xs leading-relaxed">
                Sua lista fica gravada no aparelho. Ao abrir o app, todas as suas cotações e cálculos de teto já estão prontos sem precisar redigitar!
              </p>
            </div>
          </div>
        </div>

        {/* Demais Vantagens em Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4 text-emerald-700" />
            </div>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Cálculo Instantâneo de Preço Teto</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Consulte qualquer FII de tijolo da B3 em poucos toques com cotações automáticas e margem de segurança calculada na hora.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Smartphone className="w-4 h-4 text-emerald-700" />
            </div>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Design Nativo Android</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Navegação adaptada para a tela do smartphone, com modo escuro elegante, carregamento ultra rápido e sem poluição visual.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <BellRing className="w-4 h-4 text-emerald-700" />
            </div>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Canal com o Desenvolvedor</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Participe da comunidade oficial: envie sugestões de novos filtros e melhorias diretamente para os criadores do app.
            </p>
          </div>
        </div>
      </div>

      {/* Dúvidas Frequentes Amigável */}
      <div className="bg-slate-50/80 rounded-2xl p-5 sm:p-6 border border-slate-200/80 space-y-3.5">
        <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-emerald-700" />
          <span>Perguntas frequentes</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/70 space-y-1">
            <strong className="block font-semibold text-slate-900">
              Preciso de convite ou cadastro prévio?
            </strong>
            <p className="text-slate-600 leading-relaxed">
              Não! O app está lançado em produção pública. Basta acessar a Play Store e clicar em Instalar diretamente.
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200/70 space-y-1">
            <strong className="block font-semibold text-slate-900">
              O aplicativo é gratuito?
            </strong>
            <p className="text-slate-600 leading-relaxed">
              Sim! O aplicativo é 100% gratuito e sem custos de assinatura ou taxas escondidas.
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200/70 space-y-1">
            <strong className="block font-semibold text-slate-900">
              Posso enviar ideias e sugestões?
            </strong>
            <p className="text-slate-600 leading-relaxed">
              Adoramos receber feedback! Você pode enviar sua avaliação diretamente na página do app na Play Store ou pelo suporte.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
