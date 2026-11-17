"""
Pipeline de Atualização Automatizada de Dados — MPOX Brasil
Coleta dados públicos de RSS e informes epidemiológicos do Ministério da Saúde e Fiocruz.
Pode ser executado localmente ou via GitHub Actions / Google Cloud Run Jobs.
"""

import urllib.request
import xml.etree.ElementTree as ET
import json
import os
import re
from datetime import datetime

# Feeds Oficiais de Monitoramento
FEEDS = [
    {
        "nome": "Ministério da Saúde - Notícias Oficiais",
        "url": "https://www.gov.br/saude/pt-br/assuntos/noticias/RSS",
        "orgao": "Ministério da Saúde"
    },
    {
        "nome": "Agência Fiocruz de Notícias",
        "url": "https://agencia.fiocruz.br/rss.xml",
        "orgao": "Fiocruz"
    }
]

KEYWORDS = ["mpox", "varíola dos macacos", "mva-bn", "jynneos", "tecovirimat", "dathi", "svsa", "vacina"]

def fetch_rss_items():
    print("📡 Iniciando varredura nos feeds RSS oficiais...")
    coletados = []

    for feed in FEEDS:
        try:
            req = urllib.request.Request(
                feed["url"],
                headers={"User-Agent": "MpoxBrasilDataBot/1.0 (+https://github.com/franc/mpox_br)"}
            )
            with urllib.request.urlopen(req, timeout=15) as response:
                content = response.read()
                root = ET.fromstring(content)

                # Busca items no canal RSS padrão
                for item in root.findall(".//item"):
                    title = item.findtext("title") or ""
                    link = item.findtext("link") or ""
                    pub_date = item.findtext("pubDate") or ""
                    description = item.findtext("description") or ""

                    # Limpar tags HTML da descrição
                    clean_desc = re.sub(r'<[^>]+>', '', description).strip()

                    # Verificar se contém palavras-chave sobre mpox
                    texto_completo = f"{title} {clean_desc}".lower()
                    if any(kw in texto_completo for kw in KEYWORDS):
                        # Detectar UF mencionada no texto
                        ufs_detectadas = []
                        ufs_siglas = ["SP", "RJ", "MG", "BA", "DF", "CE", "PR", "RS", "GO", "PE"]
                        for uf in ufs_siglas:
                            if re.search(r'\b' + uf + r'\b', title + " " + clean_desc):
                                ufs_detectadas.append(uf)

                        uf_relacionada = ufs_detectadas[0] if ufs_detectadas else "Nacional"

                        coletados.append({
                            "id": f"rss-{len(coletados) + 1}",
                            "dataPublicacao": datetime.now().strftime("%Y-%m-%d"),
                            "orgaoEmissor": feed["orgao"],
                            "ufRelacionada": uf_relacionada,
                            "titulo": title.strip(),
                            "tipo": "disponibilidade_vacina" if "vacina" in texto_completo else "nota_tecnica",
                            "resumo": clean_desc[:280] + ("..." if len(clean_desc) > 280 else ""),
                            "linkOficial": link.strip(),
                            "categoria": "Imunização" if "vacina" in texto_completo else "Vigilância"
                        })

        except Exception as e:
            print(f"⚠️ Erro ao consultar {feed['nome']}: {e}")

    print(f"✅ {len(coletados)} notícias/alertas filtrados sobre mpox encontrados.")
    return coletados

def fetch_powerbi_data():
    """
    Coleta direta do modelo semântico do PowerBI oficial do Ministério da Saúde.
    Endpoint público acessível sem autenticação restrita via token do relatório publicado.
    """
    print("📊 Consultando modelo semântico do PowerBI oficial do Ministério da Saúde...")
    url = "https://wabi-brazil-south-b-primary-api.analysis.windows.net/public/reports/querydata?synchronous=true"
    headers = {
        "Content-Type": "application/json;charset=UTF-8",
        "X-PowerBI-ResourceKey": "a55f888e-605d-450d-8570-f9c93f2cd3fb",
        "User-Agent": "MpoxBrasilDataBot/1.0"
    }

    # Query para série semanal por ano
    query_payload = {
        "version": "1.0.0",
        "queries": [
            {
                "Query": {
                    "Commands": [
                        {
                            "SemanticQueryDataShapeCommand": {
                                "Query": {
                                    "Version": 2,
                                    "From": [
                                        {"Name": "m", "Entity": "MPX_TRATADO", "Type": 0},
                                        {"Name": "n", "Entity": "NU_ANO", "Type": 0},
                                        {"Name": "m1", "Entity": "medidas", "Type": 0},
                                        {"Name": "c", "Entity": "CLASSI_FIN_AJ", "Type": 0}
                                    ],
                                    "Select": [
                                        {
                                            "Column": {
                                                "Expression": {"SourceRef": {"Source": "n"}},
                                                "Property": "NU_ANO"
                                            },
                                            "Name": "NU_ANO.NU_ANO"
                                        },
                                        {
                                            "Column": {
                                                "Expression": {"SourceRef": {"Source": "m"}},
                                                "Property": "SEMANA"
                                            },
                                            "Name": "MPX_TRATADO.SEMANA"
                                        },
                                        {
                                            "Measure": {
                                                "Expression": {"SourceRef": {"Source": "m1"}},
                                                "Property": "contagem_casos"
                                            },
                                            "Name": "medidas.contagem_casos"
                                        }
                                    ],
                                    "Where": [
                                        {
                                            "Condition": {
                                                "In": {
                                                    "Expressions": [
                                                        {
                                                            "Column": {
                                                                "Expression": {"SourceRef": {"Source": "c"}},
                                                                "Property": "Nome_CLASSI_FIN"
                                                            }
                                                        }
                                                    ],
                                                    "Values": [
                                                        [{"Literal": {"Value": "'Confirmado'"}}],
                                                        [{"Literal": {"Value": "'Provável'"}}]
                                                    ]
                                                }
                                            }
                                        }
                                    ]
                                },
                                "Binding": {
                                    "Primary": {"Groupings": [{"Projections": [0, 1, 2]}]}
                                },
                                "DataReduction": {
                                    "DataVolume": 3,
                                    "Primary": {"Window": {"Count": 1000}}
                                },
                                "Version": 1
                            }
                        }
                    ]
                },
                "QueryId": "",
                "ApplicationContext": {
                    "DatasetId": "1d744527-9e78-40da-8f36-00b834b82ab1",
                    "Sources": [{"ReportId": "88811e30-9253-4cf3-8948-5cd953af4325"}]
                }
            }
        ],
        "cancelQueries": [],
        "modelId": 6220395
    }

    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(query_payload).encode("utf-8"),
            headers=headers,
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            print("✅ Resposta 200 OK recebida do PowerBI Analysis Services.")
            return data
    except Exception as e:
        print(f"⚠️ Erro ao consultar PowerBI Analysis Services: {e}")
        return None

def main():
    items = fetch_rss_items()
    powerbi_raw = fetch_powerbi_data()
    output_dir = os.path.join(os.path.dirname(__file__), "..", "public", "data")
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, "latest_rss_feed.json")

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump({
            "ultimaAtualizacao": datetime.now().isoformat(),
            "totalItens": len(items),
            "itens": items
        }, f, ensure_ascii=False, indent=2)

    if powerbi_raw:
        pbi_file = os.path.join(output_dir, "powerbi_raw_latest.json")
        with open(pbi_file, "w", encoding="utf-8") as f:
            json.dump(powerbi_raw, f, ensure_ascii=False)
        print(f"💾 Snapshot bruto do PowerBI salvo em: {pbi_file}")

    print(f"💾 Dados salvos com sucesso em: {output_file}")

if __name__ == "__main__":
    main()

