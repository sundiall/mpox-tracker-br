import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { 
  Rss, 
  ExternalLink, 
  Search,
  Sparkles
} from 'lucide-react';
import { officialAlerts } from '../data/alerts';
import type { OfficialAlert } from '../data/alerts';

interface AlertsRSSViewProps {
  selectedUF: string | null;
}

export const AlertsRSSView: FC<AlertsRSSViewProps> = ({
  selectedUF
}) => {
  const [categoriaFilter, setCategoriaFilter] = useState('todas');
  const [search, setSearch] = useState('');
  const [alerts, setAlerts] = useState<OfficialAlert[]>(officialAlerts);
  const [isLiveSynced, setIsLiveSynced] = useState<boolean>(false);

  useEffect(() => {
    fetch('/data/alerts.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setAlerts(data);
          setIsLiveSynced(true);
        }
      })
      .catch(() => {});
  }, []);

  const filteredAlerts = alerts.filter((alert) => {
    const matchesUF = !selectedUF || alert.ufRelacionada === 'Nacional' || alert.ufRelacionada === selectedUF;
    const matchesCat = categoriaFilter === 'todas' || alert.categoria === categoriaFilter;
    const matchesSearch =
      alert.titulo.toLowerCase().includes(search.toLowerCase()) ||
      alert.resumo.toLowerCase().includes(search.toLowerCase()) ||
      alert.orgaoEmissor.toLowerCase().includes(search.toLowerCase());

    return matchesUF && matchesCat && matchesSearch;
  });

  const getTipoStyle = (tipo: OfficialAlert['tipo']) => {
    switch (tipo) {
      case 'alerta_urgente':
        return 'bg-red-500/15 text-red-300 border-red-500/40';
      case 'disponibilidade_vacina':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40';
      case 'nota_tecnica':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/40';
      case 'avanco_cientifico':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-orange-950/40 via-slate-900 to-amber-950/40 border border-orange-800/30 rounded-2xl p-5 backdrop-blur-md">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/40 flex items-center gap-1.5">
              <Rss className="w-3.5 h-3.5" />
              Feed Oficial & Monitoramento de Notícias
            </span>
            <span className="text-xs text-slate-400">Atualizações de Órgãos Sanitários</span>
            {isLiveSynced && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                Sincronizado em Tempo Real
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Avisos de Disponibilidade, Notas Técnicas & Vigilância
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Agregação contínua de publicações oficiais do Ministério da Saúde, Fiocruz, Anvisa e Secretarias Estaduais de Saúde (SES),
            com foco em avisos de reposição de lotes de vacinas e avanços científicos sobre o vírus da mpox.
          </p>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-md space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar comunicados, vacinas, cidades..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {['todas', 'Imunização', 'Vigilância', 'Pesquisa e Ensaios'].map((c) => (
              <button
                key={c}
                onClick={() => setCategoriaFilter(c)}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${
                  categoriaFilter === c
                    ? 'bg-orange-600 text-white border-orange-500 font-semibold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {c === 'todas' ? 'Todas' : c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Alertas */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md hover:border-slate-700 transition-all text-xs space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-300 font-mono">
                  {new Date(alert.dataPublicacao).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
                <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${getTipoStyle(alert.tipo)}`}>
                  {alert.categoria}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-medium">
                  {alert.orgaoEmissor}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-950 text-[10px] text-cyan-300 font-mono border border-slate-800">
                  {alert.ufRelacionada}
                </span>
              </div>
            </div>

            <h3 className="font-bold text-white text-sm sm:text-base leading-snug">
              {alert.titulo}
            </h3>

            <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
              {alert.resumo}
            </p>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Fonte: Portal Oficial do Órgão Emissor
              </span>
              <a
                href={alert.linkOficial}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-orange-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                Acessar Nota Oficial <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Seção Futura / Evolutiva de Desenvolvimentos Científicos */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 text-xs space-y-3">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
          <Sparkles className="w-4 h-4" />
          <span>Módulo Evolutivo: Vigilância Genômica & Próximas Pesquisas</span>
        </div>
        <p className="text-slate-400 leading-relaxed">
          Esta plataforma foi concebida para ser continuamente expandida com a evolução da literatura científica
          e novos comunicados do Centro de Operações de Emergência (COE Mpox). Conforme novos antivirais (ex.: tecovirimat)
          e novas formulações vacinais forem analisados pela ANVISA, os dados serão incorporados diretamente ao nosso pipeline.
        </p>
      </div>
    </div>
  );
};
