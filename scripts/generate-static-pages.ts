import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { FII_REPORTS_DATA } from '../src/data/fiiReports.ts';

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

interface PageDefinition {
  slug: string;
  aliases?: string[];
  tabKey: string;
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  schemaData: object;
  breadcrumbs: { name: string; url: string }[];
  h1: string;
  subtitle: string;
  richContentHtml: string;
}

const mainPages: PageDefinition[] = [
  {
    slug: 'calculadora',
    aliases: ['index'],
    tabKey: 'calculator',
    title: 'Calculadora de Preço Teto de FIIs de Tijolo - TETOFII | Método NTN-B',
    description: 'Calcule o Preço Teto de Fundos Imobiliários de Tijolo com base nos rendimentos recorrentes e na taxa de desconto do Tesouro IPCA+ (NTN-B). Simule margem de segurança e P/VP.',
    keywords: 'calculadora preco teto fii, preco teto fii tijolo, formula graham fii, tesouro ipca ntn-b, margem de seguranca fii, valuation fundos imobiliarios',
    canonicalUrl: 'https://gvlab.com.br/calculadora',
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
          <h3 class="text-lg font-bold text-slate-900 mb-2">1. Rendimento Recorrente</h3>
          <p class="text-sm text-slate-600 leading-relaxed">
            Considere apenas o dividendo mensal ordinário proveniente de aluguéis contratados, expurgando ganhos de capital extraordinários ou venda esporádica de imóveis para não distorcer o teto.
          </p>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 class="text-lg font-bold text-slate-900 mb-2">2. Taxa Livre de Risco</h3>
          <p class="text-sm text-slate-600 leading-relaxed">
            Utilize a cotação oficial do Tesouro IPCA+ do dia (NTN-B). Se o governo paga IPCA + 6,5% a.a., o FII precisa entregar um retorno superior para compensar a vacância e risco de inadimplência.
          </p>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 class="text-lg font-bold text-slate-900 mb-2">3. Margem de Segurança</h3>
          <p class="text-sm text-slate-600 leading-relaxed">
            A margem é a diferença percentual entre o Preço Teto calculado e o Preço Atual de mercado na B3. Margem positiva indica cota negociada com desconto frente ao fluxo de rendimentos projetado.
          </p>
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
    schemaData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Meu Radar Personalizado TETOFII',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'All',
      url: 'https://gvlab.com.br/meu-radar',
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
          O <strong>Meu Radar</strong> foi desenvolvido para permitir que cada investidor configure suas premissas de retorno exigido conforme o perfil de risco de cada segmento imobiliário.
        </p>
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
    schemaData: {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: 'Indicadores e Cotações dos Principais FIIs de Tijolo da B3',
      url: 'https://gvlab.com.br/fiis-de-tijolo',
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
          Fundos Imobiliários de Tijolo são condomínios fechados cujos recursos são aplicados diretamente em imóveis físicos reais geradores de renda de aluguel.
        </p>
      </section>
    `,
  },
  {
    slug: 'fiiqueinformado',
    aliases: ['fiiqueinfomado', 'fiique-informado', 'relatorios'],
    tabKey: 'reports',
    title: 'FIIque Informado - TETOFII | Destaques de Relatórios Gerenciais e Fatos de FIIs',
    description: 'Acompanhe as principais novidades dos fundos imobiliários: destaques de relatórios gerenciais, fatos relevantes, divulgação de dividendos e mudanças patrimoniais.',
    keywords: 'fiique informado, fatos relevantes fii, dividendos fii, relatorios gerenciais fii, mudanca patrimonial fii, hglg11, hgbs11, hgru11, brco11, alzr11',
    canonicalUrl: 'https://gvlab.com.br/fiiqueinformado',
    schemaData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'FIIque Informado: Destaques, Fatos Relevantes e Relatórios de FIIs',
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
        <h2 class="text-xl sm:text-2xl font-bold text-slate-900 mb-4">Matérias e Relatórios Publicados</h2>
        <div class="space-y-3">
          ${FII_REPORTS_DATA.map(r => `
            <a href="/fiiqueinformado/${r.id}" class="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-emerald-600 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 block no-underline">
              <div>
                <span class="text-xs font-black px-2 py-0.5 rounded bg-emerald-800 text-white mr-2">${r.ticker}</span>
                <span class="text-xs text-slate-500 font-semibold">${r.publishedAtFormatted} • ${r.segment}</span>
                <h3 class="font-bold text-slate-900 mt-1">${r.title}</h3>
              </div>
              <span class="text-xs font-bold text-emerald-700 shrink-0">Ler Matéria Completa →</span>
            </a>
          `).join('')}
        </div>
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
    schemaData: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Como Calcular o Preço Teto de FIIs de Tijolo: Método NTN-B e Custo de Oportunidade',
      datePublished: '2026-09-01',
      dateModified: '2026-10-17',
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
          Preço Teto é o preço máximo que um investidor consciente pode pagar por uma cota sem sacrificar sua rentabilidade mínima exigida.
        </p>
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
    schemaData: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'TETOFII Aplicativo Android & PWA',
      operatingSystem: 'Android, iOS, Web',
      applicationCategory: 'FinanceApplication',
      url: 'https://gvlab.com.br/aplicativo',
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
        <p class="text-slate-600 mb-4">Consuma dados oficiais da CVM, cotações da B3 e calcule o Preço Teto no seu smartphone.</p>
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
        <h2 class="text-xl font-bold text-slate-900 pt-2">1. Google AdSense e Cookies de Terceiros</h2>
        <p>O Google, como fornecedor terceiro, utiliza cookies para veicular anúncios neste site. O uso do cookie DoubleClick DART permite que o Google e seus parceiros veiculem anúncios para nossos usuários com base em suas visitas a este e a outros sites na Internet.</p>
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
        <p>O TETOFII é uma ferramenta estritamente quantitativa e educativa. Nenhuma informação constitui recomendação de investimento nos termos da Resolução CVM 20/2021.</p>
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
    schemaData: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'Sobre o Projeto TETOFII e GVLab',
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
        <p>Criado pela <strong>GVLab</strong>, o projeto une engenharia de software de alta performance com modelagem financeira fundamentalista.</p>
      </section>
    `,
  },
];

// Transforma cada relatório em uma página editorial pré-renderizada rica
const articlePages: PageDefinition[] = FII_REPORTS_DATA.map((report) => {
  return {
    slug: `fiiqueinformado/${report.id}`,
    aliases: [`materia/${report.id}`, `relatorios/${report.id}`],
    tabKey: 'reports',
    title: `${report.title} | TETOFII`,
    description: `Confira os principais indicadores e destaques do relatório gerencial do ${report.ticker} (${report.fundName}): ${report.summaryBadge || report.title}`,
    keywords: `${report.ticker.toLowerCase()}, relatorio gerencial ${report.ticker.toLowerCase()}, proventos ${report.ticker.toLowerCase()}, pvp ${report.ticker.toLowerCase()}, fii ${report.segment.toLowerCase()}`,
    canonicalUrl: `https://gvlab.com.br/fiiqueinformado/${report.id}`,
    schemaData: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: report.title,
      description: report.summaryBadge || report.title,
      datePublished: report.publishedAt,
      dateModified: report.publishedAt,
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
      mainEntityOfPage: `https://gvlab.com.br/fiiqueinformado/${report.id}`,
    },
    breadcrumbs: [
      { name: 'Início', url: 'https://gvlab.com.br/' },
      { name: 'FIIque Informado', url: 'https://gvlab.com.br/fiiqueinformado' },
      { name: `${report.ticker} (${report.reportMonth})`, url: `https://gvlab.com.br/fiiqueinformado/${report.id}` },
    ],
    h1: report.title,
    subtitle: `${report.fundName} • Relatório Gerencial de ${report.reportMonth} • Publicado em ${report.publishedAtFormatted}`,
    richContentHtml: `
      <article class="bg-white rounded-3xl p-6 sm:p-10 shadow-xs border border-slate-200/90 space-y-6">
        <!-- Navegação superior -->
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <a href="/fiiqueinformado" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 font-bold text-sm shadow-2xs transition-all no-underline">
            <span>← Voltar para todas as matérias</span>
          </a>
          <span class="text-xs text-slate-500 font-medium">Publicado em: ${report.publishedAtFormatted}</span>
        </div>

        <!-- Badges e identificação -->
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2 text-xs">
            <span class="px-2.5 py-0.5 rounded-lg font-black bg-emerald-800 text-white">${report.ticker}</span>
            <span class="px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">${report.segment}</span>
            <span class="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">#${report.id.toUpperCase()}</span>
          </div>
          <p class="text-sm font-semibold text-slate-600">${report.summaryBadge}</p>
        </div>

        <!-- Metadados de Gestão e Taxas -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span class="text-[11px] font-bold text-slate-500 uppercase block">Gestora</span>
            <p class="font-bold text-slate-900 text-xs mt-0.5">${report.gestor}</p>
          </div>
          <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span class="text-[11px] font-bold text-slate-500 uppercase block">Administrador</span>
            <p class="font-bold text-slate-900 text-xs mt-0.5">${report.administrador}</p>
          </div>
          <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span class="text-[11px] font-bold text-slate-500 uppercase block">Taxa de Adm Total</span>
            <p class="font-bold text-slate-900 text-xs mt-0.5">${report.taxaAdmTotal}</p>
          </div>
          ${report.guidance ? `
            <div class="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span class="text-[11px] font-bold text-emerald-800 uppercase block">${report.guidanceLabel || 'Guidance'}</span>
              <p class="font-black text-emerald-900 text-xs mt-0.5">${report.guidance}</p>
            </div>
          ` : ''}
        </div>

        <!-- Acesso ao Documento Oficial na B3 / CVM -->
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 class="font-bold text-slate-900 text-sm">Documento Oficial Protocolado na B3 / CVM</h3>
            <p class="text-xs text-slate-500 mt-0.5">Visualize a íntegra do relatório original registrado no Sistema FNET.</p>
          </div>
          <a href="${report.pdfUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors shrink-0 no-underline">
            <span>Visualizar Relatório Oficial (FNET B3) ↗</span>
          </a>
        </div>

        <!-- Grade de Indicadores -->
        <div class="space-y-4 pt-2">
          <h2 class="text-xl font-black text-slate-900">Principais Indicadores do Mês (${report.reportMonth})</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            ${report.indicadores.map(ind => `
              <div class="p-4 rounded-2xl border ${ind.highlight ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-200' : 'bg-slate-50/70 border-slate-200/80'}">
                <span class="text-[11px] font-bold text-slate-500 block leading-tight">${ind.label}</span>
                <p class="text-lg sm:text-xl font-black mt-1 ${ind.highlight ? 'text-emerald-900' : 'text-slate-900'}">${ind.value}</p>
                ${ind.sublabel ? `<span class="text-[11px] text-slate-400 block mt-0.5 font-medium">${ind.sublabel}</span>` : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Principais Inquilinos -->
        ${report.principaisInquilinos && report.principaisInquilinos.length > 0 ? `
          <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500">Principais Locatários no Portfólio:</h3>
            <div class="flex flex-wrap gap-2 pt-1">
              ${report.principaisInquilinos.map(loc => `
                <span class="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs">${loc}</span>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Outros Pontos Relevantes -->
        ${report.outrosPontosRelevantes && report.outrosPontosRelevantes.length > 0 ? `
          <div class="space-y-3 pt-2">
            <h2 class="text-xl font-black text-slate-900">Destaques e Pontos de Atenção</h2>
            <div class="space-y-2.5">
              ${report.outrosPontosRelevantes.map(ponto => `
                <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed">
                  ${ponto}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </article>
    `,
  };
});

const allPages = [...mainPages, ...articlePages];

function generateNavigationHeader(activeSlug: string): string {
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
                activeSlug.startsWith(item.slug)
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

function generateFooter(): string {
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

function renderHtmlForPage(page: PageDefinition): string {
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
    <meta property="og:type" content="article" />
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

// Cria todas as páginas nas pastas dist/ e gera as subpastas
console.log(`[Generate Static Pages] Iniciando geração de ${allPages.length} páginas (9 seções + ${articlePages.length} matérias)...`);

for (const page of allPages) {
  const htmlContent = renderHtmlForPage(page);

  // 1. Gera /dist/{slug}/index.html
  const distSubDir = path.resolve(distDir, page.slug);
  fs.mkdirSync(distSubDir, { recursive: true });
  fs.writeFileSync(path.resolve(distSubDir, 'index.html'), htmlContent, 'utf-8');

  // 2. Gera /dist/{slug}.html
  const flatHtmlPath = path.resolve(distDir, `${page.slug}.html`);
  const flatDir = path.dirname(flatHtmlPath);
  fs.mkdirSync(flatDir, { recursive: true });
  fs.writeFileSync(flatHtmlPath, htmlContent, 'utf-8');

  // 3. Se for 'calculadora', atualiza o dist/index.html (raiz)
  if (page.slug === 'calculadora') {
    fs.writeFileSync(distIndexHtmlPath, htmlContent, 'utf-8');
  }

  // 4. Aliases
  if (page.aliases && page.aliases.length > 0) {
    for (const alias of page.aliases) {
      if (alias === 'index') continue;
      const aliasDir = path.resolve(distDir, alias);
      fs.mkdirSync(aliasDir, { recursive: true });
      fs.writeFileSync(path.resolve(aliasDir, 'index.html'), htmlContent, 'utf-8');
      const aliasFlat = path.resolve(distDir, `${alias}.html`);
      fs.mkdirSync(path.dirname(aliasFlat), { recursive: true });
      fs.writeFileSync(aliasFlat, htmlContent, 'utf-8');
    }
  }
}

// Atualiza o public/sitemap.xml e dist/sitemap.xml com as URLs canônicas das 15 matérias
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- 1. PÁGINAS PRINCIPAIS / SEÇÕES CANÔNICAS DO SITE -->
  <url>
    <loc>https://gvlab.com.br/</loc>
    <lastmod>2026-10-17</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://gvlab.com.br/calculadora</loc>
    <lastmod>2026-10-17</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://gvlab.com.br/meu-radar</loc>
    <lastmod>2026-10-17</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://gvlab.com.br/fiis-de-tijolo</loc>
    <lastmod>2026-10-17</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://gvlab.com.br/fiiqueinformado</loc>
    <lastmod>2026-10-17</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://gvlab.com.br/guia-de-precificacao</loc>
    <lastmod>2026-10-17</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://gvlab.com.br/aplicativo</loc>
    <lastmod>2026-10-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://gvlab.com.br/sobre</loc>
    <lastmod>2026-10-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://gvlab.com.br/termos-de-uso</loc>
    <lastmod>2026-10-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://gvlab.com.br/politica-de-privacidade</loc>
    <lastmod>2026-10-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- 2. MATÉRIAS E RELATÓRIOS DO FIIQUE INFORMADO (CANÔNICAS E INDEXÁVEIS) -->
${FII_REPORTS_DATA.map(r => `  <url>
    <loc>https://gvlab.com.br/fiiqueinformado/${r.id}</loc>
    <lastmod>${r.publishedAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.resolve(publicDir, 'sitemap.xml'), sitemapContent, 'utf-8');
fs.writeFileSync(path.resolve(distDir, 'sitemap.xml'), sitemapContent, 'utf-8');
console.log(`[Generate Static Pages] Sitemap atualizado com sucesso (${10 + FII_REPORTS_DATA.length} URLs).`);

console.log('[Generate Static Pages] Todas as páginas principais e matérias foram geradas com sucesso!');
