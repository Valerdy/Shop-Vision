import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import productService from '@/services/productService';
import ProductCard from '@/components/ProductCard';
import ProductFilter from '@/components/ProductFilter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Loader2, Wifi, WifiOff } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterState {
  categories: string[];
  genders: string[];
  brands: string[];
  priceRange: [number, number];
}

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    genders: [],
    brands: [],
    priceRange: [50000, 150000],
  });

  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingCache, setUsingCache] = useState(false);

  // Fetch products from API with fallback
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getAll();
        setProducts(response.data.products || []);
        setUsingCache(response.fromCache || false);

        if (response.fromCache) {
          toast.info('Mode hors ligne - Données locales utilisées', {
            description: 'Le backend n\'est pas disponible. Vous consultez les données de démonstration.',
            duration: 5000,
          });
        }
      } catch (error: any) {
        console.error('Error fetching products:', error);
        toast.error('Erreur lors du chargement des produits');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const categoryMatch = filters.categories.length === 0 || filters.categories.includes(product.category);
    const genderMatch = filters.genders.length === 0 || filters.genders.includes(product.gender);
    const brandMatch = filters.brands.length === 0 || filters.brands.includes(product.brand);
    const priceMatch = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];

    // Search match
    const searchMatch = !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    return categoryMatch && genderMatch && brandMatch && priceMatch && searchMatch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'featured':
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Offline indicator */}
          {usingCache && (
            <Alert className="mb-6 bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800">
              <WifiOff className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                <strong>Mode hors ligne :</strong> Vous consultez les données de démonstration.
                Démarrez le backend pour accéder aux données complètes.
              </AlertDescription>
            </Alert>
          )}

          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-2">
              {searchQuery ? `Résultats pour "${searchQuery}"` : 'Boutique de Lunettes'}
            </h1>
            <p className="text-muted-foreground">
              {searchQuery
                ? `${sortedProducts.length} produit${sortedProducts.length > 1 ? 's' : ''} trouvé${sortedProducts.length > 1 ? 's' : ''}`
                : 'Découvrez notre collection complète de lunettes et lunettes de soleil premium'
              }
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 shrink-0">
              <ProductFilter filters={filters} onFilterChange={setFilters} />
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-slide-right">
                <p className="text-sm text-muted-foreground">
                  Affichage de {sortedProducts.length} sur {products.length} produits
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Trier par:</span>
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                    <SelectTrigger className="w-[180px]" aria-label="Trier les produits">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">En vedette</SelectItem>
                      <SelectItem value="price-asc">Prix croissant</SelectItem>
                      <SelectItem value="price-desc">Prix décroissant</SelectItem>
                      <SelectItem value="name-asc">Nom A-Z</SelectItem>
                      <SelectItem value="name-desc">Nom Z-A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {sortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="animate-scale-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 gradient-card rounded-lg shadow-card animate-fade-in">
                  <p className="text-muted-foreground text-lg">
                    {searchQuery
                      ? `Aucun produit trouvé pour "${searchQuery}"`
                      : 'Aucun produit trouvé correspondant à vos filtres.'
                    }
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Essayez d'ajuster vos critères de recherche
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
