# 🦠 MPOX Brasil — Epidemiological Surveillance & Public Health Intelligence Platform

<div align="center">

[![Live Application](https://img.shields.io/badge/Live%20Platform-mpox--tracker--br.web.app-0284c7?style=for-the-badge&logo=google-chrome&logoColor=white)](https://mpox-tracker-br.web.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)
[![GitHub Workflow](https://img.shields.io/github/actions/workflow/status/sundiall/mpox-tracker-br/auto_update_and_deploy.yml?branch=main&style=for-the-badge&logo=githubactions&logoColor=white&label=CI%2FCD%20Pipeline)](https://github.com/sundiall/mpox-tracker-br/actions)

<p align="center">
  <b>An autonomous, real-time epidemiological intelligence and vaccination tracking platform for Mpox in Brazil.</b><br/>
  Powered by autonomous AI agents, automated Power BI semantic model reverse-engineering, adaptive execution pipelines, and a high-performance Jamstack architecture.
</p>

**[🌐 English](./README.md)** • **[🇧🇷 Português (Brasil)](./README.pt-BR.md)**

---

</div>

## 📌 Executive Summary

**MPOX Brasil** is an open-source, independent public health data science platform created to provide transparency, real-time epidemiological monitoring, and evidence-based education regarding the mpox situation across all **27 Brazilian Federative Units**.

By combining **autonomous multi-source AI agents (Google Gemini)**, **direct binary reverse-engineering of official Ministry of Health Power BI models**, and an **adaptive operational gatekeeper**, the platform continuously tracks vaccine availability in specialized public healthcare units (SUS), alerts the public to official health bulletins, and visualizes epidemiological trends without stigmatization.

Hosted at zero cost on **Google Firebase Hosting (Google Cloud)**, it is architected for maximum speed, accessibility, and zero-maintenance resilience.

---

## ⚡ Architectural Highlights & Engineering Showcase

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   DATA INGESTION TIER                                  │
│  ┌────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐  │
│  │ MS Power BI API        │  │ Google News Real-Time   │  │ Institutional Feeds     │  │
│  │ Semantic Query Engine  │  │ Multi-Region Topic RSS  │  │ MS, Fiocruz, SMS, SES   │  │
│  └───────────┬────────────┘  └────────────┬────────────┘  └────────────┬────────────┘  │
└──────────────┼────────────────────────────┼────────────────────────────┼───────────────┘
               ▼                            ▼                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               AUTONOMOUS PROCESSING CORE                               │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │  1. Python ETL & Power BI Bitmask Matrix Decoder (Run-Length DSR Decompression)   │  │
│  │  2. AI Surveillance Agent: Google Gemini LLM (Structured JSON Extraction)        │  │
│  │  3. Heuristic Fallback Engine (Tri-Factor Verification & Chronological Lock)     │  │
│  │  4. Adaptive Gatekeeper (Brasília Timezone & SUS Healthcare Working Hours Gate)  │  │
│  └────────────────────────────────────────┬─────────────────────────────────────────┘  │
└───────────────────────────────────────────┼────────────────────────────────────────────┘
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              STORAGE & DUAL SYNCHRONIZATION                            │
│  ┌───────────────────────────────────────┐  ┌───────────────────────────────────────┐  │
│  │ Static Compilation Layer (src/data/)  │  │ Dynamic Hydration Tier (public/data/) │  │
│  │ TypeScript Type-Safe Data Models      │  │ Real-Time JSON Feeds (Runtime Sync)   │  │
│  └───────────────────────────────────────┘  └───────────────────────────────────────┘  │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND & EDGE DELIVERY (SPA)                            │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │  React 19 + TypeScript + Vite + Tailwind CSS v4 + Recharts                       │  │
│  │  • Interactive Brazil Choropleth Map (27 States)                                 │  │
│  │  • Multi-Year Epidemic Curve (2022–2026 Overlay + Moving Average)                 │  │
│  │  • Specialized SUS Vaccination Center Directory with Live Stock Badges           │  │
│  │  • Clinical Guidance & Instant Search Searchable FAQ                             │  │
│  └────────────────────────────────────────┬─────────────────────────────────────────┘  │
└───────────────────────────────────────────┼────────────────────────────────────────────┘
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                 DEPLOYMENT: Google Firebase Hosting (Global Edge CDN)                  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔬 Core System Components

### 1. Autonomous Surveillance Agent (`scripts/agentic_monitor.py`)
Rather than relying on brittle scrapers or hard-coded rules, the platform deploys an **Autonomous Public Health Intelligence Agent**:
* **Multi-Channel Monitoring**: Scans official institutional feeds (Ministry of Health, Fiocruz, Agência Brasil) and continuous geo-targeted Google News feeds covering health departments in São Paulo (SES-SP, SMS-SP), Rio de Janeiro (SMS-Rio, SES-RJ), Minas Gerais, Distrito Federal, Bahia, and nationwide CRIEs (Special Immunobiological Referral Centers).
* **AI Analysis via Google Gemini API**: Feeds unstructured news items and the full monitored center catalog into Google Gemini (`gemini-3.5-flash-lite` or configured model) using strict JSON Schema enforcement.
* **Tri-Factor Verification Protocol**: A news report can only alter vaccine center inventory if it satisfies three strict criteria simultaneously:
  1. *Explicit Mpox identification* (MVA-BN, Jynneos, mpox).
  2. *Unambiguous municipal network or facility identification* (e.g., "Super Centro Carioca de Vacinação", "CRIE Fiocruz").
  3. *Explicit inventory status* (Doses depleted/suspended vs. Active/Restocked).
  *If any criterion is absent, the news item is strictly discarded.*
* **Chronological Precedence Lock**: Feeds are ordered strictly from most recent to oldest. The most recent valid news finding immediately locks the state for that unit (`processed_site_ids`), preventing older reports published earlier the same day from reverting the true current status.
* **Zero-Failure Heuristic Fallback**: If the Gemini API is unreachable or rate-limited, an internal token-matching heuristic engine automatically activates to preserve uptime.

### 2. Reverse-Engineered Power BI Semantic Engine (`scripts/update_data.py`)
Official epidemiological statistics published by the Brazilian Ministry of Health reside within a Microsoft Power BI dashboard lacking an open REST API. This platform programmatically interfaces with the underlying semantic model:
* **Direct DAX Semantic Queries**: Submits authenticated POST requests directly to `wabi-brazil-south-b-primary-api` targeting the `MPX_TRATADO` entity.
* **DSR Matrix Bitmask Decoding (`decode_dsr_matrix`)**: Microsoft Power BI compresses tabular outputs using a run-length encoded bitmask (`R` integer) and value arrays (`C`, `DM0`, `DM1`). The script unpacks these bitmasks in real time, converting compressed responses into structured weekly case records.
* **Partitioned Queries Bypassing 1,000-Row Limits**: Automatically fragments queries across historical years (2022 to 2026) and states to prevent data truncation.

### 3. Adaptive Execution Gatekeeper (`scripts/check_adaptive_run.py`)
Automated surveillance pipelines often waste expensive cloud compute during idle periods. The platform implements an **Adaptive Operational Gatekeeper**:
* **Brasília Timezone Awareness (UTC-3)**: Aligns pipeline runs with actual SUS healthcare hours.
* **Dual Operation Modes**:
  * `CAMPANHA_ATIVA` (Active Campaign): Runs hourly between 07:00 and 22:00 BRT on weekdays and 08:00 to 22:00 on weekends (covering Extended Super Centers). Also triggers dedicated overnight consolidation runs (03:30 BRT for Ministry of Health daily batch sync, 21:30 BRT for evening Power BI reconciliations).
  * `CALMA` (Epidemiological Baseline): Runs twice daily (06:00 and 18:00 BRT) when transmission levels are baseline.
* **Dirty-Tree Early Exit**: If no data alterations or news alerts are discovered during a cycle (`git diff --staged --quiet`), GitHub Actions immediately terminates before invoking Node.js, Vite, or deployment steps, saving >65% of CI/CD runtime minutes.

### 4. Dual Data Architecture & Safe Reconciliation (`scripts/export_json.js`)
* **Static Compile-Time Safety**: Type-checked TypeScript datasets (`src/data/`) guarantee flawless zero-runtime-error builds during production compilation.
* **Dynamic Runtime Hydration**: Client-side fetch routines hydrate components directly from `public/data/*.json`, allowing the agent to update inventory, alerts, and time series without requiring a complete code rebuild.
* **Reconciliation Layer**: Build exports intelligently merge live agent modifications with static baselines, ensuring dynamic stock records are never overwritten during redeployments.

---

## 🎨 User Interface & Public Health Modules

| Module | Features & Capabilities |
| :--- | :--- |
| **National Epidemiological Dashboard** | Real-time KPI counters (Confirmed Cases, Probable Cases, Suspected Cases, Fatalities), national demographic breakdowns (age brackets, sex, gender), and state-level rank tables. |
| **Interactive Choropleth Brazil Map** | Vector SVG map rendering all 27 Brazilian states with dynamic quantile-based color scaling, hover tooltips, and state-specific drill-down modal views. |
| **Multi-Year Epidemic Curve** | Interactive Recharts graph comparing weekly epidemiological trends from 2022 through 2026, 7-week moving average smoothing, and milestone annotations. |
| **Vaccination Sites Directory** | Searchable database of specialized SUS vaccination centers (CRIEs, CTAs, SAEs, Super Centros) with live inventory badges (`Available`, `Depleted`, `Replenishing`), address, operating hours, and official source links. |
| **Vaccine Milestones & Fractional Dose Strategy** | Interactive timeline covering OPAS/PAHO procurement lots (MVA-BN / Jynneos) and scientific documentation on the **1/5 Dose (0.1 mL Intradermal)** dose-sparing strategy (*Frey et al., NIAID/NIH*). |
| **Clinical Guide & Searchable FAQ** | Clinical progression guide (Incubation 3–21 days, Prodrome, Rash, Crust Desquamation), transmission mechanics, diagnostic testing protocols (RT-PCR), and a searchable instant-filter FAQ. |
| **Official Alerts & RSS Feed** | Chronological feed of official epidemiological bulletins, technical notes, genomic surveillance findings, and vaccine supply announcements. |

---

## ⚖️ Editorial Policy & Public Health Ethics

* **Stigma Reduction Standard**: Strictly adheres to **WHO**, **UNAIDS**, and **Fiocruz** guidelines. Transmission is framed accurately around physical and close skin-to-skin contact, actively combating discrimination and misleading stereotyping.
* **Targeted Harm Reduction**: Highlights actionable guidance for demographics with highest notified incidence in national surveillance data (**men who have sex with men aged 18–49, regardless of race or sexual identity**, and **people living with HIV/PrEP users**) without ever excluding or neglecting other groups.
* **Scientific Grounding**: Every clinical protocol, incubation timeline, and dose-fractionation statement cites peer-reviewed medical literature (*The Lancet*, *New England Journal of Medicine*, *Vaccine / NIH*) alongside official normative notes from **Anvisa** and the **Ministry of Health**.

---

## 🛠️ Tech Stack & Architecture

### Frontend
* **React 19** & **TypeScript**
* **Vite** (Next-generation frontend tooling)
* **Tailwind CSS v4** (Modern utility-first styling with `@tailwindcss/vite`)
* **Recharts** (Declarative composable charting library)
* **Lucide React** (Clean, accessible SVG iconography)

### Data Engineering & Autonomous Agents
* **Python 3.11+**
* **Google Gemini API** (`google-genai` / HTTP JSON REST)
* **Power BI Semantic Engine Integration** (Run-length bitmask decoding)
* **XML / ElementTree & urllib** (Dependency-free, high-speed feed collection)

### Automation & Infrastructure
* **GitHub Actions** (Hourly adaptive cron workflows, dirty-tree optimization)
* **Google Firebase Hosting** (Serverless global edge CDN, automatic SSL)
* **Playwright** (Visual regression verification & automated screenshot assertions)

---

## 🚀 Local Setup & Installation

### Prerequisites
* **Node.js**: v20+ (recommended) or v18+
* **Python**: v3.10+
* **Package Manager**: `npm` (included with Node.js)

### 1. Clone the Repository
```bash
git clone https://github.com/sundiall/mpox-tracker-br.git
cd mpox-tracker-br
```

### 2. Install Dependencies
```bash
# Install frontend packages
npm install

# (Optional) Set up Python virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory (optional for local mock run, required for agent analysis):
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
GEMINI_MODEL=gemini-3.5-flash-lite
```

### 4. Run the Data Pipeline
```bash
# Check adaptive gatekeeper status
python scripts/check_adaptive_run.py

# Ingest official Power BI data and RSS feeds
python scripts/update_data.py

# Run the autonomous surveillance agent
python scripts/agentic_monitor.py

# Reconcile dynamic and static data layers
node --experimental-strip-types scripts/export_json.js
```

### 5. Launch the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173` to explore the application locally.

### 6. Production Build
```bash
npm run build
```
Generates an optimized static distribution in the `dist/` directory ready for CDN deployment.

---

## 🔄 CI/CD Automation Workflow

The repository includes a production-tested GitHub Actions workflow at [`.github/workflows/auto_update_and_deploy.yml`](.github/workflows/auto_update_and_deploy.yml):

1. **Scheduled Trigger**: Runs on the 30th minute of every hour (`cron: '30 * * * *'`).
2. **Adaptive Gatekeeper**: Calls `check_adaptive_run.py` to evaluate whether SUS clinics are currently operating or if an overnight consolidation window applies.
3. **Data Pipeline & Agent Execution**: Executes `update_data.py` and `agentic_monitor.py`.
4. **Change Detection**: Checks `git diff --staged` on data directories. If no changes occurred, the workflow gracefully exits without executing build or deploy steps.
5. **Compilation & Deployment**: When new data is confirmed, compiles the application via `npm run build` and deploys automatically to **Firebase Hosting** via Service Account or CI Token, committing updated datasets back to `main`.

---

## 📊 Data Sources & Institutional Attributions

* **Ministério da Saúde do Brasil (SVSA/MS)** — Secretária de Vigilância em Saúde e Ambiente (Official Power BI Epidemiological Surveillance Dashboard).
* **Fundação Oswaldo Cruz (Fiocruz)** — Agência Fiocruz de Notícias & Instituto Nacional de Infectologia Evandro Chagas (INI/Fiocruz).
* **Agência Nacional de Vigilância Sanitária (Anvisa)** — Vaccine technical notes and emergency use authorizations.
* **Secretarias Estaduais e Municipais de Saúde (SES & SMS)** — Official press releases, municipal health bulletins, and immunization reports (SMS-Rio, SES-SP, SES-MG, etc.).
* **Organização Pan-Americana da Saúde (OPAS / OMS)** — PAHO Revolving Fund procurement milestones and international guidelines.

---

## 🛡️ Disclaimer

This platform is an **independent, non-governmental public health data science project**. All presented information is intended solely for epidemiological transparency, educational purposes, and harm reduction, compiled from open public records. 

It does not constitute medical advice. For clinical evaluation, diagnosis, or emergencies, seek care at the nearest **Unidade Básica de Saúde (UBS)** or dial the Brazilian Unified Health System hotline at **Disque Saúde 136**.

---

## 👨‍💻 Author & Portfolio Information

Developed as an advanced portfolio demonstration of **Modern Data Engineering**, **Autonomous AI Agents**, **Reverse-Engineering Capabilities**, and **Responsive Jamstack Architecture**.

* **GitHub**: [@sundiall](https://github.com/sundiall)
* **Repository**: [sundiall/mpox-tracker-br](https://github.com/sundiall/mpox-tracker-br)
* **Production Deployment**: [https://mpox-tracker-br.web.app](https://mpox-tracker-br.web.app)

---

<div align="center">
  <sub>Built with precision for Brazilian Public Health Data Transparency. Released under the MIT License.</sub>
</div>
