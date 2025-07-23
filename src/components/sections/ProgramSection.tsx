import { Card } from '@/components/ui/card';
import { CheckCircle, Clock, MapPin, Globe } from 'lucide-react';

export const ProgramSection = () => {
  const modules = [
    'Amazon FBA',
    'Amazon FBM', 
    'Wholesale',
    'Private Label',
    'Dropshipping',
    'Basics of Artificial Intelligence',
    'Basics of Digital Marketing',
    'English Language for E Commerce'
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          <h2 className="font-montserrat font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-primary mb-4 sm:mb-6 px-2">
            Our Premium Training Program
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-2 leading-relaxed">
            Learn everything you need to build a successful e commerce business in just 3 months. 
            This comprehensive program covers:
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left side - Modules */}
          <div className="animate-fade-in">
            <Card className="p-4 sm:p-6 lg:p-8 shadow-card border-0 bg-gradient-to-br from-background to-brand-light-blue mx-2 sm:mx-0">
              <h3 className="font-montserrat font-semibold text-lg sm:text-xl lg:text-2xl text-primary mb-4 sm:mb-6">
                What You'll Learn
              </h3>
              <div className="grid gap-3 sm:gap-4">
                {modules.map((module, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-accent flex-shrink-0" />
                    <span className="text-sm sm:text-base lg:text-lg text-foreground">{module}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right side - Program Details */}
          <div className="animate-fade-in space-y-6 sm:space-y-8">
            <Card className="p-4 sm:p-6 lg:p-8 shadow-card border-primary/20 mx-2 sm:mx-0">
              <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                <Clock className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-montserrat font-semibold text-lg sm:text-xl lg:text-2xl text-primary">Duration</h3>
                  <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">3 Months</p>
                </div>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                Intensive, hands-on training designed to get you results fast
              </p>
            </Card>

            <Card className="p-4 sm:p-6 lg:p-8 shadow-card border-accent/20 mx-2 sm:mx-0">
              <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
                  <MapPin className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-accent" />
                  <Globe className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-accent" />
                </div>
                <div>
                  <h3 className="font-montserrat font-semibold text-lg sm:text-xl lg:text-2xl text-primary">Format</h3>
                  <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">In-person & Online</p>
                </div>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                Flexible learning options to fit your schedule and learning style
              </p>
            </Card>

            <div className="bg-gradient-accent p-4 sm:p-6 lg:p-8 rounded-lg text-center mx-2 sm:mx-0">
              <h4 className="font-montserrat font-bold text-lg sm:text-xl lg:text-2xl text-primary mb-3 sm:mb-4">
                Start Your E Commerce Journey Today
              </h4>
              <p className="text-primary/80 text-sm sm:text-base lg:text-lg">
                Join hundreds of successful students who have transformed their lives
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};