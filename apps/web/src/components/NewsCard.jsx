
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import pb from '@/lib/pocketbaseClient';

const NewsCard = ({ news, featured = false }) => {
  const getProbabilityColor = (probability) => {
    if (probability < 30) return 'bg-red-500';
    if (probability < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getProbabilityText = (probability) => {
    if (probability < 30) return 'Baixa';
    if (probability < 70) return 'Média';
    return 'Alta';
  };

  const imageUrl = news.image
    ? pb.files.getUrl(news, news.image)
    : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop';

  const formattedDate = new Date(news.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <Link to={`/noticia/${news.id}`}>
      <Card className={`overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${featured ? 'h-full' : ''}`}>
        <div className={`relative ${featured ? 'h-64' : 'h-48'}`}>
          <img
            src={imageUrl}
            alt={news.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            {news.category && (
              <Badge variant="secondary" className="bg-white/90 text-foreground">
                {news.category}
              </Badge>
            )}
            {news.probability !== null && news.probability !== undefined && (
              <Badge className={`${getProbabilityColor(news.probability)} text-white`}>
                {getProbabilityText(news.probability)} ({news.probability}%)
              </Badge>
            )}
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className={`font-bold text-foreground mb-2 line-clamp-2 ${featured ? 'text-xl' : 'text-lg'}`} style={{ fontFamily: 'Merriweather, serif' }}>
            {news.title}
          </h3>
          {featured && news.summary && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
              {news.summary}
            </p>
          )}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            <span className="font-medium text-primary">{news.source}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default NewsCard;
