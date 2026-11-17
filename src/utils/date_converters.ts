/**
 * Utilitários de conversão de Semanas Epidemiológicas (Padrão Sinan / Ministério da Saúde / OMS)
 * para datas civis comuns (Dia, Mês e Ano).
 */

const MONTH_NAMES_SHORT = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

/**
 * Retorna o primeiro domingo correspondente ao início da SE 01 para um determinado ano.
 */
export function getFirstDayOfEpidemiologicalYear(year: number): Date {
  const jan1 = new Date(year, 0, 1);
  const dayOfWeek = jan1.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado

  // Se 1 de janeiro for Domingo a Quarta (0, 1, 2, 3), o início é o domingo anterior ou mesmo dia
  // Se for Quinta a Sábado (4, 5, 6), a SE 01 inicia no primeiro domingo subsequente
  if (dayOfWeek <= 3) {
    const diff = -dayOfWeek;
    return new Date(year, 0, 1 + diff);
  } else {
    const diff = 7 - dayOfWeek;
    return new Date(year, 0, 1 + diff);
  }
}

/**
 * Retorna o intervalo civil (início no domingo, fim no sábado) para uma semana epidemiológica.
 */
export function getEpidemiologicalWeekDateRange(ano: number, semanaNum: number): {
  startDate: Date;
  endDate: Date;
  dataInicioFormatada: string;
  dataFimFormatada: string;
  rotuloMesAno: string;
  rotuloIntervalo: string;
  isConcluida: boolean;
} {
  const se1Start = getFirstDayOfEpidemiologicalYear(ano);
  const startDate = new Date(se1Start.getTime() + (semanaNum - 1) * 7 * 86400000);
  const endDate = new Date(startDate.getTime() + 6 * 86400000 + (23 * 3600000 + 59 * 60000 + 59000));

  const pad = (n: number) => n.toString().padStart(2, '0');
  const dStart = `${pad(startDate.getDate())}/${pad(startDate.getMonth() + 1)}`;
  const dEnd = `${pad(endDate.getDate())}/${pad(endDate.getMonth() + 1)}/${endDate.getFullYear()}`;

  const rotuloMesAno = `${MONTH_NAMES_SHORT[startDate.getMonth()]}/${startDate.getFullYear().toString().slice(-2)}`;
  const rotuloIntervalo = `${dStart} a ${dEnd}`;

  // Verifica se a semana já terminou em relação à data atual
  const now = new Date();
  const isConcluida = now.getTime() > endDate.getTime();

  return {
    startDate,
    endDate,
    dataInicioFormatada: dStart,
    dataFimFormatada: dEnd,
    rotuloMesAno,
    rotuloIntervalo,
    isConcluida
  };
}

/**
 * Converte uma chave de semana epidemiológica ("2022-SE25") para um rótulo amigável em data comum.
 */
export function formatWeekToCommonDate(semanaStr: string, format: 'mes_ano' | 'intervalo_completo' | 'dia_mes' = 'mes_ano'): string {
  const match = semanaStr.match(/^(\d{4})-SE(\d{1,2})$/);
  if (!match) return semanaStr;

  const ano = parseInt(match[1], 10);
  const semanaNum = parseInt(match[2], 10);
  const { rotuloMesAno, rotuloIntervalo, dataInicioFormatada } = getEpidemiologicalWeekDateRange(ano, semanaNum);

  if (format === 'intervalo_completo') {
    return `${rotuloIntervalo} (SE ${semanaNum}/${ano})`;
  }
  if (format === 'dia_mes') {
    return `${dataInicioFormatada} (${rotuloMesAno})`;
  }
  return rotuloMesAno;
}
