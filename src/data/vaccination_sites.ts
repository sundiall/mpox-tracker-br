export type VaccineAvailabilityStatus = 'disponivel' | 'esgotado' | 'em_abastecimento' | 'nao_informado';

export interface VaccinationSite {
  id: string;
  uf: string;
  estado: string;
  regiao: 'Sudeste' | 'Sul' | 'Nordeste' | 'Centro-Oeste' | 'Norte';
  municipio: string;
  nomeUnidade: string;
  tipo: 'CTA' | 'SAE' | 'CRIE' | 'Centro de Referencia' | 'Policlinica' | 'Hospital Universitario';
  endereco: string;
  cep: string;
  telefone: string;
  horarioFuncionamento: string;
  agendamento: 'Livre Demanda' | 'Agendamento Prévio' | 'Regulação SUS / Encaminhamento';
  observacoes: string;
  requisitos: string;
  statusEstoque?: VaccineAvailabilityStatus;
  dataAtualizacaoStatus?: string;
  notaStatus?: string;
}

export const vaccinationSites: VaccinationSite[] = [
  // --- REGIÃO SUDESTE ---
  // Rio de Janeiro
  {
    id: 'rj-1',
    uf: 'RJ',
    estado: 'Rio de Janeiro',
    regiao: 'Sudeste',
    municipio: 'Rio de Janeiro',
    nomeUnidade: 'Instituto Nacional de Infectologia Evandro Chagas (CRIE / INI / Fiocruz)',
    tipo: 'Hospital Universitario',
    endereco: 'Av. Brasil, 4365 - Manguinhos',
    cep: '21040-360',
    telefone: '(21) 3865-9595',
    horarioFuncionamento: 'Segunda a sexta, das 08h às 17h',
    agendamento: 'Livre Demanda',
    observacoes: 'Centro nacional de referência em infectologia. Aplicação para usuários de PrEP, PVHA (CD4 < 200), pós-exposição e trabalhadores expostos.',
    requisitos: 'Documento oficial com foto, cartão SUS e laudo/receita de PrEP (até 6 meses), exame CD4 ou comprovação de contato.',
    statusEstoque: 'esgotado',
    dataAtualizacaoStatus: '2026-11-18',
    notaStatus: 'Doses temporariamente esgotadas segundo comunicado oficial das redes. Aguardando novo lote de reposição da SMS-Rio.'
  },
  {
    id: 'rj-2',
    uf: 'RJ',
    estado: 'Rio de Janeiro',
    regiao: 'Sudeste',
    municipio: 'Rio de Janeiro',
    nomeUnidade: 'Super Centro Carioca de Vacinação — Botafogo',
    tipo: 'Policlinica',
    endereco: 'Rua General Severiano, 91 - Botafogo',
    cep: '22290-040',
    telefone: '(21) 2295-8855',
    horarioFuncionamento: 'Domingo a domingo, das 08h às 22h (Horário Estendido)',
    agendamento: 'Livre Demanda',
    observacoes: 'Polo principal de vacinação ampliada contra Mpox no Rio de Janeiro. Aplicação para usuários de PrEP e trabalhadores expostos.',
    requisitos: 'Documento com foto, CPF, cartão SUS e receita médica ou laudo comprobatório de uso de PrEP emitido nos últimos 6 meses.',
    statusEstoque: 'esgotado',
    dataAtualizacaoStatus: '2026-11-18',
    notaStatus: 'Doses temporariamente esgotadas após alta procura. A SMS-Rio aguarda envio de nova remessa de vacinas pelo Ministério da Saúde.'
  },
  {
    id: 'rj-3',
    uf: 'RJ',
    estado: 'Rio de Janeiro',
    regiao: 'Sudeste',
    municipio: 'Rio de Janeiro',
    nomeUnidade: 'Super Centro Carioca de Vacinação — Zona Norte (Shopping Nova América)',
    tipo: 'Policlinica',
    endereco: 'Av. Pastor Martin Luther King Jr., 126 - Del Castilho (Shopping Nova América)',
    cep: '20765-000',
    telefone: '(21) 3083-1000',
    horarioFuncionamento: 'Segunda a sábado, das 10h às 22h; Domingos e feriados, das 13h às 21h',
    agendamento: 'Livre Demanda',
    observacoes: 'Ponto estratégico de vacinação na Zona Norte carioca para PrEP e populações prioritárias.',
    requisitos: 'Documento de identidade com foto, CPF e receita/laudo de PrEP recente (até 6 meses).',
    statusEstoque: 'esgotado',
    dataAtualizacaoStatus: '2026-11-18',
    notaStatus: 'Estoque de vacinas esgotado temporariamente. Aguardando reposição da rede municipal de saúde.'
  },
  {
    id: 'rj-4',
    uf: 'RJ',
    estado: 'Rio de Janeiro',
    regiao: 'Sudeste',
    municipio: 'Rio de Janeiro',
    nomeUnidade: 'Super Centro Carioca de Vacinação — Zona Oeste (ParkShopping Campo Grande)',
    tipo: 'Policlinica',
    endereco: 'Estrada do Monteiro, 1200 - Campo Grande (ParkShopping Campo Grande)',
    cep: '23014-060',
    telefone: '(21) 2414-7000',
    horarioFuncionamento: 'Segunda a sábado, das 10h às 22h; Domingos e feriados, das 13h às 21h',
    agendamento: 'Livre Demanda',
    observacoes: 'Ponto de referência para a Zona Oeste para vacinação contra Mpox.',
    requisitos: 'Documento oficial com foto, cartão SUS e comprovação de PrEP (receita até 6 meses) ou indicação médica.',
    statusEstoque: 'esgotado',
    dataAtualizacaoStatus: '2026-11-18',
    notaStatus: 'Estoque temporariamente esgotado. Aguardando novo lote da SMS-Rio.'
  },
  {
    id: 'rj-5',
    uf: 'RJ',
    estado: 'Rio de Janeiro',
    regiao: 'Sudeste',
    municipio: 'Rio de Janeiro',
    nomeUnidade: 'Centro Especial de Vacinação Dr. Álvaro Aguiar (CEVAA)',
    tipo: 'Policlinica',
    endereco: 'Rua Evaristo da Veiga, 16 - Centro (Cinelândia)',
    cep: '20031-040',
    telefone: '(21) 2240-5530',
    horarioFuncionamento: 'Segunda a sexta, das 08h às 17h',
    agendamento: 'Livre Demanda',
    observacoes: 'Centro histórico especializado em imunobiológicos especiais no Centro do Rio de Janeiro.',
    requisitos: 'Documento com foto, CPF, cartão SUS e laudo/receita de PrEP emitido nos últimos 6 meses.',
    statusEstoque: 'esgotado',
    dataAtualizacaoStatus: '2026-11-18',
    notaStatus: 'Estoque esgotado temporariamente após grande demanda. Em processo de reabastecimento pela SMS-Rio.'
  },
  {
    id: 'rj-6',
    uf: 'RJ',
    estado: 'Rio de Janeiro',
    regiao: 'Sudeste',
    municipio: 'Niterói',
    nomeUnidade: 'Policlínica Regional Sérgio Arouca (SAE Niterói)',
    tipo: 'SAE',
    endereco: 'Rua Vital Brazil Filho, s/n - Vital Brazil',
    cep: '24230-340',
    telefone: '(21) 2711-0099',
    horarioFuncionamento: 'Segunda a sexta, das 08h às 16h',
    agendamento: 'Livre Demanda',
    observacoes: 'Atendimento para municípios da Região Metropolitana II.',
    requisitos: 'Cartão SUS, documento com foto e comprovação de grupo prioritário.'
  },

  // São Paulo
  {
    id: 'sp-1',
    uf: 'SP',
    estado: 'São Paulo',
    regiao: 'Sudeste',
    municipio: 'São Paulo',
    nomeUnidade: 'Centro de Referência e Treinamento DST/Aids-SP (CRT DST/Aids)',
    tipo: 'Centro de Referencia',
    endereco: 'Rua Santa Cruz, 81 - Vila Mariana',
    cep: '04121-000',
    telefone: '(11) 5087-9911',
    horarioFuncionamento: 'Segunda a sexta, das 07h às 19h',
    agendamento: 'Livre Demanda',
    observacoes: 'Maior centro especializado de SP. Aplicação de dose fracionada e dose plena sob triagem clínica.',
    requisitos: 'Documento oficial com foto, cartão SUS e comprovante de critério clínico (PrEP ou PVHIV).'
  },
  {
    id: 'sp-2',
    uf: 'SP',
    estado: 'São Paulo',
    regiao: 'Sudeste',
    municipio: 'São Paulo',
    nomeUnidade: 'CTA Henfil (Centro de Testagem e Aconselhamento)',
    tipo: 'CTA',
    endereco: 'Rua Líbero Badaró, 144 - Centro Histórico',
    cep: '01008-000',
    telefone: '(11) 3241-2101',
    horarioFuncionamento: 'Segunda a sexta, das 08h às 18h',
    agendamento: 'Livre Demanda',
    observacoes: 'Polo de testagem rápida, acompanhamento de profilaxias e vacinação no centro paulistano.',
    requisitos: 'Documento com foto e cartão SUS.'
  },
  {
    id: 'sp-3',
    uf: 'SP',
    estado: 'São Paulo',
    regiao: 'Sudeste',
    municipio: 'Campinas',
    nomeUnidade: 'Centro de Referência em IST/Aids de Campinas',
    tipo: 'SAE',
    endereco: 'Rua Regente Feijó, 637 - Centro',
    cep: '13013-051',
    telefone: '(19) 3232-4109',
    horarioFuncionamento: 'Segunda a sexta, das 08h às 17h',
    agendamento: 'Agendamento Prévio',
    observacoes: 'Atendimento da Região Metropolitana de Campinas.',
    requisitos: 'Cartão SUS, comprovante de residência e documento com foto.'
  },

  // Minas Gerais
  {
    id: 'mg-1',
    uf: 'MG',
    estado: 'Minas Gerais',
    regiao: 'Sudeste',
    municipio: 'Belo Horizonte',
    nomeUnidade: 'CRIE - Centro de Referência para Imunobiológicos Especiais (Hospital Odilon Behrens)',
    tipo: 'CRIE',
    endereco: 'Rua Formiga, 50 - São Cristóvão',
    cep: '31110-430',
    telefone: '(31) 3277-6196',
    horarioFuncionamento: 'Segunda a sexta, das 08h às 17h',
    agendamento: 'Regulação SUS / Encaminhamento',
    observacoes: 'Referência estadual para imunização de indivíduos com imunossupressão grave.',
    requisitos: 'Relatório médico atualizado, cartão de vacinação e documento com foto.'
  },
  {
    id: 'mg-2',
    uf: 'MG',
    estado: 'Minas Gerais',
    regiao: 'Sudeste',
    municipio: 'Belo Horizonte',
    nomeUnidade: 'CTA Sagrada Família (Centro de Testagem e Aconselhamento)',
    tipo: 'CTA',
    endereco: 'Rua Costa Monteiro, 325 - Sagrada Família',
    cep: '31030-490',
    telefone: '(31) 3277-5757',
    horarioFuncionamento: 'Segunda a sexta, das 08h às 17h',
    agendamento: 'Livre Demanda',
    observacoes: 'Polo municipal para usuários em PrEP e triagem de comunicantes.',
    requisitos: 'Documento com foto e cartão SUS.'
  },

  // Espírito Santo
  {
    id: 'es-1',
    uf: 'ES',
    estado: 'Espírito Santo',
    regiao: 'Sudeste',
    municipio: 'Vitória',
    nomeUnidade: 'CRIE Vitória / Hospital Estadual Infantil Nossa Senhora da Glória',
    tipo: 'CRIE',
    endereco: 'Alameda Mary Ubirajara, 205 - Santa Lúcia',
    cep: '29056-030',
    telefone: '(27) 3636-7500',
    horarioFuncionamento: 'Segunda a sexta, das 08h às 16h30',
    agendamento: 'Regulação SUS / Encaminhamento',
    observacoes: 'Polo de dispensação e aplicação de imunobiológicos estratégicos no ES.',
    requisitos: 'Laudo médico justificando o critério do PNI e documento com foto.'
  },

  // --- REGIÃO CENTRO-OESTE ---
  // Distrito Federal
  {
    id: 'df-1',
    uf: 'DF',
    estado: 'Distrito Federal',
    regiao: 'Centro-Oeste',
    municipio: 'Brasília',
    nomeUnidade: 'Hospital Dia da Asa Sul (Unidade Mista de Saúde de Brasília)',
    tipo: 'Centro de Referencia',
    endereco: 'EQS 508/509 - Asa Sul',
    cep: '70351-580',
    telefone: '(61) 3443-4340',
    horarioFuncionamento: 'Segunda a sexta, das 07h às 18h',
    agendamento: 'Livre Demanda',
    observacoes: 'Principal serviço de infectologia ambulatorial e dispensação de imunobiológicos do DF.',
    requisitos: 'Documento com foto, cartão SUS e comprovante de elegibilidade.'
  },

  // Goiás
  {
    id: 'go-1',
    uf: 'GO',
    estado: 'Goiás',
    regiao: 'Centro-Oeste',
    municipio: 'Goiânia',
    nomeUnidade: 'Hospital de Doenças Tropicais Dr. Anuar Auad (HDT / SES-GO)',
    tipo: 'Hospital Universitario',
    endereco: 'Alameda do Contorno, 3556 - Jardim Bela Vista',
    cep: '74853-120',
    telefone: '(62) 3201-3600',
    horarioFuncionamento: 'Segunda a sexta, das 08h às 17h',
    agendamento: 'Regulação SUS / Encaminhamento',
    observacoes: 'Hospital de referência em infectologia do Centro-Oeste.',
    requisitos: 'Encaminhamento médico pelo sistema de regulação e documento com foto.'
  },

  // Mato Grosso
  {
    id: 'mt-1',
    uf: 'MT',
    estado: 'Mato Grosso',
    regiao: 'Centro-Oeste',
    municipio: 'Cuiabá',
    nomeUnidade: 'CRIE Mato Grosso / Hospital Universitário Júlio Müller (HUJM)',
    tipo: 'CRIE',
    endereco: 'Rua Luís Philippe Pereira Leite, s/n - Alvorada',
    cep: '78048-902',
    telefone: '(65) 3615-7200',
    horarioFuncionamento: 'Segunda a sexta, das 07h30 às 16h',
    agendamento: 'Regulação SUS / Encaminhamento',
    observacoes: 'Centro especializado no atendimento de imunossuprimidos e profissionais expostos.',
    requisitos: 'Relatório médico e cartão SUS.'
  },

  // Mato Grosso do Sul
  {
    id: 'ms-1',
    uf: 'MS',
    estado: 'Mato Grosso do Sul',
    regiao: 'Centro-Oeste',
    municipio: 'Campo Grande',
    nomeUnidade: 'Hospital Dia Professora Esterina Corsini (HUMAP / UFMS)',
    tipo: 'Hospital Universitario',
    endereco: 'Av. Senador Filinto Müller, 355 - Vila Ipiranga',
    cep: '79080-190',
    telefone: '(67) 3345-3000',
    horarioFuncionamento: 'Segunda a sexta, das 07h às 16h',
    agendamento: 'Regulação SUS / Encaminhamento',
    observacoes: 'Referência em infectologia e vigilância no MS.',
    requisitos: 'Documento com foto, cartão SUS e laudo médico.'
  },

  // --- REGIÃO NORDESTE ---
  // Bahia
  {
    id: 'ba-1',
    uf: 'BA',
    estado: 'Bahia',
    regiao: 'Nordeste',
    municipio: 'Salvador',
    nomeUnidade: 'Centro Estadual Especializado em Diagnóstico, Assistência e Pesquisa (CEDAP)',
    tipo: 'Centro de Referencia',
    endereco: 'Rua Comendador José Alves Ferreira, 240 - Garcia',
    cep: '40100-160',
    telefone: '(71) 3116-8888',
    horarioFuncionamento: 'Segunda a sexta, das 07h30 às 17h',
    agendamento: 'Livre Demanda',
    observacoes: 'Maior polo ambulatorial da Bahia em IST/Aids e imunização especial.',
    requisitos: 'Documento oficial com foto e cartão do SUS.'
  },

  // Ceará
  {
    id: 'ce-1',
    uf: 'CE',
    estado: 'Ceará',
    regiao: 'Nordeste',
    municipio: 'Fortaleza',
    nomeUnidade: 'Hospital São José de Doenças Infecciosas (HSJ / SESA-CE)',
    tipo: 'Hospital Universitario',
    endereco: 'Rua Nestor Barbosa, 315 - Parquelândia',
    cep: '60455-610',
    telefone: '(85) 3101-2321',
    horarioFuncionamento: 'Atendimento ambulatorial das 08h às 16h',
    agendamento: 'Livre Demanda',
    observacoes: 'Polo de testagem molecular RT-PCR e imunização de grupos de alto risco.',
    requisitos: 'Documento com foto e cartão SUS.'
  },

  // Pernambuco
  {
    id: 'pe-1',
    uf: 'PE',
    estado: 'Pernambuco',
    regiao: 'Nordeste',
    municipio: 'Recife',
    nomeUnidade: 'Hospital Universitário Oswaldo Cruz (HUOC / CRIE PE)',
    tipo: 'CRIE',
    endereco: 'Rua Arnóbio Marquês, 310 - Santo Amaro',
    cep: '50100-130',
    telefone: '(81) 3184-1200',
    horarioFuncionamento: 'Segunda a sexta, das 07h às 16h',
    agendamento: 'Regulação SUS / Encaminhamento',
    observacoes: 'Referência estadual em doenças infectocontagiosas e imunobiológicos especiais.',
    requisitos: 'Cartão SUS, RG/CPF e laudo médico comprobatório.'
  },

  // Rio Grande do Norte
  {
    id: 'rn-1',
    uf: 'RN',
    estado: 'Rio Grande do Norte',
    regiao: 'Nordeste',
    municipio: 'Natal',
    nomeUnidade: 'Hospital Giselda Trigueiro (HGT / SESAP-RN)',
    tipo: 'Hospital Universitario',
    endereco: 'Rua Cônego Monte, 110 - Quintas',
    cep: '59035-170',
    telefone: '(84) 3232-7900',
    horarioFuncionamento: 'Segunda a sexta, das 08h às 16h',
    agendamento: 'Regulação SUS / Encaminhamento',
    observacoes: 'Hospital estadual de referência em infectologia do RN.',
    requisitos: 'Documento de identificação e encaminhamento médico.'
  },

  // Paraíba
  {
    id: 'pb-1',
    uf: 'PB',
    estado: 'Paraíba',
    regiao: 'Nordeste',
    municipio: 'João Pessoa',
    nomeUnidade: 'Complexo Hospitalar de Doenças Infectocontagiosas Clementino Fraga',
    tipo: 'Hospital Universitario',
    endereco: 'Rua Esther Ribeiro Coutinho, s/n - Jaguaribe',
    cep: '58015-270',
    telefone: '(83) 3218-5400',
    horarioFuncionamento: 'Segunda a sexta, das 08h às 16h',
    agendamento: 'Livre Demanda',
    observacoes: 'Referência em acolhimento e vacinação de contingente prioritário.',
    requisitos: 'Cartão do SUS e documento oficial com foto.'
  },

  // Maranhão
  {
    id: 'ma-1',
    uf: 'MA',
    estado: 'Maranhão',
    regiao: 'Nordeste',
    municipio: 'São Luís',
    nomeUnidade: 'Hospital Presidente Vargas / SAE São Luís',
    tipo: 'SAE',
    endereco: 'Rua da Palma, 384 - Centro',
    cep: '65010-440',
    telefone: '(98) 3218-8700',
    horarioFuncionamento: 'Segunda a sexta, das 08h às 17h',
    agendamento: 'Livre Demanda',
    observacoes: 'Serviço de referência maranhense para vigilância e imunobiológicos.',
    requisitos: 'Documento oficial e cartão SUS.'
  },

  // Alagoas
  {
    id: 'al-1',
    uf: 'AL',
    estado: 'Alagoas',
    regiao: 'Nordeste',
    municipio: 'Maceió',
    nomeUnidade: 'Hospital Escola Dr. Helvio Auto (HEHA / UNCISAL)',
    tipo: 'Hospital Universitario',
    endereco: 'Rua Cônego Fernando Lyra, s/n - Trapiche da Barra',
    cep: '57010-380',
    telefone: '(82) 3315-3224',
    horarioFuncionamento: 'Segunda a sexta, das 08h às 16h',
    agendamento: 'Regulação SUS / Encaminhamento',
    observacoes: 'Único hospital público especializado em doenças infectocontagiosas em AL.',
    requisitos: 'Encaminhamento pela rede de saúde e cartão SUS.'
  },

  // Sergipe
  {
    id: 'se-1',
    uf: 'SE',
    estado: 'Sergipe',
    regiao: 'Nordeste',
    municipio: 'Aracaju',
    nomeUnidade: 'CRIE Sergipe / Hospital de Urgências de Sergipe (HUSE)',
    tipo: 'CRIE',
    endereco: 'Av. Pres. Tancredo Neves, s/n - Capucho',
    cep: '49095-000',
    telefone: '(79) 3216-2600',
    horarioFuncionamento: 'Segunda a sexta, das 07h às 16h',
    agendamento: 'Regulação SUS / Encaminhamento',
    observacoes: 'Dispensação de vacinas especiais para público elegível.',
    requisitos: 'Laudo médico e documento de identidade.'
  },

  // Piauí
  {
    id: 'pi-1',
    uf: 'PI',
    estado: 'Piauí',
    regiao: 'Nordeste',
    municipio: 'Teresina',
    nomeUnidade: 'Instituto de Doenças Tropicais Natan Portella (IDTNP)',
    tipo: 'Hospital Universitario',
    endereco: 'Rua Governador Raimundo Artur de Vasconcelos, 151 - Centro',
    cep: '64001-450',
    telefone: '(86) 3216-3600',
    horarioFuncionamento: 'Segunda a sexta, das 08h às 17h',
    agendamento: 'Livre Demanda',
    observacoes: 'Polo central piauiense para diagnóstico molecular e imunização de alto risco.',
    requisitos: 'Cartão SUS e documento com foto.'
  },

  // --- REGIÃO SUL ---
  // Paraná
  {
    id: 'pr-1',
    uf: 'PR',
    estado: 'Paraná',
    regiao: 'Sul',
    municipio: 'Curitiba',
    nomeUnidade: 'Centro de Orientação e Aconselhamento de Curitiba (COA)',
    tipo: 'CTA',
    endereco: 'Rua Francisco Torres, 830 - Centro',
    cep: '80060-130',
    telefone: '(41) 3321-2826',
    horarioFuncionamento: 'Segunda a sexta, das 08h às 17h',
    agendamento: 'Livre Demanda',
    observacoes: 'Polo de vacinação e profilaxias pré-exposição de Curitiba.',
    requisitos: 'Cartão do SUS e documento oficial com foto.'
  },

  // Rio Grande do Sul
  {
    id: 'rs-1',
    uf: 'RS',
    estado: 'Rio Grande do Sul',
    regiao: 'Sul',
    municipio: 'Porto Alegre',
    nomeUnidade: 'Centro de Saúde Santa Marta (SAE Porto Alegre)',
    tipo: 'SAE',
    endereco: 'Rua Capitão Montanha, 27 - Centro Histórico',
    cep: '90010-040',
    telefone: '(51) 3289-5400',
    horarioFuncionamento: 'Segunda a sexta, das 08h às 17h',
    agendamento: 'Livre Demanda',
    observacoes: 'Atendimento metropolitano da capital gaúcha para imunização especial.',
    requisitos: 'Documento com foto e cartão SUS.'
  },

  // Santa Catarina
  {
    id: 'sc-1',
    uf: 'SC',
    estado: 'Santa Catarina',
    regiao: 'Sul',
    municipio: 'Florianópolis',
    nomeUnidade: 'Hospital Nereu Ramos / CRIE Santa Catarina',
    tipo: 'CRIE',
    endereco: 'Rua Rui Barbosa, s/n - Agronômica',
    cep: '88025-301',
    telefone: '(48) 3664-5800',
    horarioFuncionamento: 'Segunda a sexta, das 08h às 16h',
    agendamento: 'Regulação SUS / Encaminhamento',
    observacoes: 'Hospital estadual especializado em doenças infectocontagiosas em SC.',
    requisitos: 'Documento de identificação, cartão SUS e laudo clínico.'
  },

  // --- REGIÃO NORTE ---
  // Pará
  {
    id: 'pa-1',
    uf: 'PA',
    estado: 'Pará',
    regiao: 'Norte',
    municipio: 'Belém',
    nomeUnidade: 'Unidade de Referência Especializada em Doenças Infecciosas Parasitárias Especiais (URE DIPE)',
    tipo: 'Centro de Referencia',
    endereco: 'Av. Alcindo Cacela, 1421 - Umarizal',
    cep: '66060-000',
    telefone: '(91) 3242-6022',
    horarioFuncionamento: 'Segunda a sexta, das 07h30 às 16h',
    agendamento: 'Livre Demanda',
    observacoes: 'Principal polo de vigilância em saúde infectológica no Pará.',
    requisitos: 'Cartão SUS e documento com foto.'
  },

  // Amazonas
  {
    id: 'am-1',
    uf: 'AM',
    estado: 'Amazonas',
    regiao: 'Norte',
    municipio: 'Manaus',
    nomeUnidade: 'Fundação de Medicina Tropical Doutor Heitor Vieira Dourado (FMT-HVD)',
    tipo: 'Hospital Universitario',
    endereco: 'Av. Pedro Teixeira, 25 - Dom Pedro',
    cep: '69040-000',
    telefone: '(92) 2127-3555',
    horarioFuncionamento: 'Atendimento contínuo; CRIE das 08h às 16h',
    agendamento: 'Regulação SUS / Encaminhamento',
    observacoes: 'Maior centro de infectologia da Região Amazônica.',
    requisitos: 'Documento de identificação e relatório clínico.'
  },

  // Tocantins
  {
    id: 'to-1',
    uf: 'TO',
    estado: 'Tocantins',
    regiao: 'Norte',
    municipio: 'Palmas',
    nomeUnidade: 'Hospital Geral de Palmas (HGP / CRIE Tocantins)',
    tipo: 'CRIE',
    endereco: 'Avenida NS-01, Área Verde - Plano Diretor Sul',
    cep: '77015-002',
    telefone: '(63) 3218-7800',
    horarioFuncionamento: 'Segunda a sexta, das 08h às 16h',
    agendamento: 'Regulação SUS / Encaminhamento',
    observacoes: 'Dispensação regulada de imunobiológicos para grupos com indicação formal.',
    requisitos: 'Relatório médico e cartão SUS.'
  },

  // Rondônia
  {
    id: 'ro-1',
    uf: 'RO',
    estado: 'Rondônia',
    regiao: 'Norte',
    municipio: 'Porto Velho',
    nomeUnidade: 'Centro de Medicina Tropical de Rondônia (CEMETRON)',
    tipo: 'Hospital Universitario',
    endereco: 'Av. Guaporé, 215 - Três Marias',
    cep: '76812-536',
    telefone: '(69) 3216-2200',
    horarioFuncionamento: 'Segunda a sexta, das 08h às 17h',
    agendamento: 'Regulação SUS / Encaminhamento',
    observacoes: 'Hospital público especializado em infecções e endemias em RO.',
    requisitos: 'Cartão SUS e documento oficial.'
  },

  // Amapá
  {
    id: 'ap-1',
    uf: 'AP',
    estado: 'Amapá',
    regiao: 'Norte',
    municipio: 'Macapá',
    nomeUnidade: 'Centro de Referência em Doenças Tropicais (CRDT Macapá)',
    tipo: 'Centro de Referencia',
    endereco: 'Rua Cândido Mendes, 1071 - Centro',
    cep: '68900-100',
    telefone: '(96) 3212-6130',
    horarioFuncionamento: 'Segunda a sexta, das 08h às 16h',
    agendamento: 'Livre Demanda',
    observacoes: 'Polo estadual de vigilância, testagem e imunização em Macapá.',
    requisitos: 'Cartão do SUS e documento oficial com foto.'
  },

  // Acre
  {
    id: 'ac-1',
    uf: 'AC',
    estado: 'Acre',
    regiao: 'Norte',
    municipio: 'Rio Branco',
    nomeUnidade: 'Hospital das Clínicas do Acre (Fundhacre / CRIE Acre)',
    tipo: 'CRIE',
    endereco: 'Rodovia BR-364, Km 02 - Distrito Industrial',
    cep: '69914-220',
    telefone: '(68) 3215-2600',
    horarioFuncionamento: 'Segunda a sexta, das 07h30 às 16h',
    agendamento: 'Regulação SUS / Encaminhamento',
    observacoes: 'Polo regulador e de aplicação de imunobiológicos especiais no AC.',
    requisitos: 'Documento oficial e laudo médico do SUS.'
  },

  // Roraima
  {
    id: 'rr-1',
    uf: 'RR',
    estado: 'Roraima',
    regiao: 'Norte',
    municipio: 'Boa Vista',
    nomeUnidade: 'CRIE Roraima / Hospital Geral de Roraima Rubens de Souza Bento',
    tipo: 'CRIE',
    endereco: 'Av. Brigadeiro Eduardo Gomes, 3510 - Aeroporto',
    cep: '69310-005',
    telefone: '(95) 2121-0600',
    horarioFuncionamento: 'Segunda a sexta, das 08h às 16h',
    agendamento: 'Regulação SUS / Encaminhamento',
    observacoes: 'Vigilância epidemiológica e imunização em fronteira e capital.',
    requisitos: 'Cartão SUS e documento com foto.'
  }
];
