import feedparser
import requests
import schedule
import time
from slugify import slugify

# SUPABASE CONFIG
SUPABASE_URL = "https://svfrmghbnyzkaorpnlqq.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2ZnJtZ2hibnl6a2FvcnBubHFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxOTYzNDcsImV4cCI6MjA4ODc3MjM0N30.vGSYVkIkPrs3IlI4p9SnNZrguStafFLVFLU7qum9a3Y"

TABLE_URL = f"{SUPABASE_URL}/rest/v1/news"

# API do site Horizons
HORIZONS_URL = "https://news.proconcursos.pro/api/collections/news/records"

# RSS feeds
RSS_FEEDS = [
    "https://www.pciconcursos.com.br/rss",
    "https://g1.globo.com/rss/g1/concursos-e-emprego/",
    "https://rss.uol.com.br/feed/empregos.xml"
]

# headers supabase
headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}


def save_news(title, link, source):

    slug = slugify(title)

    data = {
        "title": title,
        "slug": slug,
        "url": link,
        "source": source,
        "summary": "Resumo automático",
        "analysis": "Análise automática",
        "probability": 50
    }

    try:
        # salvar no Supabase
        response = requests.post(TABLE_URL, json=data, headers=headers)
        print("SUPABASE STATUS:", response.status_code)

        # salvar no Horizons
        response2 = requests.post(HORIZONS_URL, json=data)
        print("HORIZONS STATUS:", response2.status_code)

    except Exception as e:
        print("ERRO AO SALVAR:", e)


def fetch_news():

    print("Buscando notícias...")

    for feed in RSS_FEEDS:

        rss = feedparser.parse(feed)

        for entry in rss.entries:

            title = entry.title
            link = entry.link

            print("Nova notícia:", title)

            save_news(title, link, feed)


# roda a cada 10 minutos
schedule.every(10).minutes.do(fetch_news)

# roda imediatamente ao iniciar
fetch_news()

while True:
    schedule.run_pending()
    time.sleep(60)
