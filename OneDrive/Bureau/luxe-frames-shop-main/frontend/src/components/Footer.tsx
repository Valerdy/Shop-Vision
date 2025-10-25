import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">LuxVision</h3>
            <p className="text-sm text-muted-foreground">
              Lunetterie premium pour le style de vie moderne. Montures de qualité, service exceptionnel.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="icon" className="hover:text-accent">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-accent">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-accent">
                <Twitter className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-sm text-muted-foreground hover:text-accent transition-smooth">
                  Voir Tout
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-accent transition-smooth">
                  À Propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-accent transition-smooth">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-sm text-muted-foreground hover:text-accent transition-smooth">
                  Mon Compte
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Service Client</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">Livraison & Retours</li>
              <li className="text-sm text-muted-foreground">Guide des Tailles</li>
              <li className="text-sm text-muted-foreground">FAQ</li>
              <li className="text-sm text-muted-foreground">Politique de Confidentialité</li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Restez Connecté</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>contact@luxvision.cg</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+242 06 123 4567</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Centre-ville, Pointe-Noire</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Abonnez-vous à notre newsletter</p>
              <div className="flex gap-2">
                <Input placeholder="Votre email" type="email" className="flex-1" />
                <Button variant="secondary" size="sm" className="hover-glow">S'abonner</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2025 LuxVision. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
