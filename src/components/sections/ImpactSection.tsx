import { Card } from '@/components/ui/card';
import { GraduationCap, Users, DollarSign, Briefcase } from 'lucide-react';

export const ImpactSection = () => {
  const stats = [
    {
      icon: GraduationCap,
      number: "500+",
      label: "Students Trained",
      description: "Successfully certified"
    },
    {
      icon: Users,
      number: "90%",
      label: "Success Rate",
      description: "Student achievement rate"
    },
    {
      icon: Briefcase,
      number: "50+",
      label: "Batches Completed",
      description: "Training programs finished"
    },
    {
      icon: DollarSign,
      number: "₹2M+",
      label: "Revenue Generated",
      description: "By our students"
    }
  ];

  return (
    <section className="py-20 bg-primary text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-brand-navy to-primary"></div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-teal/20 to-transparent"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
          <h2 className="font-montserrat font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-4 sm:mb-6 px-2">
            The Impact We've Made — In Numbers
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed px-2">
            Our track record speaks for itself. Join thousands of successful students.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4 sm:p-6 lg:p-8 text-center shadow-2xl border-0 bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-500 animate-scale-in-delayed group rounded-xl sm:rounded-2xl ring-1 ring-white/20 hover:scale-105 hover:shadow-premium">
              <div className="mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-accent rounded-full flex items-center justify-center group-hover:bg-primary transition-all duration-500 shadow-lg">
                  <stat.icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary group-hover:text-white" />
                </div>
              </div>
              <h3 className="font-montserrat font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-primary mb-1 sm:mb-2">
                {stat.number}
              </h3>
              <h4 className="font-semibold text-sm sm:text-base lg:text-xl text-foreground mb-1 sm:mb-2">
                {stat.label}
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {stat.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};