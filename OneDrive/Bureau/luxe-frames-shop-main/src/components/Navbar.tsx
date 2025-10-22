import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, User, Glasses, Heart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import SearchBar from '@/components/SearchBar';

const Navbar = () => {
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/shop', label: 'Boutique' },
    { to: '/about', label: 'À Propos' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-foreground hover:text-accent transition-smooth shrink-0">
            <Glasses className="w-6 h-6 text-accent" />
            <span className="hidden sm:inline">LuxVision</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-300 hover:after:w-full animate-fade-in whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link to="/auth" className="hidden sm:inline-block">
              <Button variant="ghost" size="icon" className="relative" aria-label="Compte utilisateur">
                <User className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="relative" aria-label="Favoris">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-glow animate-scale-in">
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative" aria-label="Panier">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-glow animate-scale-in">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-slide-up">
            <div className="flex flex-col gap-4">
              {/* Search Bar - Mobile */}
              <div className="md:hidden px-4">
                <SearchBar />
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth px-4 py-2 rounded-md hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/auth"
                className="sm:hidden text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth px-4 py-2 rounded-md hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                Mon Compte
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
