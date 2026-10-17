import React, { useEffect } from 'react';
import { FileText, AlertTriangle, ArrowLeft, Scale, CheckCircle2, Building, ShieldCheck } from 'lucide-react';

interface TermsPageProps {
  onBackToCalculator: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onBackToCalculator }) => {
  useEffect(() => {
    document.title = 'Termos de Uso e Isenção Regulatória - TETOFII | Resolução CVM 20/2021';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Termos de uso e avisos legais da plataforma TETOFII. Esclarecimentos sobre simulações matemáticas, ausência de recomendação de investimento e conformidade com a regulamentação da CVM.'
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
        <span className="text-xs text-slate-400 font-mono">Documento Regulatório GVLab</span>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xs border border-slate-200 space-y-8 text-slate-700 text-sm leading-relaxed">
        {/* Header */}
        <div className="border-b border-slate-100 pb-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Scale className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
              Avisos Legais & Diretrizes Operacionais
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Termos de Uso e Isenção de Responsabilidade
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Condições gerais de navegação e utilização das ferramentas matemáticas do portal TETOFII (gvlab.com.br).
            </p>
          </div>
        </div>

        {/* Destaque Regulatório */}
        <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/90 flex items-start gap-3.5 text-amber-950 text-xs sm:text-sm leading-relaxed">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <strong className="block font-bold text-amber-950">
              Declaração Regulatória de Ausência de Recomendação (Resolução CVM nº 20/2021)
            </strong>
            <p>
              "O TETOFII é uma aplicação estritamente educacional e computacional. Os resultados de Preço Teto, Margem de Segurança e projeções de taxa são gerados automaticamente a partir de fórmulas matemáticas clássicas e dos valores inseridos discricionariamente pelo próprio usuário. Nenhuma simulação, matéria ou dado contido neste site deve ser interpretado como oferta, solicitação de compra ou venda, nem recomendação de alocação em quaisquer ativos financeiros ou cotas de Fundos Imobiliários."
            </p>
          </div>
        </div>

        {/* 1. Objeto da Plataforma */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-700" />
            1. Objeto da Plataforma
          </h2>
          <p>
            O portal TETOFII disponibiliza ferramentas de cálculo e compilação de dados sobre Fundos de Investimento Imobiliário (FIIs) do segmento de Tijolo listados na B3. O objetivo primordial é fornecer ao investidor pessoa física recursos para compreender a mecânica de taxas de desconto, custo de oportunidade soberano (NTN-B / Tesouro IPCA+) e prêmios de risco imobiliário.
          </p>
        </section>

        {/* 2. Responsabilidade do Usuário */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            2. Responsabilidade pelas Premissas Inseridas
          </h2>
          <p>
            O investidor é o único responsável pela definição de suas premissas de investimento. Proventos futuros, taxas de inflação, reajustes contratuais e prêmios de risco variam de acordo com as condições macroeconômicas e operacionais de cada empreendimento físico. Rentabilidade passada não representa garantia de rentabilidade futura.
          </p>
        </section>

        {/* 3. Atualização e Integridade de Dados */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-700" />
            3. Fontes de Dados e Atualizações
          </h2>
          <p>
            As informações de cotações em tempo real e valores patrimoniais têm como fontes a B3 e o Portal de Dados Abertos da CVM. Embora o sistema execute rotinas de verificação periódica, não nos responsabilizamos por eventuais instabilidades temporárias nos servidores oficiais ou descompassos decorrentes de novas emissões de cotas não consolidadas no informe mensal estruturado.
          </p>
        </section>

        {/* 4. Propriedade Intelectual e Gratuidade */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            4. Gratuidade e Propriedade Intelectual
          </h2>
          <p>
            O acesso às calculadoras, radares e guias educativos do TETOFII é gratuito para pessoas físicas. As marcas, código-fonte, layout visual e textos originais são de propriedade do estúdio GVLab. É autorizada a citação do conteúdo para fins didáticos, desde que acompanhada de atribuição com link para <code>gvlab.com.br</code>.
          </p>
        </section>
      </div>
    </div>
  );
};
