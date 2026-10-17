import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const publicDir = path.resolve(rootDir, 'public');

// Verifica se dist/index.html existe
const distIndexHtmlPath = path.resolve(distDir, 'index.html');
if (!fs.existsSync(distIndexHtmlPath)) {
  console.error('[Generate Static Pages] Erro: dist/index.html não foi encontrado. Execute vite build primeiro.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(distIndexHtmlPath, 'utf-8');

// Extrai as tags de script e css geradas pelo Vite
const scriptMatches = baseHtml.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);
const cssMatches = baseHtml.match(/<link rel="stylesheet" crossorigin href="([^"]+)">/);

const scriptSrc = scriptMatches ? scriptMatches[1] : '/assets/index.js';
const cssHref = cssMatches ? cssMatches[1] : '/assets/index.css';

// Garante caminhos absolutos para permitir navegação em subpastas
const cleanScriptSrc = scriptSrc.startsWith('./') ? scriptSrc.slice(1) : (scriptSrc.startsWith('/') ? scriptSrc : `/${scriptSrc}`);
const cleanCssHref = cssHref.startsWith('./') ? cssHref.slice(1) : (cssHref.startsWith('/') ? cssHref : `/${cssHref}`);

console.log(`[Generate Static Pages] Assets identificados: Script: ${cleanScriptSrc} | CSS: ${cleanCssHref}`);

const pages = [
  {
    slug: 'calculadora',
    aliases: ['index'],
    tabKey: 'calculator',
    title: 'Calculadora de Preço Teto de FIIs de Tijolo - TETOFII | Método NTN-B',
    description: 'Calcule o Preço Teto de Fundos Imobiliários de Tijolo com base nos rendimentos recorrentes e na taxa de desconto do Tesouro IPCA+ (NTN-B). Simule margem de segurança e P/VP.',
    keywords: 'calculadora preco teto fii, preco teto fii tijolo, formula graham fii, tesouro ipca ntn-b, margem de seguranca fii, valuation fundos imobiliarios',
    canonicalUrl: 'https://gvlab.com.br/calculadora',
    schemaType: 'WebApplication',
    schemaData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Calculadora de Preço Teto de FIIs TETOFII',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'All',
      url: 'https://gvlab.com.br/calculadora',
      description: 'Ferramenta quantitativa de precificação e valuation de Fundos de Investimento Imobiliário (FIIs) de Tijolo baseada no custo de oportunidade da NTN-B (Tesouro IPCA+) e prêmio de risco setorial.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'BRL',
      },
    },
    breadcrumbs: [
      { name: 'Início', url: 'https://gvlab.com.br/' },
      { name: 'Calculadora de Preço Teto', url: 'https://gvlab.com.br/calculadora' },
    ],
    h1: 'Calculadora de Preço Teto e Valuation para FIIs de Tijolo',
    subtitle: 'Encontre o valor justo máximo a pagar por cotas de Fundos Imobiliários de Tijolo com base na taxa soberana do Tesouro IPCA+ e no rendimento recorrente.',
    richContentHtml: `
      <section class="mb-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        <h2 class="text-xl sm:text-2xl font-bold text-slate-900 mb-4">Como Funciona o Cálculo do Preço Teto com NTN-B</h2>
        <p class="text-slate-600 mb-4 leading-relaxed">
          O Preço Teto representa o valor máximo por cota que um investidor fundamentalista aceita pagar por um Fundo Imobiliário de Tijolo para obter uma taxa de retorno real condizente com o risco do ativo. Diferente de fórmulas genéricas do mercado de ações, os FIIs de Tijolo possuem contratos reais de locação atrelados à inflação (IPCA ou IGP-M), equiparando-se conceitualmente a títulos híbridos de renda imobiliária.
        </p>
        <div class="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded-r-xl my-4 text-emerald-950">
          <p class="font-bold mb-1">A Fórmula Fundamentalista do Preço Teto:</p>
          <p class="font-mono text-sm bg-white p-3 rounded border border-emerald-200 inline-block text-emerald-900">
            Preço Teto = Rendimento Anual Recorrente ÷ Taxa de Desconto Exigida (NTN-B + Prêmio de Risco)
          </p>
        </div>
        <p class="text-slate-600 leading-relaxed">
          A Taxa de Desconto é composta pela rentabilidade do título soberano <strong>Tesouro IPCA+ de longo prazo (NTN-B Principal)</strong> acrescida de um <strong>prêmio de risco de crédito e liquidez</strong> (geralmente entre 1,5% e 3,0% a.a., dependendo da qualidade dos galpões, shoppings ou escritórios do fundo).
        </p>
      </section>

      <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 class="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-black">1</span>
            Rendimento Recorrente
          </h3>
          <p class="text-sm text-slate-600 leading-relaxed">
            Considere apenas o dividendo mensal ordinário proveniente de aluguéis contratados, expurgando ganhos de capital extraordinários ou venda esporádica de imóveis para não distorcer o teto.
          </p>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 class="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-black">2</span>
            Taxa Livre de Risco
          </h3>
          <p class="text-sm text-slate-600 leading-relaxed">
            Utilize a cotação oficial do Tesouro IPCA+ do dia (NTN-B). Se o governo paga IPCA + 6,5% a.a., o FII precisa entregar um retorno superior para compensar a vacância e risco de inadimplência.
          </p>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 class="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-black">3</span>
            Margem de Segurança
          </h3>
          <p class="text-sm text-slate-600 leading-relaxed">
            A margem é a diferença percentual entre o Preço Teto calculado e o Preço Atual de mercado na B3. Margem positiva indica cota negociada com desconto frente ao fluxo de rendimentos projetado.
          </p>
        </div>
      </section>

      <section class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs mb-8">
        <h2 class="text-xl sm:text-2xl font-bold text-slate-900 mb-4">Perguntas Frequentes sobre Precificação de FIIs</h2>
        <div class="space-y-4">
          <div class="border-b border-slate-100 pb-4">
            <h3 class="font-bold text-slate-800 mb-1">Qual a diferença entre Preço Teto e Valor Patrimonial (VP)?</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              O Valor Patrimonial (VP) é um dado contábil divulgado no informe mensal da CVM, calculado por laudos anuais de avaliação dos imóveis. Já o Preço Teto é uma métrica dinâmica baseada no fluxo de caixa real distribuído ao cotista e no custo de oportunidade atual dos juros no Brasil.
            </p>
          </div>
          <div class="border-b border-slate-100 pb-4">
            <h3 class="font-bold text-slate-800 mb-1">Posso usar a fórmula de Graham tradicional em FIIs?</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              A fórmula clássica de Graham [√(22,5 × LPA × VPA)] foi concebida para empresas industriais da bolsa de valores. Em FIIs, que distribuem obrigatoriamente 95% do lucro sem retenção para reinvestimento, a adaptação mais rigorosa e aceita pelos analistas é a relação com a curva de juros reais da NTN-B e o modelo de dividendos descontados de Gordon.
            </p>
          </div>
        </div>
      </section>
    `,
  },
  {
    slug: 'meu-radar',
    aliases: [],
    tabKey: 'my-radar',
    title: 'Meu Radar Personalizado de FIIs de Tijolo - TETOFII',
    description: 'Personalize seu painel de Fundos Imobiliários de Tijolo: defina taxas de retorno exigidas por segmento, veja o Preço Teto dinâmico, margem de segurança e P/VP em tempo real.',
    keywords: 'meu radar fii, carteira de fiis, monitoramento fii tijolo, radar de fundos imobiliarios, margem de seguranca carteira fii',
    canonicalUrl: 'https://gvlab.com.br/meu-radar',
    schemaType: 'WebApplication',
    schemaData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Meu Radar Personalizado TETOFII',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'All',
      url: 'https://gvlab.com.br/meu-radar',
      description: 'Painel interativo para monitoramento customizado de FIIs de Tijolo, com filtros de segmento, cotações em tempo real da B3 e cálculo automático de Preço Teto.',
    },
    breadcrumbs: [
      { name: 'Início', url: 'https://gvlab.com.br/' },
      { name: 'Meu Radar', url: 'https://gvlab.com.br/meu-radar' },
    ],
    h1: 'Meu Radar Personalizado de Fundos Imobiliários de Tijolo',
    subtitle: 'Acompanhe seus fundos favoritos, personalize as taxas de desconto por segmento imobiliário e identifique oportunidades com margem de segurança atrativa.',
    richContentHtml: `
      <section class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs mb-8">
        <h2 class="text-xl sm:text-2xl font-bold text-slate-900 mb-4">Gestão Estratégica do seu Radar de FIIs</h2>
        <p class="text-slate-600 mb-4 leading-relaxed">
          O <strong>Meu Radar</strong> foi desenvolvido para permitir que cada investidor configure suas premissas de retorno exigido. Nenhum investidor possui o mesmo perfil de risco: enquanto fundos de galpões logísticos com contratos atípicos de 10 anos exigem um prêmio de risco menor, lajes corporativas no centro expandido podem demandar prêmios maiores para cobrir ciclos de vacância.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h3 class="font-bold text-slate-900 mb-1">Filtros por Segmento de Atuação</h3>
            <p class="text-sm text-slate-600">Filtre rapidamente por Galpões Logísticos, Lajes Corporativas (Escritórios), Shoppings Centers, Renda Urbana ou Híbridos.</p>
          </div>
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h3 class="font-bold text-slate-900 mb-1">Margem de Segurança em Cores</h3>
            <p class="text-sm text-slate-600">Identifique visualmente fundos abaixo do Preço Teto (margem positiva em verde) e cotas sobrevalorizadas (margem negativa em vermelho).</p>
          </div>
        </div>
      </section>
    `,
  },
  {
    slug: 'fiis-de-tijolo',
    aliases: ['radar'],
    tabKey: 'radar',
    title: 'Radar de FIIs de Tijolo - TETOFII | Cotações B3, P/VP, Vacância e VPA CVM',
    description: 'Tabela completa com os principais FIIs de Tijolo listados na B3: cotações em tempo real, VPA oficial da CVM (Resolução 175), P/VP, vacância física e dividend yield anualizado.',
    keywords: 'fiis de tijolo b3, tabela fii tijolo, cotacao fii, pvp fiis tijolo, vacancia fii, vpa cvm fundos imobiliarios, hglg11, knri11, xpml11',
    canonicalUrl: 'https://gvlab.com.br/fiis-de-tijolo',
    schemaType: 'Dataset',
    schemaData: {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: 'Indicadores e Cotações dos Principais FIIs de Tijolo da B3',
      description: 'Base de dados pública e consolidada com indicadores patrimoniais da CVM (Resolução 175), cotações do pregão da B3, dividend yields e taxas de vacância dos FIIs de Tijolo.',
      url: 'https://gvlab.com.br/fiis-de-tijolo',
      keywords: ['FIIs de Tijolo', 'B3', 'CVM', 'P/VP', 'Dividend Yield', 'Vacância Física'],
      creator: {
        '@type': 'Organization',
        name: 'GVLab TETOFII',
        url: 'https://gvlab.com.br',
      },
    },
    breadcrumbs: [
      { name: 'Início', url: 'https://gvlab.com.br/' },
      { name: 'FIIs de Tijolo', url: 'https://gvlab.com.br/fiis-de-tijolo' },
    ],
    h1: 'Radar Completo de FIIs de Tijolo da B3',
    subtitle: 'Acompanhe os principais indicadores dos fundos imobiliários com imóveis físicos no Brasil: cotação B3, VPA oficial CVM, P/VP, vacância física e dividendos.',
    richContentHtml: `
      <section class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs mb-8">
        <h2 class="text-xl sm:text-2xl font-bold text-slate-900 mb-4">O que são Fundos Imobiliários de Tijolo?</h2>
        <p class="text-slate-600 mb-4 leading-relaxed">
          Fundos Imobiliários de Tijolo são condomínios fechados de investidores cujos recursos são aplicados diretamente na aquisição e exploração comercial de imóveis físicos acabados ou em construção. Seus ativos geram receita através do recebimento de aluguéis pagos pelos locatários comerciais.
        </p>
        <p class="text-slate-600 mb-4 leading-relaxed">
          Nesta seção, o TETOFII monitora os fundos mais relevantes e negociados da bolsa brasileira (B3), cruzando cotações de mercado com o <strong>VPA oficial extraído dos informes estruturados da CVM (Resolução CVM 175)</strong>.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div class="font-bold text-slate-900">P/VP (Preço sobre Valor Patrimonial)</div>
            <p class="text-xs text-slate-600 mt-1">Indica se a cota de mercado está sendo negociada com ágio (> 1,00) ou desconto (< 1,00) em relação ao laudo patrimonial.</p>
          </div>
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div class="font-bold text-slate-900">Vacância Física</div>
            <p class="text-xs text-slate-600 mt-1">Percentual da Área Bruta Locável (ABL) total do fundo que se encontra atualmente desocupada sem gerar aluguel.</p>
          </div>
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div class="font-bold text-slate-900">Dividend Yield Anualizado</div>
            <p class="text-xs text-slate-600 mt-1">Taxa de retorno percentual gerada pelos proventos distribuídos pelo fundo nos últimos 12 meses sobre a cotação.</p>
          </div>
        </div>
      </section>
    `,
  },
  {
    slug: 'fiiqueinformado',
    aliases: ['fiiqueinfomado', 'fiique-informado', 'relatorios'],
    tabKey: 'reports',
    title: 'FIIque Informado - TETOFII | Destaques de Relatórios Gerenciais e Fatos de FIIs',
    description: 'Acompanhe as principais novidades dos fundos imobiliários: destaques de relatórios gerenciais, fatos relevantes, divulgação de dividendos e mudanças patrimoniais.',
    keywords: 'fiique informado, fatos relevantes fii, dividendos fii, relatorios gerenciais fii, mudanca patrimonial fii, hglg11, hgbs11, hgru11',
    canonicalUrl: 'https://gvlab.com.br/fiiqueinformado',
    schemaType: 'CollectionPage',
    schemaData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'FIIque Informado: Destaques, Fatos Relevantes e Relatórios de FIIs',
      description: 'Hub de informações de Fundos Imobiliários de Tijolo: destaques gerenciais, anúncios de dividendos, movimentações patrimoniais e fatos relevantes.',
      url: 'https://gvlab.com.br/fiiqueinformado',
    },
    breadcrumbs: [
      { name: 'Início', url: 'https://gvlab.com.br/' },
      { name: 'FIIque Informado', url: 'https://gvlab.com.br/fiiqueinformado' },
    ],
    h1: 'FIIque Informado: Destaques, Fatos Relevantes e Relatórios',
    subtitle: 'Sínteses executivas, anúncios de proventos, movimentações patrimoniais e comunicados oficiais dos fundos imobiliários.',
    richContentHtml: `
      <section class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs mb-8">
        <h2 class="text-xl sm:text-2xl font-bold text-slate-900 mb-4">A Importância da Leitura dos Relatórios Gerenciais</h2>
        <p class="text-slate-600 mb-4 leading-relaxed">
          O relatório gerencial é o principal documento de comunicação entre a equipe de gestão de um FII e os cotistas. Nele constam informações vitais que números isolados não revelam: vencimento do cronograma de contratos de locação, perfil dos inquilinos (típicos vs. atípicos), obras de manutenção e retrofit, índices de reajuste inflacionário e reservas de contingência.
        </p>
        <p class="text-slate-600 leading-relaxed">
          A curadoria do <strong>FIIque Informado</strong> condensa os principais destaques operacionais para que o investidor tome decisões com embasamento factual direto das fontes oficiais.
        </p>
      </section>
    `,
  },
  {
    slug: 'guia-de-precificacao',
    aliases: ['guia'],
    tabKey: 'guide',
    title: 'Guia Completo de Precificação de FIIs - TETOFII | Metodologia NTN-B',
    description: 'Aprenda como calcular o Preço Teto de Fundos Imobiliários de Tijolo usando o Tesouro IPCA+ (NTN-B), Gordon Growth Model e prêmio de risco adequado. Guia completo para investidores.',
    keywords: 'guia precificacao fii, valuation fii tijolo, metodologia ntn-b preco teto, gordon fii, premio de risco logistica shopping lajes',
    canonicalUrl: 'https://gvlab.com.br/guia-de-precificacao',
    schemaType: 'Article',
    schemaData: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Como Calcular o Preço Teto de FIIs de Tijolo: Método NTN-B e Custo de Oportunidade',
      description: 'Guia completo passo a passo ensinando a calcular o Preço Teto de Fundos Imobiliários de Tijolo através do custo de oportunidade da NTN-B e modelo de fluxo de caixa descontado.',
      author: {
        '@type': 'Organization',
        name: 'GVLab TETOFII',
        url: 'https://gvlab.com.br',
      },
      publisher: {
        '@type': 'Organization',
        name: 'TETOFII',
        logo: {
          '@type': 'ImageObject',
          url: 'https://gvlab.com.br/favicon.svg',
        },
      },
      datePublished: '2026-09-01',
      dateModified: '2026-10-16',
      mainEntityOfPage: 'https://gvlab.com.br/guia-de-precificacao',
    },
    breadcrumbs: [
      { name: 'Início', url: 'https://gvlab.com.br/' },
      { name: 'Guia de Precificação', url: 'https://gvlab.com.br/guia-de-precificacao' },
    ],
    h1: 'Como Calcular o Preço Teto de FIIs de Tijolo: Método NTN-B e Custo de Oportunidade',
    subtitle: 'Um manual prático e fundamentalista sobre precificação de imóveis em bolsa, taxa livre de risco e margem de segurança.',
    richContentHtml: `
      <section class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs mb-8">
        <h2 class="text-xl sm:text-2xl font-bold text-slate-900 mb-4">1. O Conceito Fundamental de Preço Teto</h2>
        <p class="text-slate-600 mb-4 leading-relaxed">
          Preço Teto é o preço máximo que um investidor consciente pode pagar por uma cota sem sacrificar sua rentabilidade mínima exigida. Inspirado nas lições clássicas de Benjamin Graham e adaptado para o ecossistema brasileiro de Fundos Imobiliários por Décio Bazin e analistas independentes, o Preço Teto busca garantir que você nunca compre cotas sobreavaliadas pelo otimismo temporário do mercado.
        </p>
        <h2 class="text-xl sm:text-2xl font-bold text-slate-900 mb-4 mt-8">2. Por que a NTN-B (Tesouro IPCA+) é o Balizador Correto?</h2>
        <p class="text-slate-600 mb-4 leading-relaxed">
          Os imóveis físicos de um FII de Tijolo contam com cláusulas de reajuste anual pela inflação (IPCA ou IGP-M). Logo, o dividendo pago pelo fundo já embute a reposição inflacionária do valor dos contratos no médio e longo prazo.
        </p>
        <p class="text-slate-600 mb-4 leading-relaxed">
          A NTN-B Principal (Tesouro IPCA+) é o título soberano do governo brasileiro que remunera o IPCA mais uma taxa de juros real prefixada. Se o Tesouro Nacional oferece IPCA + 6,50% a.a. sem nenhum risco de vacância ou reformas prediais, qualquer investimento em imóveis reais precisa entregar um dividendo anual superior a esse patamar.
        </p>
        <div class="bg-slate-50 p-6 rounded-xl border border-slate-200 my-6">
          <h3 class="font-bold text-slate-900 mb-2">Tabela Referencial de Prêmios de Risco Setoriais:</h3>
          <ul class="space-y-2 text-sm text-slate-700">
            <li><strong>Galpões Logísticos Prime (AAA):</strong> NTN-B + 1,5% a 2,0% a.a. (Contratos atípicos de longo prazo com gigantes do e-commerce).</li>
            <li><strong>Shoppings Centers Consolidados:</strong> NTN-B + 2,0% a 2,5% a.a. (Receitas com aluguel percentual sobre vendas e estacionamento).</li>
            <li><strong>Lajes Corporativas (Escritórios):</strong> NTN-B + 2,5% a 3,5% a.a. (Ciclo mais longo de reposicionamento e custos condominiais durante a vacância).</li>
            <li><strong>Híbridos / Renda Urbana:</strong> NTN-B + 2,0% a 2,8% a.a. (Supermercados, atacarejos, farmácias e agências bancárias).</li>
          </ul>
        </div>
      </section>
    `,
  },
  {
    slug: 'aplicativo',
    aliases: ['baixe-o-app'],
    tabKey: 'download',
    title: 'Baixe o Aplicativo TETOFII | App Android e PWA de Precificação de FIIs',
    description: 'Instale o aplicativo oficial do TETOFII no celular Android ou adicione o PWA à tela inicial. Precificação de FIIs de tijolo, sincronização oficial CVM e cotações B3 no seu bolso.',
    keywords: 'aplicativo tetofii, app fii android, baixar app fundos imobiliarios, pwa tetofii, calculadora fii mobile',
    canonicalUrl: 'https://gvlab.com.br/aplicativo',
    schemaType: 'SoftwareApplication',
    schemaData: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'TETOFII Aplicativo Android & PWA',
      operatingSystem: 'Android, iOS, Web',
      applicationCategory: 'FinanceApplication',
      url: 'https://gvlab.com.br/aplicativo',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'BRL',
      },
    },
    breadcrumbs: [
      { name: 'Início', url: 'https://gvlab.com.br/' },
      { name: 'Baixe o Aplicativo', url: 'https://gvlab.com.br/aplicativo' },
    ],
    h1: 'Aplicativo TETOFII para Android e Web PWA',
    subtitle: 'Tenha o poder da precificação e dos dados oficiais da CVM no bolso, com carregamento ultrarrápido e funcionamento responsivo.',
    richContentHtml: `
      <section class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs mb-8">
        <h2 class="text-xl sm:text-2xl font-bold text-slate-900 mb-4">Recursos do Aplicativo TETOFII</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-5 rounded-xl bg-slate-50 border border-slate-200">
            <h3 class="font-bold text-slate-900 mb-2">Sincronização Periódica com a CVM</h3>
            <p class="text-sm text-slate-600">O app consome a base oficial de Informes Mensais Estruturados da CVM (Resolução 175), atualizando o VPA com 100% de conformidade regulatória.</p>
          </div>
          <div class="p-5 rounded-xl bg-slate-50 border border-slate-200">
            <h3 class="font-bold text-slate-900 mb-2">Calculadora Instantânea</h3>
            <p class="text-sm text-slate-600">Simule o Preço Teto alterando a NTN-B de referência ou o prêmio de risco com resposta imediata e feedback visual de margem.</p>
          </div>
          <div class="p-5 rounded-xl bg-slate-50 border border-slate-200">
            <h3 class="font-bold text-slate-900 mb-2">Instalação Direta (PWA)</h3>
            <p class="text-sm text-slate-600">Adicione o TETOFII à tela inicial do seu dispositivo sem ocupar espaço de memória com instaladores pesados.</p>
          </div>
          <div class="p-5 rounded-xl bg-slate-50 border border-slate-200">
            <h3 class="font-bold text-slate-900 mb-2">100% Gratuito e Independente</h3>
            <p class="text-sm text-slate-600">Desenvolvido como ferramenta de utilidade pública e educação financeira para a comunidade de investidores em FIIs.</p>
          </div>
        </div>
      </section>
    `,
  },
  {
    slug: 'politica-de-privacidade',
    aliases: ['privacidade'],
    tabKey: 'privacy',
    title: 'Política de Privacidade e Cookies - TETOFII | Conformidade AdSense e LGPD',
    description: 'Política de Privacidade oficial da plataforma TETOFII. Informações sobre tratamento de dados, cookies de publicidade Google AdSense (DART) e direitos LGPD.',
    keywords: 'politica de privacidade tetofii, cookies adsense, conformidade lgpd tetofii, termos privacidade google adsense',
    canonicalUrl: 'https://gvlab.com.br/politica-de-privacidade',
    schemaType: 'PrivacyPolicy',
    schemaData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Política de Privacidade e Cookies do TETOFII',
      url: 'https://gvlab.com.br/politica-de-privacidade',
    },
    breadcrumbs: [
      { name: 'Início', url: 'https://gvlab.com.br/' },
      { name: 'Política de Privacidade', url: 'https://gvlab.com.br/politica-de-privacidade' },
    ],
    h1: 'Política de Privacidade e Proteção de Dados Pessoais',
    subtitle: 'Transparência no uso de cookies, publicidade contextual Google AdSense e conformidade com a Lei Geral de Proteção de Dados (LGPD).',
    richContentHtml: `
      <section class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs mb-8 space-y-4 text-slate-600 leading-relaxed">
        <p><strong>Última atualização:</strong> 17 de Outubro de 2026</p>
        <h2 class="text-xl font-bold text-slate-900 pt-2">1. Informações Gerais e Compromisso de Privacidade</h2>
        <p>A plataforma TETOFII (operada pela GVLab, acessível em gvlab.com.br) tem o compromisso inequívoco de respeitar a privacidade e proteger os dados dos usuários que utilizam nossos serviços, simuladores matemáticos e conteúdos educativos.</p>
        
        <h2 class="text-xl font-bold text-slate-900 pt-2">2. Google AdSense e Cookies de Terceiros</h2>
        <p>O Google, como fornecedor terceiro, utiliza cookies para veicular anúncios neste site. O uso do cookie DoubleClick DART permite que o Google e seus parceiros veiculem anúncios para nossos usuários com base em suas visitas a este e a outros sites na Internet.</p>
        <p>Os usuários podem desativar o uso do cookie DART acessando a <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" class="text-emerald-700 underline font-medium">Política de privacidade da rede de conteúdo e dos anúncios do Google</a>.</p>
        
        <h2 class="text-xl font-bold text-slate-900 pt-2">3. Google Analytics (GA4)</h2>
        <p>Utilizamos o Google Analytics para coletar métricas de navegação anônimas (páginas visitadas, tempo de permanência, tipo de navegador), com a finalidade exclusiva de aprimorar a usabilidade da aplicação.</p>

        <h2 class="text-xl font-bold text-slate-900 pt-2">4. Seus Direitos (LGPD - Lei 13.709/2018)</h2>
        <p>Você tem o direito de solicitar a confirmação da existência de tratamento de dados, acesso, correção ou eliminação de informações. Para exercer quaisquer direitos, entre em contato através do e-mail: <strong>contato@gvlab.com.br</strong>.</p>
      </section>
    `,
  },
  {
    slug: 'termos-de-uso',
    aliases: ['termos'],
    tabKey: 'terms',
    title: 'Termos de Uso e Isenção Regulatória - TETOFII | Resolução CVM 20/2021',
    description: 'Termos de uso e avisos legais da plataforma TETOFII. Esclarecimentos sobre simulações matemáticas e ausência de recomendação de investimentos.',
    keywords: 'termos de uso tetofii, aviso legal cvm 20, isencao de responsabilidade fii, simulacao matematica educacional',
    canonicalUrl: 'https://gvlab.com.br/termos-de-uso',
    schemaType: 'TermsOfService',
    schemaData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Termos de Uso e Isenção Regulatória do TETOFII',
      url: 'https://gvlab.com.br/termos-de-uso',
    },
    breadcrumbs: [
      { name: 'Início', url: 'https://gvlab.com.br/' },
      { name: 'Termos de Uso', url: 'https://gvlab.com.br/termos-de-uso' },
    ],
    h1: 'Termos de Uso e Isenção de Responsabilidade Regulatória',
    subtitle: 'Condições gerais de navegação, conformidade com a Resolução CVM nº 20/2021 e finalidade exclusivamente educacional.',
    richContentHtml: `
      <section class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs mb-8 space-y-4 text-slate-600 leading-relaxed">
        <h2 class="text-xl font-bold text-slate-900">1. Natureza Exclusivamente Educativa e Simulador Matemático</h2>
        <p>O TETOFII é uma ferramenta estritamente quantitativa e educativa. Nenhuma informação, dado, cálculo de Preço Teto, indicador ou texto disponibilizado nesta plataforma constitui recomendação, consultoria, oferta de compra ou venda de cotas de Fundos Imobiliários ou qualquer valor mobiliário.</p>

        <h2 class="text-xl font-bold text-slate-900 pt-2">2. Conformidade com a Resolução CVM nº 20/2021</h2>
        <p>Em total obediência às normas expedidas pela Comissão de Valores Mobiliários (CVM), os desenvolvedores e mantenedores do TETOFII declaram expressamente que não atuam como analistas de valores mobiliários credenciados (CNPI) e não emitem relatórios de análise nos termos da Resolução CVM 20/2021. Toda tomada de decisão de investimento cabe unicamente ao próprio investidor.</p>

        <h2 class="text-xl font-bold text-slate-900 pt-2">3. Fontes Públicas Oficiais</h2>
        <p>Os dados patrimoniais exibidos são extraídos de fontes públicas oficiais: Comissão de Valores Mobiliários (CVM - Portal de Dados Abertos e Resolução 175), B3 S.A. - Brasil, Bolsa, Balcão e Secretaria do Tesouro Nacional. Embora empreguemos os melhores esforços para garantir a integridade dos dados, oscilações operacionais e atrasos das fontes primárias podem ocorrer.</p>
      </section>
    `,
  },
  {
    slug: 'sobre',
    aliases: [],
    tabKey: 'about',
    title: 'Sobre o TETOFII - GVLab | Engenharia Quantitativa e Educação em FIIs',
    description: 'Conheça a história, missão e metodologia matemática por trás do TETOFII. Iniciativa do estúdio GVLab para democratização do valuation de FIIs de Tijolo.',
    keywords: 'sobre o tetofii, gvlab tecnologia, historia tetofii, equipe gvlab, missao valuation fii democratizacao',
    canonicalUrl: 'https://gvlab.com.br/sobre',
    schemaType: 'AboutPage',
    schemaData: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'Sobre o Projeto TETOFII e GVLab',
      description: 'Conheça a história, missão e metodologia matemática por trás do TETOFII, iniciativa do estúdio GVLab para democratização do valuation de FIIs de Tijolo.',
      url: 'https://gvlab.com.br/sobre',
    },
    breadcrumbs: [
      { name: 'Início', url: 'https://gvlab.com.br/' },
      { name: 'Sobre o TETOFII', url: 'https://gvlab.com.br/sobre' },
    ],
    h1: 'Sobre o Projeto TETOFII & GVLab',
    subtitle: 'Nossa história, missão de transparência quantitativa e compromisso com a educação de investidores em Fundos Imobiliários.',
    richContentHtml: `
      <section class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs mb-8 space-y-4 text-slate-600 leading-relaxed">
        <h2 class="text-xl sm:text-2xl font-bold text-slate-900">A Origem do TETOFII</h2>
        <p>O TETOFII nasceu da percepção de que a maioria dos investidores pessoa física no Brasil comprava cotas de Fundos Imobiliários orientando-se apenas pelo dividendo nominal do mês anterior ou pela recomendação superficial de influenciadores digitais, sem qualquer critério de valuation ou comparação com a taxa de juros real soberana (NTN-B).</p>
        <p>Criado pela <strong>GVLab</strong>, o projeto une engenharia de software de alta performance com modelagem financeira fundamentalista, oferecendo de forma 100% gratuita uma ferramenta que antes era restrita a mesas institucionais de análise imobiliária.</p>

        <h2 class="text-xl sm:text-2xl font-bold text-slate-900 pt-4">Nossa Metodologia</h2>
        <p>Priorizamos o rigor técnico:</p>
        <ul class="list-disc list-inside space-y-2 pl-2">
          <li><strong>Dados Contábeis Oficiais:</strong> Informes Mensais Estruturados da CVM (Resolução 175) consultados e cruzados diretamente por CNPJ e ISIN.</li>
          <li><strong>Custo de Oportunidade Real:</strong> Paridade com os títulos NTN-B do Tesouro Direto.</li>
          <li><strong>Independência:</strong> O TETOFII não vende relatórios fechados, não recebe comissões de corretoras e não faz recomendações de compra.</li>
        </ul>

        <h2 class="text-xl sm:text-2xl font-bold text-slate-900 pt-4">Contato e Sugestões</h2>
        <p>Para dúvidas, sugestões de novos FIIs para a base ou contato institucional, envie uma mensagem para <strong>contato@gvlab.com.br</strong>.</p>
      </section>
    `,
  },
];

function generateNavigationHeader(activeSlug) {
  const navItems = [
    { slug: 'calculadora', label: 'Calculadora' },
    { slug: 'meu-radar', label: 'Meu Radar' },
    { slug: 'fiis-de-tijolo', label: 'FIIs de Tijolo' },
    { slug: 'fiiqueinformado', label: 'FIIque Informado' },
    { slug: 'guia-de-precificacao', label: 'Guia de Precificação' },
    { slug: 'aplicativo', label: 'Baixe o App' },
  ];

  return `
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        <a href="/" class="flex items-center gap-3 cursor-pointer group">
          <div class="w-11 h-11 rounded-xl overflow-hidden shadow-xs flex items-center justify-center bg-emerald-800 text-white font-black text-xl">
            TF
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xl font-black text-slate-900 tracking-tight">
                TETO<span class="text-emerald-700">FII</span>
              </span>
              <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Tijolo
              </span>
            </div>
            <p class="text-[11px] text-slate-500 font-medium hidden sm:block">
              Preço Teto, P/VP e Margem de Segurança
            </p>
          </div>
        </a>

        <nav class="hidden md:flex items-center gap-2 text-xs sm:text-sm font-semibold">
          ${navItems.map(item => `
            <a
              href="/${item.slug}"
              class="px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
                activeSlug === item.slug
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }"
            >
              <span>${item.label}</span>
            </a>
          `).join('')}
        </nav>
      </div>
    </header>
  `;
}

function generateFooter() {
  return `
    <footer class="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-sm mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="space-y-3">
            <div class="text-lg font-bold text-white tracking-tight">
              TETO<span class="text-emerald-400">FII</span>
            </div>
            <p class="text-xs text-slate-400 leading-relaxed">
              Plataforma quantitativa e independente de precificação fundamentalista de Fundos Imobiliários de Tijolo com base na taxa de juros real do Tesouro IPCA+ (NTN-B).
            </p>
          </div>
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Navegação</h4>
            <ul class="space-y-2 text-xs">
              <li><a href="/calculadora" class="hover:text-emerald-400 transition-colors">Calculadora de Preço Teto</a></li>
              <li><a href="/meu-radar" class="hover:text-emerald-400 transition-colors">Meu Radar Personalizado</a></li>
              <li><a href="/fiis-de-tijolo" class="hover:text-emerald-400 transition-colors">Radar de FIIs de Tijolo</a></li>
              <li><a href="/fiiqueinformado" class="hover:text-emerald-400 transition-colors">FIIque Informado</a></li>
              <li><a href="/guia-de-precificacao" class="hover:text-emerald-400 transition-colors">Guia de Precificação</a></li>
              <li><a href="/aplicativo" class="hover:text-emerald-400 transition-colors">Baixe o Aplicativo</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Institucional & Legal</h4>
            <ul class="space-y-2 text-xs">
              <li><a href="/sobre" class="hover:text-emerald-400 transition-colors">Sobre o Projeto TETOFII</a></li>
              <li><a href="/termos-de-uso" class="hover:text-emerald-400 transition-colors">Termos de Uso e Isenção CVM</a></li>
              <li><a href="/politica-de-privacidade" class="hover:text-emerald-400 transition-colors">Política de Privacidade e Cookies</a></li>
              <li><span class="text-slate-400">Contato: contato@gvlab.com.br</span></li>
            </ul>
          </div>
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Fontes Oficiais</h4>
            <p class="text-xs text-slate-400 leading-relaxed">
              Dados consolidados a partir do Portal de Dados Abertos da CVM (Resolução 175), B3 S.A. e Secretaria do Tesouro Nacional.
            </p>
          </div>
        </div>
        <div class="pt-8 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 TETOFII • GVLab. Todos os direitos reservados. Finalidade exclusivamente educacional (Resolução CVM nº 20/2021).</p>
        </div>
      </div>
    </footer>
  `;
}

function renderHtmlForPage(page) {
  const schemaJson = JSON.stringify(page.schemaData, null, 2);

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${page.title}</title>
    <meta name="description" content="${page.description}" />
    <meta name="keywords" content="${page.keywords}" />
    <link rel="canonical" href="${page.canonicalUrl}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${page.canonicalUrl}" />
    <meta property="og:title" content="${page.title}" />
    <meta property="og:description" content="${page.description}" />
    <meta property="og:site_name" content="TETOFII" />
    
    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${page.title}" />
    <meta name="twitter:description" content="${page.description}" />

    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    
    <!-- Google Analytics 4 -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-C0V1Z0YWK5"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-C0V1Z0YWK5');
    </script>
    
    <!-- Google AdSense Oficial -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3391273614251226" crossorigin="anonymous"></script>

    <!-- Schema.org Structured Data -->
    <script type="application/ld+json">
${schemaJson}
    </script>

    <!-- Bundle CSS gerado pelo Vite -->
    <link rel="stylesheet" crossorigin href="${cleanCssHref}">
  </head>
  <body class="bg-slate-50 text-slate-800 antialiased font-sans">
    <div id="root">
      <!-- Conteúdo Semântico Pré-Renderizado para Rastreamento pelo Googlebot e AdSense -->
      <div class="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
        ${generateNavigationHeader(page.slug)}

        <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
          <!-- Breadcrumb de Navegação -->
          <nav aria-label="Breadcrumb" class="text-xs text-slate-400 flex items-center gap-2">
            ${page.breadcrumbs.map((b, i) => `
              <span>${i > 0 ? '›' : ''}</span>
              <a href="${b.url}" class="hover:text-emerald-700 transition-colors ${i === page.breadcrumbs.length - 1 ? 'font-bold text-slate-700' : ''}">
                ${b.name}
              </a>
            `).join('')}
          </nav>

          <!-- Cabeçalho Principal da Página -->
          <header class="bg-white rounded-3xl p-6 sm:p-10 shadow-xs border border-slate-200">
            <h1 class="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-3">
              ${page.h1}
            </h1>
            <p class="text-base sm:text-lg text-slate-600 max-w-4xl leading-relaxed">
              ${page.subtitle}
            </p>
          </header>

          <!-- Espaço de Anúncio AdSense Superior -->
          <div class="my-4">
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-3391273614251226"
                 data-ad-slot="1122334455"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
          </div>

          <!-- Conteúdo Editorial Rico da Página -->
          ${page.richContentHtml}
        </main>

        ${generateFooter()}
      </div>
    </div>

    <!-- Script SPA do React para hidratação interativa completa -->
    <script type="module" crossorigin src="${cleanScriptSrc}"></script>
  </body>
</html>`;
}

// Cria as páginas nas pastas dist/ e public/
for (const page of pages) {
  const htmlContent = renderHtmlForPage(page);

  // 1. Gera /dist/{slug}/index.html
  const distSubDir = path.resolve(distDir, page.slug);
  fs.mkdirSync(distSubDir, { recursive: true });
  fs.writeFileSync(path.resolve(distSubDir, 'index.html'), htmlContent, 'utf-8');
  console.log(`[Generate Static Pages] Gerado: dist/${page.slug}/index.html`);

  // 2. Gera /dist/{slug}.html para servidores sem configuração de trailing slash
  fs.writeFileSync(path.resolve(distDir, `${page.slug}.html`), htmlContent, 'utf-8');

  // 3. Se for 'calculadora', também atualiza o dist/index.html (raiz) para já conter todo o HTML pré-renderizado!
  if (page.slug === 'calculadora') {
    fs.writeFileSync(distIndexHtmlPath, htmlContent, 'utf-8');
    console.log(`[Generate Static Pages] Atualizado: dist/index.html com conteúdo da Calculadora`);
  }

  // 4. Gera aliases (como radar -> fiis-de-tijolo, guia -> guia-de-precificacao)
  if (page.aliases && page.aliases.length > 0) {
    for (const alias of page.aliases) {
      if (alias === 'index') continue;
      const aliasDir = path.resolve(distDir, alias);
      fs.mkdirSync(aliasDir, { recursive: true });
      fs.writeFileSync(path.resolve(aliasDir, 'index.html'), htmlContent, 'utf-8');
      fs.writeFileSync(path.resolve(distDir, `${alias}.html`), htmlContent, 'utf-8');
      console.log(`[Generate Static Pages] Gerado alias: dist/${alias}/index.html`);
    }
  }
}

console.log('[Generate Static Pages] Todas as 9 páginas foram geradas com sucesso!');
