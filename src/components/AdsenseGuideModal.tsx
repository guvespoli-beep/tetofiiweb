import React from 'react';
import { X, CheckCircle, Globe, Shield, DollarSign, ExternalLink, AlertTriangle, Copy, Check } from 'lucide-react';

interface AdsenseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdsenseGuideModal: React.FC<AdsenseGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const adScriptCode = `<!-- Adicionar dentro da tag <head> do seu index.html -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-SEU_ID_AQUI"
     crossorigin="anonymous"></script>`;

  const adSlotCode = `<!-- Exemplo de Bloco de Anúncio Responsivo -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-SEU_ID_AQUI"
     data-ad-slot="1234567890"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <DollarSign className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                Guia Estratégico de Monetização: AdSense + Domínio Próprio
              </h3>
              <p className="text-xs text-emerald-200">
                Passo a passo para ser aprovado no Google AdSense com GitHub Pages
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm leading-relaxed">
          {/* Introduction Alert */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs sm:text-sm">
            <p className="font-semibold mb-1">
              🎯 Os 4 Pontos Estratégicos Escolhidos:
            </p>
            <p>
              Posicionamos 4 áreas de anúncio cuidadosamente pensadas para não violar a política de "Conteúdo de Baixo Valor" nem atrapalhar o cálculo do investidor:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-blue-800">
              <li><strong>1. Header Leaderboard (728x90):</strong> Visibilidade imediata acima do conteúdo principal.</li>
              <li><strong>2. Retângulo Lateral (300x250):</strong> Ao lado dos inputs da calculadora — formato com maior receita e CTR do AdSense.</li>
              <li><strong>3. Banner Pós-Resultado:</strong> Exibido logo após a margem de segurança, aproveitando o momento em que o investidor conclui a análise.</li>
              <li><strong>4. Banner In-Article / Rodapé:</strong> Entre a calculadora e o conteúdo educativo e glossário.</li>
            </ul>
          </div>

          {/* Checklist for Approval */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-600" />
              Critérios Obrigatórios para Aprovação no Google AdSense
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-800">Domínio de Nível Superior (TLD)</strong>
                  <span>O AdSense geralmente recusa subdomínios como .github.io. Seu plano de apontar um domínio próprio (ex: .com.br ou .com) é o caminho correto!</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-800">Conteúdo Rico e Educativo</strong>
                  <span>Calculadoras de página única vazias são negadas por "Valuable Inventory". Incluímos o Radar de FIIs, Guia de Bazin e Histórico de Tickers para resolver isso.</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-800">Política de Privacidade & Cookies DART</strong>
                  <span>O Google exige menção expressa sobre os cookies de publicidade DART. Já criamos a página de Política pronta para você.</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-800">Navegação e Usabilidade Limpa</strong>
                  <span>Nenhum anúncio colado em botões de ação para evitar cliques acidentais (cliques inválidos).</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step-by-Step Implementation */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-teal-600" />
              Como Publicar no GitHub Pages com Domínio Próprio
            </h4>

            <ol className="list-decimal pl-5 text-xs text-slate-600 space-y-2">
              <li>
                <strong>Suba o código no repositório GitHub:</strong> Habilite o GitHub Pages nas configurações (Settings &gt; Pages &gt; Branch: gh-pages ou GitHub Actions).
              </li>
              <li>
                <strong>Configure o Domínio Customizado no GitHub:</strong> Em <em>Custom domain</em>, digite seu domínio (ex: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">seusite.com.br</code>) e ative <em>Enforce HTTPS</em>.
              </li>
              <li>
                <strong>No seu registrador de domínio (ex: Registro.br / GoDaddy):</strong> Aponte as entradas DNS:
                <div className="mt-1 bg-slate-900 text-slate-100 p-2.5 rounded font-mono text-[11px] space-y-0.5">
                  <p>CNAME: www -&gt; seousuario.github.io</p>
                  <p>A (Apex): 185.199.108.153 | 185.199.109.153</p>
                </div>
              </li>
              <li>
                <strong>Cadastre seu domínio no Google AdSense:</strong> Aguarde a análise da equipe do Google (geralmente entre 2 a 14 dias).
              </li>
            </ol>
          </div>

          {/* Code Snippets */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400">
              Códigos para Inserir na Sua Aplicação
            </h4>

            <div>
              <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                <span>1. Script Principal do AdSense (no &lt;head&gt; de index.html):</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(adScriptCode, 1)}
                  className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
                >
                  {copiedIndex === 1 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIndex === 1 ? 'Copiado!' : 'Copiar Código'}</span>
                </button>
              </div>
              <pre className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-xs overflow-x-auto">
                {adScriptCode}
              </pre>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                <span>2. Código de Cada Bloco de Anúncio (no lugar do AdBanner):</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(adSlotCode, 2)}
                  className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
                >
                  {copiedIndex === 2 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIndex === 2 ? 'Copiado!' : 'Copiar Código'}</span>
                </button>
              </div>
              <pre className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-xs overflow-x-auto">
                {adSlotCode}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <a
            href="https://adsense.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
          >
            Acessar Painel do Google AdSense
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
          >
            Fechar Guia
          </button>
        </div>
      </div>
    </div>
  );
};
