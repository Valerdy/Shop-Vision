import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Mail, Phone, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactFormData } from '@/lib/validations';

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Simulate sending email
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Message envoyé ! Nous vous répondrons bientôt.');
      reset();
    } catch (error) {
      toast.error('Une erreur est survenue lors de l\'envoi du message');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-center animate-fade-in">Contactez-Nous</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="gradient-card rounded-lg p-8 shadow-card animate-slide-right">
              <h2 className="text-2xl font-semibold mb-6">Envoyez-nous un message</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    className={errors.name ? 'border-destructive' : ''}
                    placeholder="Votre nom complet"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className={errors.email ? 'border-destructive' : ''}
                    placeholder="votre.email@exemple.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="subject">Sujet</Label>
                  <Input
                    id="subject"
                    {...register('subject')}
                    className={errors.subject ? 'border-destructive' : ''}
                    placeholder="Objet de votre message"
                  />
                  {errors.subject && (
                    <p className="text-sm text-destructive mt-1">{errors.subject.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    {...register('message')}
                    className={errors.message ? 'border-destructive' : ''}
                    rows={5}
                    placeholder="Décrivez votre demande..."
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="w-full hover-glow"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer le Message'}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="gradient-card rounded-lg p-8 shadow-card animate-slide-up">
                <h2 className="text-2xl font-semibold mb-6">Entrez en Contact</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 animate-fade-in">
                    <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-muted-foreground">contact@luxvision.cg</p>
                      <p className="text-muted-foreground">support@luxvision.cg</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Téléphone</h3>
                      <p className="text-muted-foreground">+242 06 123 4567</p>
                      <p className="text-muted-foreground">Lun-Sam: 9h-18h</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Adresse</h3>
                      <p className="text-muted-foreground">Avenue de l'Indépendance</p>
                      <p className="text-muted-foreground">Centre-ville, Pointe-Noire, Congo</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="gradient-card rounded-lg p-8 shadow-card animate-scale-in">
                <h3 className="font-semibold mb-4">Horaires d'ouverture</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Lundi - Vendredi</span>
                    <span>9h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Samedi</span>
                    <span>9h00 - 14h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimanche</span>
                    <span>Fermé</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
