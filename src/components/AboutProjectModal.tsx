import React from 'react';
import {
  Building2,
  ShieldCheck,
  Calculator,
  Mail,
  ExternalLink,
  Target,
  Sparkles,
  Users,
  Award,
  Layers
} from 'lucide-react';

interface AboutProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToGuide?: () => void;
}

export const AboutProjectModal: React.FC<AboutProjectModalProps> = ({
  isOpen,
  onClose,
  onGoToGuide,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 text-slate-700 text-sm leading-relaxed"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Sobre o TETOFII</h2>
              <p className="text-xs text-slate-500">
                Iniciativa de Modelagem Quantitativa e Educação Financeira
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-lg font-bold"
            aria-label="Fechar modal"
          >
            ✕
          </button>
        </div>

        {/* Missão */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-700" />
            Nossa Missão
          </h3>
          <p>
            O <strong>TETOFII</strong> foi desenvolvido para democratizar ferramentas de precificação imobiliária de alta precisão e prover uma curadoria transparente de informações para pessoas físicas que investem em Fundos Imobiliários de Tijolo listados na bolsa de valores brasileira (B3).
          </p>
          <p>
            Tradicionalmente, cálculos que confrontam a taxa do título público federal (Tesouro IPCA+ / NTN-B) com o retorno em dividendos ficavam restritos a relatórios pagos de analistas ou planilhas complexas. O TETOFII oferece uma interface limpa, rápida e 100% gratuita para que qualquer investidor descubra o limite racional a pagar por cotas imobiliárias, além de acompanhar destaques de relatórios gerenciais e notícias do mercado na seção <strong>FIIque Informado</strong>.
          </p>
        </div>

        {/* Metodologia e Independência */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% Independente
            </div>
            <p className="text-xs text-slate-600">
              Não vendemos cotas, não somos assessores vinculados a corretoras e não recebemos comissão de gestoras ou administradores fiduciários. Nossas fórmulas são matemáticas e neutras.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
              <Calculator className="w-4 h-4 text-emerald-600" />
              Fontes Públicas e Oficiais
            </div>
            <p className="text-xs text-slate-600">
              Utilizamos dados públicos da B3 (cotações de mercado via Yahoo Finance), informes mensais e laudos periciais registrados na CVM e as taxas oficiais divulgadas diariamente pelo Tesouro Nacional.
            </p>
          </div>
        </div>

        {/* Quem Somos / GVLab */}
        <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
          <div className="flex items-center gap-2 font-bold text-emerald-950 text-sm">
            <Users className="w-4 h-4 text-emerald-700" />
            Desenvolvido por GVLab
          </div>
          <p className="text-xs text-emerald-900 leading-relaxed">
            A <strong>GVLab</strong> é um estúdio de engenharia de software e pesquisa quantitativa focado em criar aplicações web e mobile de alto impacto visual e rigor matemático para o mercado brasileiro.
          </p>
        </div>

        {/* Contato e Transparência */}
        <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Mail className="w-4 h-4 text-emerald-700" />
            <span>Fale com os desenvolvedores:</span>
            <a href="mailto:suporte@gvlab.com.br" className="font-semibold text-slate-800 underline hover:text-emerald-700">
              suporte@gvlab.com.br
            </a>
          </div>

          <div className="flex items-center gap-3">
            {onGoToGuide && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onGoToGuide();
                }}
                className="text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                Ler Guia Completo →
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
