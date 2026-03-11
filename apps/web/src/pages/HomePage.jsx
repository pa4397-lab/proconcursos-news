
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { ExternalLink, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import SearchBar from '@/components/SearchBar.jsx';
import NewsCard from '@/components/NewsCard.jsx';
import pb from '@/lib/pocketbaseClient';

const HomePage = () => {
  const [news, setNews] = useState([]);
  const [featuredNews, setFeaturedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ['INSS', 'Polícia Federal', 'Tribunal', 'Educação', 'Saúde', 'Fiscal'];

  useEffect(() => {
    fetchNews();
  }, [selectedCategory, currentPage]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const filter = selectedCategory !== 'all' ? `category = "${selectedCategory}"` : '';
      
      const result = await pb.collection('news').getList(currentPage, 9, {
        filter,
        sort: '-created_at',
        $autoCancel: false
      });

      setNews(result.items);
      setTotalPages(result.totalPages);

      const featured = await pb.collection('news').getList(1, 3, {
        sort: '-created_at',
        $autoCancel: false
      });
      setFeaturedNews(featured.items);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  const displayNews = searchResults !== null ? searchResults : news;

  return (
    <>
      <Helmet>
        <title>PROCONCURSOS NEWS - Notícias de Concursos Públicos com IA</title>
        <meta name="description" content="Portal de notícias sobre concursos públicos com análises inteligentes baseadas em IA. Fique por dentro das últimas novidades do INSS, Polícia Federal, Tribunais e mais." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1648891216240-eda0e5d9f671"
              alt="Estudantes preparando-se para concursos públicos"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
          </div>
          
          <div className="relative z-10 container mx-auto px-4 text-center">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6" style={{ fontFamily: 'Merriweather, serif' }}>
              Notícias de Concursos
              <br />
              <span className="text-secondary">Analisadas por IA</span>
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Fique por dentro das últimas notícias e descubra a probabilidade de novos editais
            </p>
            <div className="max-w-2xl mx-auto">
              <SearchBar onResults={handleSearchResults} />
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => {
                setSelectedCategory('all');
                setCurrentPage(1);
              }}
            >
              Todas
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
              >
                {category}
              </Button>
            ))}
          </div>

          {searchResults === null && featuredNews.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Merriweather, serif' }}>
                  Destaques
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredNews.map((item) => (
                  <NewsCard key={item.id} news={item} featured />
                ))}
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Carregando notícias...</p>
                </div>
              ) : displayNews.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">Nenhuma notícia encontrada.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {displayNews.map((item) => (
                      <NewsCard key={item.id} news={item} />
                    ))}
                  </div>

                  {searchResults === null && totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        Anterior
                      </Button>
                      <span className="flex items-center px-4 text-sm text-muted-foreground">
                        Página {currentPage} de {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Próxima
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>

            <aside className="space-y-6">
              <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Merriweather, serif' }}>
                    Upgrade Premium
                  </h3>
                  <p className="text-white/90 mb-4 text-sm">
                    Acesse análises exclusivas, alertas personalizados e muito mais!
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
        </div>

        <Footer />
      </div>
    </>
  );
};

export default HomePage;
