import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-6 animate-fade-in">À Propos de LuxVision</h1>
          
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p className="animate-slide-up">
              LuxVision est une marque de lunetterie premium dédiée à fournir des lunettes et lunettes de soleil 
              de qualité exceptionnelle pour l'individu moderne. Fondée avec une passion pour le design et l'artisanat, 
              nous croyons que les lunettes doivent être à la fois fonctionnelles et à la mode.
            </p>
            
            <p className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Notre collection présente des montures soigneusement sélectionnées de designers renommés et de marques 
              émergentes, garantissant que chaque pièce répond à nos normes élevées de qualité et de style. Des 
              classiques aviateurs aux montures œil-de-chat contemporaines, nous offrons une gamme diversifiée pour 
              convenir à chaque forme de visage et style personnel.
            </p>
            
            <p className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Nous sommes engagés envers la durabilité et les pratiques éthiques. Toutes nos montures sont fabriquées 
              à partir de matériaux premium, et nous travaillons en étroite collaboration avec des fabricants qui 
              partagent nos valeurs de responsabilité environnementale et de pratiques de travail équitables.
            </p>
            
            <p className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              Merci d'avoir choisi LuxVision. Nous sommes là pour vous aider à trouver la paire parfaite qui reflète 
              votre vision unique. Visitez notre boutique à Pointe-Noire pour découvrir notre collection complète.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
