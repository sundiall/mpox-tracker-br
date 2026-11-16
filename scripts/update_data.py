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

def main():
    items = fetch_rss_items()
    output_dir = os.path.join(os.path.dirname(__file__), "..", "public", "data")
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, "latest_rss_feed.json")

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump({
            "ultimaAtualizacao": datetime.now().isoformat(),
            "totalItens": len(items),
            "itens": items
        }, f, ensure_ascii=False, indent=2)

    print(f"💾 Dados salvos com sucesso em: {output_file}")

if __name__ == "__main__":
    main()
