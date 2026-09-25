import { ExplanationTopic } from '../types';

export const EXPLANATION_TOPICS: Record<string, ExplanationTopic> = {
  'taxa-referencia': {
    id: 'taxa-referencia',
    title: 'Taxa de Referência (NTN-B / Tesouro IPCA+)',
    badge: 'Custo de Oportunidade',
    summary: 'A taxa de rentabilidade real (acima da inflação) oferecida pelos títulos públicos do Governo Federal, especialmente o Tesouro IPCA+ (NTN-B).',
    detailedContent: [
      'No mercado financeiro brasileiro, a taxa de referência é representada pelos títulos do Tesouro Nacional. Para investimentos imobiliários de longo prazo, utiliza-se a taxa real (juro acima do IPCA) dos títulos Tesouro IPCA+ com juros semestrais ou com vencimento entre 5 a 10 anos (NTN-B).',
      'Por que essa taxa é essencial? Porque geralmente as pessoas não querem correr os riscos do mercado imobiliário (vacância, inadimplência, reformas, oscilação de mercado) e das oscilações em bolsa para ganhar menos do que receberia nos títulos de renda fixa do Tesouro Direto.',
      'A taxa de referência estabelece o ponto de partida (custo de oportunidade base) sobre o qual adicionamos o prêmio de risco do imóvel.'
    ],
    example: {
      title: 'Exemplo prático no mercado atual',
      scenario: 'Se um título Tesouro IPCA+ 2035 está pagando IPCA + 7,00% ao ano, esse valor de 7,00% é o seu custo de oportunidade na taxa de referência.',
      result: 'Qualquer fundo imobiliário precisa render 7,00% + um prêmio de risco para justificar o investimento.'
    },
    externalLinks: [
      {
        label: 'Ver Taxas Negociadas Hoje no Tesouro Direto',
        url: 'https://www.tesourodireto.com.br/produtos/dados-sobre-titulos/rendimento-dos-titulos',
        description: 'Consulte em tempo real as taxas do Tesouro IPCA+ diretamente na página oficial do Tesouro Nacional.'
      }
    ]
  },

  'premio-risco': {
    id: 'premio-risco',
    title: 'Prêmio de Risco do Investidor',
    badge: 'Margem Adicional',
    summary: 'O percentual de retorno adicional que o investidor exige para aceitar as incertezas inerentes aos imóveis físicos em relação aos títulos públicos.',
    detailedContent: [
      'Investir em imóveis físicos através de FIIs de tijolo envolve riscos que não existem na dívida pública soberana:',
      '• Risco de Vacância Física e Financeira (imóveis desocupados gerando despesas de condomínio e IPTU em vez de renda);',
      '• Risco de Inadimplência e Renegociação de Contratos com locatários;',
      '• Despesas de Manutenção, Retrofit e CAPEX não recuperável;',
      '• Volatilidade das cotas negociadas no pregão da B3.',
      'Na prática do mercado brasileiro, analistas e investidores experientes costumam adotar um prêmio de risco entre 1,5% e 3,0% ao ano para fundos de tijolo com bons portfólios e gestão profissional.',
      'Quanto mais arriscado o segmento ou imóvel (por exemplo, prédios antigos ou monousuários), maior deve ser o prêmio de risco exigido.'
    ],
    formula: 'Yield Requerido = Taxa Livre de Risco + Prêmio de Risco',
    formulaDescription: 'Exemplo: Com NTN-B a 6,20% e prêmio de risco de 2,00%, seu Yield Requerido é de 8,20% ao ano.',
    example: {
      title: 'Prêmio por Perfil de Fundo de Tijolo',
      scenario: 'Galpões logísticos classe AAA locados para gigantes do comércio (1,5% a 2,0%) vs. Lajes corporativas com vacância elevada em regiões secundárias (3,0% a 4,5%).',
      result: 'Exigir um prêmio maior reduz o Preço Teto, garantindo que você só compre se houver um desconto que compense o risco adicional.'
    }
  },

  'provento-mensal': {
    id: 'provento-mensal',
    title: 'Provento Mensal Estimado (Rendimento Recorrente)',
    badge: 'Fluxo de Caixa',
    summary: 'A estimativa do dividendo líquido médio que a cota do fundo distribuirá nos próximos 12 meses.',
    detailedContent: [
      'Os fundos imobiliários são obrigados por lei (Lei 8.668/93) a distribuir no mínimo 95% do lucro semestral auferido no regime de caixa.',
      'Ao estimar o provento mensal, é fundamental distinguir a renda recorrente (aluguéis contratuais regulares) de receitas não-recorrentes (lucro extraordinário obtido na venda pontual de um imóvel).',
      'Para o cálculo do Preço Teto, utilize preferencialmente a média dos últimos 6 a 12 meses de proventos recorrentes, ou a projeção oficial (guidance) fornecida pelo gestor nos relatórios gerenciais.',
      'O valor inserido é multiplicado por 12 para representar a capacidade anualizada de geração de caixa por cota.'
    ],
    formula: 'Provento Anual = Provento Mensal Estimado × 12',
    formulaDescription: 'Exemplo: Um fundo distribuindo R$ 0,85/mês de forma recorrente tem um fluxo anual projetado de R$ 10,20 por cota.',
    example: {
      title: 'Atenção aos eventos não-recorrentes',
      scenario: 'Se um fundo pagou R$ 0,80 por 11 meses e no mês 12 pagou R$ 2,50 devido à venda de um imóvel, sua base de cálculo recorrente deve ser R$ 0,80, e não a média distorcida.',
      result: 'Usar o provento correto evita superestimar o Preço Teto do ativo.'
    }
  },

  'vp-cota': {
    id: 'vp-cota',
    title: 'Valor Patrimonial por Cota (VP) e Informes da CVM',
    badge: 'Patrimônio Contábil',
    summary: 'O patrimônio líquido do fundo (valor contábil dos imóveis menos as dívidas/obrigações) dividido pelo número total de cotas emitidas.',
    detailedContent: [
      'O Valor Patrimonial por Cota reflete o valor contábil dos ativos imobiliários do fundo apurado periodicamente e reportado à Comissão de Valores Mobiliários (CVM) no Informe Mensal Estruturado.',
      'No Brasil, a regulamentação da CVM exige que todos os imóveis físicos dos fundos imobiliários passem por um laudo de reavaliação anual a valor justo realizado por empresas independentes especializadas (como Colliers, Cushman & Wakefield, CBRE).',
      'Por que este campo é editável? Porque laudos de avaliação são feitos uma vez por ano e podem refletir premissas defasadas em relação ao ciclo econômico atual. Além disso, novas emissões de cotas ou aquisições recentes podem alterar o VP antes da publicação do novo informe.'
    ],
    formula: 'VP por Cota = (Ativo Total Imobiliário - Passivos/Dívidas) ÷ Total de Cotas',
    formulaDescription: 'Disponibilizado mensalmente no portal da CVM e nos relatórios de administração do fundo.',
    example: {
      title: 'Verificação da data do laudo CVM',
      scenario: 'Um fundo possui galpões avaliados contabilmente em R$ 1 bilhão e 10 milhões de cotas. Seu VP por cota é R$ 100,00.',
      result: 'Se o mercado precifica essa cota a R$ 95,00, ela negocia com 5% de desconto patrimonial.'
    }
  },

  'pvp': {
    id: 'pvp',
    title: 'P/VP (Preço de Mercado sobre Valor Patrimonial)',
    badge: 'Múltiplo de Avaliação',
    summary: 'Indicador que mede a relação entre a cotação atual negociada na Bolsa (B3) e o patrimônio líquido contábil do fundo.',
    detailedContent: [
      'O indicador P/VP indica quanto os investidores estão dispostos a pagar por cada real de patrimônio imobiliário do fundo:',
      '• P/VP menor que 1,00: O fundo está sendo negociado com DESCONTO patrimonial. O investidor está comprando os tijolos e terrenos por um valor menor do que o laudo de engenharia avaliou.',
      '• P/VP igual a 1,00: O fundo negocia na PARIDADE com o seu valor patrimonial.',
      '• P/VP maior que 1,00: O fundo negocia com ÁGIO (sobrepreço em relação ao valor contábil).',
      'Cuidados importantes em Fundos de Tijolo: Em FIIs de tijolo, um P/VP baixo nem sempre significa oportunidade! Imóveis com laudos desatualizados, vacâncias crônicas em praças difíceis ou custos de manutenção elevados podem justificar um desconto estrutural.'
    ],
    formula: 'P/VP = Preço Atual da Cota ÷ Valor Patrimonial por Cota (VP)',
    formulaDescription: 'Exemplo: Cota a R$ 90,00 com VP de R$ 100,00 resulta em P/VP de 0,90 (10% de desconto).',
    example: {
      title: 'Interpretação do P/VP',
      scenario: 'Se um FII de Shoppings possui VP de R$ 114,80 e está cotado a R$ 102,50, o cálculo é 102,50 / 114,80 = 0,89.',
      result: 'O fundo está sendo negociado com 11% de desconto em relação ao valor dos shoppings físicos.'
    }
  },

  'preco-teto': {
    id: 'preco-teto',
    title: 'Preço Teto para Fundos Imobiliários',
    badge: 'Preço Máximo de Compra',
    summary: 'O preço limite que você pode pagar pela cota para atingir exatamente a rentabilidade mínima desejada (Yield Requerido).',
    detailedContent: [
      'A metodologia do Preço Teto define o valor máximo que um investidor deve pagar por uma cota para garantir a rentabilidade desejada através do fluxo de proventos.',
      'O princípio é simples e poderoso: você nunca deve pagar por um ativo um valor que reduza seu fluxo de proventos abaixo da taxa mínima de retorno que você estabeleceu.',
      'Como funciona a fórmula: O Provento Anual projetado é dividido pela taxa de retorno exigida (Taxa de Referência NTN-B + Prêmio de Risco).',
      'Se o Preço Atual estiver ABAIXO do Preço Teto, você está comprando com Margem de Segurança. Se estiver ACIMA, o ativo está caro perante suas exigências de retorno.'
    ],
    formula: 'Preço Teto = (Provento Mensal × 12) ÷ (Taxa de Referência + Prêmio de Risco)',
    formulaDescription: 'Exemplo matemático: Provento anual de R$ 10,00 ÷ 8,25% (0,0825) = Preço Teto de R$ 121,21.',
    example: {
      title: 'Simulação prática do Preço Teto',
      scenario: 'FII paga R$ 0,88/mês (R$ 10,56/ano). Taxa NTN-B = 6,30% + Prêmio de Risco de 2,00% = Taxa de Desconto de 8,30% (0,083).',
      result: 'Preço Teto = 10,56 / 0,083 = R$ 127,23. Se a cota estiver a R$ 102,50, você tem uma margem de segurança de ~19,4%.'
    }
  },

  'relacao-preco-teto': {
    id: 'relacao-preco-teto',
    title: 'Preço Atual / Preço Teto e Margem de Segurança',
    badge: 'Múltiplo de Decisão',
    summary: 'Métrica exibida em formato decimal (como o P/VP) que compara a cotação de mercado ao Preço Teto calculado.',
    detailedContent: [
      'Assim como o indicador P/VP compara o preço de mercado ao valor contábil (VP), o múltiplo Preço Atual / Preço Teto compara a cotação diretamente com o limite máximo de compra estipulado pelo investidor:',
      '• Múltiplo menor que 1,00 (ex: 0,85): A cotação está ABAIXO do Preço Teto. A diferença para 1,00 é a sua MARGEM DE SEGURANÇA (neste exemplo, 15% de margem de proteção). Quanto menor que 1,00, maior a sua proteção contra imprevistos como vacâncias ou despesas.',
      '• Múltiplo igual a 1,00: O preço de mercado está exatamente na paridade com o teto. O ativo entregará exatamente o retorno exigido (yield requerido).',
      '• Múltiplo maior que 1,00 (ex: 1,12): A cotação está ACIMA do Preço Teto (neste exemplo, 12% acima). O investidor estaria pagando mais do que o limite aceitável para o retorno exigido frente ao Tesouro IPCA+.'
    ],
    formula: 'Preço Atual / Teto = Preço Atual da Cota ÷ Preço Teto | Margem de Segurança = ((Preço Teto - Preço Atual) ÷ Preço Teto) × 100%',
    formulaDescription: 'Múltiplo abaixo de 1,00 indica oportunidade com margem de segurança favorável ao cotista.',
    example: {
      title: 'Exemplo prático similar ao P/VP',
      scenario: 'Preço Teto calculado = R$ 120,00. Cotação de mercado na B3 = R$ 96,00.',
      result: 'Preço Atual / Teto = 0,80 (equivalente a 80% do teto, conferindo 20% de margem de segurança).'
    }
  }
};
