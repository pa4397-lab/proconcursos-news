
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Calendar, ExternalLink, ArrowLeft, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import NewsCard from '@/components/NewsCard.jsx';
import pb from '@/lib/pocketbaseClient';

const NewsDetailPage = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNewsDetail();
  }, [id]);

  const fetchNewsDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const article = await pb.collection('news').getOne(id, { $autoCancel: false });
      setNews(article);

      const filter = article.category ? `category = "${article.category}" && id != "${id}"` : `id != "${id}"`;
      const related = await pb.collection('news').getList(1, 3, {
        filter,
        sort: '-created_at',
        $autoCancel: false
      });
      setRelatedNews(related.items);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Não foi possível carregar a notícia.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando notícia...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !news) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive text-lg mb-4">{error || 'Notícia não encontrada'}</p>
            <Link to="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para Home
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const imageUrl = news.image
    ? pb.files.getUrl(news, news.image)
    : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=800&fit=crop';

  const formattedDate = new Date(news.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const getProbabilityColor = (probability) => {
    if (probability < 30) return 'bg-red-500';
    if (probability < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getProbabilityText = (probability) => {
    if (probability < 30) return 'Baixa Probabilidade';
    if (probability < 70) return 'Média Probabilidade';
    return 'Alta Probabilidade';
  };

  return (
    <>
      <Helmet>
        <title>{`${news.title} - PROCONCURSOS NEWS`}</title>
        <meta name="description" content={news.summary || news.title} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <article className="container mx-auto px-4 py-8">
          <Link to="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-6">
                {news.category && (
                  <Badge variant="secondary" className="mb-3">
                    {news.category}
                  </Badge>
                )}
                <h1 className="text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'Merriweather, serif' }}>
                  {news.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formattedDate}</span>
                  </div>
                  <span className="font-medium text-primary">{news.source}</span>
                </div>
              </div>

              <div className="mb-8">
                <img
                  src={imageUrl}
                  alt={news.title}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>

              {news.summary && (
                <Card className="mb-6 border-l-4 border-l-primary">
                  <CardHeader>
                    <CardTitle className="text-xl" style={{ fontFamily: 'Merriweather, serif' }}>
                      📝 Resumo IA
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground leading-relaxed whitespace-pre-line">
                      {news.summary}
                    </p>
                  </CardContent>
                </Card>
              )}

              {news.analysis && (
                <Card className="mb-6 border-l-4 border-l-secondary">
                  <CardHeader>
                    <CardTitle className="text-xl" style={{ fontFamily: 'Merriweather, serif' }}>
                      🤖 Análise IA
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-foreground leading-relaxed whitespace-pre-line">
                        {news.analysis}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {news.probability !== null && news.probability !== undefined && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-xl" style={{ fontFamily: 'Merriweather, serif' }}>
                      📊 Probabilidade de Edital
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                          {getProbabilityText(news.probability)}
                        </span>
                        <span className="text-2xl font-bold text-foreground">
                          {news.probability}%
                        </span>
                      </div>
                      <Progress value={news.probability} className="h-3" />
                    </div>
                  </CardContent>
                </Card>
              )}

              <a href={news.url} target="_blank" rel="noopener noreferrer">
                <Button className="w-full" size="lg">
                  Ler Artigo Original
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>

            <aside className="space-y-6">
              <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Merriweather, serif' }}>
                    Upgrade Premium
                  </h3>
                  <p className="text-white/90 mb-4 text-sm">
                    Acesse análises exclusivas e alertas personalizados!
                  </p>
                  <a
                    href="https://proconcursos.pro/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="secondary" className="w-full bg-white text-secondary hover:bg-white/90">
                      Saiba Mais
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <p className="text-center text-sm text-muted-foreground">
                    [AdSense Placeholder - Sidebar]
                  </p>
                </CardContent>
              </Card>
            </aside>
          </div>

          {relatedNews.length > 0 && (
            <section className="mt-16">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Merriweather, serif' }}>
                  Notícias Relacionadas
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedNews.map((item) => (
                  <NewsCard key={item.id} news={item} />
                ))}
              </div>
            </section>
          )}
        </article>

        <Footer />
      </div>
    </>
  );
};

export default NewsDetailPage;
