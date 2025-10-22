import { useState } from 'react';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import ProductFilter from '@/components/ProductFilter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface FilterState {
  categories: string[];
  genders: string[];
  brands: string[];
  priceRange: [number, number];
}

const Shop = () => {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    genders: [],
    brands: [],
    priceRange: [50000, 150000],
  });

  const filteredProducts = products.filter((product) => {
    const categoryMatch = filters.categories.length === 0 || filters.categories.includes(product.category);
    const genderMatch = filters.genders.length === 0 || filters.genders.includes(product.gender);
    const brandMatch = filters.brands.length === 0 || filters.brands.includes(product.brand);
    const priceMatch = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];

    return categoryMatch && genderMatch && brandMatch && priceMatch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-2">Boutique de Lunettes</h1>
            <p className="text-muted-foreground">
              Découvrez notre collection complète de lunettes et lunettes de soleil premium
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 shrink-0">
              <ProductFilter filters={filters} onFilterChange={setFilters} />
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between animate-slide-right">
                <p className="text-sm text-muted-foreground">
                  Affichage de {filteredProducts.length} sur {products.length} produits
                </p>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product, index) => (
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
                    Aucun produit trouvé correspondant à vos filtres.
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
