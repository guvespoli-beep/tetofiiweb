import React from 'react';
import {
  BookOpen,
  Award,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  Layers,
  HelpCircle,
  FileCheck
} from 'lucide-react';

interface EducationalGuideProps {
  onOpenTopic: (topicId: string) => void;
}

export const EducationalGuide: React.FC<EducationalGuideProps> = ({ onOpenTopic }) => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-8 text-slate-700 text-sm leading-relaxed">
      {/* Title */}
      <div className="border-b border-slate-100 pb-6">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            Guia de Valuation Imobiliário
          </span>
          <span className="text-xs text-slate-400">Leitura recomendada • 8 minutos</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
          Como Calcular o Preço Teto de FIIs de Tijolo: Método Bazin Adaptado e Custo de Oportunidade
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Aprenda a calibrar a taxa de desconto livre de risco (NTN-B), mensurar o prêmio de risco adequado para galpões, shoppings e lajes corporativas, e evitar as armadilhas do P/VP contábil.
        </p>
      </div>

      {/* Section 1: O que é o Preço Teto de Tijolo */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-700" />
          1. O que é o Preço Teto e por que Décio Bazin é adaptado aos FIIs?
        </h3>
        <p>
          O conceito de <strong>Preço Teto</strong> foi consagrado pelo jornalista financeiro Décio Bazin em sua célebre obra <em>Faça Fortuna com Ações</em>. A tese central de Bazin era inequívoca: um investidor que busca renda passiva recorrente não deve pagar por um ativo um valor superior àquele que garanta uma rentabilidade mínima pré-fixada através de dividendos.
        </p>
        <p>
          Originalmente desenvolvido para o mercado de ações com um Yield fixo de 6% ao ano, o método precisou ser <strong>adaptado para a realidade do mercado imobiliário brasileiro e dos Fundos Imobiliários (FIIs)</strong> por uma razão fundamental: a presença de títulos públicos soberanos com remuneração real extremamente atraente, os títulos do <strong>Tesouro IPCA+ (NTN-B)</strong>.
        </p>
        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 font-medium text-xs sm:text-sm">
          Fórmula Matemática Central:
          <div className="font-mono font-bold text-emerald-900 text-sm sm:text-base mt-1 p-2 bg-white rounded-lg border border-emerald-200/80">
            Preço Teto = (Provento Mensal Estimado × 12) ÷ (Taxa de Referência NTN-B + Prêmio de Risco)
          </div>
        </div>
      </section>

      {/* Section 2: A Taxa de Referência Livre de Risco (NTN-B) */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-700" />
          2. A Taxa de Referência (NTN-B): O Custo de Oportunidade Soberano
        </h3>
        <p>
          Ao alocar recursos em cotas de um fundo de investimento imobiliário de tijolo, você está renunciando a colocar seu dinheiro no título de dívida mais seguro do país: o Tesouro Nacional. O título <strong>Tesouro IPCA+ (antiga Nota do Tesouro Nacional - Série B, ou NTN-B)</strong> garante o poder de compra corrigido pela inflação oficial brasileira (IPCA) acrescido de uma taxa de juros real anual.
        </p>
        <p>
          Se o governo brasileiro está remunerando os investidores com <strong>IPCA + 6,30% ao ano</strong> com risco de crédito soberano, qualquer imóvel físico — por melhor que seja sua localização — <strong>precisa render acima desse patamar</strong> para remunerar o risco de desocupação e manutenção.
        </p>
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => onOpenTopic('taxa-referencia')}
            className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Saiba mais sobre a NTN-B e veja o link do Tesouro Direto</span>
          </button>
        </div>
      </section>

      {/* Section 3: O Prêmio de Risco do Imóvel Físico */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          3. Como Estimar o Prêmio de Risco Correto para Tijolo
        </h3>
        <p>
          O prêmio de risco é a margem adicional de rentabilidade exigida para cobrir as vicissitudes do mundo real:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li><strong>Vacância Física e Financeira:</strong> Espaços desocupados deixam de gerar aluguel e passam a onerar o fundo com IPTU e condomínio pagos pelo proprietário.</li>
          <li><strong>Inadimplência de Inquilinos:</strong> Risco de atrasos, recuperações judiciais e renegociações de aluguel para baixo em ciclos recessivos.</li>
          <li><strong>Despesas de Capital (CAPEX):</strong> Imóveis envelhecem. É necessário reformar fachadas, ar-condicionado, elevadores e pavimentação logística para manter a competitividade.</li>
        </ul>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-bold text-slate-800 block text-xs">Logística AAA (1,5% a 2,0%)</span>
            <span className="text-[11px] text-slate-500">Galpões de última milha com inquilinos multinacionais e contratos longos.</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-bold text-slate-800 block text-xs">Shoppings Dominantes (2,0% a 2,5%)</span>
            <span className="text-[11px] text-slate-500">Centros de compras consolidados com venda sobre faturamento das lojas.</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-bold text-slate-800 block text-xs">Lajes Corporativas (2,5% a 3,5%)</span>
            <span className="text-[11px] text-slate-500">Escritórios em praças competitivas com maior ciclo de absorção e desocupação.</span>
          </div>
        </div>
      </section>

      {/* Section 4: As Armadilhas do P/VP em Fundos de Tijolo */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          4. Cuidado com o P/VP: Por que o Laudo da CVM pode iludir?
        </h3>
        <p>
          Muitos investidores iniciantes compram cotas exclusivamente porque o indicador <strong>P/VP está abaixo de 1,00</strong>, acreditando estarem fazendo um excelente negócio. Em fundos de tijolo, contudo, é preciso ter cautela redobrada com essa métrica contábil:
        </p>
        <p>
          <strong>Periodicidade Anual:</strong> Os laudos de avaliação patrimonial das propriedades imobiliárias são emitidos pelas consultorias periciais geralmente apenas uma vez ao ano (em dezembro). Se as taxas de juros subirem abruptamente ao longo do ano, a taxa de desconto de mercado muda imediatamente, enquanto o laudo contábil do informe CVM permanece inalterado até a próxima rodada de avaliação.
        </p>
        <p>
          <strong>Qualidade dos Imóveis:</strong> Prédios velhos, com plantas ineficientes ou localizados em regiões decadentes podem negociar com 30% de desconto sobre o VP de forma permanente (o chamado <em>value trap</em> ou armadilha de valor). O laudo CVM reflete o custo de reposição, mas o mercado só paga pelo fluxo de caixa real que os inquilinos aceitam desembolsar.
        </p>
      </section>

      {/* Section 5: Metodologia e Boas Práticas */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-emerald-700" />
          5. Checklist para Utilizar a Calculadora com Rigor Técnico
        </h3>
        <ol className="list-decimal pl-5 space-y-2 text-slate-600">
          <li>
            <strong>Verifique os proventos dos últimos 12 meses:</strong> Certifique-se de expurgar receitas atípicas (como multas rescisórias vultosas ou ganho de capital na venda pontual de galpões).
          </li>
          <li>
            <strong>Ajuste o VP se houver nova emissão de cotas:</strong> Emissões recentes de cotas alteram o número total de cotas e o caixa do fundo antes do informe mensal ser consolidado na CVM.
          </li>
          <li>
            <strong>Exija Margem de Segurança:</strong> Não compre no limite exato do Preço Teto. Estabeleça uma margem de segurança de pelo menos 10% a 15% para suportar imprevistos da economia real.
          </li>
        </ol>
      </section>
    </div>
  );
};
