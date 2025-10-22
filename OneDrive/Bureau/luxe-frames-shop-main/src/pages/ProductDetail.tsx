import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '@/data/products';
import { reviews } from '@/data/reviews';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, Check, Star, User, Package, AlertCircle, ShieldCheck } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const productReviews = reviews.filter((r) => r.productId === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { recentProducts, addRecentProduct } = useRecentlyViewed();

  // Scroll en haut à chaque changement de produit
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    if (product) {
      addRecentProduct(product);
      // Reset quantity when product changes
      setQuantity(1);
      setSelectedImage(0);
    }
  }, [product]);

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
                <p className="text-3xl font-bold text-accent mb-4">{product.price.toLocaleString('fr-FR')} FCFA</p>

                {/* Rating & Stock Info */}
                <div className="flex flex-wrap items-center gap-4">
                  {product.rating && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating!)
                                ? 'fill-accent text-accent'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">{product.rating}</span>
                      <span className="text-sm text-muted-foreground">({product.reviewsCount} avis)</span>
                    </div>
                  )}
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-md ${
                    product.stock < 10 ? 'bg-destructive/10 text-destructive' : 'bg-muted'
                  }`}>
                    <Package className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {product.stock < 10 ? `Plus que ${product.stock} en stock !` : `${product.stock} en stock`}
                    </span>
                  </div>
                </div>
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

              {/* Stock Alert */}
              {product.stock < 10 && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <p className="text-sm text-destructive font-medium">
                    Stock limité ! Commandez rapidement avant rupture.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-input rounded-md">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-muted transition-smooth"
                      aria-label="Diminuer la quantité"
                    >
                      -
                    </button>
                    <span className="px-6 py-2 border-x border-input">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 py-2 hover:bg-muted transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity >= product.stock}
                      aria-label="Augmenter la quantité"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Maximum: {product.stock}
                  </span>
                </div>
                <Button
                  variant="default"
                  size="lg"
                  onClick={handleAddToCart}
                  className="w-full hover-glow"
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au Panier'}
                </Button>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          {productReviews.length > 0 && (
            <div className="mt-16 pt-16 border-t border-border">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Avis Clients</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating!)
                              ? 'fill-accent text-accent'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-bold">{product.rating}</span>
                    <span className="text-muted-foreground">sur 5</span>
                  </div>
                  <span className="text-muted-foreground">
                    {productReviews.length} avis client{productReviews.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                {productReviews.map((review) => (
                  <div key={review.id} className="gradient-card rounded-lg p-6 shadow-card">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <User className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{review.author}</p>
                            {review.verified && (
                              <span className="flex items-center gap-1 text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                                <ShieldCheck className="w-3 h-3" />
                                Achat vérifié
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(review.date).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-accent text-accent'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recently Viewed Products */}
          {recentProducts.length > 1 && (
            <div className="mt-16 pt-16 border-t border-border">
              <h2 className="text-2xl font-bold mb-8 animate-fade-in">Produits Récemment Consultés</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentProducts
                  .filter((p) => p.id !== product.id)
                  .slice(0, 4)
                  .map((recentProduct) => (
                    <ProductCard key={recentProduct.id} product={recentProduct} />
                  ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
