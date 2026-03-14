from bs4 import BeautifulSoup
import feedparser
import requests
import time
import os
from slugify import slugify
from groq import Groq

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

TABLE_URL = f"{SUPABASE_URL}/rest/v1/news"

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

client = Groq(api_key=GROQ_API_KEY)

RSS_FEEDS = [
    "https://www.pciconcursos.com.br/rss",
    "https://g1.globo.com/rss/g1/concursos-e-emprego/",
    "https://rss.uol.com.br/feed/empregos.xml",
    "https://www.estrategiaconcursos.com.br/blog/feed/",
    "https://folha.qconcursos.com/feed/",
    "https://www.direcaoconcursos.com.br/feed/",
    "https://blog.grancursosonline.com.br/feed/"
]

KEYWORDS = [
    "concurso",
    "edital",
    "vagas",
    "inscrição",
    "prefeitura",
    "polícia",
    "tribunal",
    "processo seletivo"
]


def is_concurso(title):

    title = title.lower()

    return any(k in title for k in KEYWORDS)


def news_exists(slug, link):

    url = f"{TABLE_URL}?or=(slug.eq.{slug},url.eq.{link})"

    r = requests.get(url, headers=headers)

    if r.status_code == 200 and len(r.json()) > 0:
        return True

    return False


def get_image_from_page(url):

    try:

        r = requests.get(url, timeout=10)

        soup = BeautifulSoup(r.text, "html.parser")

        og = soup.find("meta", property="og:image")
        if og and og.get("content"):
            return og["content"]

        tw = soup.find("meta", attrs={"name": "twitter:image"})
        if tw and tw.get("content"):
            return tw["content"]

        img = soup.find("img")
        if img and img.get("src"):
            src = img["src"]

            if src.startswith("http"):
                return src

    except:
        pass

    return "https://placehold.co/600x400?text=ProConcursos"


def generate_summary(content):

    try:

        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[{
                "role": "user",
                "content": f"Resuma esta notícia de concurso público em 2 frases: {content}"
            }]
        )

        return response.choices[0].message.content

    except:

        return "Resumo automático"


def extract_content(url):

    try:

        r = requests.get(url, timeout=10)

        soup = BeautifulSoup(r.text, "html.parser")

        paragraphs = soup.find_all("p")

        text = " ".join(p.get_text() for p in paragraphs)

        return text[:5000]

    except:

        return ""


def save_news(title, link, source, published):

    slug = slugify(title)

    if news_exists(slug, link):

        print("Duplicada:", title)

        return

    image = get_image_from_page(link)

    content = extract_content(link)

    summary = generate_summary(content)

    data = {
        "title": title,
        "slug": slug,
        "url": link,
        "source": source,
        "content": content,
        "summary": summary,
        "image": image,
        "published_at": published
    }

    try:

        r = requests.post(TABLE_URL, json=data, headers=headers)

        print("STATUS:", r.status_code)
        print("RESPOSTA:", r.text)
        print("Salvou:", title)

    except Exception as e:

        print("Erro:", e)


def cleanup_old_news():

    print("Limpando notícias antigas...")

    url = f"{TABLE_URL}?select=id&order=published_at.desc&offset=500"

    r = requests.get(url, headers=headers)

    if r.status_code != 200:
        return

    old_news = r.json()

    for n in old_news:

        delete_url = f"{TABLE_URL}?id=eq.{n['id']}"

        requests.delete(delete_url, headers=headers)

    print("Limpeza concluída")


def fetch_news():

    print("Buscando notícias...")

    for feed in RSS_FEEDS:

        rss = feedparser.parse(feed)

        for entry in rss.entries:

            title = entry.title
            link = entry.link

            if not is_concurso(title):
                continue

            from datetime import datetime

            published = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

            if hasattr(entry, "published_parsed"):

                published = time.strftime(
                    "%Y-%m-%d %H:%M:%S",
                    entry.published_parsed
                )

            save_news(title, link, feed, published)

    cleanup_old_news()


if __name__ == "__main__":

    fetch_news()
