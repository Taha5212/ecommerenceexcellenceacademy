import { Button } from '@/components/ui/button';
import { ArrowRight, Clock } from 'lucide-react';

export const FinalCTASection = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-gradient-primary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-2xl"></div>

      <div className="relative container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h2 className="font-montserrat font-bold text-4xl lg:text-6xl text-white mb-6">
            So, What Are You 
            <span className="text-accent block">Waiting For?</span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
            Join hundreds of successful students who have already transformed their lives. 
            Your e-commerce journey starts with a single step.
          </p>

          <div className="flex items-center justify-center space-x-4 mb-12">
            <Clock className="w-8 h-8 text-accent" />
            <p className="text-lg text-accent font-semibold">
              Limited Seats Available - Enroll Today!
            </p>
          </div>

          <Button 
            onClick={scrollToTop}
            size="lg"
            className="bg-accent text-primary hover:bg-white hover:text-primary text-xl font-bold px-12 py-6 h-auto rounded-full shadow-premium transition-all duration-300 transform hover:scale-105"
          >
            Enroll Now — Limited Seats Left
            <ArrowRight className="ml-3 w-6 h-6" />
          </Button>

          <p className="text-white/80 mt-8 text-lg">
            Don't let this opportunity pass you by. Start your transformation today.
          </p>
        </div>
      </div>
    </section>
  );
};