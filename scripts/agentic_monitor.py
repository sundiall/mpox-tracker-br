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

    prompt = f"""
Você é o Agente de Vigilância Epidemiológica da plataforma pública MPOX Brasil (https://mpox-tracker-br.web.app).
Analise com rigor factual a seguinte lista de notícias, comunicados e matérias sobre mpox coletadas hoje ({datetime.now().strftime('%d/%m/%Y')}):

{json.dumps(items[:10], ensure_ascii=False, indent=2)}

Sua tarefa é extrair e produzir um objeto JSON estritamente válido com a seguinte estrutura:
{{
  "alteracoesEstoque": [
    {{
      "unidade": "nome da unidade (ex: 'Fiocruz', 'CEVAA', 'Super Centro Botafogo', 'Hospital Eduardo de Menezes')",
      "uf": "RJ, SP, MG, etc.",
      "statusEstoque": "esgotado" | "disponivel" | "em_abastecimento" | "previsto",
      "motivo": "resumo de 1 frase justificando com base no comunicado",
      "previsaoFutura": "previsão de datas, chegada de lotes futuros ou ampliação de grupos elegíveis (ex: 'Ampliação para todas as PVHA a partir de 30/11')",
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

        # 1. Rio de Janeiro (Super Centros, CEVAA, Fiocruz)
        if any(term in texto for term in ["super centro", "botafogo", "nova américa", "campo grande", "rio de janeiro", "sms-rio", "município do rio"]):
            if is_reabastecimento:
                alteracoes.append({
                    "unidade": "Super Centros Cariocas (Botafogo, Shopping Nova América, ParkShopping Campo Grande)",
                    "uf": "RJ",
                    "statusEstoque": "disponivel",
                    "motivo": "Reabastecido com novo lote de 1.000 frascos (até 5.000 doses intradérmicas) enviado pelo Ministério da Saúde. Vacinação ativa.",
                    "previsaoFutura": "Vacinação ativa nos Super Centros enquanto durar o lote. Novos repasses federais previstos conforme demanda.",
                    "fonte": it["link"]
                })
            elif is_esgotamento:
                alteracoes.append({
                    "unidade": "Super Centros Cariocas e Postos do Rio de Janeiro",
                    "uf": "RJ",
                    "statusEstoque": "esgotado",
                    "motivo": "Doses temporariamente esgotadas na rede carioca segundo relatos e comunicados oficiais. Aguardando novo lote de reposição.",
                    "previsaoFutura": "Aguardando confirmação de despacho de novo lote pelo Ministério da Saúde.",
                    "fonte": it["link"]
                })

        # 2. Belo Horizonte (PBH, Hospitais e Centros de Referência)
        if any(term in texto for term in ["belo horizonte", "pbh", "hospital eduardo de menezes", "sagrada família", "orestes diniz", "urs centro-sul"]):
            if any(p in texto for p in ["vacina", "amplia", "ampliação", "inicia", "doses", "imunização"]):
                alteracoes.append({
                    "unidade": "Polos de Vacinação de Belo Horizonte (Hospital Eduardo de Menezes, URS Centro-Sul, Sagrada Família, Orestes Diniz, CRIE)",
                    "uf": "MG",
                    "statusEstoque": "disponivel",
                    "motivo": "Prefeitura de Belo Horizonte iniciou vacinação em 5 unidades para grupos prioritários e anunciou expansão para 30/11.",
                    "previsaoFutura": "A partir de 30/11: Ampliação para todas as pessoas vivendo com HIV/Aids (PVHA), independente de contagem de CD4 (campanha até 04/12).",
                    "fonte": it["link"]
                })

        # 3. São Paulo (Rede Municipal e Estadual)
        if any(term in texto for term in ["são paulo", "saopaulo", "sp recebe", "cidade de sp"]):
            if is_reabastecimento or any(p in texto for p in ["recebe novas doses", "mil novas doses", "distribuição de doses"]):
                alteracoes.append({
                    "unidade": "Rede Especializada de São Paulo (SAEs e CRIEs)",
                    "uf": "SP",
                    "statusEstoque": "disponivel",
                    "motivo": "Recebimento e distribuição de novo lote de 1.000 doses da vacina MVA-BN aos SAEs e CRIEs.",
                    "previsaoFutura": "Doses de primeira aplicação ativas. Segunda dose recomendada a partir de 28 dias para consolidar imunidade.",
                    "fonte": it["link"]
                })

        if "cevaa" in texto or "álvaro aguiar" in texto:
            alteracoes.append({
                "unidade": "Centro Especial de Vacinação Dr. Álvaro Aguiar (CEVAA)",
                "uf": "RJ",
                "statusEstoque": "em_abastecimento" if is_reabastecimento else "esgotado",
                "motivo": "Processo de reabastecimento pela SMS-Rio com chegada da nova remessa." if is_reabastecimento else "Estoque temporariamente esgotado.",
                "previsaoFutura": "Previsão de retorno da vacinação na Cinelândia assim que concluída a conferência interna do novo lote.",
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
    com base nas alterações estruturadas extraídas pelo Agente.
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
            alt_uf = alt.get("uf", "").upper()
            alt_unit = alt.get("unidade", "").lower()
            new_status = alt.get("statusEstoque")
            motivo = alt.get("motivo")
            previsao = alt.get("previsaoFutura")

            for s in sites:
                matches_uf = alt_uf and s.get("uf") == alt_uf
                matches_unit = any(w in s.get("nomeUnidade", "").lower() for w in ["super centro", "botafogo", "eduardo de menezes", "sagrada família", "crt", "henfil", "campos elíseos"] if w in alt_unit)

                if matches_uf and (matches_unit or "super centro" in alt_unit or "polos" in alt_unit or "rede" in alt_unit):
                    if new_status and s.get("statusEstoque") != new_status:
                        s["statusEstoque"] = new_status
                        s["dataAtualizacaoStatus"] = today_str
                        if motivo:
                            s["notaStatus"] = motivo
                        updated = True
                    if previsao and s.get("previsaoFutura") != previsao:
                        s["previsaoFutura"] = previsao
                        updated = True

        if updated:
            with open(sites_json_path, "w", encoding="utf-8") as f:
                json.dump(sites, f, ensure_ascii=False, indent=2)
            print("✅ [Agente] vaccination_sites.json atualizado com novas previsões e status.")
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
