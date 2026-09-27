import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function createPdf() {
  const pdfDoc = await PDFDocument.create();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Cores
  const darkNavy = rgb(0.04, 0.12, 0.28);
  const brightBlue = rgb(0.1, 0.45, 0.85);
  const textDark = rgb(0.12, 0.16, 0.22);
  const textGray = rgb(0.35, 0.4, 0.48);
  const lightGrayBg = rgb(0.96, 0.97, 0.98);
  const white = rgb(1, 1, 1);

  // Helper para adicionar página com cabeçalho e rodapé
  const createPage = (title: string, pageNum: number, totalPages: number) => {
    const page = pdfDoc.addPage([595.28, 841.89]); // A4
    const { width, height } = page.getSize();

    // Faixa Superior
    page.drawRectangle({
      x: 0,
      y: height - 55,
      width: width,
      height: 55,
      color: darkNavy,
    });

    page.drawText('PATRIA REAL ESTATE', {
      x: 35,
      y: height - 35,
      size: 14,
      font: helveticaBold,
      color: white,
    });

    page.drawText('HGLG11 | Patria LOG FII', {
      x: width - 180,
      y: height - 35,
      size: 11,
      font: helvetica,
      color: rgb(0.8, 0.88, 1),
    });

    // Título da página
    page.drawText(title, {
      x: 35,
      y: height - 90,
      size: 16,
      font: helveticaBold,
      color: darkNavy,
    });

    page.drawLine({
      start: { x: 35, y: height - 100 },
      end: { x: width - 35, y: height - 100 },
      thickness: 1,
      color: rgb(0.85, 0.88, 0.92),
    });

    // Rodapé
    page.drawLine({
      start: { x: 35, y: 40 },
      end: { x: width - 35, y: 40 },
      thickness: 1,
      color: rgb(0.85, 0.88, 0.92),
    });

    page.drawText('Relatório Gerencial - Agosto de 2026', {
      x: 35,
      y: 25,
      size: 9,
      font: helvetica,
      color: textGray,
    });

    page.drawText(`Página ${pageNum} de ${totalPages}`, {
      x: width - 95,
      y: 25,
      size: 9,
      font: helvetica,
      color: textGray,
    });

    return page;
  };

  const totalPages = 4;

  // ===================== PÁGINA 1: CAPA E INFORMAÇÕES GERAIS =====================
  const page1 = pdfDoc.addPage([595.28, 841.89]);
  const p1Size = page1.getSize();

  // Capa com gradiente/fundo dark
  page1.drawRectangle({
    x: 0,
    y: 0,
    width: p1Size.width,
    height: p1Size.height,
    color: darkNavy,
  });

  page1.drawText('PATRIA', {
    x: 45,
    y: p1Size.height - 70,
    size: 26,
    font: helveticaBold,
    color: white,
  });

  page1.drawText('Real Estate', {
    x: 45,
    y: p1Size.height - 95,
    size: 14,
    font: helvetica,
    color: rgb(0.65, 0.8, 1),
  });

  page1.drawText('HGLG11', {
    x: 45,
    y: p1Size.height - 240,
    size: 52,
    font: helveticaBold,
    color: white,
  });

  page1.drawText('Patria LOG FII', {
    x: 48,
    y: p1Size.height - 275,
    size: 24,
    font: helvetica,
    color: rgb(0.75, 0.85, 1),
  });

  page1.drawText('Relatório Gerencial', {
    x: 48,
    y: p1Size.height - 320,
    size: 16,
    font: helveticaBold,
    color: rgb(0.35, 0.7, 1),
  });

  page1.drawText('Competência: Agosto de 2026', {
    x: 48,
    y: p1Size.height - 345,
    size: 13,
    font: helvetica,
    color: rgb(0.85, 0.9, 0.98),
  });

  // Caixa de Informações Básicas
  page1.drawRectangle({
    x: 45,
    y: 110,
    width: p1Size.width - 90,
    height: 250,
    color: rgb(0.08, 0.18, 0.38),
    borderWidth: 1,
    borderColor: rgb(0.18, 0.32, 0.58),
  });

  page1.drawText('Informações Gerais do Fundo', {
    x: 65,
    y: 330,
    size: 14,
    font: helveticaBold,
    color: white,
  });

  const infoGerais = [
    ['Início das Atividades', 'Março 2011'],
    ['Código de Negociação', 'HGLG11 (B3)'],
    ['CNPJ', '11.728.688/0001-47'],
    ['Gestor', 'Patria Investimentos Ltda.'],
    ['Administrador e Escriturador', 'Banco Genial S.A.'],
    ['Taxa de Administração Total', '0,6% ao ano sobre valor de mercado'],
    ['Público Alvo', 'Investidores em Geral'],
    ['Tipo Anbima', 'Tijolo Renda Gestão Ativa'],
    ['Cotas Emitidas', '45.601.713'],
  ];

  infoGerais.forEach(([label, val], idx) => {
    const yPos = 300 - idx * 20;
    page1.drawText(label, { x: 65, y: yPos, size: 10, font: helveticaBold, color: rgb(0.7, 0.82, 0.98) });
    page1.drawText(val, { x: 260, y: yPos, size: 10, font: helvetica, color: white });
  });

  page1.drawText('Página 1 de 4', {
    x: p1Size.width - 100,
    y: 35,
    size: 10,
    font: helvetica,
    color: rgb(0.5, 0.65, 0.85),
  });

  // ===================== PÁGINA 2: COMENTÁRIOS DA GESTÃO E DESTAQUES =====================
  const page2 = createPage('Comentários da Gestão e Indicadores do Mês', 2, totalPages);
  
  // Grid de Indicadores Principais
  const p2Grid = [
    ['Patrimônio Líquido', 'R$ 7,6 bilhões'],
    ['Cota Patrimonial', 'R$ 165,95'],
    ['Valor de Mercado', 'R$ 6,8 bilhões'],
    ['Cota de Mercado', 'R$ 148,34'],
    ['P/VP', '0,89x'],
    ['Quantidade de Imóveis', '41 imóveis'],
    ['Quantidade de Inquilinos', '188 locatários'],
    ['Vacância Física', '2,9%'],
    ['Vacância Financeira', '3,4%'],
    ['Alavancagem', '8,7% (10,2% c/ SPEs)'],
    ['Receita Total', 'R$ 1,28/cota'],
    ['Resultado Distribuível', 'R$ 1,02/cota'],
    ['Rendimento Distribuído', 'R$ 1,17/cota'],
    ['Reserva Acumulada', 'R$ 0,93/cota'],
  ];

  let curY = 715;
  for (let i = 0; i < p2Grid.length; i += 2) {
    const [l1, v1] = p2Grid[i];
    const [l2, v2] = p2Grid[i + 1] || ['', ''];

    // Caixa 1
    page2.drawRectangle({
      x: 35,
      y: curY - 30,
      width: 250,
      height: 38,
      color: lightGrayBg,
      borderWidth: 1,
      borderColor: rgb(0.9, 0.92, 0.94),
    });
    page2.drawText(l1, { x: 45, y: curY - 12, size: 9, font: helvetica, color: textGray });
    page2.drawText(v1, { x: 45, y: curY - 26, size: 12, font: helveticaBold, color: darkNavy });

    // Caixa 2
    if (l2) {
      page2.drawRectangle({
        x: 310,
        y: curY - 30,
        width: 250,
        height: 38,
        color: lightGrayBg,
        borderWidth: 1,
        borderColor: rgb(0.9, 0.92, 0.94),
      });
      page2.drawText(l2, { x: 320, y: curY - 12, size: 9, font: helvetica, color: textGray });
      page2.drawText(v2, { x: 320, y: curY - 26, size: 12, font: helveticaBold, color: darkNavy });
    }

    curY -= 46;
  }

  // Guidance Box
  curY -= 10;
  page2.drawRectangle({
    x: 35,
    y: curY - 45,
    width: 525,
    height: 45,
    color: rgb(0.93, 0.97, 0.95),
    borderWidth: 1,
    borderColor: rgb(0.7, 0.88, 0.78),
  });
  page2.drawText('Guidance de Rendimento para o 2º Semestre de 2026:', {
    x: 45,
    y: curY - 20,
    size: 10,
    font: helveticaBold,
    color: rgb(0.08, 0.4, 0.2),
  });
  page2.drawText('R$ 1,17/cota com base na reserva acumulada de R$ 0,93/cota e recebimentos contratuais previstos.', {
    x: 45,
    y: curY - 36,
    size: 10,
    font: helvetica,
    color: rgb(0.12, 0.35, 0.22),
  });

  // ===================== PÁGINA 3: PONTOS RELEVANTES E OBRAS =====================
  const page3 = createPage('Desenvolvimento, Obras e Carteira Imobiliária', 3, totalPages);

  let p3Y = 715;

  page3.drawText('Outros Pontos Relevantes Destacados no Mês:', {
    x: 35,
    y: p3Y,
    size: 13,
    font: helveticaBold,
    color: darkNavy,
  });

  p3Y -= 25;

  const destaques = [
    '• Itupeva G400: Principal projeto em desenvolvimento; 86,8% de avanço físico acumulado e conclusão prevista para novembro/2026. Contrato firmado com o Mercado Livre é de 10 anos (BTS), com YoC (Yield on Cost) estimado em 11,8%.',
    '• Simões Filho G200: Obra com 12,01% de avanço físico; cronograma deverá ser postergado devido às fortes chuvas no período.',
    '• Vacância Projetada: A saída prevista de Cargill/Hospcom e Boticário em janeiro/2027 deve elevar a vacância física de 2,9% para aproximadamente 3,6%.',
    '• 12ª Emissão de Cotas: Operação comunicada no dia 17/08 com montante total estimado em R$ 1,5 bilhão para alocação em novos ativos logísticos.',
    '• Performance de Mercado: A cota do HGLG11 valorizou +1,4% em agosto, superando amplamente o IFIX que recuou 1,5% no mesmo período.',
    '• Estrutura Contratual: 69% dos contratos do fundo são atípicos e 31% típicos; 88% do portfólio tem reajuste anual atrelado à inflação (IPCA).'
  ];

  destaques.forEach(d => {
    // Quebrar em linhas se necessário
    page3.drawRectangle({
      x: 35,
      y: p3Y - 45,
      width: 525,
      height: 48,
      color: lightGrayBg,
      borderWidth: 1,
      borderColor: rgb(0.9, 0.92, 0.94),
    });

    const lines = d.split(': ');
    const header = lines[0];
    const desc = lines.slice(1).join(': ');

    page3.drawText(header + ':', {
      x: 45,
      y: p3Y - 18,
      size: 10,
      font: helveticaBold,
      color: brightBlue,
    });

    page3.drawText(desc.length > 105 ? desc.substring(0, 105) + '...' : desc, {
      x: 45,
      y: p3Y - 34,
      size: 9,
      font: helvetica,
      color: textDark,
    });

    p3Y -= 58;
  });

  // Principais Inquilinos
  p3Y -= 15;
  page3.drawText('Principais Inquilinos (% da Receita Contratada):', {
    x: 35,
    y: p3Y,
    size: 12,
    font: helveticaBold,
    color: darkNavy,
  });

  p3Y -= 20;
  const inq = 'Mercado Livre (14%)  •  Shopee (7%)  •  Volkswagen (6%)  •  Electrolux (3%)  •  Decathlon (3%)  •  Cremer (2%)  •  Raia Drogasil (2%)';
  page3.drawText(inq, {
    x: 35,
    y: p3Y,
    size: 9.5,
    font: helvetica,
    color: textGray,
  });

  // ===================== PÁGINA 4: RESULTADO FINANCEIRO (DRE) E NOTAS =====================
  const page4 = createPage('Demonstração de Resultados (DRE) e Notas Oficiais', 4, totalPages);

  let p4Y = 715;

  page4.drawText('Demonstração do Resultado Contábil (Competência Agosto/2026):', {
    x: 35,
    y: p4Y,
    size: 12,
    font: helveticaBold,
    color: darkNavy,
  });

  p4Y -= 25;

  const dre = [
    ['Receita de Locação', 'R$ 55.421.036', 'R$ 1,22/cota'],
    ['Receitas Mobiliárias (CRIs/FIIs)', 'R$ 2.312.746', 'R$ 0,05/cota'],
    ['Receitas Extraordinárias', 'R$ 655.549', 'R$ 0,01/cota'],
    ['Receitas Totais', 'R$ 58.389.331', 'R$ 1,28/cota'],
    ['Despesas Imobiliárias e Vacância', '(R$ 496.713)', '(R$ 0,01/cota)'],
    ['Despesas Operacionais e Adm', '(R$ 6.359.924)', '(R$ 0,14/cota)'],
    ['Despesas Financeiras (Juros CRIs)', '(R$ 5.167.021)', '(R$ 0,11/cota)'],
    ['Despesas Totais', '(R$ 12.023.658)', '(R$ 0,26/cota)'],
    ['Resultado Distribuível', 'R$ 46.365.673', 'R$ 1,02/cota'],
    ['Rendimento Total Distribuído', 'R$ 53.354.042', 'R$ 1,17/cota'],
  ];

  dre.forEach(([item, valTotal, valCota], i) => {
    const isTotal = item.includes('Totais') || item.includes('Distribuído');
    page4.drawRectangle({
      x: 35,
      y: p4Y - 18,
      width: 525,
      height: 22,
      color: isTotal ? rgb(0.92, 0.95, 0.98) : (i % 2 === 0 ? lightGrayBg : white),
      borderWidth: 0.5,
      borderColor: rgb(0.88, 0.9, 0.93),
    });

    page4.drawText(item, {
      x: 45,
      y: p4Y - 12,
      size: 9.5,
      font: isTotal ? helveticaBold : helvetica,
      color: isTotal ? darkNavy : textDark,
    });

    page4.drawText(valTotal, {
      x: 320,
      y: p4Y - 12,
      size: 9.5,
      font: isTotal ? helveticaBold : helvetica,
      color: isTotal ? darkNavy : textDark,
    });

    page4.drawText(valCota, {
      x: 460,
      y: p4Y - 12,
      size: 9.5,
      font: isTotal ? helveticaBold : helvetica,
      color: isTotal ? brightBlue : textGray,
    });

    p4Y -= 24;
  });

  p4Y -= 30;
  // Disclaimer Oficial Patria / CVM
  page4.drawRectangle({
    x: 35,
    y: p4Y - 110,
    width: 525,
    height: 120,
    color: rgb(0.98, 0.98, 0.99),
    borderWidth: 1,
    borderColor: rgb(0.88, 0.9, 0.93),
  });

  page4.drawText('Informações Regulatórias e Fontes de Dados:', {
    x: 45,
    y: p4Y - 10,
    size: 9,
    font: helveticaBold,
    color: darkNavy,
  });

  const legalText = 
    'Este documento sintetiza o Relatório Gerencial emitido pela Patria Investimentos Ltda. para o Fundo ' +
    'de Investimento Imobiliário Patria LOG (HGLG11), competência Agosto de 2026. ' +
    'Os dados reportados foram obtidos a partir dos comunicados públicos enviados ao Sistema Fnet da B3 e CVM. ' +
    'Investimentos em fundos imobiliários não contam com garantia do Administrador, Gestor ou FGC. ' +
    'Rentabilidade passada não representa garantia de retorno futuro.';

  page4.drawText(legalText, {
    x: 45,
    y: p4Y - 30,
    size: 8,
    font: helvetica,
    color: textGray,
    lineHeight: 12,
    maxWidth: 500,
  });

  const pdfBytes = await pdfDoc.save();
  const outputPath = path.join(process.cwd(), 'public', 'HGLG11_Relatorio_Gerencial_Agosto_2026.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log('PDF gerado com sucesso em:', outputPath);
}

createPdf().catch(err => {
  console.error('Erro gerando PDF:', err);
  process.exit(1);
});
