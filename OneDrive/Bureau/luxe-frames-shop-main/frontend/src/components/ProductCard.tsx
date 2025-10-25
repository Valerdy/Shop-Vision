import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Package } from 'lucide-react';
import { Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFavorite = isInWishlist(product.id);

  // Translation mapping for categories and genders
  const categoryLabels: Record<string, string> = {
    'optical': 'Optique',
    'sunglasses': 'Lunettes de soleil'
  };

  const genderLabels: Record<string, string> = {
    'men': 'Homme',
    'women': 'Femme',
    'unisex': 'Mixte'
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} ajouté au panier`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product);
    if (isFavorite) {
      toast.info(`${product.name} retiré des favoris`);
    } else {
      toast.success(`${product.name} ajouté aux favoris`);
    }
  };

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="gradient-card rounded-lg overflow-hidden shadow-card hover-lift">
        <div className="aspect-square overflow-hidden bg-muted relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-smooth group-hover:scale-110"
          />
          {/* Wishlist Button */}
          <Button
            size="icon"
            variant="secondary"
            onClick={handleToggleWishlist}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-smooth"
            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <Heart
              className={`w-4 h-4 ${isFavorite ? 'fill-accent text-accent' : ''}`}
            />
          </Button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <p className="text-xs text-muted-foreground font-medium">{product.brand}</p>
            <h3 className="font-semibold text-foreground group-hover:text-accent transition-smooth">
              {product.name}
            </h3>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-accent">{product.price.toLocaleString('fr-FR')} FCFA</p>
            <Button
              size="icon"
              variant="secondary"
              onClick={handleAddToCart}
              className="opacity-0 group-hover:opacity-100 transition-smooth"
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>

          {/* Rating & Stock */}
          <div className="flex items-center justify-between text-xs">
            {product.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-accent text-accent" />
                <span className="font-medium">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviewsCount})</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Package className="w-3 h-3 text-muted-foreground" />
              <span className={`font-medium ${product.stock < 10 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {product.stock < 10 ? `Plus que ${product.stock}` : `${product.stock} en stock`}
              </span>
            </div>
          </div>

          <div className="flex gap-2 text-xs">
            <span className="px-2 py-1 bg-muted rounded-md text-muted-foreground">
              {categoryLabels[product.category] || product.category}
            </span>
            <span className="px-2 py-1 bg-muted rounded-md text-muted-foreground">
              {genderLabels[product.gender] || product.gender}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
