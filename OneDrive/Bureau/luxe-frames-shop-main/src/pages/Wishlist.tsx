import { Link } from 'react-router-dom';
import { useWishlist } from '@/contexts/WishlistContext';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

const Wishlist = () => {
  const { wishlist, clearWishlist, wishlistCount } = useWishlist();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <div>
              <h1 className="text-4xl font-bold mb-2">Mes Favoris</h1>
              <p className="text-muted-foreground">
                {wishlistCount} produit{wishlistCount > 1 ? 's' : ''} dans vos favoris
              </p>
            </div>
            {wishlistCount > 0 && (
              <Button variant="outline" onClick={clearWishlist}>
                Vider les favoris
              </Button>
            )}
          </div>

          {wishlist.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlist.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 gradient-card rounded-lg shadow-card animate-fade-in">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full gradient-accent flex items-center justify-center">
                  <Heart className="w-10 h-10 text-accent-foreground" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Aucun favori</h2>
              <p className="text-muted-foreground mb-6">
                Commencez à ajouter des produits à vos favoris pour les retrouver facilement
              </p>
              <Link to="/shop">
                <Button variant="default" size="lg" className="hover-glow">
                  Découvrir la Boutique
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;
