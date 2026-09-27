import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Building2,
  ChevronDown,
  ChevronUp,
  Landmark,
  Calculator as CalcIcon,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface EducationalGuideProps {
  onOpenTopic?: (topicId: string) => void;
  onGoToCalculator?: () => void;
}

export const EducationalGuide: React.FC<EducationalGuideProps> = ({
  onOpenTopic,
  onGoToCalculator,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(prev => (prev === index ? null : index));
  };

  const faqs = [
    {
      q: 'O que diferencia um FII de Tijolo de um FII de Papel?',
      a: 'Os FIIs de Tijolo investem diretamente em imóveis físicos reais (galpões logísticos, edifícios corporativos, shopping centers, hospitais). Sua receita vem dos contratos de locação pagos pelos inquilinos, que costumam ser reajustados anualmente pela inflação (IPCA ou IGP-M). Já os FIIs de Papel investem em títulos de dívida imobiliária (como CRIs e LCIs), auferindo juros e amortizações financeiras.'
    },
    {
      q: 'Por que a NTN-B (Tesouro IPCA+) é utilizada como taxa de referência livre de risco?',
      a: 'Porque a NTN-B é o título soberano emitido pela Secretaria do Tesouro Nacional do Brasil que paga o índice de inflação (IPCA) acrescido de uma taxa de juros real. É considerado o ativo de menor risco de crédito da economia brasileira. Se o governo paga, por exemplo, IPCA + 6,5% a.a., nenhum investidor racional deveria aceitar correr o risco de ter imóveis físicos para receber um retorno real inferior a isso.'
    },
    {
      q: 'Qual é o prêmio de risco recomendado para cada segmento de tijolo?',
      a: 'O prêmio de risco reflete a incerteza operacional de cada imóvel. Em geral, o mercado adota: Logística Prime AAA: 1,5% a 2,0% a.a.; Shoppings Consolidados/Dominantes: 2,0% a 2,5% a.a.; Lajes Corporativas (Escritórios): 2,5% a 3,5% a.a. devido ao ciclo mais longo de vacância e custos de condomínio e IPTU durante a desocupação.'
    },
    {
      q: 'Por que comprar FII de tijolo com P/VP muito baixo (abaixo de 0,80) pode ser uma armadilha?',
      a: 'O Valor Patrimonial (VP) registrado na CVM é baseado em laudos de avaliação pericial feitos quase sempre uma vez por ano. Se os juros sobem ou a região onde o prédio está localizado sofreu deterioração urbana e vacância prolongada, o laudo pode estar superestimado em relação à capacidade real dos imóveis de gerar aluguel. Um desconto permanente muitas vezes sinaliza prédios obsoletos ou inquilinos inadimplentes.'
    },
    {
      q: 'Como expurgar rendimentos não recorrentes para calcular o Preço Teto com segurança?',
      a: 'O investidor deve analisar os relatórios gerenciais do fundo e identificar se o último dividendo incluiu venda de imóveis com ganho de capital extraordinário, multas rescisórias vultosas ou liberação de reserva de lucros. Para o cálculo do Preço Teto, utilize sempre a média dos aluguéis orgânicos e recorrentes que o fundo é capaz de manter de forma sustentável.'
    },
    {
      q: 'O que é a Margem de Segurança na prática de investimentos?',
      a: 'A Margem de Segurança é a diferença percentual entre o Preço Teto calculado e o Preço Atual de Mercado da cota na B3. Quando a cota está abaixo do teto, diz-se que há margem positiva. Ela serve como colchão de proteção contra imprevistos macroeconômicos, aumento temporário de vacância ou reformas inesperadas nas propriedades.'
    }
  ];

  return (
    <article className="space-y-8 text-slate-700">
      {/* Hero Header do Artigo */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xs border border-slate-200/90 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-emerald-100/50 to-transparent pointer-events-none rounded-bl-full" />
        
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800 tracking-wide uppercase">
              Guia Completo de Precificação
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 font-medium">Metodologia Fundamentalista</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 font-medium">Tempo de leitura: 10 min</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Como Calcular o Preço Teto de FIIs de Tijolo: Método NTN-B e Custo de Oportunidade
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Aprenda a fórmula matemática de precificação aplicada aos Fundos de Investimento Imobiliário de Tijolo listados na B3. Descubra como definir o custo de oportunidade soberano (NTN-B), estimar o prêmio de risco por segmento (galpões, shoppings e lajes corporativas) e evitar armadilhas contábeis de laudos CVM.
          </p>

          {onGoToCalculator && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onGoToCalculator}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
              >
                <CalcIcon className="w-4 h-4" />
                <span>Simular no TETOFII Agora</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid de Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Coluna de Texto Principal (8 colunas) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Seção 1 */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/90 space-y-4 leading-relaxed">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black">
                1
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                O Conceito Fundamental de Preço Teto em Ativos Geradores de Renda
              </h2>
            </div>

            <p>
              O conceito de <strong>Preço Teto</strong>, popularizado na literatura de dividendos por <strong>Décio Bazin</strong> e <strong>Luiz Barsi</strong>, bem como nas teorias clássicas de precificação de fluxo de caixa (como os modelos de Gordon e Graham), estabelece o limite máximo de preço a ser pago por um ativo financeiro para assegurar que a taxa de retorno em proventos atenda aos critérios mínimos de rentabilidade exigidos pelo investidor.
            </p>

            <p>
              Em Fundos de Investimento Imobiliário (FIIs) do segmento de <strong>Tijolo</strong> (ativos lastreados em prédios comerciais físicos, galpões logísticos e shopping centers), o investimento possui características híbridas: entrega um fluxo mensal contínuo de aluguéis isentos de imposto de renda para pessoas físicas e, ao mesmo tempo, preserva o patrimônio em tijolo de concreto reajustado historicamente pela inflação da construção civil e reposição de custo.
            </p>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                Fórmula Canônica do Preço Teto para Imóveis:
              </span>
              <div className="p-3 bg-white rounded-xl border border-slate-300 font-mono font-bold text-slate-900 text-center text-sm sm:text-base shadow-2xs">
                Preço Teto = (Provento Anual Projetado) ÷ (Taxa de Desconto Requerida)
              </div>
              <p className="text-xs text-slate-500 pt-1">
                Onde: <code className="text-emerald-700 font-semibold font-mono">Taxa de Desconto Requerida = Taxa de Referência Livre de Risco (NTN-B) + Prêmio de Risco do Imóvel</code>.
              </p>
            </div>
          </section>

          {/* Seção 2 */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/90 space-y-4 leading-relaxed">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black">
                2
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                A Taxa Livre de Risco no Brasil: O Tesouro IPCA+ (NTN-B)
              </h2>
            </div>

            <p>
              No mercado financeiro internacional de países desenvolvidos, adota-se com frequência o rendimento dos títulos públicos do Tesouro dos EUA (Treasuries de 10 anos) como referência soberana. No Brasil, o ativo de menor risco de crédito e garantidor de poder de compra real é a <strong>Nota do Tesouro Nacional - Série B (NTN-B)</strong>, negociada no Tesouro Direto com o nome de <strong>Tesouro IPCA+</strong>.
            </p>

            <p>
              Ao adquirir uma cota de FII na B3, o investidor está voluntariamente abrindo mão de emprestar dinheiro ao governo federal brasileiro sob remuneração de, hipoteticamente, <strong>IPCA + 7,40% ao ano</strong>. Portanto, o fluxo de aluguéis distribuído por um condomínio fechado de lajes ou galpões precisa <em>obrigatoriamente</em> superar com folga essa taxa soberana para justificar o risco de vacância, rescisões e obras de retrofit.
            </p>

            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs sm:text-sm space-y-1">
              <strong>Regra de Ouro da Precificação Soberana:</strong>
              <p>
                Quando a taxa da NTN-B sobe no mercado secundário (por exemplo, de 6,5% para 7,5% a.a.), a exigência de rentabilidade de todos os imóveis do país aumenta. Consequentemente, o Preço Teto cai, tornando compras no topo de preço perigosas para o investidor de longo prazo.
              </p>
            </div>
          </section>

          {/* Seção 3 */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/90 space-y-4 leading-relaxed">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black">
                3
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Como Calibrar o Prêmio de Risco por Segmento de Ativos
              </h2>
            </div>

            <p>
              O <strong>Prêmio de Risco (Risk Premium)</strong> é o spread percentual adicional exigido para compensar as incertezas inerentes à operação física dos imóveis. Nem todos os fundos de tijolo possuem o mesmo perfil operacional:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  Galpões Logísticos
                </span>
                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800">
                  Prêmio: 1,5% a 2,0% a.a.
                </span>
                <p className="text-xs text-slate-600">
                  Contratos atípicos de longo prazo (10 a 15 anos) com grandes redes de e-commerce e varejo; baixo custo de manutenção por metro quadrado.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  Shopping Centers
                </span>
                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-100 text-blue-800">
                  Prêmio: 2,0% a 2,5% a.a.
                </span>
                <p className="text-xs text-slate-600">
                  Receitas atreladas a aluguel percentual sobre vendas dos lojistas e faturamento de estacionamentos; proteção inflacionária dinâmica no consumo.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  Lajes Corporativas
                </span>
                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-100 text-amber-800">
                  Prêmio: 2,5% a 3,5% a.a.
                </span>
                <p className="text-xs text-slate-600">
                  Maior ciclicidade de absorção e desocupação em polos financeiros; custos pesados de condomínio e IPTU suportados pelo fundo em períodos de vacância.
                </p>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm leading-relaxed">
              <p>
                <strong>Importante:</strong> O investidor deve ajustar o prêmio de risco à sua própria percepção de risco de cada ativo através de uma avaliação qualitativa (qualidade construtiva dos imóveis, localização, histórico da gestão, solidez dos inquilinos e indexadores de contrato). Os percentuais acima são apenas exemplos e referências.
              </p>
            </div>
          </section>

          {/* Seção 4 */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/90 space-y-4 leading-relaxed">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black">
                4
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                P/VP Contábil vs. Geração de Caixa: O Perigo da "Armadilha de Valor"
              </h2>
            </div>

            <p>
              O indicador <strong>P/VP (Preço sobre Valor Patrimonial)</strong> é amplamente utilizado por analistas e investidores para checar se uma cota está com desconto ou ágio em relação ao patrimônio líquido reportado no informe mensal da CVM. Contudo, adotar o P/VP de forma isolada é uma das principais fontes de prejuízo para iniciantes:
            </p>

            <ul className="space-y-2.5 text-slate-600 text-sm list-disc pl-5">
              <li>
                <strong>Defasagem dos laudos periciais:</strong> A regulamentação da CVM exige que os imóveis dos fundos sejam reavaliados a valor justo anualmente. Se o laudo foi emitido em dezembro e a taxa de juros do país disparou 200 pontos-base nos seis meses seguintes, o valor patrimonial contábil continua o mesmo, mas o valor econômico de mercado dos edifícios já encolheu.
              </li>
              <li>
                <strong>Obsolescência técnica (CapEx reprimido):</strong> Um imóvel com 25 anos de uso pode ter um laudo contábil elevado baseado no custo de reposição do terreno e alvenaria, porém inquilinos modernos exigem certificações sustentáveis (LEED), pé-direito duplo e ar-condicionado central. Sem reformas caras, o fundo não consegue alugar pelo preço do laudo.
              </li>
              <li>
                <strong>Fundo Monoativo / Monoinquilino:</strong> O risco de vacância súbita de 100% de um edifício alugado a uma única empresa em crise pode anular completamente a distribuição de dividendos por anos, mesmo que o P/VP aparente um "desconto de 40%".
              </li>
            </ul>
          </section>

          {/* Seção 5: FAQ Completo */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/90 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                Tire suas Dúvidas Técnicas
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Perguntas Frequentes sobre Precificação de FIIs de Tijolo (FAQ)
              </h2>
            </div>

            <div className="divide-y divide-slate-100">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={faq.q} className="py-4">
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between text-left gap-4 font-bold text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer"
                    >
                      <span className="text-sm sm:text-base">{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-emerald-700 shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="mt-3 text-sm text-slate-600 leading-relaxed pr-4 animate-in fade-in duration-200">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Barra Lateral Editorial (4 colunas) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card Resumo da Metodologia */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/90 space-y-4">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Resumo Metodológico TETOFII</span>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              O TETOFII é uma ferramenta analítica matemática que cruza três pilares inegociáveis do investimento imobiliário:
            </p>

            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span><strong>Renda Recorrente:</strong> Aluguéis mensais projetados a valor presente.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span><strong>Taxa de Oportunidade:</strong> Comparação em tempo real com o Tesouro IPCA+.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span><strong>Laudos CVM:</strong> Confrontação do preço de cota com o VP pericial oficial.</span>
              </li>
            </ul>

            <div className="pt-2 border-t border-slate-100">
              <a
                href="https://www.tesourodireto.com.br/produtos/dados-sobre-titulos/rendimento-dos-titulos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center justify-between p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100/70 transition-colors"
              >
                <span>Consultar taxas no Tesouro Direto</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Card Sobre o Projeto e Transparência */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/90 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Sobre a Plataforma
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Compromisso com o Investidor Independente
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              O TETOFII foi desenvolvido pela <strong>GVLab</strong> como uma iniciativa independente de educação financeira e modelagem quantitativa. Não comercializamos cotas de fundos, não somos corretora e não recebemos comissões de gestoras ou administradores fiduciários.
            </p>
            <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
              Contato com a equipe editorial: <a href="mailto:suporte@gvlab.com.br" className="underline text-emerald-700 font-medium">suporte@gvlab.com.br</a>
            </div>
          </div>

          {/* Dica de Boas Práticas */}
          <div className="bg-amber-50/70 rounded-3xl p-6 border border-amber-200/80 space-y-2 text-amber-950 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <span>Aviso Regulatório Obrigatório</span>
            </div>
            <p className="leading-relaxed text-amber-900/90">
              Rentabilidade passada não representa garantia de retorno futuro. Fundos Imobiliários não contam com garantia do Fundo Garantidor de Créditos (FGC). Calcule sempre com cautela e diversifique seus investimentos.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};
