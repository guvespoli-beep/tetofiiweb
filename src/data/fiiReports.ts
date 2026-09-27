import { FiiReportHighlight } from '../types/reports';

export const FII_REPORTS_DATA: FiiReportHighlight[] = [
  {
    id: 'art-1001',
    ticker: 'HGLG11',
    fundName: 'Patria LOG FII (CSHG Logística)',
    segment: 'Logística',
    reportMonth: 'Agosto de 2026',
    publishedAt: '2026-09-26',
    publishedAtFormatted: '26/09/2026',
    title: 'HGLG11 - Destaques do Relatório Gerencial de Agosto de 2026',
    summaryBadge: 'Logística AAA • P/VP 0,89x',
    // Link direto para o documento oficial na B3 / CVM (Sistema Fnet)
    pdfUrl: 'https://fnet.bmfbovespa.com.br/fnet/publico/exibirDocumento?id=1327262&cvm=true',
    pdfFilename: 'HGLG11_Relatorio_Gerencial_Agosto_2026.pdf',

    gestor: 'Patria Investimentos Ltda.',
    administrador: 'Banco Genial S.A.',
    taxaAdmTotal: '0,6% ao ano sobre o valor de mercado do fundo.',
    guidance: 'R$ 1,17/cota no 2º semestre de 2026',

    indicadores: [
      { label: 'Patrimônio Líquido', value: 'R$ 7,6 bilhões' },
      { label: 'Cota Patrimonial', value: 'R$ 165,95' },
      { label: 'Valor de Mercado', value: 'R$ 6,8 bilhões' },
      { label: 'Cota de Mercado', value: 'R$ 148,34' },
      { label: 'P/VP', value: '0,89x', highlight: true },
      { label: 'Quantidade de Imóveis', value: '41' },
      { label: 'Quantidade de Inquilinos', value: '188' },
      { label: 'Vacância Física', value: '2,9%' },
      { label: 'Vacância Financeira', value: '3,4%' },
      { label: 'Alavancagem Financeira', value: '8,7%', sublabel: '10,2% incluindo dívida das SPEs' },
      { label: 'Receita Total', value: 'R$ 1,28' },
      { label: 'Resultado Distribuível', value: 'R$ 1,02' },
      { label: 'Rendimento Distribuído', value: 'R$ 1,17', highlight: true },
      { label: 'Reserva Acumulada', value: 'R$ 0,93' },
    ],

    principaisInquilinos: [
      'Mercado Livre (14%)',
      'Shopee (7%)',
      'Volkswagen (6%)',
      'Electrolux (3%)',
      'Decathlon (3%)',
      'Cremer (2%)',
      'Raia Drogasil (2%)',
    ],

    outrosPontosRelevantes: [
      'Itupeva G400: principal projeto em desenvolvimento; 86,8% de avanço físico e conclusão prevista para novembro/2026. O contrato com o Mercado Livre é de 10 anos (BTS), com YoC (Yield on Cost) estimado em 11,8%.',
      'Simões Filho G200: obra com 12,01% de avanço físico; cronograma deverá ser postergado devido às fortes chuvas no período.',
      'Vacância: a saída prevista de Cargill/Hospcom e Boticário em janeiro/2027 deve elevar a vacância física de 2,9% para aproximadamente 3,6%.',
      '12ª emissão: operação anunciada em agosto, com volume de aproximadamente R$ 1,5 bilhão para novas aquisições de ativos logísticos.',
      'Mercado: o HGLG11 apresentou +1,4% em agosto, superando o IFIX que caiu 1,5% no mês.',
      'Estrutura contratual: 69% dos contratos são atípicos e 31% típicos; 88% dos contratos têm correção monetária anual pelo IPCA.',
    ],

    observacaoTetoFii: 'Para fins de cálculo do Preço Teto no TETOFII: A gestão reforçou o guidance de distribuição de R$ 1,17/cota para o 2S26, amparado por uma robusta reserva acumulada de lucros de R$ 0,93/cota e entrega iminente do galpão BTS Mercado Livre (YoC 11,8%). Ao mesmo tempo, 88% da receita é indexada ao IPCA, garantindo reposição inflacionária aderente ao custo de oportunidade da NTN-B.',
  },
];
