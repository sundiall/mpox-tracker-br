# 🦠 MPOX Brasil — Plataforma de Inteligência Epidemiológica & Monitoramento em Saúde Pública

<div align="center">

[![Aplicação em Produção](https://img.shields.io/badge/Plataforma%20Online-mpox--tracker--br.web.app-0284c7?style=for-the-badge&logo=google-chrome&logoColor=white)](https://mpox-tracker-br.web.app/)
[![Licença: MIT](https://img.shields.io/badge/Licen%C3%A7a-MIT-emerald?style=for-the-badge)](LICENSE)
[![GitHub Workflow](https://img.shields.io/github/actions/workflow/status/sundiall/mpox-tracker-br/auto_update_and_deploy.yml?branch=main&style=for-the-badge&logo=githubactions&logoColor=white&label=Pipeline%20CI%2FCD)](https://github.com/sundiall/mpox-tracker-br/actions)

<p align="center">
  <b>Plataforma autônoma de vigilância epidemiológica em tempo real e rastreamento vacinal da Mpox no Brasil.</b><br/>
  Impulsionada por agentes autônomos de IA, engenharia reversa do modelo semântico do Power BI oficial, esteira adaptativa de execução e arquitetura Jamstack de alta performance.
</p>

**[🌐 English](./README.md)** • **[🇧🇷 Português (Brasil)](./README.pt-BR.md)**

---

</div>

## 📌 Resumo Executivo

O **MPOX Brasil** é uma iniciativa independente de ciência de dados em saúde pública criada para proporcionar transparência, monitoramento epidemiológico em tempo real e educação em saúde baseada em evidências científicas em todas as **27 Unidades da Federação (UF)**.

Integrando **agentes autônomos de IA multicanal (Google Gemini)**, **engenharia reversa binária direta do modelo semântico do Power BI do Ministério da Saúde** e um **gatekeeper operacional adaptativo**, a plataforma monitora continuamente a disponibilidade de imunizantes na rede especializada do SUS, emite alertas automáticos sobre notas técnicas e visualiza a curva da epidemia sem estigmatização de populações.

Hospedada com custo zero de infraestrutura no **Google Firebase Hosting (Google Cloud)**, a aplicação foi concebida para oferecer carregamento instantâneo, total acessibilidade e resiliência contínua sem necessidade de manutenção manual.

---

## ⚡ Destaques de Arquitetura & Demonstração Técnica

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              CAMADA DE INGESTÃO DE DADOS                               │
│  ┌────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐  │
│  │ API do MS Power BI     │  │ Google News Real-Time   │  │ Feeds Institucionais    │  │
│  │ Modelo Semântico Oficial│ │ RSS Regional Geofocado  │  │ MS, Fiocruz, SMS, SES   │  │
│  └───────────┬────────────┘  └────────────┬────────────┘  └────────────┬────────────┘  │
└──────────────┼────────────────────────────┼────────────────────────────┼───────────────┘
               ▼                            ▼                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              NÚCLEO AUTÔNOMO DE PROCESSAMENTO                          │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │  1. Pipeline ETL & Decodificador de Matriz Bitmask DSR (Descompressão RLE)       │  │
│  │  2. Agente de Vigilância: Google Gemini LLM (Extração Estruturada JSON)          │  │
│  │  3. Motor Heurístico de Contingência (Triplo Requisito & Prevalência Cronológica)│  │
│  │  4. Gatekeeper Adaptativo (Horário de Brasília UTC-3 & Funcionamento do SUS)     │  │
│  └────────────────────────────────────────┬─────────────────────────────────────────┘  │
└───────────────────────────────────────────┼────────────────────────────────────────────┘
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                             ARMAZENAMENTO & SINCRONIZAÇÃO DUAL                         │
│  ┌───────────────────────────────────────┐  ┌───────────────────────────────────────┐  │
│  │ Camada Estática (src/data/)           │  │ Camada Dinâmica (public/data/)        │  │
│  │ Modelos Tipados em TypeScript         │  │ Datasets JSON em Tempo Real (Runtime) │  │
│  └───────────────────────────────────────┘  └───────────────────────────────────────┘  │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND & ENTREGA EDGE (SPA)                             │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │  React 19 + TypeScript + Vite + Tailwind CSS v4 + Recharts                       │  │
│  │  • Mapa Coroplético Vetorial do Brasil (27 UFs)                                  │  │
│  │  • Curva Epidêmica Multianual (2022 a 2026 sobreposto + Média Móvel de 7 semanas)│  │
│  │  • Catálogo de Polos SUS com Badges de Estoque em Tempo Real                     │  │
│  │  • Guia Clínico Completo & FAQ com Busca Instantânea e Filtro por Categorias     │  │
│  └────────────────────────────────────────┬─────────────────────────────────────────┘  │
└───────────────────────────────────────────┼────────────────────────────────────────────┘
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                 DEPLOYMENT: Google Firebase Hosting (CDN Global de Borda)              │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔬 Componentes Centrais do Sistema

### 1. Agente Autônomo de Vigilância (`scripts/agentic_monitor.py`)
Em vez de depender de scrapers estáticos frágeis ou regras fixas em código, o sistema executa um **Agente Autônomo de Inteligência Epidemiológica**:
* **Monitoramento Multicanal em Tempo Real**: Varre continuamente comunicados oficiais (Ministério da Saúde, Fiocruz, Agência Brasil) e tópicos especializados do Google News cobrindo as secretarias de saúde do Rio de Janeiro (SMS-Rio, SES-RJ), São Paulo (SES-SP, SMS-SP), Minas Gerais, Distrito Federal, Bahia e CRIEs (Centros de Referência para Imunobiológicos Especiais) por todo o país.
* **Análise por IA via Google Gemini API**: Submete as notícias coletadas e o catálogo oficial completo de postos ao Google Gemini (`gemini-3.5-flash-lite` ou modelo configurado), utilizando estruturação estrita em JSON Schema.
* **Protocolo de Três Requisitos Obrigatórios**: Para que qualquer notícia altere o status de estoque de um polo, ela DEVE conter obrigatoriamente:
  1. *Identificação explícita da vacina de Mpox* (MVA-BN, Jynneos, mpox).
  2. *Identificação inequívoca do centro ou rede municipal* (ex.: "Super Centro Carioca de Vacinação", "CRIE Fiocruz").
  3. *Situação explícita do estoque* (Doses esgotadas/suspensas vs. Disponíveis/Reabastecidas).
  *Se faltar qualquer um dos 3 itens, a notícia é sumariamente descartada.*
* **Trava de Prevalência Cronológica**: Os comunicados são avaliados estritamente do mais recente para o mais antigo. A primeira decisão válida atribuída a um polo trava a sua situação (`processed_site_ids`), impedindo que notícias antigas veiculadas no mesmo dia revertam a informação mais recente.
* **Contingência Heurística com Zero Falhas**: Caso a API do Gemini esteja inacessível ou atinja rate limit, um motor heurístico interno por casamento léxico assume instantaneamente o processamento sem interromper a esteira.

### 2. Engenharia Reversa do Modelo Semântico Power BI (`scripts/update_data.py`)
Os dados epidemiológicos oficiais do Ministério da Saúde estão hospedados em um dashboard Microsoft Power BI sem API REST pública. Esta plataforma conecta-se diretamente ao modelo semântico:
* **Consultas Semânticas DAX Diretas**: Emite requisições POST autenticadas para o endpoint `wabi-brazil-south-b-primary-api` consultando a entidade `MPX_TRATADO`.
* **Decodificação de Matriz Bitmask DSR (`decode_dsr_matrix`)**: O Power BI comprime saídas tabulares utilizando uma matriz codificada por comprimento de corrida (*Run-Length Encoding* via inteiro `R`) e vetores de dados (`C`, `DM0`, `DM1`). O script decodifica essa bitmask em tempo real, convertendo a resposta compactada em séries temporais estruturadas.
* **Particionamento Inteligente contra Limite de 1.000 Registros**: Divide as consultas por ano (2022 a 2026) e por estado para contornar truncamentos automáticos do backend corporativo da Microsoft.

### 3. Gatekeeper de Frequência Adaptativa (`scripts/check_adaptive_run.py`)
Pipelines agénticos frequentemente desperdiçam recursos de nuvem executando em horários ociosos. A plataforma implementa um **Gatekeeper de Frequência Adaptativa**:
* **Consciência de Fuso Horário (Horário Oficial de Brasília — UTC-3)**: Sincronizado com os horários reais da rede pública de saúde brasileira.
* **Dois Modos de Operação**:
  * `CAMPANHA_ATIVA`: Execuções horárias entre 07h e 22h em dias úteis e das 08h às 22h em fins de semana (acompanhando Super Centros em shoppings). Realiza também varreduras noturnas pontuais de consolidação (03:30 BRT para o fechamento diário do Ministério da Saúde e 21:30 BRT para consolidação no Power BI).
  * `CALMA`: Execuções basais duas vezes ao dia (06h e 18h BRT) em períodos de baixa circulação viral.
* **Saída Antecipada (Early Exit)**: Se nenhuma novidade ou alteração for detectada no ciclo (`git diff --staged --quiet`), o GitHub Actions finaliza imediatamente antes de rodar Node.js, compilação Vite ou deploy, economizando mais de 65% dos minutos de máquina virtual do GitHub Actions.

### 4. Sincronização Dual de Dados (`scripts/export_json.js`)
* **Segurança Estática em Compilação**: Arquivos TypeScript tipados (`src/data/`) asseguram que o build de produção compile sem erros em tempo de empacotamento.
* **Hidratação Dinâmica em Runtime**: O frontend consome dinamicamente os arquivos em `public/data/*.json`, permitindo que o agente atualize estoques, alertas e marcos sem exigir rebuild do código da aplicação.
* **Reconciliação e Preservação**: O script de exportação mescla com segurança as alterações dinâmicas geradas pelo agente, impedindo que compilações locais sobreponham status obtidos em tempo real.

---

## 🎨 Módulos & Recursos da Aplicação

| Módulo | Funcionalidades & Capacidades |
| :--- | :--- |
| **Painel Geral (Dashboard Epidemiológico)** | Contadores acumulados (Casos Confirmados, Prováveis, Suspeitos, Óbitos), perfil demográfico nacional (faixas etárias, sexo, gênero) e tabela classificatória por UF com ordenação por coluna. |
| **Mapa Coroplético Interativo do Brasil** | Mapa vetorial SVG de todas as 27 UFs com escala dinâmica de cores por quantis, tooltips informativos e modal de detalhamento por estado ao clicar. |
| **Curva Epidêmica Multianual** | Gráfico interativo em Recharts sobrepondo as semanas epidemiológicas de 2022 a 2026, com média móvel suavizada de 7 semanas e anotações contextuais de marcos. |
| **Onde se Vacinar (Rede SUS Especializada)** | Catálogo pesquisável de postos e centros especializados (CRIEs, CTAs, SAEs, Super Centros) com badges de disponibilidade em tempo real (`Disponível`, `Esgotado`, `Em Abastecimento`), endereços, telefones, horários e links oficiais das fontes. |
| **Marcos de Vacinação & Dose Fracionada** | Linha do tempo dos lotes adquiridos via Fundo Rotatório da OPAS (*Bavarian Nordic – MVA-BN / Jynneos*) e documentação clínica da **Estratégia de 1/5 da Dose (0,1 mL Intradérmica)** (*Frey et al., NIAID/NIH*). |
| **Guia Clínico & FAQ Dinâmico** | Evolução clínica detalhada (Incubação de 3 a 21 dias, Fase Prodrômica, Fase Eruptiva e Queda de Crostas), critérios de cura, protocolo de atendimento na UBS e FAQ com busca instantânea e filtros por categoria. |
| **Alertas Oficiais & Feed RSS** | Painel cronológico de notas técnicas oficiais, comunicados de abastecimento, vigilância genômica e ensaios terapêuticos. |

---

## ⚖️ Princípios Editoriais & Ética em Saúde Pública

* **Comunicação Sem Estigmas**: Alinhado integralmente com as diretrizes da **OMS**, **UNAIDS** e **Fiocruz**, a plataforma foca estritamente nas dinâmicas de transmissão por contato físico direto e pele a pele íntimo, combatendo preconceitos e estigmatizações de qualquer grupo ou identidade.
* **Foco Real em Redução de Danos**: Prioriza orientações claras para os grupos com maior concentração de casos nas notificações da vigilância nacional (**homens cisgênero que fazem sexo com homens de 18 a 49 anos, independentemente de raça ou orientação sexual**, além de **pessoas vivendo com HIV e usuários de PrEP**), sem jamais discriminar ou negligenciar nenhum outro estrato social.
* **Evidências Científicas Revisadas por Pares**: Todos os protocolos clínicos, prazos de incubação e fundamentações de fracionamento de dose apoiam-se em literatura médica de alto impacto (*The Lancet*, *New England Journal of Medicine*, *Vaccine / NIH*) e notas técnicas normativas da **Anvisa** e do **Ministério da Saúde**.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
* **React 19** & **TypeScript**
* **Vite** (Ambiente de desenvolvimento e empacotamento de última geração)
* **Tailwind CSS v4** (Estilização utilitária de alta velocidade com `@tailwindcss/vite`)
* **Recharts** (Biblioteca declarativa e responsiva de gráficos vetoriais)
* **Lucide React** (Ícones modernos e acessíveis)

### Ciência de Dados & Agentes de IA
* **Python 3.11+**
* **Google Gemini API** (`google-genai` / HTTP JSON REST)
* **Engenharia Reversa Power BI** (Decodificação de matriz bitmask DSR)
* **XML / ElementTree & urllib** (Coleta de feeds em alta velocidade sem dependências pesadas)

### Automação & Infraestrutura
* **GitHub Actions** (Workflows cron horários adaptativos com verificação dirty-tree)
* **Google Firebase Hosting** (CDN global edge serverless com SSL automático)
* **Playwright** (Validação visual contínua e asserções automatizadas com capturas de tela)

---

## 🚀 Como Executar Localmente

### Pré-requisitos
* **Node.js**: v20+ (recomendado) ou v18+
* **Python**: v3.10+
* **Gerenciador de Pacotes**: `npm` (integrado ao Node.js)

### 1. Clonar o Repositório
```bash
git clone https://github.com/sundiall/mpox-tracker-br.git
cd mpox-tracker-br
```

### 2. Instalar Dependências
```bash
# Instalar dependências do frontend
npm install

# (Opcional) Criar ambiente virtual Python
python -m venv venv
# No Windows:
venv\Scripts\activate
# No Linux/macOS:
source venv/bin/activate
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto (opcional para execução local mock, necessário para o agente de IA):
```env
GEMINI_API_KEY=sua_chave_da_google_gemini_api_aqui
GEMINI_MODEL=gemini-3.5-flash-lite
```

### 4. Executar o Pipeline de Dados
```bash
# Avaliar estado epidemiológico e gatekeeper
python scripts/check_adaptive_run.py

# Coletar dados oficiais do Power BI e feeds RSS
python scripts/update_data.py

# Executar o agente autônomo de vigilância
python scripts/agentic_monitor.py

# Reconciliar as camadas estática e dinâmica de dados
node --experimental-strip-types scripts/export_json.js
```

### 5. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```
Acesse `http://localhost:5173` no navegador para interagir com o portal localmente.

### 6. Build de Produção
```bash
npm run build
```
Gera a distribuição estática otimizada no diretório `dist/` pronta para implantação em CDN.

---

## 🔄 Fluxo de Automação CI/CD

O repositório contém a esteira completa automatizada no GitHub Actions em [`.github/workflows/auto_update_and_deploy.yml`](.github/workflows/auto_update_and_deploy.yml):

1. **Gatilho Programado**: Executa no minuto 30 de cada hora (`cron: '30 * * * *'`).
2. **Gatekeeper Adaptativo**: Executa `check_adaptive_run.py` para verificar se os postos de saúde estão em atendimento ou se é horário de consolidação oficial.
3. **Execução do Pipeline e Agente**: Executa `update_data.py` e `agentic_monitor.py`.
4. **Detecção de Mudanças**: Avalia `git diff --staged`. Se não houver novos dados, o workflow é finalizado sem desperdiçar tempo de build.
5. **Compilação & Deploy Automático**: Ao confirmar novos dados, executa `npm run build` e publica a versão atualizada no **Firebase Hosting** via Service Account ou Token de CI, comitando os datasets de volta à branch `main`.

---

## 📊 Fontes de Dados & Atribuições Institucionais

* **Ministério da Saúde do Brasil (SVSA/MS)** — Secretaria de Vigilância em Saúde e Ambiente (Painel Epidemiológico Oficial em Power BI).
* **Fundação Oswaldo Cruz (Fiocruz)** — Agência Fiocruz de Notícias & Instituto Nacional de Infectologia Evandro Chagas (INI/Fiocruz).
* **Agência Nacional de Vigilância Sanitária (Anvisa)** — Notas técnicas de vacinas e autorizações de uso emergencial.
* **Secretarias Estaduais e Municipais de Saúde (SES & SMS)** — Notícias oficiais, boletins informativos e informes de imunização (SMS-Rio, SES-SP, SES-MG, etc.).
* **Organização Pan-Americana da Saúde (OPAS / OMS)** — Aquisições pelo Fundo Rotatório e diretrizes globais.

---

## 🛡️ Aviso Legal / Disclaimer

Este portal é uma **ferramenta não governamental e independente de ciência de dados em saúde**. As informações apresentadas têm finalidade estritamente informativa, educacional e de redução de danos, compiladas a partir de dados públicos abertos.

Não substitui avaliação médica profissional. Em caso de suspeita clínica, lesões ou emergências, procure a **Unidade Básica de Saúde (UBS)** mais próxima ou ligue para o **Disque Saúde 136** do SUS.

---

## 👨‍💻 Autor & Portfólio

Projeto desenvolvido como vitrine técnica de engenharia de software e ciência de dados aplicadas à saúde pública: **Engenharia de Dados Moderna**, **Agentes Autônomos de IA**, **Engenharia Reversa de Protocolos** e **Arquitetura Jamstack de Alta Performance**.

* **GitHub**: [@sundiall](https://github.com/sundiall)
* **Repositório**: [sundiall/mpox-tracker-br](https://github.com/sundiall/mpox-tracker-br)
* **Plataforma Online**: [https://mpox-tracker-br.web.app](https://mpox-tracker-br.web.app)

---

<div align="center">
  <sub>Desenvolvido com rigor técnico para a transparência de dados da saúde pública brasileira. Licenciado sob a Licença MIT.</sub>
</div>
