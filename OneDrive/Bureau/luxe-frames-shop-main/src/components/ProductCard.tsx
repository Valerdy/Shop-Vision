import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} ajouté au panier`);
  };

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="gradient-card rounded-lg overflow-hidden shadow-card hover-lift">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-smooth group-hover:scale-110"
          />
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
          <div className="flex gap-2 text-xs">
            <span className="px-2 py-1 bg-muted rounded-md text-muted-foreground">
              {product.category}
            </span>
            <span className="px-2 py-1 bg-muted rounded-md text-muted-foreground">
              {product.gender}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
