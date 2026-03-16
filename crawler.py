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
    "https://folha.qconcursos.com/feed/",
    "https://blog.grancursosonline.com.br/feed/"
]

def news_exists(slug):

    url = f"{TABLE_URL}?slug=eq.{slug}"

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

        paragraphs = soup.find_all("p")

        text_list = []

        for p in paragraphs:

            t = p.get_text().strip()

            # remover propagandas comuns
            if any(x in t.lower() for x in [

                "assinatura",
                "teste grátis",
                "gran cursos",
                "estratégia concursos",
                "assine",
                "curso completo",
                "mentoria",
                "clique aqui",
                "saiba mais",
                "preparação completa",
                "milhões de questões",
                "oficina de redação",
                "evento presencial"

            ]):
                continue

            # remover textos muito curtos
            if len(t) < 40:
                continue

            text_list.append(t)

        text = " ".join(text_list)

        return text[:3500]

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


def generate_article(title, content):

    prompt = f"""

Crie um artigo completo de SEO sobre concursos públicos.

Título da notícia:
{title}

Conteúdo base:
{content}

Estrutura obrigatória:

Introdução
Sobre o concurso
Vagas e cargos
Salários
Como se preparar
Conclusão

Escreva em português.
Texto entre 600 e 900 palavras.
"""

    try:

        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[{"role":"user","content":prompt}]
        )

        return response.choices[0].message.content

    except:

        return content


def save_news(title, link, source, published):

    slug = slugify(title)

    if news_exists(slug):
        return

    image = get_image(link)

    content = extract_content(link)

    summary = generate_summary(content)

    article = generate_article(title, content)

    data = {
        "title": title,
        "slug": slug,
        "url": link,
        "source": source,
        "content": content,
        "summary": summary,
        "article": article,
        "image": image,
        "published_at": published
    }

    r = requests.post(TABLE_URL, json=data, headers=headers)

    print("Salvou:", title)


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


if __name__ == "__main__":

    fetch_news()
