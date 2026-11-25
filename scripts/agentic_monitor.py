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

                    # Requisito temático estrito: o item DEVE tratar de mpox/varíola E de vacinação/doses
                    is_mpox = any(w in full_text for w in ["mpox", "varíola", "variola", "mva-bn", "jynneos", "monkeypox"])
                    is_vaccine = any(w in full_text for w in ["vacina", "vacinação", "vacinacao", "imunização", "imunizacao", "doses", "prep", "crie", "super centro"])

                    if is_mpox and is_vaccine:
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
    model_name = os.environ.get("GEMINI_MODEL", "gemini-3.5-flash-lite")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"

    # Carregar a base oficial completa de postos para passar contexto integral ao Agente
    sites_json_path = os.path.join(os.path.dirname(__file__), "..", "public", "data", "vaccination_sites.json")
    known_sites = []
    if os.path.exists(sites_json_path):
        try:
            with open(sites_json_path, "r", encoding="utf-8") as f:
                raw_sites = json.load(f)
                known_sites = [{"id": s["id"], "uf": s["uf"], "municipio": s["municipio"], "nomeUnidade": s["nomeUnidade"], "statusAtual": s.get("statusEstoque", "em_abastecimento")} for s in raw_sites]
        except Exception:
            pass

    # Priorizar e reter todas as notícias operacionais de vacinação sem corte arbitrário (até 60 itens)
    prioritized_items = []
    other_items = []
    vaccine_terms = ["vacina", "doses", "super centro", "lote", "crie", "esgotou", "suspensa", "polo", "hub", "partenon", "santa marta", "cevaa", "sms", "ses"]
    for it in items:
        t = f"{it.get('titulo', '')} {it.get('resumo', '')}".lower()
        if any(w in t for w in vaccine_terms):
            prioritized_items.append(it)
        else:
            other_items.append(it)
    # Ordenar notícias cronologicamente (da mais recente para a mais antiga)
    def parse_item_date(it):
        raw = it.get("data", "")
        if not raw:
            return datetime.min
        try:
            from email.utils import parsedate_to_datetime
            return parsedate_to_datetime(raw)
        except Exception:
            return datetime.min

    selected_items = sorted(prioritized_items + other_items, key=parse_item_date, reverse=True)[:60]

    prompt = f"""
Você é o Agente Autônomo de Vigilância Epidemiológica da plataforma oficial MPOX Brasil (https://mpox-tracker-br.web.app).
Analise com rigor factual as seguintes notícias, comunicados e matérias sobre mpox coletadas em tempo real ({datetime.now().strftime('%d/%m/%Y')}):

NOTÍCIAS COLETADAS:
{json.dumps(selected_items, ensure_ascii=False, indent=2)}

CATÁLOGO OFICIAL DE CENTROS DE VACINAÇÃO MONITORDADOS:
{json.dumps(known_sites, ensure_ascii=False, indent=2)}

DIRETRIZES AGÉNTICAS DE AVALIAÇÃO:
1. TRÊS REQUISITOS OBRIGATÓRIOS PARA QUALQUER ALTERAÇÃO DE STATUS:
   Para que uma notícia gere uma alteração de status em 'alteracoesEstoque', a notícia DEVE CONTER EXPLICITAMENTE TODAS as 3 informações a seguir:
   a) A vacina contra MPOX (varíola dos macacos, MVA-BN, Jynneos). Não altere com notícias genéricas de outras vacinas ou saúde geral.
   b) O centro / polo de vacinação específico (ou a rede municipal claramente nomeada, ex: "todos os postos do Rio", "Super Centro de Botafogo", "CRIE Fiocruz").
   c) A situação explícita do estoque: se as doses estão DISPONÍVEIS / reabastecidas OU se as doses estão ESGOTADAS / acabaram / foram suspensas por falta de vacina.
   -> REGRA DE DESCARTE ESTRITO: Se a notícia NÃO contiver todas essas três informações explícitas para permitir uma interpretação segura, DESCARTE A NOTÍCIA COMPLETAMENTE para fins de alteração de estoque (não gere alteração inventada ou presumida).

2. ORDEM CRONOLÓGICA E PREVALÊNCIA TEMPORAL:
   - As notícias estão ordenadas da MAIS RECENTE para a mais antiga.
   - Em caso de comunicados conflitantes sobre a mesma cidade ou unidade ao longo do dia, o fato noticiado no horário mais recente PREVALECE.
   - Exemplo: se no início do dia foi anunciado que as vacinas seguiam disponíveis em um polo (ex: 'segue disponível apenas em Botafogo'), mas horas depois a Secretaria de Saúde ou a imprensa noticiou que as doses acabaram e os postos pararam ('Vacina contra mpox acaba no Rio após 8 mil doses e postos param'), a notícia mais recente prevalece e o status final é 'esgotado'.

3. ABRANGÊNCIA FACTUAL MUNICIPAL:
   - Se uma notícia factual e recente comprovar que as doses de mpox se esgotaram em toda a rede de um município/capital e os postos foram paralisados, interprete essa informação aplicando 'esgotado' aos centros cadastrados daquele município que dependiam do lote esgotado.

4. PRESERVAÇÃO DE FONTES:
   - Indique a URL oficial da matéria que sustenta diretamente a interpretação. Evite links de agregadores genéricos quando houver link institucional.

5. SEÇÃO DE ALERTAS & NOTÍCIAS OFICIAIS ('alertasNoticias'):
   - Identifique e sintetize todas as notícias relevantes e recentes sobre Mpox para a seção oficial de Alertas & Notícias da plataforma.
   - Para esgotamento ou suspensão de doses em postos, classifique como tipo 'alerta_urgente' e categoria 'Imunização'.
   - Para chegada de novos lotes, início de vacinação ou distribuição, classifique como tipo 'disponibilidade_vacina' e categoria 'Imunização'.
   - Para estudos, vigilância genômica ou notas técnicas, classifique como 'nota_tecnica' ou 'avanco_cientifico'.
   - O 'orgaoEmissor' deve ser o órgão oficial ou fonte jornalística (ex: 'SMS-Rio', 'SES-SP', 'Ministério da Saúde', 'Fiocruz', 'EBC / Agência Brasil').
   - A 'dataPublicacao' deve ser 'YYYY-MM-DD'.
   - O 'id' deve ser um slug único sem espaços (ex: 'alert-rj-suspensao-2026-11-24', 'alert-sp-inicio-vacinacao-2026-11-24').

Estrutura JSON esperada:
{{
  "alteracoesEstoque": [
    {{
      "siteId": "id exata do catálogo correspondente (ex: 'rj-1', 'rj-2', 'df-1', 'rs-1', etc.)",
      "unidade": "nome da unidade correspondente",
      "uf": "UF",
      "statusEstoque": "disponivel" | "esgotado" | "em_abastecimento" | "previsto",
      "motivo": "justificativa sucinta baseada estritamente no comunicado/notícia",
      "previsaoFutura": "previsão de reposição, próximos lotes ou grupos elegíveis",
      "fonte": "URL oficial ou nome da fonte"
    }}
  ],
  "novosMarcos": [
    {{
      "titulo": "título do marco",
      "dataEstimada": "YYYY-MM ou semana",
      "categoria": "vacina" | "vigilancia" | "clinica",
      "descricao": "resumo do marco"
    }}
  ],
  "alertasNoticias": [
    {{
      "id": "slug-identificador-unico",
      "dataPublicacao": "YYYY-MM-DD",
      "orgaoEmissor": "Ministério da Saúde" | "Anvisa" | "Fiocruz" | "SES-RJ" | "SES-SP" | "OMS / OPAS" | "Prefeitura de BH" | "SMS-Rio" | "SES-MG" | "Fonte Oficial",
      "ufRelacionada": "Nacional" | "RJ" | "SP" | "MG" | "UF correspondente",
      "titulo": "título claro e factual da notícia",
      "tipo": "alerta_urgente" | "disponibilidade_vacina" | "nota_tecnica" | "avanco_cientifico",
      "resumo": "resumo detalhado com informações práticas (doses, locais, público elegível)",
      "linkOficial": "URL da matéria ou comunicado oficial",
      "categoria": "Vigilância" | "Imunização" | "Pesquisa e Ensaios" | "Epidemiologia"
    }}
  ]
}}

Responda APENAS com o JSON puro, sem blocos markdown ou texto explicativo.
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
    Análise de contingência agéntica quando a Gemini API não responder.
    Exige obrigatoriamente as 3 informações para qualquer alteração:
    1) Menção explícita a mpox/varíola dos macacos;
    2) Menção explícita ao centro ou rede municipal;
    3) Menção explícita à disponibilidade ou esgotamento.
    Caso falte qualquer uma das 3, a notícia é descartada.
    """
    print("⚙️ [Agente] Executando correspondência dinâmica entre catálogo oficial e notícias...")
    alteracoes = []
    alertas = []

    # Ordenar rigorosamente da notícia mais recente para a mais antiga
    def get_item_datetime(it):
        raw = it.get("data", "")
        if not raw:
            return datetime.min
        try:
            from email.utils import parsedate_to_datetime
            return parsedate_to_datetime(raw)
        except Exception:
            return datetime.min

    sorted_items = sorted(items, key=get_item_datetime, reverse=True)

    sites_json_path = os.path.join(os.path.dirname(__file__), "..", "public", "data", "vaccination_sites.json")
    known_sites = []
    if os.path.exists(sites_json_path):
        try:
            with open(sites_json_path, "r", encoding="utf-8") as f:
                known_sites = json.load(f)
        except Exception:
            pass

    for it in sorted_items:
        texto = f"{it.get('titulo', '')} {it.get('resumo', '')}".lower()

        # Requisito 1: Deve mencionar explicitamente MPOX
        has_mpox = any(w in texto for w in ["mpox", "varíola", "variola", "mva-bn", "jynneos", "monkeypox"])
        if not has_mpox:
            continue

        # Requisito 3: Deve mencionar explicitamente situação de estoque (disponível ou esgotado)
        is_reabastecimento = any(p in texto for p in [
            "reabastece", "reabastecimento", "novas doses", "novo lote", "mais mil",
            "retoma", "retomou", "amplia vacinação", "recebe mil", "chegada de doses", "reforço de doses",
            "começa a vacinar", "inicia vacinação", "segue disponível"
        ])
        is_esgotamento = any(p in texto for p in [
            "esgotou", "esgotado", "acabou", "terminou", "sem doses", "falta de doses", "paralisa", "postos param", "aplicação suspensa", "suspende vacinação"
        ])

        if not (is_reabastecimento or is_esgotamento):
            continue

        # Requisito 2: Deve identificar explicitamente o centro ou a rede municipal correspondente
        is_esgotamento_cidade_rio = is_esgotamento and ("rio" in texto or "carioca" in texto or "sms-rio" in texto) and any(w in texto for w in ["acaba", "esgotou", "postos param", "paralisa", "sem doses", "após 8 mil"])

        for site in known_sites:
            s_name = site.get("nomeUnidade", "").lower()
            s_id = site.get("id")
            s_uf = site.get("uf", "")

            generic_words = {
                "centro", "saúde", "saude", "hospital", "unidade", "especial", "especiais", "referência", "referencia",
                "serviço", "servico", "vacinação", "vacinacao", "sala", "posto", "atendimento", "ambulatorio",
                "policlinica", "instituto", "super", "zona", "norte", "oeste", "leste", "sul",
                "região", "regiao", "shopping", "geral", "municipal", "estadual", "federal", "público", "publico",
                "para", "com", "sem", "por", "dos", "das", "pelas", "pelos", "sobre", "entre", "imunobiológicos", "imunobiologicos",
                "nova", "novas", "novo", "novos", "campo", "grande", "paulo"
            }
            name_tokens = [w for w in re.split(r'[\s\(\)/—\-,]+', s_name) if len(w) > 3 and w not in generic_words]

            matched = len(name_tokens) > 0 and any(tok in texto for tok in name_tokens)
            if is_esgotamento_cidade_rio and s_uf == "RJ":
                matched = True

            # Se atende a todos os 3 requisitos, gera a alteração estruturada
            if matched:
                if is_esgotamento:
                    alteracoes.append({
                        "siteId": s_id,
                        "unidade": site.get("nomeUnidade"),
                        "uf": s_uf,
                        "statusEstoque": "esgotado",
                        "motivo": f"Esgotamento ou suspensão explícita de doses noticiada em comunicado oficial.",
                        "previsaoFutura": "Aguardando envio e redistribuição de novos lotes pelo Ministério da Saúde.",
                        "fonte": it.get("link")
                    })
                elif is_reabastecimento:
                    alteracoes.append({
                        "siteId": s_id,
                        "unidade": site.get("nomeUnidade"),
                        "uf": s_uf,
                        "statusEstoque": "disponivel",
                        "motivo": f"Vacinação ativa/reabastecida segundo comunicado oficial.",
                        "previsaoFutura": "Doses ativas para os grupos prioritários elegíveis.",
                        "fonte": it.get("link")
                    })

        if has_mpox and any(w in texto for w in ["vacina", "doses", "esgotou", "suspensa", "distribui", "lote", "saúde", "imunização"]):
            # Extrair data YYYY-MM-DD
            item_date = get_item_datetime(it)
            date_str = item_date.strftime("%Y-%m-%d") if item_date != datetime.min else datetime.now().strftime("%Y-%m-%d")
            
            # Identificar órgão emissor provável
            orgao = "Ministério da Saúde"
            if any(w in texto for w in ["rio", "carioca", "sms-rio", "ses-rj"]):
                orgao = "SMS-Rio" if "município" in texto or "capital" in texto or "postos" in texto else "SES-RJ"
            elif any(w in texto for w in ["são paulo", "sp", "ses-sp", "capital paulista"]):
                orgao = "SES-SP"
            elif any(w in texto for w in ["belo horizonte", "bh", "pbh", "ses-mg"]):
                orgao = "Prefeitura de BH"
            elif "fiocruz" in texto:
                orgao = "Fiocruz"
            elif "ebc" in texto or "agência brasil" in texto or "agencia brasil" in texto:
                orgao = "Agência Brasil"

            uf = "Nacional"
            if any(w in texto for w in ["rio de janeiro", "rio", "carioca"]):
                uf = "RJ"
            elif any(w in texto for w in ["são paulo", "sp"]):
                uf = "SP"
            elif any(w in texto for w in ["belo horizonte", "minas gerais", "mg"]):
                uf = "MG"

            tipo = "alerta_urgente" if is_esgotamento else ("disponibilidade_vacina" if is_reabastecimento else "nota_tecnica")
            cat = "Imunização" if (is_esgotamento or is_reabastecimento or "vacina" in texto) else "Vigilância"
            
            # Gerar slug id único
            clean_slug = re.sub(r'[^a-z0-9]+', '-', it.get("titulo", "").lower().strip())[:40].strip('-')
            slug_id = f"alert-{uf.lower()}-{date_str}-{clean_slug}"

            alertas.append({
                "id": slug_id,
                "dataPublicacao": date_str,
                "orgaoEmissor": orgao,
                "ufRelacionada": uf,
                "titulo": it.get("titulo"),
                "tipo": tipo,
                "resumo": it.get("resumo"),
                "linkOficial": it.get("link"),
                "categoria": cat
            })

    return {
        "alteracoesEstoque": alteracoes,
        "novosMarcos": [],
        "alertasNoticias": alertas[:10],
        "alertasUrgentes": alertas[:10]
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
        processed_site_ids = set()

        for alt in alteracoes:
            alt_id = alt.get("siteId", "").strip().lower()
            alt_uf = alt.get("uf", "").upper()
            alt_unit = alt.get("unidade", "").lower()
            new_status = alt.get("statusEstoque")
            motivo = alt.get("motivo")
            previsao = alt.get("previsaoFutura")
            fonte = alt.get("fonte")

            for s in sites:
                s_id = s.get("id", "").strip().lower()
                # 1. Correspondência exata por siteId (prioridade máxima e independente)
                matches_id = alt_id and s_id == alt_id

                # 2. Correspondência dinâmica por nome / tokens caso não haja siteId explícito
                matches_unit = False
                if not alt_id:
                    s_name = s.get("nomeUnidade", "").lower()
                    matches_uf = not alt_uf or s.get("uf") == alt_uf
                    if matches_uf:
                        generic_words = {
                            "centro", "saúde", "saude", "hospital", "unidade", "especial", "especiais", "referência", "referencia",
                            "serviço", "servico", "vacinação", "vacinacao", "sala", "posto", "atendimento", "ambulatorio",
                            "policlinica", "instituto", "super", "zona", "norte", "oeste", "leste", "sul",
                            "região", "regiao", "shopping", "geral", "municipal", "estadual", "federal", "público", "publico",
                            "para", "com", "sem", "por", "dos", "das", "pelas", "pelos", "sobre", "entre", "imunobiológicos", "imunobiologicos"
                        }
                        alt_tokens = [w for w in re.split(r'[\s\(\)/—\-,]+', alt_unit) if len(w) > 3 and w not in generic_words]
                        if alt_tokens and any(tok in s_name for tok in alt_tokens):
                            matches_unit = True

                if matches_id or matches_unit:
                    # Prevalência Cronológica: a lista alteracoes vem ordenada da notícia MAIS RECENTE para a mais antiga.
                    # A primeira alteração atribuída a um polo é a cronologicamente soberana.
                    # Notícias mais antigas subsequentes na lista NÃO podem sobrescrever a decisão mais recente.
                    if s_id in processed_site_ids:
                        continue
                    processed_site_ids.add(s_id)

                    if new_status and s.get("statusEstoque") != new_status:
                        s["statusEstoque"] = new_status
                        s["dataAtualizacaoStatus"] = today_str
                        if motivo:
                            s["notaStatus"] = motivo
                        updated = True

                    # Preservar URLs oficiais ou atualizar quando houver nova fonte válida
                    if fonte and fonte.startswith("http") and not ("news.google.com" in fonte) and s.get("fonteStatus") != fonte:
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

def update_alerts_from_report(analise, output_dir):
    """
    Atualiza a seção oficial de Alertas & Notícias (public/data/alerts.json e src/data/alerts.ts)
    com base nas notícias e comunicados agénticos estruturados extraídos pelo Agente.
    """
    new_alerts = analise.get("alertasNoticias", []) or analise.get("alertasUrgentes", [])
    if not new_alerts:
        return

    alerts_json_path = os.path.join(output_dir, "alerts.json")
    alerts_ts_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "alerts.ts")

    existing_alerts = []
    if os.path.exists(alerts_json_path):
        try:
            with open(alerts_json_path, "r", encoding="utf-8") as f:
                existing_alerts = json.load(f)
        except Exception:
            existing_alerts = []

    seen_ids = {a.get("id") for a in existing_alerts if a.get("id")}
    seen_titles = {a.get("titulo", "").strip().lower() for a in existing_alerts if a.get("titulo")}

    valid_new = []
    for na in new_alerts:
        title = na.get("titulo", "").strip()
        if not title:
            continue
        title_lower = title.lower()
        if title_lower in seen_titles:
            continue

        slug = na.get("id")
        if not slug or slug in seen_ids:
            clean_slug = re.sub(r'[^a-z0-9]+', '-', title_lower)[:35].strip('-')
            slug = f"alert-{na.get('ufRelacionada', 'br').lower()}-{na.get('dataPublicacao', '2026')}-{clean_slug}"

        clean_alert = {
            "id": slug,
            "dataPublicacao": na.get("dataPublicacao", datetime.now().strftime("%Y-%m-%d")),
            "orgaoEmissor": na.get("orgaoEmissor", "Ministério da Saúde"),
            "ufRelacionada": na.get("ufRelacionada", "Nacional"),
            "titulo": title,
            "tipo": na.get("tipo", "disponibilidade_vacina"),
            "resumo": na.get("resumo", ""),
            "linkOficial": na.get("linkOficial", ""),
            "categoria": na.get("categoria", "Imunização")
        }
        valid_new.append(clean_alert)
        seen_ids.add(slug)
        seen_titles.add(title_lower)

    if not valid_new:
        return

    merged = valid_new + existing_alerts
    def parse_alert_date(a):
        try:
            return datetime.strptime(a.get("dataPublicacao", "2026-01-01"), "%Y-%m-%d")
        except Exception:
            return datetime.min

    merged.sort(key=parse_alert_date, reverse=True)

    try:
        with open(alerts_json_path, "w", encoding="utf-8") as f:
            json.dump(merged, f, ensure_ascii=False, indent=2)
        print(f"✅ [Agente] public/data/alerts.json atualizado com {len(valid_new)} novas notícias/alertas (total: {len(merged)}).")
    except Exception as e:
        print(f"⚠️ Erro ao salvar alerts.json: {e}")

    try:
        ts_content = f"""export interface OfficialAlert {{
  id: string;
  dataPublicacao: string; // YYYY-MM-DD
  orgaoEmissor: 'Ministério da Saúde' | 'Anvisa' | 'Fiocruz' | 'SES-RJ' | 'SES-SP' | 'OMS / OPAS' | 'Prefeitura de BH' | 'SMS-Rio' | 'SES-MG' | string;
  ufRelacionada: string; // 'Nacional' ou UF
  titulo: string;
  tipo: 'alerta_urgente' | 'disponibilidade_vacina' | 'nota_tecnica' | 'avanco_cientifico';
  resumo: string;
  linkOficial: string;
  categoria: 'Vigilância' | 'Imunização' | 'Pesquisa e Ensaios' | 'Epidemiologia';
}}

export const officialAlerts: OfficialAlert[] = {json.dumps(merged, ensure_ascii=False, indent=2)};
"""
        with open(alerts_ts_path, "w", encoding="utf-8") as f:
            f.write(ts_content)
        print(f"✅ [Agente] src/data/alerts.ts sincronizado com os novos comunicados.")
    except Exception as e:
        print(f"⚠️ Erro ao sincronizar src/data/alerts.ts: {e}")

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

    # Atualizar automaticamente a seção oficial de Alertas & Notícias
    update_alerts_from_report(analise, output_dir)

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
