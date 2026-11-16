# MPOX BRASIL — Painel de Monitoramento, Vacinas & Guia Clínico

Iniciativa independente de ciência de dados em saúde pública dedicada ao acompanhamento epidemiológico da **mpox no Brasil**, transparência na distribuição de imunizantes e educação em saúde baseada em evidências científicas.

---

## 🎯 Princípios Editoriais & População-Foco

* **Comunicação Sem Estigmas**: Alinhado com as diretrizes da **OMS**, **UNAIDS** e **Fiocruz**, o portal enfatiza as dinâmicas de transmissão por contato físico direto e íntimo pele a pele, combatendo qualquer estigmatização de identidades.
* **Foco Epidemiológico Real**: Prioriza informações práticas e redução de danos para a população com maior concentração de casos notificados na vigilância nacional (**homens cisgênero que fazem sexo com homens de 18 a 49 anos, independentemente de raça ou orientação sexual**), sem jamais discriminar ou negligenciar qualquer outro grupo social.
* **Transparência Científica**: Todos os protocolos clínicos contam com referências diretas a estudos revisados por pares (*The Lancet*, *NEJM*, *Vaccine / NIH*) e notas técnicas da **Anvisa** e do **Ministério da Saúde**.

---

## 🧬 Módulos da Aplicação

1. **Painel Geral (Dashboard Epidemiológico)**:
   - Indicadores acumulados de casos confirmados, casos prováveis, casos em investigação e óbitos.
   - Mapa coroplético e seletor territorial interativo com todas as **27 Unidades da Federação (UF)**.
   - Perfil demográfico nacional e tendências por estado.

2. **Marcos de Vacinação (Milestones & Linha do Tempo)**:
   - Histórico de lotes adquiridos via Fundo Rotatório da OPAS (*Bavarian Nordic – MVA-BN / JYNNEOS*).
   - Detalhamento da **Estratégia de 1/5 da Dose (0,1 mL Intradérmica)** no Rio de Janeiro e Brasil, com fundamentação imunológica (estudo clínico NIAID/NIH *Frey et al.*) e critérios de indicação para usuários de PrEP e pessoas vivendo com HIV (PVHIV).

3. **Guia Clínico & Perguntas Frequentes (FAQ)**:
   - Fases da infecção: **Período de Incubação (3 a 21 dias)**, Fase Prodrômica, Fase Eruptiva e Descolamento de Crostas.
   - Período de Transmissibilidade e critério de cura (queda de 100% das crostas e pele nova íntegra).
   - Protocolo de conduta em caso de suspeita (isolamento, proteção de lesões, busca por UBS/CTA e coleta de RT-PCR).
   - FAQ dinâmico com mecanismo de busca instantânea e filtros por categoria.

4. **Onde se Vacinar (Rede SUS Especializada)**:
   - Catálogo de Centros de Testagem e Aconselhamento (CTA), Serviços de Atenção Especializada (SAE) e polos de imunização com endereços, telefones, horários e modalidades de acesso.

5. **Alertas Oficiais & Feed RSS**:
   - Agregação de notas técnicas e comunicados do Ministério da Saúde, Fiocruz, Anvisa e secretarias estaduais.
   - Seção evolutiva para novos achados em vigilância genômica (cepas) e ensaios terapêuticos (ex.: tecovirimat).

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 18+ (recomendado 20+)
- Python 3.10+

### Instalação e Execução
```bash
# 1. Instalar dependências
npm install

# 2. Executar servidor de desenvolvimento
npm run dev

# 3. Executar o script de coleta automatizada de RSS e dados
python scripts/update_data.py

# 4. Gerar build de produção
npm run build
```

---

## ☁️ Hospedagem Gratuita com Recursos Google Cloud (Google AI / Firebase)

A infraestrutura foi desenhada no modelo **Jamstack / Serverless**, permitindo hospedagem de alto desempenho a **custo zero** via **Google Firebase Hosting** (integrado ao ecossistema Google Cloud):

### Passo a Passo de Deploy no Firebase:
1. Instale o Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Faça login com sua conta Google (vinculada à sua assinatura Google AI Plus):
   ```bash
   firebase login
   ```
3. Inicialize ou vincule o projeto:
   ```bash
   firebase init hosting
   # Selecione seu projeto Google Cloud existente ou crie um novo
   # Diretório público: dist
   # Configurar como SPA: Yes
   ```
4. Compile e faça o deploy:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```
Sua aplicação estará no ar imediatamente com CDN global de alta velocidade, certificado SSL automático e domínio gratuito `.web.app` / `.firebaseapp.com`.

---

## 🤖 Pipeline de Atualização Automática (GitHub Actions)

O repositório já inclui o arquivo `.github/workflows/auto_update_and_deploy.yml` configurado para:
* Executar a cada 12 horas via cron (`0 0,12 * * *`).
* Executar `python scripts/update_data.py`.
* Atualizar os datasets JSON.
* Recompilar e publicar a versão atualizada automaticamente.

---

## ⚖️ Aviso Legal / Disclaimer
Este portal é uma **ferramenta não governamental e independente de ciência de dados**. As informações apresentadas têm finalidade exclusivamente informativa e educacional, compiladas a partir de dados públicos abertos. Em caso de suspeita clínica ou emergência, procure a Unidade Básica de Saúde (UBS) mais próxima ou entre em contato com o **Disque Saúde 136** do SUS.
