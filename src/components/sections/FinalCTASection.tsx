import { Button } from '@/components/ui/button';
import { ArrowRight, Clock } from 'lucide-react';

export const FinalCTASection = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-primary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary"></div>
      <div className="absolute top-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-accent/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-accent/10 rounded-full blur-2xl"></div>

      <div className="relative container mx-auto px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h2 className="font-montserrat font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white mb-4 sm:mb-6 px-2 leading-tight">
            So, What Are You 
            <span className="text-accent block">Waiting For?</span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-white/90 mb-6 sm:mb-8 leading-relaxed px-2">
            Join hundreds of successful students who have already transformed their lives. 
            Your e-commerce journey starts with a single step.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 mb-8 sm:mb-12">
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-accent flex-shrink-0" />
            <p className="text-sm sm:text-base lg:text-lg text-accent font-semibold text-center">
              Limited Seats Available - Enroll Today!
            </p>
          </div>

          <Button 
            onClick={scrollToTop}
            size="lg"
            className="bg-accent text-primary hover:bg-white hover:text-primary text-sm sm:text-base lg:text-xl font-bold px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-6 h-auto rounded-full shadow-premium transition-all duration-300 transform hover:scale-105 w-full sm:w-auto max-w-sm mx-auto"
          >
            <span className="flex items-center justify-center">
              <span className="hidden sm:inline">Enroll Now — Limited Seats Left</span>
              <span className="sm:hidden">Enroll Now</span>
              <ArrowRight className="ml-2 sm:ml-3 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </span>
          </Button>

          <p className="text-white/80 mt-6 sm:mt-8 text-sm sm:text-base lg:text-lg px-2">
            Don't let this opportunity pass you by. Start your transformation today.
          </p>
        </div>
      </div>
    </section>
  );
};