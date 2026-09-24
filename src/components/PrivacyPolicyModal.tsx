import React from 'react';
import { X, ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                Política de Privacidade e Termos de Uso
              </h3>
              <p className="text-xs text-slate-300">
                Conformidade com Google AdSense, LGPD e Diretrizes de Transparência
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              1. Caráter Educativo e Isenção de Responsabilidade
            </h4>
            <p>
              Esta ferramenta possui caráter exclusivamente educativo e de simulação matemática. Os cálculos dependem integralmente das premissas e dados inseridos pelo usuário. Não constitui relatório de análise, indicação de compra ou venda, nem recomendação de investimentos. O usuário é o único responsável por suas decisões de alocação de capital e investimentos no mercado imobiliário.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              2. Coleta de Dados e Privacidade
            </h4>
            <p>
              Nossa aplicação opera com processamento local no navegador do usuário (Client-Side). Os valores digitados de proventos, taxas e VP não são armazenados em servidores externos nem compartilhados com terceiros.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-600" />
              3. Cookies de Publicidade e Google AdSense (DART Cookies)
            </h4>
            <p>
              Em conformidade com as diretrizes do Google AdSense:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>
                Fornecedores terceiros, incluindo o Google, utilizam cookies para veicular anúncios com base em visitas anteriores dos usuários a este ou a outros sites na internet.
              </li>
              <li>
                Com o uso de cookies de publicidade, o Google e seus parceiros podem veicular anúncios personalizados aos visitantes deste site com base nas visitas realizadas.
              </li>
              <li>
                Os usuários podem desativar a publicidade personalizada acessando as <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-semibold">Configurações de Anúncios do Google</a> ou através do site <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-semibold">www.aboutads.info</a>.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900">
              4. Dados de Referência e Informes da CVM
            </h4>
            <p>
              Os dados de Valor Patrimonial por cota (VP), tickers anteriores e informes mensais são compilados a partir de fontes públicas e documentos disponibilizados pelos administradores dos fundos na CVM e na B3. Embora envidemos esforços contínuos para manter as bases atualizadas, não garantimos a inexistência de defasagens pontuais decorrentes de novas emissões ou laudos recentes de reavaliação.
            </p>
          </section>

          <section className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <h4 className="text-sm font-bold text-slate-900">
              5. Contato, Dúvidas e Encarregado (LGPD)
            </h4>
            <p>
              Caso tenha dúvidas sobre este documento, queira relatar divergências de dados em algum fundo, solicitar esclarecimentos sobre o tratamento de informações ou enviar sugestões, entre em contato com nossa equipe pelo e-mail oficial:{' '}
              <a href="mailto:suporte@gvlab.com.br" className="font-semibold text-emerald-700 underline">
                suporte@gvlab.com.br
              </a>.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-800 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
