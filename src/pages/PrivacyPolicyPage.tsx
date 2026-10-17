import React, { useEffect } from 'react';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft, CheckCircle2, Mail, ExternalLink } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onBackToCalculator: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onBackToCalculator }) => {
  useEffect(() => {
    document.title = 'Política de Privacidade e Cookies - TETOFII | Conformidade Google AdSense e LGPD';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Política de Privacidade e Termos de Cookies da plataforma TETOFII. Informações sobre tratamento de dados locais, cookies de publicidade Google AdSense (DART) e conformidade LGPD.'
      );
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumb / Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToCalculator}
          className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-700" />
          <span>Voltar para a Calculadora</span>
        </button>
        <span className="text-xs text-slate-400 font-mono">Última atualização: Outubro de 2026</span>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xs border border-slate-200 space-y-8 text-slate-700 text-sm leading-relaxed">
        {/* Header */}
        <div className="border-b border-slate-100 pb-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
              Transparência & Conformidade Regulatória
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Política de Privacidade e Gestão de Cookies
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Conformidade com as Diretrizes do Google AdSense, Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) e Padrões Globais da Web.
            </p>
          </div>
        </div>

        {/* Seção 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-700" />
            1. Caráter Educativo e Isenção de Responsabilidade de Investimentos
          </h2>
          <p>
            A plataforma <strong>TETOFII</strong> (operada pelo estúdio de engenharia quantitativa <strong>GVLab</strong>, disponível no domínio <code>gvlab.com.br</code>) é uma ferramenta estritamente educacional, matemática e informativa.
          </p>
          <p>
            Os cálculos de Preço Teto, Margem de Segurança e projeções de retorno utilizam modelos acadêmicos consolidados (como o Modelo de Desconto de Dividendos de Gordon e os critérios de valuation de Benjamin Graham e Luiz Barsi), alimentados pelas taxas soberanas do Tesouro Nacional (NTN-B) e dados públicos da CVM. Nenhuma simulação matemática gerada pela plataforma configura recomendação de compra, venda, consultoria financeira ou relatório de análise de valores mobiliários nos termos da Resolução CVM nº 20/2021. O usuário é única e exclusivamente responsável por suas decisões de alocação de patrimônio.
          </p>
        </section>

        {/* Seção 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-700" />
            2. Coleta de Dados e Processamento Local (Client-Side Privacy)
          </h2>
          <p>
            Priorizamos a privacidade por concepção (<em>Privacy by Design</em>). A arquitetura do TETOFII foi desenvolvida para operar com processamento no navegador do usuário (Client-Side):
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
            <li>
              <strong>Valores inseridos pelo usuário:</strong> Taxas de juros, prêmios de risco, projeções de dividendos e seleções de carteira inseridas na Calculadora ou no Meu Radar permanecem no navegador do usuário e, quando persistidas, utilizam o armazenamento local (<code>localStorage</code>) do seu próprio dispositivo.
            </li>
            <li>
              <strong>Não exigência de cadastro:</strong> Não exigimos criação de conta, login com senha, CPF ou dados bancários para o uso integral da plataforma web.
            </li>
          </ul>
        </section>

        {/* Seção 3 */}
        <section className="space-y-3 p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald-700" />
            3. Cookies de Publicidade, Fornecedores Terceiros e Google AdSense
          </h2>
          <p>
            Em total transparência e conformidade com as Políticas de Programa do Google AdSense:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>
              Fornecedores terceiros, incluindo a empresa Google Inc., utilizam cookies para veicular anúncios com base em visitas anteriores dos usuários a este site ou a outros sites na internet.
            </li>
            <li>
              Com o uso de cookies de publicidade (incluindo o cookie DART do Google), o Google e seus parceiros podem veicular anúncios para os usuários com base nas visitas feitas aos seus sites e/ou a outros sites na Internet.
            </li>
            <li>
              Os usuários podem optar por desativar o uso de publicidade personalizada acessando as{' '}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-800 font-bold underline inline-flex items-center gap-0.5"
              >
                <span>Configurações de Anúncios do Google</span>
                <ExternalLink className="w-3 h-3 inline" />
              </a>.
            </li>
            <li>
              Alternativamente, você pode desativar o uso de cookies de fornecedores terceiros para publicidade personalizada visitando o portal de autorregulação{' '}
              <a
                href="https://www.aboutads.info"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-800 font-bold underline inline-flex items-center gap-0.5"
              >
                <span>www.aboutads.info</span>
                <ExternalLink className="w-3 h-3 inline" />
              </a>.
            </li>
          </ul>
        </section>

        {/* Seção 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">
            4. Dados Regulatórios e Fontes Públicas (CVM e B3)
          </h2>
          <p>
            Os dados de Valor Patrimonial por cota (VPA/VP), códigos de negociação, denominações sociais e informes periódicos apresentados nas tabelas e radares são compilados a partir de fontes públicas oficiais da Comissão de Valores Mobiliários (Portal de Dados Abertos CVM - Resolução CVM 175) e da B3 (Brasil, Bolsa, Balcão). O portal realiza consultas periódicas automatizadas para manter a base sincronizada com os informes mensais oficiais mais recentes protocolados pelos administradores fiduciários.
          </p>
        </section>

        {/* Seção 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">
            5. Direitos do Titular de Dados e Encarregado (LGPD)
          </h2>
          <p>
            Nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem o direito de obter a qualquer momento a confirmação da existência de tratamento, o acesso aos seus dados e a eliminação de dados locais em seu navegador por meio da limpeza de cookies e cache.
          </p>
        </section>

        {/* Seção 6 */}
        <section className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-700" />
              Canal de Atendimento e Suporte ao Usuário
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Dúvidas sobre esta política ou questões editoriais podem ser direcionadas à equipe técnica do GVLab.
            </p>
          </div>
          <a
            href="mailto:suporte@gvlab.com.br"
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-mono text-xs font-bold hover:bg-slate-800 transition-colors text-center shrink-0"
          >
            suporte@gvlab.com.br
          </a>
        </section>
      </div>
    </div>
  );
};
