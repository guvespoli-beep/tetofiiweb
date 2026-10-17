import React, { useEffect } from 'react';
import { Building2, Target, Calculator, Mail, ArrowLeft, Award, Layers, Users, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

interface AboutPageProps {
  onBackToCalculator: () => void;
  onGoToGuide: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBackToCalculator, onGoToGuide }) => {
  useEffect(() => {
    document.title = 'Sobre o TETOFII - GVLab | Engenharia Quantitativa e Educação em FIIs';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Conheça a história, a missão e a metodologia matemática por trás do TETOFII. Projeto mantido pelo GVLab dedicado à democratização do valuation de Fundos Imobiliários de Tijolo.'
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
        <span className="text-xs text-slate-400 font-mono">Iniciativa GVLab</span>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xs border border-slate-200 space-y-8 text-slate-700 text-sm leading-relaxed">
        {/* Header */}
        <div className="border-b border-slate-100 pb-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
              Institucional & Metodologia
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Sobre o Projeto TETOFII
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Desenvolvido pelo estúdio de engenharia quantitativa GVLab para trazer rigor matemático e clareza ao investidor de FIIs de Tijolo.
            </p>
          </div>
        </div>

        {/* 1. Nossa Missão */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-700" />
            Nossa Missão
          </h2>
          <p>
            O <strong>TETOFII</strong> nasceu com o propósito de democratizar ferramentas de valuation imobiliário de alta precisão para pessoas físicas que investem em Fundos de Investimento Imobiliário (FIIs) do segmento de Tijolo listados na B3.
          </p>
          <p>
            Tradicionalmente, a análise de custo de oportunidade e taxas de desconto em fundos imobiliários ficava restrita a planilhas financeiras complexas ou relatórios fechados de bancos de investimento. Nossa meta é transformar esses conceitos matemáticos em uma interface rápida, limpa e gratuita para qualquer investidor.
          </p>
        </section>

        {/* 2. Independência Editorial */}
        <section className="space-y-3 p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            Independência Editorial e Neutralidade Matemática
          </h2>
          <p>
            O TETOFII é um projeto totalmente independente:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-slate-700">
            <li>Não temos vínculo societário com gestoras, administradoras ou corretoras de valores.</li>
            <li>Não recebemos remuneração para recomendar ou destacar qualquer fundo específico.</li>
            <li>Todos os cálculos são 100% determinísticos e orientados pelos dados e premissas inseridos pelo próprio usuário.</li>
          </ul>
        </section>

        {/* 3. A Metodologia Quantitativa */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-700" />
            Fundamentos Matemáticos e Econômicos
          </h2>
          <p>
            As ferramentas do TETOFII utilizam três pilares clássicos de finanças corporativas:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 text-xs block mb-1">1. Custo Soberano</span>
              <p className="text-xs text-slate-600">
                Adoção da taxa da NTN-B (Tesouro IPCA+) como o custo de oportunidade livre de risco de crédito do Brasil.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 text-xs block mb-1">2. Prêmio de Risco</span>
              <p className="text-xs text-slate-600">
                Calibragem de spread por segmento físico (galpões 1,5%-2,0%, shoppings 2,0%-2,5%, escritórios 2,5%-3,5%).
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 text-xs block mb-1">3. Dados da CVM</span>
              <p className="text-xs text-slate-600">
                Sincronização com o Portal de Dados Abertos da CVM (Resolução 175) para apuração do VPA oficial.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Guia */}
        <section className="p-5 rounded-2xl bg-gradient-to-r from-emerald-800 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              Quer entender toda a teoria matemática em detalhes?
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Consulte nosso Guia Editorial completo sobre como calcular o Preço Teto, a fórmula de Gordon e armadilhas do P/VP.
            </p>
          </div>
          <button
            type="button"
            onClick={onGoToGuide}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shrink-0 cursor-pointer text-center"
          >
            Acessar Guia de Precificação
          </button>
        </section>

        {/* Contato */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Mantenedor: <strong>GVLab</strong></span>
          <span>Contato: <a href="mailto:suporte@gvlab.com.br" className="underline hover:text-slate-800">suporte@gvlab.com.br</a></span>
        </div>
      </div>
    </div>
  );
};
