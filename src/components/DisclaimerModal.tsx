import React from 'react';
import { ShieldAlert, CheckCircle2, Info } from 'lucide-react';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (dontShowAgain: boolean) => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({
  isOpen,
  onClose,
  onAccept,
}) => {
  const [dontShowAgain, setDontShowAgain] = React.useState(false);

  if (!isOpen) return null;

  const disclaimerText =
    "Esta ferramenta possui caráter exclusivamente educativo e de simulação matemática. Os cálculos dependem integralmente das premissas e dados inseridos pelo usuário. Não constitui relatório de análise, indicação de compra ou venda, nem recomendação de investimentos.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden transform transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="disclaimer-title"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 px-6 py-5 text-white flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-xl">
            <ShieldAlert className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <h3 id="disclaimer-title" className="text-lg font-bold tracking-tight">
              Aviso Importante e Termo de Isenção
            </h3>
            <p className="text-xs text-emerald-200">
              Leia com atenção antes de utilizar a calculadora
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200/80 text-amber-950 text-sm leading-relaxed">
            <div className="flex gap-2.5 items-start">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="font-semibold leading-relaxed">
                "{disclaimerText}"
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>
              • Os valores patrimoniais (VP) são baseados nos últimos informes estruturados reportados à CVM e devem ser conferidos pelo investidor.
            </p>
            <p>
              • A taxa de referência e o prêmio de risco são estimativas de custo de oportunidade e variam de acordo com o perfil e objetivos de cada investidor.
            </p>
            <p>
              • Rentabilidade passada não representa garantia de rentabilidade futura. Fundos de tijolo possuem riscos de vacância, despesas e variações de mercado.
            </p>
          </div>

          {/* Checkbox remember */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-3 cursor-pointer select-none text-xs text-slate-600 hover:text-slate-900">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-pointer"
              />
              <span>Não exibir este aviso novamente neste dispositivo</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => onAccept(dontShowAgain)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm shadow-sm transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Entendi e Concordo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
