import { useEffect } from 'react';
import type { FC } from 'react';
import type { StateEpidemiology } from '../data/epidemiology';
import { vaccinationSites } from '../data/vaccination_sites';
import { officialAlerts } from '../data/alerts';
import { 
  X, 
  MapPin, 
  Phone, 
  Clock, 
  ShieldAlert, 
  Building2 
} from 'lucide-react';

interface StateDrilldownModalProps {
  state: StateEpidemiology | null;
  onClose: () => void;
}

export const StateDrilldownModal: FC<StateDrilldownModalProps> = ({ state, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!state) return null;

  const localSites = vaccinationSites.filter((s) => s.uf === state.uf);
  const localAlerts = officialAlerts.filter((a) => a.ufRelacionada === state.uf || a.ufRelacionada === 'Nacional');

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="state-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
    >
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header do Modal */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-300 font-bold font-mono text-base">
              {state.uf}
            </span>
            <div>
              <h3 id="state-modal-title" className="text-lg font-bold text-white leading-tight">
                {state.nome} — Painel Estadual de Vigilância
              </h3>
              <p className="text-xs text-slate-400">
                Região {state.regiao} • Notificações consolidadas e rede assistencial
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar modal"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo com Scroll */}
        <div className="p-5 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Métricas Principais da UF */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase">Casos Confirmados</span>
              <span className="text-lg font-bold text-white block">{state.casosConfirmados.toLocaleString('pt-BR')}</span>
              <span className="text-[10px] text-slate-500">{state.casosProvaveis} prováveis</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase">Total de Óbitos</span>
              <span className="text-lg font-bold text-rose-400 block">{state.obitos}</span>
              <span className="text-[10px] text-slate-500">Letalidade: {state.taxaLetalidade.toFixed(2)}%</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase">Doses Aplicadas</span>
              <span className="text-lg font-bold text-emerald-400 block">{state.dosesAplicadas.toLocaleString('pt-BR')}</span>
              <span className="text-[10px] text-slate-500">de {state.dosesDistribuidas.toLocaleString('pt-BR')} enviadas</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase">Tendência</span>
              <span className="text-sm font-bold text-cyan-300 capitalize block pt-1">
                {state.tendencia}
              </span>
              <span className="text-[10px] text-slate-500">Vigilância epidemiológica</span>
            </div>
          </div>

          {/* Centros de Referência na UF */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                Centros de Referência & Vacinação em {state.nome} ({localSites.length})
              </h4>
            </div>

            {localSites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {localSites.map((site) => (
                  <div key={site.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white text-xs">{site.nomeUnidade}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-teal-300">
                        {site.tipo}
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-400">
                      <p className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                        <span>{site.endereco} — {site.municipio}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="text-slate-300">{site.telefone}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{site.horarioFuncionamento}</span>
                      </p>
                    </div>

                    <p className="text-[11px] text-cyan-200/90 bg-cyan-950/30 p-2 rounded-lg border border-cyan-800/40">
                      <strong>Acesso: </strong>{site.agendamento}. {site.observacoes}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-center">
                Os postos de vacinação neste estado são centralizados no CRIE ou na Secretaria Estadual de Saúde.
              </div>
            )}
          </div>

          {/* Alertas Oficiais Recentes para esta UF */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Comunicados e Notas Oficiais Aplicáveis
            </h4>
            <div className="space-y-2">
              {localAlerts.slice(0, 2).map((alert) => (
                <div key={alert.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{alert.titulo}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{alert.dataPublicacao}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{alert.resumo}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer do Modal */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Fechar Painel
          </button>
        </div>
      </div>
    </div>
  );
};
