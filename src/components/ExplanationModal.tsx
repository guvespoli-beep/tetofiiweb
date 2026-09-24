import React from 'react';
import { X, ExternalLink, HelpCircle, BookOpen, Lightbulb, Calculator as CalcIcon } from 'lucide-react';
import { ExplanationTopic } from '../types';
import { EXPLANATION_TOPICS } from '../data/explanations';

interface ExplanationModalProps {
  topicId: string | null;
  onClose: () => void;
}

export const ExplanationModal: React.FC<ExplanationModalProps> = ({
  topicId,
  onClose,
}) => {
  if (!topicId) return null;

  const topic: ExplanationTopic | undefined = EXPLANATION_TOPICS[topicId];
  if (!topic) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden transform transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="topic-title"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-block px-2 py-0.5 text-[11px] font-semibold bg-emerald-500/30 text-emerald-300 rounded mb-1">
                {topic.badge}
              </div>
              <h3 id="topic-title" className="text-base sm:text-lg font-bold">
                {topic.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700 text-sm leading-relaxed">
          {/* Summary */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-emerald-950 font-medium">
            {topic.summary}
          </div>

          {/* Detailed Paragraphs */}
          <div className="space-y-2.5">
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400">
              Conceito e Aplicação Prática
            </h4>
            {topic.detailedContent.map((paragraph, idx) => (
              <p key={idx} className="text-slate-600">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Formula Box if available */}
          {topic.formula && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <CalcIcon className="w-4 h-4 text-emerald-600" />
                <span>Fórmula Matemática Aplicada</span>
              </div>
              <div className="font-mono text-sm sm:text-base font-semibold text-emerald-800 bg-white p-2.5 rounded-lg border border-slate-200 overflow-x-auto">
                {topic.formula}
              </div>
              {topic.formulaDescription && (
                <p className="text-xs text-slate-500">
                  {topic.formulaDescription}
                </p>
              )}
            </div>
          )}

          {/* Example if available */}
          {topic.example && (
            <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>{topic.example.title}</span>
              </div>
              <p className="text-xs text-amber-950 font-medium">
                {topic.example.scenario}
              </p>
              <div className="p-2.5 bg-white/80 rounded-lg text-xs font-semibold text-amber-900 border border-amber-200/60">
                Resultado: {topic.example.result}
              </div>
            </div>
          )}

          {/* External Links (like Tesouro Direto) */}
          {topic.externalLinks && topic.externalLinks.length > 0 && (
            <div className="pt-2 border-t border-slate-200 space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400">
                Links e Fontes Oficiais
              </h4>
              {topic.externalLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 rounded-xl border border-emerald-200 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-emerald-900 group-hover:text-emerald-950 flex items-center gap-2">
                      {link.label}
                      <ExternalLink className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                  {link.description && (
                    <p className="text-xs text-emerald-700/90 mt-1">
                      {link.description}
                    </p>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            TETOFII • Conteúdo Educativo
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export const QuestionButton: React.FC<{
  topicId: string;
  onClick: (topicId: string) => void;
  className?: string;
}> = ({ topicId, onClick, className = '' }) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick(topicId);
      }}
      title="Clique para ver a explicação detalhada deste cálculo"
      aria-label="Ajuda e explicação sobre este campo"
      className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-200/80 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 transition-all cursor-pointer text-xs font-semibold shrink-0 ${className}`}
    >
      <HelpCircle className="w-3.5 h-3.5" />
    </button>
  );
};
