export interface ScientificReference {
  autores: string;
  ano: number;
  titulo: string;
  periodico: string;
  doi?: string;
  url: string;
  relevancia: string;
}

export interface FAQItem {
  id: string;
  categoria: 'transmissao' | 'sintomas' | 'vacina' | 'cuidados' | 'tratamento';
  pergunta: string;
  resposta: string;
  destaque?: string;
  referencias?: ScientificReference[];
}

export interface ClinicalStage {
  fase: string;
  periodoDias: string;
  descricao: string;
  sinaisPrincipais: string[];
  nivelTransmissibilidade: 'Início de Risco' | 'Risco Máximo' | 'Risco em Declínio' | 'Não Transmissível';
  alertaCuidados: string;
}

export const clinicalStages: ClinicalStage[] = [
  {
    fase: '1. Período de Incubação',
    periodoDias: '3 a 21 dias (média de 6 a 13 dias)',
    descricao: 'Tempo decorrido entre o contato com o vírus e o aparecimento dos primeiros sintomas clínicos. O vírus se multiplica nos gânglios linfáticos regionais antes de atingir a corrente sanguínea.',
    sinaisPrincipais: ['Assintomático', 'Sem lesões visíveis', 'Sem febre nesta fase'],
    nivelTransmissibilidade: 'Início de Risco',
    alertaCuidados: 'Embora a transmissão assintomática seja rara, a vigilância de sintomas é fundamental caso você tenha tido contato desprotegido com alguém diagnosticado.'
  },
  {
    fase: '2. Fase Prodrômica (Início Sistêmico)',
    periodoDias: 'Dias 1 a 3 do início dos sintomas',
    descricao: 'Primeiros sinais sistêmicos da infecção. A linfadenopatia (gânglios ou ínguas inchadas e dolorosas na região do pescoço, axilas e virilha) é o marco diagnóstico diferencial contra catapora e varíola clássica.',
    sinaisPrincipais: [
      'Febre súbita (> 38,5°C)',
      'Linfadenopatia acentuada (ínguas cervicais, inguinais e axilares)',
      'Cefaleia intensa (dor de cabeça frontal)',
      'Mialgia e dor lombar intensa',
      'Fadiga extrema / exaustão'
    ],
    nivelTransmissibilidade: 'Risco Máximo',
    alertaCuidados: 'O vírus já está presente na orofaringe e em mucosas. Inicie isolamento imediato e use máscara cirúrgica caso precise sair para atendimento médico.'
  },
  {
    fase: '3. Fase Eruptiva / Lesões Cutâneas',
    periodoDias: 'Dias 4 a 14',
    descricao: 'Desenvolvimento das lesões na pele e mucosas. A erupção progride de forma sincrônica: Máculas (manchas planas) → Pápulas (lesões elevadas sólidas) → Vesículas (pequenas bolhas com líquido transparente) → Pústulas (bolhas com líquido turvo/amarelado com umbilicação central característica).',
    sinaisPrincipais: [
      'Lesões em áreas genitais, perianais e orais (frequentes na transmissão íntima)',
      'Lesões na face, palmas das mãos e solas dos pés',
      'Sensação de queimação, prurido (coceira) intensa e dor local',
      'Dor retal intensa ou proctite em casos com acometimento anorretal'
    ],
    nivelTransmissibilidade: 'Risco Máximo',
    alertaCuidados: 'O fluido das vesículas e pústulas possui carga viral altíssima. NÃO estourar, espremer ou coçar as lesões. Mantenha as lesões cobertas com curativo limpo e use roupas folgadas.'
  },
  {
    fase: '4. Formação e Descolamento de Crostas',
    periodoDias: 'Dias 14 a 28 (ou até 4 semanas)',
    descricao: 'As pústulas secam e formam crostas escuras que vão se desprendendo gradualmente. A cicatrização é completa quando todas as crostas caem espontaneamente, revelando uma nova camada de pele íntegra reepitelizada.',
    sinaisPrincipais: [
      'Crostas secas e duras',
      'Descamação cutânea',
      'Despigmentação ou hipocromia temporária no local cicatrizado'
    ],
    nivelTransmissibilidade: 'Risco em Declínio',
    alertaCuidados: 'CRÍTICO: A pessoa AINDA É TRANSMISSÍVEL enquanto houver mesmo que uma única crosta remanescente. O isolamento só deve ser encerrado após a queda total de todas as crostas.'
  },
  {
    fase: '5. Cura e Reepitelização Completa',
    periodoDias: 'Após a queda de 100% das crostas',
    descricao: 'Pele reepitelizada, sem feridas abertas e sem crostas residuais.',
    sinaisPrincipais: ['Pele nova formada', 'Resolução dos sintomas sistêmicos'],
    nivelTransmissibilidade: 'Não Transmissível',
    alertaCuidados: 'Liberação do isolamento. Recomenda-se uso de preservativo nas relações sexuais por até 12 semanas pós-cura como medida de precaução adicional para fluidos genitais.'
  }
];

export const scientificReferences: ScientificReference[] = [
  {
    autores: 'Frey SE, Newman FK, Kennedy JS, et al.',
    ano: 2015,
    titulo: 'Comparison of lyophilized versus liquid modified vaccinia Ankara (MVA-BN) formulations, and evaluation of alternative routes of administration',
    periodico: 'Vaccine (NIH / NIAID Trial)',
    doi: '10.1016/j.vaccine.2015.06.025',
    url: 'https://pubmed.ncbi.nlm.nih.gov/26143613/',
    relevancia: 'Ensaio clínico fundamental que demonstrou que a via intradérmica de 0,1 mL (1/5 da dose subcutânea padrão) induz títulos de anticorpos neutralizantes equivalentes e taxa de soroconversão não inferior a 0,5 mL subcutânea, embasando a estratégia brasileira e do Rio de Janeiro.'
  },
  {
    autores: 'Thornhill JP, Barkati S, Walmsley S, et al.',
    ano: 2022,
    titulo: 'Monkeypox Virus Infection in Humans across 16 Countries — April–June 2022',
    periodico: 'The New England Journal of Medicine (NEJM)',
    doi: '10.1056/NEJMoa2207323',
    url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa2207323',
    relevancia: 'Estudo seminal sobre a dinâmica de transmissão interpessoal no surto global, documentando que 98% dos casos foram em homens cisgênero gays, bissexuais e HSH, destacando a transmissão por contato físico íntimo e a prevalência de lesões anogenitais.'
  },
  {
    autores: 'World Health Organization (WHO)',
    ano: 2024,
    titulo: 'Mpox (monkeypox) — Fact sheet and Global Strategic Preparedness and Response Plan',
    periodico: 'WHO Guidelines & Surveillance Standards',
    url: 'https://www.who.int/news-room/fact-sheets/detail/monkeypox',
    relevancia: 'Diretrizes internacionais atualizadas sobre os períodos de incubação (3 a 21 dias), critérios de fim de isolamento (queda de todas as crostas) e recomendações para vacinação dose-sparing intradérmica.'
  },
  {
    autores: 'Tarín-Vicente EJ, Alemany A, Agud-Dios M, et al.',
    ano: 2022,
    titulo: 'Clinical presentation and virological assessment of monkeypox: a prospective cohort study',
    periodico: 'The Lancet',
    doi: '10.1016/S0140-6736(22)01436-2',
    url: 'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(22)01436-2/fulltext',
    relevancia: 'Avaliou a cinética de eliminação viral em swabs de lesões, orofaringe e sêmen, correlacionando o período de incubação curto em transmissão íntima e a persistência do DNA viral em crostas.'
  },
  {
    autores: 'Ministério da Saúde do Brasil / SVSA',
    ano: 2024,
    titulo: 'Nota Técnica Conjunta nº 17/2024-SVSA/MS: Recomendações sobre vacinação contra mpox e manejo clínico',
    periodico: 'Secretaria de Vigilância em Saúde e Ambiente (SVSA/MS)',
    url: 'https://www.gov.br/saude/pt-br/composicao/svsa/cnie/painel-mpox',
    relevancia: 'Documento normativo do SUS que define os critérios de priorização para vacinação de PVHIV com imunossupressão grave e a recomendação técnica de dose fracionada intradérmica de 0,1 mL para usuários de PrEP.'
  }
];

export const faqList: FAQItem[] = [
  {
    id: 'faq-1',
    categoria: 'transmissao',
    pergunta: 'Como o vírus da mpox é transmitido na prática?',
    resposta: 'A principal via de transmissão é o contato físico direto e prolongado pele a pele com lesões cutâneas, crostas ou fluidos corporais de uma pessoa infectada. Isso inclui relações sexuais (oral, vaginal ou anal), beijos, abraços e massagens. Também pode ocorrer por contato com fômites (lençóis, toalhas, roupas ou objetos contaminados) e por gotículas respiratórias expelidas em conversas face a face próximas e prolongadas.',
    destaque: 'O contato sexual e íntimo é a via predominante observada no surto atual, devido ao atrito prolongado e contato direto de mucosas.',
    referencias: [scientificReferences[1], scientificReferences[2]]
  },
  {
    id: 'faq-2',
    categoria: 'transmissao',
    pergunta: 'Qual é o período exato em que uma pessoa transmite o vírus?',
    resposta: 'A transmissão se inicia com os primeiros sintomas clínicos (inclusive no período de febre e ínguas) e CONTINUA até que todas as feridas tenham secado, todas as crostas tenham se desprendido e uma nova camada de pele íntegra e saudável tenha se formado por baixo. Esse processo dura em média de 2 a 4 semanas. Enquanto restar uma única crosta, há risco real de transmissão.',
    destaque: 'Mesmo após o desaparecimento da dor e das ínguas, a presença de crostas ainda transmite o vírus.',
    referencias: [scientificReferences[2], scientificReferences[3]]
  },
  {
    id: 'faq-3',
    categoria: 'cuidados',
    pergunta: 'O que devo fazer imediatamente se suspeitar que estou com mpox?',
    resposta: '1. Isole-se imediatamente em um quarto individual em sua casa.\n2. Não compartilhe roupas de cama, toalhas, pratos ou talheres.\n3. Cubra as lesões visíveis com roupas compridas de algodão ou gaze limpa sem apertar.\n4. Use máscara cirúrgica caso precise interagir com outras pessoas no mesmo ambiente ou sair de casa.\n5. Dirija-se a uma Unidade Básica de Saúde (UBS), UPA ou Centro de Testagem e Aconselhamento (CTA) para avaliação médica e coleta do exame de PCR em swab da lesão.\n6. Avise seus contatos íntimos e sexuais dos últimos 21 dias para que monitorem possíveis sintomas.',
    destaque: 'Não tente remover ou estourar as pústulas. O exame padrão-ouro no SUS é o teste molecular RT-PCR a partir do fluido da lesão.'
  },
  {
    id: 'faq-4',
    categoria: 'vacina',
    pergunta: 'Por que no Rio de Janeiro e em outros estados é utilizada 1/5 da dose (0,1 mL intradérmica)?',
    resposta: 'Devido à escassez global do imunizante MVA-BN (JYNNEOS) produzido em lote limitado na Dinamarca, as autoridades sanitárias do Brasil (Ministério da Saúde e Anvisa), em consonância com a FDA norte-americana e a OMS, autorizaram a aplicação intradérmica de 0,1 mL (exatamente um quinto da dose subcutânea padrão de 0,5 mL). A derme humana é rica em células apresentadoras de antígenos (células de Langerhans e dendríticas), o que gera uma resposta imune de anticorpos neutralizantes robusta e estatisticamente não-inferior à aplicação subcutânea completa, ampliando em 5 vezes o alcance do estoque disponível.',
    destaque: 'A eficácia e segurança da dose de 0,1 mL foi comprovada em ensaios clínicos controlados pelo NIH/NIAID para usuários de PrEP e pessoas imunocompetentes.',
    referencias: [scientificReferences[0], scientificReferences[4]]
  },
  {
    id: 'faq-5',
    categoria: 'vacina',
    pergunta: 'Quem pode tomar a dose fracionada de 0,1 mL e quem deve tomar a dose cheia de 0,5 mL?',
    resposta: 'A dose fracionada intradérmica de 0,1 mL é indicada para usuários de PrEP (Profilaxia Pré-Exposição ao HIV) e profissionais de laboratório que manipulam o vírus. Por outro lado, para pessoas vivendo com HIV com imunossupressão grave (contagem de Linfócitos T-CD4 < 200 céls/mm³) ou outras condições de imunodeficiência severa, a recomendação formal do Ministério da Saúde é a aplicação do volume padrão de 0,5 mL por via subcutânea, garantindo máxima estimulação sistêmica.',
    destaque: 'O esquema vacinal completo exige 2 doses com intervalo de 28 dias entre a primeira e a segunda dose.'
  },
  {
    id: 'faq-6',
    categoria: 'vacina',
    pergunta: 'A vacina é oferecida para a população geral em massa no SUS?',
    resposta: 'Não. Pelo protocolo do Ministério da Saúde do Brasil e das Secretarias Estaduais de Saúde, a vacinação contra a mpox não é universal nem em massa. Ela é focalizada e prioritária para os segmentos populacionais de maior risco clínico e epidemiológico: pessoas vivendo com HIV/aids com imunossupressão, usuários cadastrados de PrEP, contatos diretos (profilaxia pós-exposição em até 4 a 14 dias) e profissionais laboratoriais de biossegurança nível 3.',
    destaque: 'Consulte os Centros de Referência em IST/Aids (CTA/SAE) do seu município para checar elegibilidade e agendamento.'
  },
  {
    id: 'faq-7',
    categoria: 'sintomas',
    pergunta: 'Como diferenciar as lesões da mpox de catapora, sífilis ou herpes?',
    resposta: 'A mpox costuma apresentar lesões que evoluem todas no mesmo estágio em uma mesma área corporal (ao contrário da catapora, onde coexistem manchas, bolhas e crostas ao mesmo tempo). Além disso, a presença de ínguas dolorosas pronunciadas (linfadenopatia) no pescoço e na virilha é quase universal na mpox e rara na catapora. As lesões de mpox frequentemente apresentam umbilicação central (parecem ter um pequeno "furinho" ou depressão no centro da bolha). A sífilis primária (cancro duro) geralmente é uma lesão única e indolor, enquanto o herpes causa pequenas vesículas agrupadas em base avermelhada que ardem intensamente.',
    destaque: 'Apenas a avaliação clínica e o exame laboratorial por biologia molecular (RT-PCR) podem confirmar com precisão o diagnóstico.'
  },
  {
    id: 'faq-8',
    categoria: 'tratamento',
    pergunta: 'Existe remédio específico contra a mpox no Brasil?',
    resposta: 'Na grande maioria dos casos com pessoas sem imunossupressão severa, a doença é autolimitada e o tratamento é sintomático (analgésicos para dor e febre, hidratação e higiene rigorosa das lesões com água e sabão neutro para evitar infecção bacteriana secundária). Em casos graves com risco de evolução para sepse ou encefalite (especialmente em indivíduos com CD4 muito baixo), o antiviral Tecovirimat (TPOXX) pode ser disponibilizado pelo Ministério da Saúde em caráter de uso compassivo sob protocolo hospitalar.',
    destaque: 'Evite o uso de pomadas caseiras, álcool ou substâncias irritantes diretamente sobre as lesões abertas.'
  }
];
