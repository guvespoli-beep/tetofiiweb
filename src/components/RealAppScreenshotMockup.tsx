import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export const RealAppScreenshotMockup: React.FC = () => {
  return (
    <div className="w-full bg-[#0a0f1d] text-white font-sans text-left select-none p-3.5 space-y-3.5">
      {/* Botão + Cadastrar Ativo */}
      <div className="pt-1">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00b074] hover:bg-[#009e67] text-white text-xs font-bold shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Cadastrar Ativo</span>
        </button>
      </div>

      {/* CARD 1: HGBS11 */}
      <div className="bg-[#101728] rounded-xl p-3 border border-slate-800/80 shadow-md space-y-2.5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-wide text-white">HGBS11</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#00b074]/20 text-[#00d084] border border-[#00b074]/30">
                +0,60%
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate max-w-[180px]">
              HEDGE Brasil Shopping Fundo de Investimen...
            </p>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Edit2 className="w-3 h-3 hover:text-slate-200 cursor-pointer" />
            <Trash2 className="w-3 h-3 hover:text-rose-400 cursor-pointer" />
          </div>
        </div>

        {/* Caixa de Preço Atual & Preço Teto */}
        <div className="bg-[#0b101e] rounded-lg p-2 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 block">
              2. PREÇO ATUAL
            </span>
            <span className="text-sm font-black font-mono text-white">
              R$ 18,48
            </span>
          </div>
          <div className="text-right">
            <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 block">
              3. PREÇO TETO
            </span>
            <span className="text-sm font-black font-mono text-[#00d084]">
              R$ 19,96
            </span>
          </div>
        </div>

        {/* Métricas e Tags */}
        <div className="space-y-1 text-[10px]">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">4. Análise Preço Teto:</span>
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#004d36] text-[#00e599] border border-[#007050]">
              Abaixo do Preço Teto
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">5. P.Atual / P. Teto:</span>
            <span className="font-mono font-bold text-slate-200">0,93</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">6. Análise VP:</span>
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#004d36] text-[#00e599] border border-[#007050]">
              Abaixo do VP por Cota
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">7. P/VP:</span>
            <span className="font-mono font-bold text-slate-200">0,92</span>
          </div>
        </div>

        {/* Rodapé do Ativo */}
        <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[8px] text-slate-400 font-mono">
          <span>VP: R$ 20,18</span>
          <span>Prêmio: 2.6%</span>
          <span>Prov: R$ 0,17</span>
        </div>
      </div>

      {/* CARD 2: FATN11 */}
      <div className="bg-[#101728] rounded-xl p-3 border border-slate-800/80 shadow-md space-y-2.5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-wide text-white">FATN11</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#00b074]/20 text-[#00d084] border border-[#00b074]/30">
                +0,68%
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate max-w-[180px]">
              BRC Renda Corporativa FII - FII Athena I
            </p>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Edit2 className="w-3 h-3 hover:text-slate-200 cursor-pointer" />
            <Trash2 className="w-3 h-3 hover:text-rose-400 cursor-pointer" />
          </div>
        </div>

        {/* Caixa de Preço Atual & Preço Teto */}
        <div className="bg-[#0b101e] rounded-lg p-2 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 block">
              2. PREÇO ATUAL
            </span>
            <span className="text-sm font-black font-mono text-white">
              R$ 83,20
            </span>
          </div>
          <div className="text-right">
            <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 block">
              3. PREÇO TETO
            </span>
            <span className="text-sm font-black font-mono text-[#00d084]">
              R$ 90,40
            </span>
          </div>
        </div>

        {/* Métricas e Tags */}
        <div className="space-y-1 text-[10px]">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">4. Análise Preço Teto:</span>
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#004d36] text-[#00e599] border border-[#007050]">
              Abaixo do Preço Teto
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">5. P.Atual / P. Teto:</span>
            <span className="font-mono font-bold text-slate-200">0,92</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">6. Análise VP:</span>
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#004d36] text-[#00e599] border border-[#007050]">
              Abaixo do VP por Cota
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">7. P/VP:</span>
            <span className="font-mono font-bold text-slate-200">0,86</span>
          </div>
        </div>

        {/* Rodapé do Ativo */}
        <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[8px] text-slate-400 font-mono">
          <span>VP: R$ 97,23</span>
          <span>Prêmio: 3%</span>
          <span>Prov: R$ 0,80</span>
        </div>
      </div>
    </div>
  );
};
