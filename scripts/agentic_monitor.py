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

# Feeds de Notícias e Alertas em Tempo Real
FEEDS = [
    {
        "nome": "Google News Real-Time (Mpox Vacinas, Fiocruz, CEVAA, SUS)",
        "url": "https://news.google.com/rss/search?q=" + urllib.parse.quote("mpox (vacina OR doses OR prep OR fiocruz OR cevaa OR esgotou OR lote) brasil") + "&hl=pt-BR&gl=BR&ceid=BR:pt-419",
        "tipo": "google_news"
    },
    {
        "nome": "Google News Real-Time (Mpox RJ & SP Super Centros & CRIEs)",
        "url": "https://news.google.com/rss/search?q=" + urllib.parse.quote("mpox (rio de janeiro OR sao paulo OR crie OR super centro) vacina") + "&hl=pt-BR&gl=BR&ceid=BR:pt-419",
        "tipo": "google_news"
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
    "fiocruz", "cevaa", "prep", "crie", "super centro", "doses", "esgotou"
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
    model_name = os.environ.get("GEMINI_MODEL", "gemini-1.5-flash")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"

    prompt = f"""
Você é o Agente de Vigilância Epidemiológica da plataforma pública MPOX Brasil (https://mpox-tracker-br.web.app).
Analise com rigor factual a seguinte lista de notícias, comunicados e matérias sobre mpox coletadas hoje ({datetime.now().strftime('%d/%m/%Y')}):

{json.dumps(items[:10], ensure_ascii=False, indent=2)}

Sua tarefa é extrair e produzir um objeto JSON estritamente válido com a seguinte estrutura:
{{
  "alteracoesEstoque": [
    {{
      "unidade": "nome da unidade (ex: 'Fiocruz', 'CEVAA', 'Super Centro Botafogo')",
      "uf": "RJ, SP, etc.",
      "statusEstoque": "esgotado" | "disponivel" | "em_abastecimento",
      "motivo": "resumo de 1 frase justificando com base no comunicado",
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
    """
    print("⚙️ [Agente] Executando análise heurística baseada em regras...")
    alteracoes = []
    alertas = []

    for it in items:
        texto = f"{it['titulo']} {it['resumo']}".lower()

        # Detecção de esgotamento de vacina em postos do RJ
        if "fiocruz" in texto and any(p in texto for p in ["esgotou", "acabou", "terminou", "fila", "alta procura"]):
            alteracoes.append({
                "unidade": "Instituto Nacional de Infectologia Evandro Chagas (CRIE / INI / Fiocruz)",
                "uf": "RJ",
                "statusEstoque": "esgotado",
                "motivo": "Doses temporariamente esgotadas segundo informado nas redes sociais oficiais.",
                "fonte": it["link"]
            })

        if "cevaa" in texto or "álvaro aguiar" in texto:
            alteracoes.append({
                "unidade": "Centro Especial de Vacinação Dr. Álvaro Aguiar (CEVAA)",
                "uf": "RJ",
                "statusEstoque": "esgotado",
                "motivo": "Estoque temporariamente esgotado na Cinelândia. Aguardando reposição da SMS-Rio.",
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
        "alertasUrgentes": alertas[:5]
    }

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

if __name__ == "__main__":
    main()
