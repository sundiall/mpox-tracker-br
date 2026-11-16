export interface VaccinationSite {
  id: string;
  uf: string;
  estado: string;
  municipio: string;
  nomeUnidade: string;
  tipo: 'CTA' | 'SAE' | 'Centro de Referencia' | 'Policlinica' | 'Hospital Universitario';
  endereco: string;
  bairro: string;
  telefone: string;
  horarioFuncionamento: string;
  agendamento: 'Livre Demanda' | 'Agendamento Prévio' | 'Regulação SUS / Encaminhamento';
  observacoes: string;
}

export const vaccinationSites: VaccinationSite[] = [
  // Rio de Janeiro
  {
    id: 'rj-1',
    uf: 'RJ',
    estado: 'Rio de Janeiro',
    municipio: 'Rio de Janeiro',
    nomeUnidade: 'Instituto Nacional de Infectologia Evandro Chagas (INI / Fiocruz)',
    tipo: 'Hospital Universitario',
    endereco: 'Av. Brasil, 4365 - Manguinhos',
    bairro: 'Manguinhos',
    telefone: '(21) 3865-9595 / (21) 3865-9500',
    horarioFuncionamento: 'Segunda a sexta, das 08h às 17h',
    agendamento: 'Regulação SUS / Encaminhamento',
    observacoes: 'Principal centro de referência nacional em vigilância e pesquisa clínica de mpox e imunização de populações com comorbidades e usuários em ensaios.'
  },
  {
    id: 'rj-2',
    uf: 'RJ',
    estado: 'Rio de Janeiro',
    municipio: 'Rio de Janeiro',
    nomeUnidade: 'Centro Municipal de Saúde Escola Lapa (CMS Lapa - SMS Rio)',
    tipo: 'CTA',
    endereco: 'Rua do Riachuelo, 43',
    bairro: 'Lapa',
    telefone: '(21) 2224-4428',
    horarioFuncionamento: 'Segunda a sexta, das 08h às 18h',
    agendamento: 'Livre Demanda',
    observacoes: 'Polo estratégico para aplicação da dose fracionada intradérmica (0,1 mL) para usuários de PrEP cadastrados na rede carioca.'
  },
  {
    id: 'rj-3',
    uf: 'RJ',
    estado: 'Rio de Janeiro',
    municipio: 'Rio de Janeiro',
    nomeUnidade: 'Policlínica Municipal Ronaldo Galdino',
    tipo: 'Policlinica',
    endereco: 'Rua General Severiano, 91',
    bairro: 'Botafogo',
    telefone: '(21) 2295-8855',
    horarioFuncionamento: 'Segunda a sexta, das 08h às 17h',
    agendamento: 'Agendamento Prévio',
    observacoes: 'Posto de imunização de grupos prioritários da Zona Sul da capital carioca.'
  },
  {
    id: 'rj-4',
    uf: 'RJ',
    estado: 'Rio de Janeiro',
    municipio: 'Niterói',
    nomeUnidade: 'Policlínica Regional Sérgio Arouca (SAE Niterói)',
    tipo: 'SAE',
    endereco: 'Rua Vital Brazil Filho, s/n',
    bairro: 'Vital Brazil',
    telefone: '(21) 2711-0099',
    horarioFuncionamento: 'Segunda a sexta, das 08h às 16h',
    agendamento: 'Livre Demanda',
    observacoes: 'Referência metropolitana para imunização e manejo de ISTs na Região Oceânica e Niterói.'
  },

  // São Paulo
  {
    id: 'sp-1',
    uf: 'SP',
    estado: 'São Paulo',
    municipio: 'São Paulo',
    nomeUnidade: 'Centro de Referência e Treinamento DST/Aids-SP (CRT DST/Aids)',
    tipo: 'Centro de Referencia',
    endereco: 'Rua Santa Cruz, 81',
    bairro: 'Vila Mariana',
    telefone: '(11) 5087-9911',
    horarioFuncionamento: 'Segunda a sexta, das 07h às 19h',
    agendamento: 'Livre Demanda',
    observacoes: 'Maior centro de referência do estado de SP para imunização de usuários de PrEP e pessoas com HIV com critérios de imunossupressão.'
  },
  {
    id: 'sp-2',
    uf: 'SP',
    estado: 'São Paulo',
    municipio: 'São Paulo',
    nomeUnidade: 'CTA Henfil (Centro de Testagem e Aconselhamento)',
    tipo: 'CTA',
    endereco: 'Rua Líbero Badaró, 144',
    bairro: 'Centro Histórico',
    telefone: '(11) 3241-2101',
    horarioFuncionamento: 'Segunda a sexta, das 08h às 18h',
    agendamento: 'Livre Demanda',
    observacoes: 'Polo central em São Paulo para distribuição e aplicação em populações vulnerabilizadas.'
  },
  {
    id: 'sp-3',
    uf: 'SP',
    estado: 'São Paulo',
    municipio: 'Campinas',
    nomeUnidade: 'Centro de Referência em IST/Aids de Campinas',
    tipo: 'SAE',
    endereco: 'Rua Regente Feijó, 637',
    bairro: 'Centro',
    telefone: '(19) 3232-4109',
    horarioFuncionamento: 'Segunda a sexta, das 08h às 17h',
    agendamento: 'Agendamento Prévio',
    observacoes: 'Atendimento e dispensação de imunobiológicos na Região Metropolitana de Campinas.'
  },

  // Minas Gerais
  {
    id: 'mg-1',
    uf: 'MG',
    estado: 'Minas Gerais',
    municipio: 'Belo Horizonte',
    nomeUnidade: 'Centro de Referência em Imunobiológicos Especiais (CRIE / Hospital Odilon Behrens)',
    tipo: 'Centro de Referencia',
    endereco: 'Rua Formiga, 50',
    bairro: 'São Cristóvão',
    telefone: '(31) 3277-6196',
    horarioFuncionamento: 'Segunda a sexta, das 08h às 17h',
    agendamento: 'Regulação SUS / Encaminhamento',
    observacoes: 'Disponibilização da vacina contra mpox para públicos imunocomprometidos e contatos imediatos sob regulação municipal.'
  },
  {
    id: 'mg-2',
    uf: 'MG',
    estado: 'Minas Gerais',
    municipio: 'Belo Horizonte',
    nomeUnidade: 'CTA Sagrada Família (Centro de Testagem e Aconselhamento)',
    tipo: 'CTA',
    endereco: 'Rua Costa Monteiro, 325',
    bairro: 'Sagrada Família',
    telefone: '(31) 3277-5757',
    horarioFuncionamento: 'Segunda a sexta, das 08h às 17h',
    agendamento: 'Livre Demanda',
    observacoes: 'Atendimento acolhedor e triagem de elegibilidade para usuários em acompanhamento de PrEP.'
  },

  // Distrito Federal
  {
    id: 'df-1',
    uf: 'DF',
    estado: 'Distrito Federal',
    municipio: 'Brasília',
    nomeUnidade: 'Hospital Dia da Asa Sul (Polivalente / SES-DF)',
    tipo: 'Centro de Referencia',
    endereco: 'EQS 508/509 - Asa Sul',
    bairro: 'Asa Sul',
    telefone: '(61) 3443-4340',
    horarioFuncionamento: 'Segunda a sexta, das 07h às 18h',
    agendamento: 'Livre Demanda',
    observacoes: 'Centro especializado no DF para imunização e cuidado integral de populações sob vigilância de ISTs.'
  },

  // Bahia
  {
    id: 'ba-1',
    uf: 'BA',
    estado: 'Bahia',
    municipio: 'Salvador',
    nomeUnidade: 'Centro Estadual Especializado em Diagnóstico, Assistência e Pesquisa (CEDAP)',
    tipo: 'Centro de Referencia',
    endereco: 'Rua Comendador José Alves Ferreira, 240',
    bairro: 'Garcia',
    telefone: '(71) 3116-8888',
    horarioFuncionamento: 'Segunda a sexta, das 07h30 às 17h',
    agendamento: 'Livre Demanda',
    observacoes: 'Principal polo de vigilância e imunização da Secretaria da Saúde do Estado da Bahia (SESAB).'
  },

  // Ceará
  {
    id: 'ce-1',
    uf: 'CE',
    estado: 'Ceará',
    municipio: 'Fortaleza',
    nomeUnidade: 'Hospital São José de Doenças Infecciosas (HSJ / SESA-CE)',
    tipo: 'Hospital Universitario',
    endereco: 'Rua Nestor Barbosa, 315',
    bairro: 'Parquelândia',
    telefone: '(85) 3101-2321',
    horarioFuncionamento: '24 horas para urgência; Vacinação das 08h às 16h',
    agendamento: 'Regulação SUS / Encaminhamento',
    observacoes: 'Referência no Nordeste para diagnóstico molecular (RT-PCR), internamento de casos complexos e vacinação estratégica.'
  },

  // Paraná
  {
    id: 'pr-1',
    uf: 'PR',
    estado: 'Paraná',
    municipio: 'Curitiba',
    nomeUnidade: 'Centro de Orientação e Aconselhamento de Curitiba (COA)',
    tipo: 'CTA',
    endereco: 'Rua Francisco Torres, 830',
    bairro: 'Centro',
    telefone: '(41) 3321-2826',
    horarioFuncionamento: 'Segunda a sexta, das 08h às 17h',
    agendamento: 'Livre Demanda',
    observacoes: 'Serviço municipal de Curitiba para prevenção, PrEP e vacinação de contingente prioritário.'
  },

  // Rio Grande do Sul
  {
    id: 'rs-1',
    uf: 'RS',
    estado: 'Rio Grande do Sul',
    municipio: 'Porto Alegre',
    nomeUnidade: 'Centro de Saúde Santa Marta (SAE Porto Alegre)',
    tipo: 'SAE',
    endereco: 'Rua Capitão Montanha, 27',
    bairro: 'Centro Histórico',
    telefone: '(51) 3289-5400',
    horarioFuncionamento: 'Segunda a sexta, das 08h às 17h',
    agendamento: 'Livre Demanda',
    observacoes: 'Atendimento central da capital gaúcha para administração de imunobiológicos especiais.'
  }
];
