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
      
      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="font-montserrat font-bold text-4xl lg:text-5xl text-white mb-6">
            The Impact We've Made — In Numbers
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Our track record speaks for itself. Join thousands of successful students.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-8 text-center shadow-2xl border-0 bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-500 animate-scale-in-delayed group rounded-2xl ring-1 ring-white/20 hover:scale-105 hover:shadow-premium">
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto bg-accent rounded-full flex items-center justify-center group-hover:bg-primary transition-all duration-500 shadow-lg">
                  <stat.icon className="w-10 h-10 text-primary group-hover:text-white" />
                </div>
              </div>
              <h3 className="font-montserrat font-bold text-4xl lg:text-5xl text-primary mb-2">
                {stat.number}
              </h3>
              <h4 className="font-semibold text-xl text-foreground mb-2">
                {stat.label}
              </h4>
              <p className="text-muted-foreground">
                {stat.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};