import React from 'react';
import { History, ArrowRight, ShieldCheck, AlertCircle, Building, CheckCircle2 } from 'lucide-react';
import { FII_DATABASE, formatCurrency } from '../data/fiiDatabase';

interface TickerMigrationGuideProps {
  onSelectFii: (ticker: string) => void;
}

export const TickerMigrationGuide: React.FC<TickerMigrationGuideProps> = ({ onSelectFii }) => {
  const fundsWithMigration = FII_DATABASE.filter(f => f.previousTickers.length > 0);

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-8 text-slate-700 text-sm leading-relaxed">
      {/* Title */}
      <div className="border-b border-slate-100 pb-6">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
            Histórico B3 & CVM Auditado
          </span>
          <span className="text-xs text-slate-400">Guia Oficial de Migrações e Mudanças de Ticker</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
          Por que Tickers de Fundos Imobiliários Mudam de Código na B3?
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Entenda as razões societárias, trocas de gestoras e expansão de teses de investimento que levaram fundos como <strong>MALL11</strong> a virar <strong>PMLL11</strong>, <strong>SDIL11</strong> a se tornar <strong>TRBL11</strong> e <strong>GALG11</strong> a virar <strong>GARE11</strong>.
        </p>
      </div>

      {/* Overview */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <History className="w-5 h-5 text-emerald-700" />
          1. Os Principais Motivos para Mudança de Ticker
        </h3>
        <p>
          Investidores que acompanham a B3 frequentemente se deparam com comunicados informando que determinado fundo imobiliário passou a ser negociado sob um novo código de 4 letras. Esse processo é formalmente deliberado em Assembleia Geral Extraordinária (AGE) de cotistas e registrado na Comissão de Valores Mobiliários (CVM):
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Troca de Gestão / Branding
            </span>
            <p className="text-xs text-slate-600">
              Ocorreu com o <strong>MALL11</strong>: após a gestão migrar para a <strong>Pátria Investimentos</strong> (Patria - VBI Asset Management), o fundo passou a se chamar <strong>Pátria Malls FII</strong> e o ticker foi alterado para <strong>PMLL11</strong> na B3.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Entrada de Cogestora Estratégica
            </span>
            <p className="text-xs text-slate-600">
              Caso do <strong>SDIL11</strong>: anteriormente conhecido como SDI Rio Bravo Renda Logística, passou a se chamar <strong>Tellus Rio Bravo Renda Logística</strong> e adotou o ticker <strong>TRBL11</strong> em julho de 2023 com a entrada da Tellus na gestão.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Ampliação de Tese e Mandato
            </span>
            <p className="text-xs text-slate-600">
              Caso do <strong>GALG11</strong>: era restrito a galpões logísticos (Guardian Logística). Em fevereiro de 2024, expandiu o mandato para renda urbana e outros ativos imobiliários, alterando seu ticker para <strong>GARE11</strong> (Guardian Real Estate).
            </p>
          </div>
        </div>
      </section>

      {/* Case Study: MALL11 to PMLL11 */}
      <section className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-emerald-900 font-bold text-base">
          <Building className="w-5 h-5 text-emerald-700" />
          <span>Estudo de Caso: A Migração do MALL11 para PMLL11 (Pátria Malls)</span>
        </div>
        <p className="text-xs sm:text-sm text-emerald-950">
          O <strong>Malls Brasil Plural FII</strong> (posteriormente Genial Malls) foi lançado sob o ticker <strong>MALL11</strong>. Após a aquisição e consolidação da gestão pela <strong>Pátria Investimentos</strong> (Patria - VBI), os cotistas aprovaram a nova denominação social para <strong>Pátria Malls FII</strong> e a substituição do ticker na B3 para <strong>PMLL11</strong>.
        </p>
        <p className="text-xs text-emerald-800 font-medium">
          💡 <strong>Resolução Inteligente na Calculadora:</strong> Ao digitar "MALL11", "SDIL11" ou "GALG11", a calculadora identifica o histórico automaticamente, carrega os dados oficiais atualizados na CVM e emite um alerta educativo.
        </p>
      </section>

      {/* Table of Major Historical Migrations */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          Mapeamento dos Casos de Tickers Migrados na B3
        </h3>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <th className="p-3">Ticker Anterior</th>
                <th className="p-3">Ticker Atual na B3</th>
                <th className="p-3">Nome Oficial do Fundo</th>
                <th className="p-3">Gestora</th>
                <th className="p-3 text-right">Preço Atual</th>
                <th className="p-3 text-right">VP por Cota</th>
                <th className="p-3">Motivo da Mudança</th>
                <th className="p-3 text-center">Simular</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fundsWithMigration.map((fund) => (
                <tr key={fund.ticker} className="hover:bg-slate-50/70">
                  <td className="p-3 font-mono font-bold text-amber-700">
                    {fund.previousTickers.join(', ')}
                  </td>
                  <td className="p-3 font-mono font-bold text-emerald-700 text-sm">
                    {fund.ticker}
                  </td>
                  <td className="p-3 font-medium text-slate-800">
                    {fund.name}
                  </td>
                  <td className="p-3 text-slate-600">
                    {fund.management}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-800">
                    {formatCurrency(fund.currentMarketPrice)}
                  </td>
                  <td className="p-3 text-right font-mono font-medium text-slate-700">
                    {formatCurrency(fund.vpPerShare)}
                  </td>
                  <td className="p-3 text-slate-600 text-xs">
                    {fund.tickerChangeReason || fund.notes}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() => onSelectFii(fund.ticker)}
                      className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
                    >
                      Carregar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
