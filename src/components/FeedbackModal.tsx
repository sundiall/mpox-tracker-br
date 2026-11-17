import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageSquare, 
  Mail, 
  Copy, 
  Check, 
  ShieldCheck,
  ExternalLink 
} from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FeedbackCategory = 
  | 'correcao_dados' 
  | 'sugestao' 
  | 'metodologia' 
  | 'bug' 
  | 'geral';

const CATEGORIES: { id: FeedbackCategory; label: string; icon: string }[] = [
  { id: 'correcao_dados', label: 'Correção ou Inconsistência de Dados', icon: '📊' },
  { id: 'sugestao', label: 'Sugestão de Funcionalidade / Melhoria', icon: '💡' },
  { id: 'metodologia', label: 'Dúvida Metodológica ou Fontes', icon: '🔬' },
  { id: 'bug', label: 'Relato de Bug Técnico ou Visual', icon: '🐞' },
  { id: 'geral', label: 'Contato Geral / Parceria Acadêmica', icon: '✉️' }
];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [category, setCategory] = useState<FeedbackCategory>('correcao_dados');
  const [message, setMessage] = useState('');
  const [userContact, setUserContact] = useState('');
  const [copied, setCopied] = useState(false);

  // Fechar com tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentCategoryLabel = CATEGORIES.find((c) => c.id === category)?.label || 'Feedback';

  const formatFeedbackBody = () => {
    const lines = [
      `[Mpox Brasil - Relato de Usuário/Pesquisador]`,
      `Categoria: ${currentCategoryLabel}`,
      `Data/Hora: ${new Date().toLocaleString('pt-BR')}`,
      userContact ? `Contato informado: ${userContact}` : `Contato: Não informado (anônimo)`,
      `Navegador: ${navigator.userAgent}`,
      ``,
      `--- MENSAGEM / OBSERVAÇÃO ---`,
      message.trim() || '(Nenhuma mensagem detalhada inserida)',
      ``,
      `--- FIM DO RELATO ---`
    ];
    return lines.join('\n');
  };

  const handleCopy = async () => {
    const text = formatFeedbackBody();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  const handleMailto = () => {
    const subject = encodeURIComponent(`[Mpox Brasil Feedback] ${currentCategoryLabel}`);
    const body = encodeURIComponent(formatFeedbackBody());
    window.open(`mailto:357946931+sundiall@users.noreply.github.com?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabeçalho */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 id="feedback-modal-title" className="text-sm font-bold text-white flex items-center gap-2">
                Feedback & Contato com o Desenvolvedor
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  BETA
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Canal direto e seguro para sugestões, correções ou dúvidas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar janela"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs">
          {/* Aviso de Privacidade e Segurança */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 text-slate-400 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong className="text-slate-200">Privacidade Preservada:</strong> Não armazenamos cookies de rastreamento nem registramos dados sensíveis. O feedback é encaminhado com segurança para o e-mail oficial do mantenedor (<code className="text-cyan-300 font-mono text-[10px]">357946931+sundiall@users.noreply.github.com</code>) ou via GitHub Issues.
            </div>
          </div>

          {/* Categoria do Feedback */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-200 text-xs">
              Qual é o objetivo do seu contato?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-center gap-2 ${
                    category === cat.id
                      ? 'bg-cyan-950/70 border-cyan-500/70 text-cyan-200 font-medium'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span className="leading-tight text-[11px]">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Campo de Mensagem (Generous Size per Rule 18) */}
          <div className="space-y-1.5">
            <label htmlFor="feedback-message" className="font-semibold text-slate-200 text-xs flex justify-between">
              <span>Sua mensagem ou observação detalhada:</span>
              <span className="text-slate-500 font-normal">Mínimo 10 caracteres</span>
            </label>
            <textarea
              id="feedback-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ex: Identifiquei que na SE 44 os casos do meu estado divergem da tabela do boletim epidemiológico municipal... ou: Sugiro adicionar..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 text-xs min-h-[90px] resize-y"
            />
          </div>

          {/* Campo Opcional de Contato / E-mail */}
          <div className="space-y-1">
            <label htmlFor="feedback-contact" className="font-semibold text-slate-200 text-xs flex items-center justify-between">
              <span>Seu e-mail ou nome (opcional):</span>
              <span className="text-slate-500 text-[10px]">Apenas caso deseje resposta direta</span>
            </label>
            <input
              id="feedback-contact"
              type="text"
              value={userContact}
              onChange={(e) => setUserContact(e.target.value)}
              placeholder="exemplo@pesquisador.org ou @usuario"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 text-xs"
            />
          </div>

          {copied && (
            <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Mensagem e metadados copiados para a área de transferência com sucesso!</span>
            </div>
          )}
        </div>

        {/* Rodapé com Ações Claras */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-950/70 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copiar</span>
            </button>
            <a
              href="https://github.com/sundiall/mpox-tracker-br/issues"
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>GitHub Issues</span>
            </a>
          </div>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 text-xs font-medium transition-colors"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={handleMailto}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Enviar via E-mail</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
