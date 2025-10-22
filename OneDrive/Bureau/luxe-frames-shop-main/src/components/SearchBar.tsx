import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { products } from '@/data/products';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<typeof products>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
      setIsOpen(true);
    } else {
      setFilteredProducts([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    setQuery('');
    setFilteredProducts([]);
    setIsOpen(false);
  };

  const handleProductClick = () => {
    setIsOpen(false);
    setQuery('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <form onSubmit={handleSearchSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher des lunettes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10"
            aria-label="Rechercher des produits"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={handleClear}
              aria-label="Effacer la recherche"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && filteredProducts.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50 animate-slide-up">
          <div className="p-2">
            <p className="text-xs text-muted-foreground px-3 py-2">
              {filteredProducts.length} résultat{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
            </p>
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                onClick={handleProductClick}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-smooth"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.brand}</p>
                </div>
                <p className="text-sm font-semibold text-accent">
                  {product.price.toLocaleString('fr-FR')} FCFA
                </p>
              </Link>
            ))}
          </div>
          <div className="border-t border-border p-2">
            <Link
              to={`/shop?search=${encodeURIComponent(query)}`}
              onClick={handleProductClick}
              className="block text-center text-sm text-accent hover:text-accent/80 py-2 transition-smooth"
            >
              Voir tous les résultats pour "{query}"
            </Link>
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && query.trim() && filteredProducts.length === 0 && (
        <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-lg shadow-lg p-4 z-50 animate-slide-up">
          <p className="text-sm text-muted-foreground text-center">
            Aucun produit trouvé pour "{query}"
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
