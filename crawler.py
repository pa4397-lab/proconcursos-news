from bs4 import BeautifulSoup
import feedparser
import requests
import time
import os
from slugify import slugify
from groq import Groq


# =========================
# VARIÁVEIS DE AMBIENTE
# =========================

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not SUPABASE_URL or not SUPABASE_KEY or not GROQ_API_KEY:
    raise Exception("Variáveis de ambiente não encontradas")

TABLE_URL = f"{SUPABASE_URL}/rest/v1/news"

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

client = Groq(api_key=GROQ_API_KEY)


# =========================
# RSS FEEDS
# =========================

RSS_FEEDS = [
    "https://www.pciconcursos.com.br/rss",
    "https://g1.globo.com/rss/g1/concursos-e-emprego/",
    "https://rss.uol.com.br/feed/empregos.xml"
]


# =========================
# FILTRO DE CONCURSOS
# =========================

KEYWORDS = [
    "concurso",
    "edital",
    "vagas",
    "inscrição",
    "prefeitura",
    "polícia",
    "tribunal",
    "processo seletivo",
    "universidade",
    "if"
]


def is_concurso(title):

    text = title.lower()

    return any(k in text for k in KEYWORDS)


# =========================
# VERIFICAR DUPLICAÇÃO
# =========================

def news_exists(slug):

    url = f"{TABLE_URL}?slug=eq.{slug}"

    try:

        r = requests.get(url, headers=headers)

        if r.status_code == 200 and len(r.json()) > 0:
            return True

    except:
        pass

    return False


# =========================
# EXTRAIR IMAGEM
# =========================

def get_image_from_page(url):

    try:

        r = requests.get(url, timeout=10)

        soup = BeautifulSoup(r.text, "html.parser")

        meta = soup.find("meta", property="og:image")

        if meta:
            return meta["content"]

        meta = soup.find("meta", attrs={"name": "twitter:image"})

        if meta:
            return meta["content"]

        img = soup.find("img")

        if img and img.get("src"):
            return img["src"]

    except:
        pass

    return "https://placehold.co/600x400?text=ProConcursos"


# =========================
# EXTRAIR TEXTO DA PÁGINA
# =========================

def extract_content(url):

    try:

        r = requests.get(url, timeout=10)

        soup = BeautifulSoup(r.text, "html.parser")

        paragraphs = soup.find_all("p")

        text = " ".join(p.get_text() for p in paragraphs)

        return text[:5000]

    except:

        return ""


# =========================
# REESCREVER NOTÍCIA COM IA
# =========================

def rewrite_news(content):

    if not content:
        return ""

    try:

        prompt = f"""
Você é um jornalista especializado em concursos públicos.

Reescreva a notícia abaixo de forma ORIGINAL.

Regras:
- texto 100% único
- 4 parágrafos
- destaque vagas, salários e órgão
- linguagem jornalística

Notícia:
{content}
"""

        response = client.chat.completions.create(

            model="llama3-70b-8192",

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]

        )

        return response.choices[0].message.content

    except:

        return content[:500]


# =========================
# GERAR RESUMO
# =========================

def generate_summary(content):

    if not content:
        return ""

    try:

        response = client.chat.completions.create(

            model="llama3-70b-8192",

            messages=[
                {
                    "role": "user",
                    "content": f"Resuma esta notícia de concurso em 2 frases: {content}"
                }
            ]

        )

        return response.choices[0].message.content

    except:

        return ""


# =========================
# SALVAR NO SUPABASE
# =========================

def save_news(title, link, source, published):

    slug = slugify(title)

    if news_exists(slug):

        print("Notícia já existe:", title)

        return

    print("Processando:", title)

    image = get_image_from_page(link)

    content = extract_content(link)

    rewritten = rewrite_news(content)

    summary = generate_summary(rewritten)

    data = {
        "title": title,
        "slug": slug,
        "url": link,
        "source": source,
        "content": rewritten,
        "summary": summary,
        "analysis": "Análise automática",
        "probability": 50,
        "image": image,
        "published_at": published
    }

    try:

        r = requests.post(TABLE_URL, json=data, headers=headers)

        print("SUPABASE STATUS:", r.status_code)

    except Exception as e:

        print("ERRO AO SALVAR:", e)


# =========================
# BUSCAR NOTÍCIAS
# =========================

def fetch_news():

    print("Buscando notícias...")

    for feed in RSS_FEEDS:

        print("Feed:", feed)

        rss = feedparser.parse(feed)

        for entry in rss.entries:

            title = entry.title
            link = entry.link

            if not is_concurso(title):
                continue

            published = None

            if hasattr(entry, "published_parsed"):

                published = time.strftime(
                    "%Y-%m-%d %H:%M:%S",
                    entry.published_parsed
                )

            save_news(title, link, feed, published)


# =========================
# MAIN
# =========================

if __name__ == "__main__":

    fetch_news()
