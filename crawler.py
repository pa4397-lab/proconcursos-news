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
    "https://blog.grancursosonline.com.br/feed/"
]

ESTADOS = [
"AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
"MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
"RS","RO","RR","SC","SP","SE","TO"
]

def detectar_estado(texto):

    texto = texto.upper()

    for uf in ESTADOS:
        if uf in texto:
            return uf

    return None


def detectar_categoria(titulo):

    t = titulo.lower()

    if "polícia" in t or "pm" in t or "pf" in t:
        return "policia"

    if "tribunal" in t or "tj" in t or "trf" in t:
        return "tribunais"

    if "prefeitura" in t:
        return "prefeitura"

    if "universidade" in t or "professor" in t:
        return "educacao"

    if "saúde" in t:
        return "saude"

    return "concursos"


def detectar_orgao(titulo):

    palavras = titulo.split()

    if len(palavras) > 3:
        return palavras[0] + " " + palavras[1]

    return None


def news_exists(slug, link):

    url = f"{TABLE_URL}?or=(slug.eq.{slug},url.eq.{link})"

    r = requests.get(url, headers=headers)

    if r.status_code == 200 and len(r.json()) > 0:
        return True

    return False


def get_image(url):

    try:

        r = requests.get(url, timeout=10)

        soup = BeautifulSoup(r.text, "html.parser")

        og = soup.find("meta", property="og:image")

        if og:
            return og["content"]

    except:
        pass

    return "https://placehold.co/600x400"


def extract_content(url):

    try:

        r = requests.get(url, timeout=10)

        soup = BeautifulSoup(r.text, "html.parser")

        p = soup.find_all("p")

        texto = " ".join(x.get_text() for x in p)

        return texto[:4000]

    except:

        return ""


def generate_summary(text):

    try:

        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[{
                "role": "user",
                "content": f"Resuma esta notícia de concurso em 2 frases: {text}"
            }]
        )

        return response.choices[0].message.content

    except:

        return "Resumo automático"


def save_news(title, link, source, published):

    slug = slugify(title)

    if news_exists(slug, link):
        return

    image = get_image(link)

    content = extract_content(link)

    summary = generate_summary(content)

    categoria = detectar_categoria(title)

    estado = detectar_estado(title)

    orgao = detectar_orgao(title)

    data = {
        "title": title,
        "slug": slug,
        "url": link,
        "source": source,
        "content": content,
        "summary": summary,
        "image": image,
        "categoria": categoria,
        "estado": estado,
        "orgao": orgao,
        "tipo_concurso": categoria,
        "published_at": published
    }

    r = requests.post(TABLE_URL, json=data, headers=headers)

    print("Salvou:", title)


def cleanup():

    url = f"{TABLE_URL}?select=id&order=published_at.desc&offset=500"

    r = requests.get(url, headers=headers)

    if r.status_code != 200:
        return

    old = r.json()

    for n in old:

        requests.delete(f"{TABLE_URL}?id=eq.{n['id']}", headers=headers)


def fetch_news():

    for feed in RSS_FEEDS:

        rss = feedparser.parse(feed)

        for entry in rss.entries:

            title = entry.title
            link = entry.link

            published = time.strftime("%Y-%m-%d %H:%M:%S")

            if hasattr(entry, "published_parsed"):

                published = time.strftime(
                    "%Y-%m-%d %H:%M:%S",
                    entry.published_parsed
                )

            save_news(title, link, feed, published)

    cleanup()


if __name__ == "__main__":
    fetch_news()
