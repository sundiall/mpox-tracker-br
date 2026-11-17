import type { FC } from 'react';
import type { LucideIcon } from 'lucide-react';

interface KPICardProps {
  titulo: string;
  valor: string | number;
  periodo?: string;
  subtexto?: string;
  icon: LucideIcon;
  badge?: {
    texto: string;
    tipo: 'positivo' | 'negativo' | 'alerta' | 'neutro';
  };
  destaqueCor?: 'cyan' | 'red' | 'amber' | 'emerald' | 'purple';
}

export const KPICard: FC<KPICardProps> = ({
  titulo,
  valor,
  periodo,
  subtexto,
  icon: Icon,
  badge,
  destaqueCor = 'cyan'
}) => {
  const colorMap = {
    cyan: 'border-cyan-500/30 bg-cyan-950/20 text-cyan-400',
    red: 'border-red-500/30 bg-red-950/20 text-red-400',
    amber: 'border-amber-500/30 bg-amber-950/20 text-amber-400',
    emerald: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400',
    purple: 'border-purple-500/30 bg-purple-950/20 text-purple-400'
  };

  const badgeColorMap = {
    positivo: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    negativo: 'bg-red-500/20 text-red-300 border-red-500/40',
    alerta: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    neutro: 'bg-slate-800 text-slate-300 border-slate-700'
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4.5 backdrop-blur-md hover:border-slate-700 transition-all shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase">{titulo}</span>
          <div className={`p-2 rounded-xl border shrink-0 ${colorMap[destaqueCor]}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>

        {periodo && (
          <div className="mt-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-cyan-900/40">
              📅 {periodo}
            </span>
          </div>
        )}

        <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 tracking-tight">
          {typeof valor === 'number' ? valor.toLocaleString('pt-BR') : valor}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs pt-2.5 border-t border-slate-800/60">
        <span className="text-slate-400 truncate">{subtexto}</span>
        {badge && (
          <span className={`px-2 py-0.5 rounded-full border text-[11px] font-medium ml-2 ${badgeColorMap[badge.tipo]}`}>
            {badge.texto}
          </span>
        )}
      </div>
    </div>
  );
};
