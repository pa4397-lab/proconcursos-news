
import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-background border border-border rounded-lg p-4 mb-8">
          <p className="text-center text-sm text-muted-foreground">
            [AdSense Placeholder - Footer Banner]
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground" style={{ fontFamily: 'Merriweather, serif' }}>
              PROCONCURSOS NEWS
            </h3>
            <p className="text-sm text-muted-foreground">
              Seu portal de notícias sobre concursos públicos com análises baseadas em IA.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a
                  href="https://proconcursos.pro/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary hover:text-secondary/80 transition-colors font-medium inline-flex items-center"
                >
                  Upgrade to Premium
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Sobre</h4>
            <p className="text-sm text-muted-foreground">
              Análises inteligentes de notícias para concurseiros que querem estar sempre à frente.
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PROCONCURSOS NEWS. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
