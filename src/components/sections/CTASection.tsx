import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CTASection = () => {
  const scrollToForm = () => {
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
      // Focus on the form after scrolling
      setTimeout(() => {
        const formElement = heroSection.querySelector('form');
        if (formElement) {
          const firstInput = formElement.querySelector('input') as HTMLInputElement;
          if (firstInput) {
            firstInput.focus();
          }
        }
      }, 800);
    }
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-primary via-brand-navy to-primary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/5 w-72 h-72 bg-gradient-to-br from-brand-gold/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/6 w-96 h-96 bg-gradient-to-tl from-brand-teal/8 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-brand-gold mr-3 animate-pulse" />
            <h2 className="font-montserrat font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white">
              Ready to Transform Your Future?
            </h2>
            <Sparkles className="w-8 h-8 text-brand-gold ml-3 animate-pulse" />
          </div>
          
          <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto px-2">
            Don't wait any longer. Join thousands of successful students who have already transformed their lives through our premium e-commerce training program.
          </p>
          
          <Button 
            onClick={scrollToForm}
            className="group bg-gradient-to-r from-brand-gold to-brand-gold/90 hover:from-brand-gold/90 hover:to-brand-gold text-primary hover:text-white text-lg sm:text-xl font-bold px-8 sm:px-12 py-4 sm:py-6 rounded-2xl shadow-2xl hover:shadow-premium transition-all duration-500 transform hover:scale-105 border-0 ring-2 ring-brand-gold/30 hover:ring-white/30"
          >
            <span className="flex items-center">
              Join Our Success Story Today!
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </Button>
          
          <p className="text-brand-gold/80 font-medium text-sm sm:text-base mt-6">
            ⚡ Limited seats available • Start your journey now
          </p>
        </div>
      </div>
    </section>
  );
};