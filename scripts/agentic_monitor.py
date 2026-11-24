"""
Agente de Vigilância Epidemiológica & Monitoramento em Tempo Real — MPOX Brasil
Monitora múltiplos canais oficiais (RSS institucional, alertas de notícias municipais em tempo real
e redes sociais via bridges), analisa o impacto com Google Gemini API (Estratégia 1)
e atualiza os postos de vacinação, alertas técnicos e marcos da plataforma.
"""

import os
import sys
import json
import re
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime

try:
    from update_data import update_sync_status
except ImportError:
    from scripts.update_data import update_sync_status

# Feeds de Notícias e Alertas em Tempo Real
FEEDS = [
    {
        "nome": "Google News Real-Time (Mpox Vacinas, Fiocruz, CEVAA, SUS)",
        "url": "https://news.google.com/rss/search?q=" + urllib.parse.quote("mpox (vacina OR doses OR prep OR fiocruz OR cevaa OR esgotou OR lote) brasil") + "&hl=pt-BR&gl=BR&ceid=BR:pt-419",
        "tipo": "google_news"
    },
    {
        "nome": "Google News Real-Time (Mpox RJ & SP Super Centros & Redes Sociais)",
        "url": "https://news.google.com/rss/search?q=" + urllib.parse.quote("mpox (vacina OR doses OR prep) (esgotou OR acabou OR 'sem doses' OR 'saude_rio' OR 'saudeprefsp' OR 'super centro' OR fila OR 'novo lote')") + "&hl=pt-BR&gl=BR&ceid=BR:pt-419",
        "tipo": "google_news"
    },
    {
        "nome": "Google News Real-Time (CIEVS & Secretarias RJ, SP, DF, MG, BA)",
        "url": "https://news.google.com/rss/search?q=" + urllib.parse.quote("mpox ('secretaria de saude' OR 'secretaria municipal' OR cievs OR 'boletim epidemiologico') (rio OR 'sao paulo' OR 'distrito federal' OR 'minas gerais')") + "&hl=pt-BR&gl=BR&ceid=BR:pt-419",
        "tipo": "google_news"
    },
    {
        "nome": "Google News Real-Time (Mpox Tier 1: CE, DF, SC, PR, RS, PE, RO)",
        "url": "https://news.google.com/rss/search?q=" + urllib.parse.quote("mpox (vacina OR doses OR prep OR crie) (ceara OR fortaleza OR brasilia OR 'distrito federal' OR curitiba OR 'porto alegre' OR recife OR 'porto velho' OR 'hospital sao jose' OR cemetron OR huoc)") + "&hl=pt-BR&gl=BR&ceid=BR:pt-419",
        "tipo": "google_news"
    },
    {
        "nome": "Prefeitura da Cidade do Rio de Janeiro (SMS-Rio Notícias)",
        "url": "https://prefeitura.rio/feed/",
        "tipo": "institucional"
    },
    {
        "nome": "Agência Brasil - Saúde (SUS & Cobertura Nacional)",
        "url": "https://agenciabrasil.ebc.com.br/rss/saude/feed.xml",
        "tipo": "institucional"
    },
    {
        "nome": "Ministério da Saúde - Notícias Oficiais",
        "url": "https://www.gov.br/saude/pt-br/assuntos/noticias/RSS",
        "tipo": "institucional"
    },
    {
        "nome": "Agência Fiocruz de Notícias",
        "url": "https://agencia.fiocruz.br/rss.xml",
        "tipo": "institucional"
    }
]

KEYWORDS = [
    "mpox", "varíola", "mva-bn", "jynneos", "vacina", "vacinação",
    "fiocruz", "cevaa", "prep", "crie", "super centro", "doses", "esgotou",
    "acabou", "falta", "sem doses", "reabastecimento", "lote", "saude_rio", "saudeprefsp", "fila", "subpav",
    "ceara", "fortaleza", "brasilia", "curitiba", "porto alegre", "recife", "porto velho", "huoc", "cemetron", "hub", "hsj"
]

def fetch_feed_items():
    print("📡 [Agente] Iniciando varredura de feeds em tempo real...")
    items = []
    seen_links = set()

    for feed in FEEDS:
        try:
            req = urllib.request.Request(
                feed["url"],
                headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) MpoxBrasilAgent/1.0"}
            )
            with urllib.request.urlopen(req, timeout=12) as response:
                content = response.read()
                root = ET.fromstring(content)

                for item in root.findall(".//item")[:15]:
                    title = item.findtext("title") or ""
                    link = item.findtext("link") or ""
                    pub_date = item.findtext("pubDate") or ""
                    description = item.findtext("description") or ""

                    clean_desc = re.sub(r'<[^>]+>', '', description).strip()
                    full_text = f"{title} {clean_desc}".lower()

                    if any(kw in full_text for kw in KEYWORDS):
                        if link not in seen_links:
                            seen_links.add(link)
                            items.append({
                                "fonte": feed["nome"],
                                "titulo": title.strip(),
                                "resumo": clean_desc[:300],
                                "link": link.strip(),
                                "data": pub_date
                            })
        except Exception as e:
            print(f"⚠️ Erro ao consultar feed '{feed['nome']}': {e}")

    print(f"✅ [Agente] {len(items)} notícias e comunicados relevantes encontrados.")
    return items

def analyze_with_gemini(items, api_key):
    """
    Envia as notícias coletadas para a API do Google Gemini para classificação agéntica estruturada.
    """
    print("🧠 [Agente] Invocando Google Gemini API para análise de impacto...")
    # Modelos suportados pela Gemini API
    model_name = os.environ.get("GEMINI_MODEL", "gemini-3.8-flash")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"

    # Priorizar e filtrar notícias com foco operacional de vacinação e municípios
    prioritized_items = []
    other_items = []
    vaccine_terms = ["vacina", "doses", "super centro", "botafogo", "lote", "crie", "esgotou", "suspensa", "apenas", "pbh", "sms-rio", "saudeprefsp"]
    for it in items:
        t = f"{it.get('titulo', '')} {it.get('resumo', '')}".lower()
        if any(w in t for w in vaccine_terms):
            prioritized_items.append(it)
        else:
            other_items.append(it)
    selected_items = (prioritized_items + other_items)[:25]

    prompt = f"""
Você é o Agente de Vigilância Epidemiológica da plataforma pública MPOX Brasil (https://mpox-tracker-br.web.app).
Analise com rigor factual a seguinte lista de notícias, comunicados e matérias sobre mpox coletadas hoje ({datetime.now().strftime('%d/%m/%Y')}):

{json.dumps(selected_items, ensure_ascii=False, indent=2)}

Sua tarefa é extrair e produzir um objeto JSON estritamente válido.
IMPORTANTE SOBRE UNIDADES E IDs:
Cada unidade deve ser reportada de forma individual e específica com sua respectiva id de centro sempre que aplicável.
Ids de referência conhecidas:
- 'rj-1': CRIE / INI / Fiocruz
- 'rj-2': Super Centro Carioca de Vacinação — Botafogo
- 'rj-3': Super Centro Carioca de Vacinação — Zona Norte (Shopping Nova América)
- 'rj-4': Super Centro Carioca de Vacinação — Zona Oeste (ParkShopping Campo Grande)
- 'rj-5': CEVAA (Dr. Álvaro Aguiar)
- 'sp-1': CRT DST/Aids-SP
- 'sp-2': CTA Henfil
- 'sp-3': SAE Campos Elíseos
- 'sp-4': CRIE HC / Emílio Ribas
- 'sp-5': SAE Lapa
- 'sp-6': Centro de Referência Campinas
- 'mg-1': Hospital Eduardo de Menezes
- 'mg-2': URS Centro-Sul
- 'mg-3': CTA/SAE Sagrada Família
- 'mg-4': CTR Orestes Diniz
- 'mg-5': CRIE Hospital Odilon Behrens
- 'ce-1': CRIE Ceará (Hospital São José)
- 'df-1': CRIE DF (HUB / UnB)
- 'df-2': Hospital Dia da Asa Sul
- 'sc-1': CRIE Santa Catarina (Hospital Nereu Ramos)
- 'pr-1': CRIE Paraná (CHC / UFPR)
- 'pr-2': COA Curitiba
- 'rs-1': CRIE Rio Grande do Sul (Sanatório Partenon)
- 'rs-2': Centro de Saúde Santa Marta
- 'pe-1': CRIE Pernambuco (HUOC / UPE)
- 'pe-2': Policlínica Gouveia de Barros
- 'ro-1': CRIE Rondônia (CEMETRON)

Estrutura JSON esperada:
{{
  "alteracoesEstoque": [
    {{
      "siteId": "id específica do centro (ex: 'rj-2', 'rj-3') ou vazio se não identificado",
      "unidade": "nome da unidade individual",
      "uf": "RJ, SP, MG, etc.",
      "statusEstoque": "esgotado" | "disponivel" | "em_abastecimento" | "previsto",
      "motivo": "resumo de 1 frase justificando com base no comunicado oficial",
      "previsaoFutura": "previsão de datas, chegada de lotes futuros ou ampliação de grupos elegíveis",
      "fonte": "nome da fonte ou link"
    }}
  ],
  "novosMarcos": [
    {{
      "titulo": "título do marco (apenas se for política pública ou fato histórico novo)",
      "dataEstimada": "YYYY-MM ou semana",
      "categoria": "vacina" | "vigilancia" | "clinica",
      "descricao": "resumo do marco"
    }}
  ],
  "alertasUrgentes": [
    {{
      "titulo": "título do alerta",
      "tipo": "disponibilidade_vacina" | "criterios_elegibilidade" | "nota_tecnica",
      "resumo": "resumo sucinto",
      "linkOficial": "url da matéria"
    }}
  ]
}}

Responda APENAS com o JSON puro, sem blocos markdown ou explicações adicionais.
"""

    payload = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.1
        }
    }

    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            res_json = json.loads(resp.read().decode("utf-8"))
            candidate = res_json.get("candidates", [{}])[0]
            text = candidate.get("content", {}).get("parts", [{}])[0].get("text", "{}")
            structured_data = json.loads(text)
            print("✅ [Agente] Análise de impacto gerada com sucesso pela Gemini API.")
            return structured_data
    except Exception as e:
        print(f"⚠️ Erro ao chamar Gemini API: {e}. Prosseguindo com fallback heurístico.")
        return fallback_heuristic_analysis(items)

def fallback_heuristic_analysis(items):
    """
    Fallback heurístico executado quando não houver chave GEMINI_API_KEY ou ocorrer falha de rede.
    Analisa comunicados oficiais de forma bidirecional (detecção tanto de esgotamento quanto de reposição/novos lotes).
    """
    print("⚙️ [Agente] Executando análise heurística bidirecional baseada em regras...")
    alteracoes = []
    alertas = []

    for it in items:
        texto = f"{it['titulo']} {it['resumo']}".lower()

        # Palavras-chave indicativas de abastecimento e esgotamento
        is_reabastecimento = any(p in texto for p in [
            "reabastece", "reabastecimento", "novas doses", "novo lote", "mais mil",
            "retoma", "retomou", "amplia", "ampliação", "recebe mil", "chegada", "reforço de doses"
        ])
        is_esgotamento = any(p in texto for p in [
            "esgotou", "esgotado", "acabou", "terminou", "fila", "alta procura", "sem doses", "falta de doses"
        ])

        # 1. Rio de Janeiro (Detecção individual e específica por Centro)
        if any(term in texto for term in ["super centro", "botafogo", "nova américa", "campo grande", "rio de janeiro", "sms-rio", "município do rio"]):
            # Caso 1.1: Disponibilidade explícita em Botafogo / Suspensão nos outros centros
            if "apenas" in texto and "botafogo" in texto and any(s in texto for s in ["suspensa", "esgotad", "reduzid"]):
                alteracoes.append({
                    "siteId": "rj-2",
                    "unidade": "Super Centro Carioca de Vacinação — Botafogo",
                    "uf": "RJ",
                    "statusEstoque": "disponivel",
                    "motivo": "Vacinação ativa e centralizada pela SMS-Rio na unidade Botafogo (08h às 22h).",
                    "previsaoFutura": "Doses mantidas ativas para PrEP e PVHA (CD4 < 200). Aguardando novas remessas complementares do Ministério da Saúde.",
                    "fonte": it["link"]
                })
                alteracoes.append({
                    "siteId": "rj-3",
                    "unidade": "Super Centro Carioca de Vacinação — Zona Norte (Shopping Nova América)",
                    "uf": "RJ",
                    "statusEstoque": "esgotado",
                    "motivo": "Aplicação temporariamente suspensa pela SMS-Rio devido à redução de estoques municipais.",
                    "previsaoFutura": "Previsão de retomada após chegada e distribuição de novos lotes federais pelo Ministério da Saúde.",
                    "fonte": it["link"]
                })
                alteracoes.append({
                    "siteId": "rj-4",
                    "unidade": "Super Centro Carioca de Vacinação — Zona Oeste (ParkShopping Campo Grande)",
                    "uf": "RJ",
                    "statusEstoque": "esgotado",
                    "motivo": "Aplicação temporariamente suspensa pela SMS-Rio devido à redução de estoques municipais.",
                    "previsaoFutura": "Previsão de retomada após chegada e distribuição de novos lotes federais pelo Ministério da Saúde.",
                    "fonte": it["link"]
                })
            elif is_reabastecimento:
                # Reabastecimento geral
                for sid, sname in [
                    ("rj-2", "Super Centro Carioca de Vacinação — Botafogo"),
                    ("rj-3", "Super Centro Carioca de Vacinação — Zona Norte (Shopping Nova América)"),
                    ("rj-4", "Super Centro Carioca de Vacinação — Zona Oeste (ParkShopping Campo Grande)")
                ]:
                    alteracoes.append({
                        "siteId": sid,
                        "unidade": sname,
                        "uf": "RJ",
                        "statusEstoque": "disponivel",
                        "motivo": "Reabastecido com novo lote de frascos enviado pelo Ministério da Saúde. Vacinação ativa.",
                        "previsaoFutura": "Vacinação ativa enquanto durar o lote repassado pelo Ministério da Saúde.",
                        "fonte": it["link"]
                    })
            elif is_esgotamento:
                for sid, sname in [
                    ("rj-2", "Super Centro Carioca de Vacinação — Botafogo"),
                    ("rj-3", "Super Centro Carioca de Vacinação — Zona Norte (Shopping Nova América)"),
                    ("rj-4", "Super Centro Carioca de Vacinação — Zona Oeste (ParkShopping Campo Grande)")
                ]:
                    alteracoes.append({
                        "siteId": sid,
                        "unidade": sname,
                        "uf": "RJ",
                        "statusEstoque": "esgotado",
                        "motivo": "Doses temporariamente esgotadas segundo comunicados oficiais. Aguardando reposição.",
                        "previsaoFutura": "Aguardando confirmação de despacho de novo lote pelo Ministério da Saúde.",
                        "fonte": it["link"]
                    })

        # 2. Belo Horizonte (Hospitais e Centros de Referência por ID)
        if any(term in texto for term in ["belo horizonte", "pbh", "hospital eduardo de menezes", "sagrada família", "orestes diniz", "urs centro-sul"]):
            if any(p in texto for p in ["vacina", "amplia", "ampliação", "inicia", "doses", "imunização"]):
                for sid, sname in [
                    ("mg-1", "Hospital Eduardo de Menezes"),
                    ("mg-2", "URS Centro-Sul / Serviço de Saúde do Viajante"),
                    ("mg-3", "CTA / SAE Sagrada Família"),
                    ("mg-4", "CTR Orestes Diniz"),
                    ("mg-5", "CRIE Hospital Odilon Behrens")
                ]:
                    alteracoes.append({
                        "siteId": sid,
                        "unidade": sname,
                        "uf": "MG",
                        "statusEstoque": "disponivel",
                        "motivo": "Vacinação ativa pela PBH com ampliação programada.",
                        "previsaoFutura": "Ampliação para todas as PVHA independente de contagem de CD4.",
                        "fonte": it["link"]
                    })

        # 3. São Paulo (SAEs e CRIEs por ID)
        if any(term in texto for term in ["são paulo", "saopaulo", "sp recebe", "cidade de sp"]):
            if is_reabastecimento or any(p in texto for p in ["recebe novas doses", "mil novas doses", "distribuição de doses"]):
                for sid, sname in [
                    ("sp-1", "Centro de Referência e Treinamento DST/Aids-SP (CRT DST/Aids)"),
                    ("sp-2", "CTA Henfil"),
                    ("sp-3", "SAE Campos Elíseos"),
                    ("sp-4", "CRIE Hospital das Clínicas / Emílio Ribas"),
                    ("sp-5", "SAE Lapa — Paulo César Bonfim")
                ]:
                    alteracoes.append({
                        "siteId": sid,
                        "unidade": sname,
                        "uf": "SP",
                        "statusEstoque": "disponivel",
                        "motivo": "Recebimento e distribuição de novo lote de doses da vacina MVA-BN aos SAEs e CRIEs.",
                        "previsaoFutura": "Doses de primeira aplicação ativas. Segunda dose recomendada a partir de 28 dias.",
                        "fonte": it["link"]
                    })

        if "cevaa" in texto or "álvaro aguiar" in texto:
            alteracoes.append({
                "siteId": "rj-5",
                "unidade": "Centro Especial de Vacinação Dr. Álvaro Aguiar (CEVAA)",
                "uf": "RJ",
                "statusEstoque": "em_abastecimento" if is_reabastecimento else "esgotado",
                "motivo": "Processo de reabastecimento pela SMS-Rio." if is_reabastecimento else "Estoque temporariamente esgotado.",
                "previsaoFutura": "Previsão de retorno assim que concluída a conferência interna do novo lote.",
                "fonte": it["link"]
            })

        if "vacina" in texto:
            alertas.append({
                "titulo": it["titulo"],
                "tipo": "disponibilidade_vacina",
                "resumo": it["resumo"],
                "linkOficial": it["link"]
            })

    return {
        "alteracoesEstoque": alteracoes,
        "novosMarcos": [],
        "alertasUrgentes": alertas[:6]
    }

def update_sites_and_alerts_from_report(analise, output_dir):
    """
    Atualiza o estoque e previsão futura dos polos confirmados em public/data/vaccination_sites.json
    com base nas alterações estruturadas extraídas pelo Agente, utilizando identificação primária por ID específica.
    """
    sites_json_path = os.path.join(output_dir, "vaccination_sites.json")
    if not os.path.exists(sites_json_path):
        return

    try:
        with open(sites_json_path, "r", encoding="utf-8") as f:
            sites = json.load(f)

        alteracoes = analise.get("alteracoesEstoque", [])
        if not alteracoes:
            return

        updated = False
        today_str = datetime.now().strftime("%Y-%m-%d")

        for alt in alteracoes:
            alt_id = alt.get("siteId", "").strip().lower()
            alt_uf = alt.get("uf", "").upper()
            alt_unit = alt.get("unidade", "").lower()
            new_status = alt.get("statusEstoque")
            motivo = alt.get("motivo")
            previsao = alt.get("previsaoFutura")
            fonte = alt.get("fonte")

            for s in sites:
                # 1. Correspondência exata por siteId (prioridade máxima e independente)
                matches_id = alt_id and s.get("id", "").strip().lower() == alt_id

                # 2. Correspondência cirúrgica por nome / UF caso não haja siteId explícito
                matches_uf = alt_uf and s.get("uf") == alt_uf
                matches_unit = False
                if not alt_id and matches_uf:
                    s_name = s.get("nomeUnidade", "").lower()
                    # Mapeamento estrito por tokens representativos de unidade
                    if "botafogo" in alt_unit and "botafogo" in s_name:
                        matches_unit = True
                    elif ("nova américa" in alt_unit or "nova america" in alt_unit) and "nova américa" in s_name:
                        matches_unit = True
                    elif "campo grande" in alt_unit and "campo grande" in s_name:
                        matches_unit = True
                    elif "cevaa" in alt_unit or "álvaro aguiar" in alt_unit:
                        matches_unit = "álvaro aguiar" in s_name or "cevaa" in s_name
                    elif "eduardo de menezes" in alt_unit and "eduardo de menezes" in s_name:
                        matches_unit = True
                    elif "sagrada família" in alt_unit and "sagrada família" in s_name:
                        matches_unit = True
                    elif "crt" in alt_unit and "crt" in s_name:
                        matches_unit = True
                    elif "henfil" in alt_unit and "henfil" in s_name:
                        matches_unit = True
                    elif "campos elíseos" in alt_unit and "campos elíseos" in s_name:
                        matches_unit = True

                if matches_id or matches_unit:
                    if new_status and s.get("statusEstoque") != new_status:
                        s["statusEstoque"] = new_status
                        s["dataAtualizacaoStatus"] = today_str
                        if motivo:
                            s["notaStatus"] = motivo
                        updated = True
                    if fonte and fonte.startswith("http") and s.get("fonteStatus") != fonte:
                        s["fonteStatus"] = fonte
                        updated = True
                    if previsao and s.get("previsaoFutura") != previsao:
                        s["previsaoFutura"] = previsao
                        updated = True

        if updated:
            with open(sites_json_path, "w", encoding="utf-8") as f:
                json.dump(sites, f, ensure_ascii=False, indent=2)
            print("✅ [Agente] vaccination_sites.json atualizado com novas previsões e status por ID.")
    except Exception as e:
        print(f"⚠️ Erro ao conciliar alterações de postos: {e}")

def main():
    items = fetch_feed_items()
    gemini_key = os.environ.get("GEMINI_API_KEY", "").strip()

    if gemini_key:
        analise = analyze_with_gemini(items, gemini_key)
    else:
        print("ℹ️ [Agente] GEMINI_API_KEY não configurada no ambiente. Usando heurísticas de detecção de estoque.")
        analise = fallback_heuristic_analysis(items)

    output_dir = os.path.join(os.path.dirname(__file__), "..", "public", "data")
    os.makedirs(output_dir, exist_ok=True)
    report_file = os.path.join(output_dir, "agent_monitoring_report.json")

    with open(report_file, "w", encoding="utf-8") as f:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "totalItensVarredura": len(items),
            "analiseAgente": analise
        }, f, ensure_ascii=False, indent=2)

    print(f"💾 [Agente] Relatório agéntico salvo com sucesso em: {report_file}")

    # Conciliar alterações detectadas com os postos de vacinação
    update_sites_and_alerts_from_report(analise, output_dir)

    # Atualização dinâmica e adaptativa do estado de vigilância
    state_file = os.path.join(output_dir, "monitor_state.json")
    state = {}
    if os.path.exists(state_file):
        try:
            with open(state_file, "r", encoding="utf-8") as sf:
                state = json.load(sf)
        except Exception:
            state = {}

    tem_novidades = (
        len(analise.get("alteracoesEstoque", [])) > 0 or 
        len(analise.get("alertasUrgentes", [])) > 0 or 
        len(analise.get("novosMarcos", [])) > 0
    )

    now_iso = datetime.now().isoformat()
    state["ultimaChecagem"] = now_iso

    if tem_novidades:
        state["modo"] = "CAMPANHA_ATIVA"
        state["diasSemNovidades"] = 0
        state["ultimaAlteracaoCritica"] = now_iso
        state["motivo"] = "Campanha de vacinação ativa e alterações recentes detectadas nos postos"
    else:
        dias_sem = state.get("diasSemNovidades", 0) + 0.1
        state["diasSemNovidades"] = round(dias_sem, 2)
        if dias_sem >= 5:
            state["modo"] = "CALMA"
            state["motivo"] = "Mais de 5 dias sem alterações críticas de estoque ou novos marcos"

    with open(state_file, "w", encoding="utf-8") as sf:
        json.dump(state, sf, ensure_ascii=False, indent=2)
    print(f"🔄 [Agente] Estado adaptativo atualizado: modo={state.get('modo')} (dias sem novidades: {state.get('diasSemNovidades', 0)})")

    # Sincronizar arquivos JSON públicos com a interface web
    try:
        import subprocess
        export_script = os.path.join(os.path.dirname(__file__), "export_json.js")
        subprocess.run(["node", "--experimental-strip-types", export_script], check=False)
    except Exception as e:
        print(f"⚠️ Erro ao exportar JSONs públicos: {e}")

    # Atualizar metadados globais de sincronização e horários
    try:
        update_sync_status()
    except Exception as e:
        print(f"⚠️ Erro ao atualizar metadados de sincronização: {e}")

if __name__ == "__main__":
    main()
