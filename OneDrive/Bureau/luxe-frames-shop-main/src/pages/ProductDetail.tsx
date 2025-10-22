import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 animate-fade-in">Produit Non Trouvé</h1>
            <Link to="/shop">
              <Button variant="default" className="hover-glow">
                <ArrowLeft className="w-4 h-4" />
                Retour à la Boutique
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} ${product.name} ajouté${quantity > 1 ? 's' : ''} au panier`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <Link to="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth mb-8 animate-fade-in">
            <ArrowLeft className="w-4 h-4" />
            Retour à la Boutique
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden gradient-card shadow-card">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden transition-smooth ${
                      selectedImage === index
                        ? 'ring-2 ring-accent shadow-glow'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-2">{product.brand}</p>
                <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                <p className="text-3xl font-bold text-accent">{product.price.toLocaleString('fr-FR')} FCFA</p>
              </div>

              <div className="flex gap-4 text-sm">
                <span className="px-3 py-1 bg-muted rounded-md capitalize">{product.category}</span>
                <span className="px-3 py-1 bg-muted rounded-md capitalize">{product.gender}</span>
                <span className="px-3 py-1 bg-muted rounded-md">{product.frameShape}</span>
              </div>

              <p className="text-muted-foreground leading-relaxed">{product.description}</p>

              <div className="space-y-3">
                <h3 className="font-semibold">Caractéristiques Clés:</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-muted-foreground">
                      <Check className="w-4 h-4 text-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Matériau:</span>
                  <span className="text-muted-foreground">{product.material}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Couleur:</span>
                  <span className="text-muted-foreground">{product.color}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-6">
                <div className="flex items-center border border-input rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-muted transition-smooth"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 border-x border-input">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-muted transition-smooth"
                  >
                    +
                  </button>
                </div>
                <Button
                  variant="default"
                  size="lg"
                  onClick={handleAddToCart}
                  className="flex-1 hover-glow"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Ajouter au Panier
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
