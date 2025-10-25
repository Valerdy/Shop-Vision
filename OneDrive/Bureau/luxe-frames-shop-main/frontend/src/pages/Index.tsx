import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Truck, RefreshCw } from 'lucide-react';
import heroImage from '@/assets/hero-eyewear.jpg';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Luxury eyewear"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
          </div>
          <div className="relative container mx-auto px-4 text-center z-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 animate-fade-in">
              Voyez Le Monde Autrement
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto animate-slide-up">
              Lunettes premium pour style et confort. Découvrez des montures qui définissent votre vision unique.
            </p>
            <Link to="/shop">
              <Button variant="hero" size="xl" className="animate-scale-in hover-glow">
                Voir la Collection
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center space-y-3 p-6 gradient-card rounded-lg shadow-card hover-lift animate-slide-up">
                <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center animate-scale-in">
                  <Shield className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="font-semibold text-lg">Qualité Premium</h3>
                <p className="text-sm text-muted-foreground">
                  Montures artisanales avec des matériaux supérieurs et une attention au détail
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-3 p-6 gradient-card rounded-lg shadow-card hover-lift animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center animate-scale-in" style={{ animationDelay: '0.1s' }}>
                  <Truck className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="font-semibold text-lg">Livraison Gratuite</h3>
                <p className="text-sm text-muted-foreground">
                  Livraison rapide et gratuite à Pointe-Noire pour toute commande
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-3 p-6 gradient-card rounded-lg shadow-card hover-lift animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center animate-scale-in" style={{ animationDelay: '0.2s' }}>
                  <RefreshCw className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="font-semibold text-lg">Retours Faciles</h3>
                <p className="text-sm text-muted-foreground">
                  Politique de retour de 30 jours, sans questions
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20">
          <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Collection Vedette</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Découvrez notre sélection premium de lunettes conçues pour l'individu moderne
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center animate-fade-in">
              <Link to="/shop">
                <Button variant="default" size="lg" className="hover-glow">
                  Voir Tous Les Produits
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4 animate-fade-in">
              Trouvez Votre Paire Parfaite
            </h2>
            <p className="text-primary-foreground/90 max-w-2xl mx-auto mb-8 animate-slide-up">
              Rejoignez des milliers de clients satisfaits qui ont trouvé leur style signature avec LuxVision
            </p>
            <Link to="/shop">
              <Button variant="secondary" size="xl" className="animate-scale-in hover-glow">
                Commencer Vos Achats
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
