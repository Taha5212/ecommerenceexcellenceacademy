import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Ahmed Khan",
      feedback: "Best investment I ever made. Now earning ₹50K monthly from my Amazon FBA business!",
      avatar: "AK",
      rating: 5,
      role: "Amazon FBA Seller"
    },
    {
      name: "Sarah Ali",
      feedback: "Transformed my career completely. From housewife to successful entrepreneur!",
      avatar: "SA",
      rating: 5,
      role: "Dropshipping Expert"
    },
    {
      name: "Muhammad Hassan",
      feedback: "Excellent mentorship and practical training. Started earning within 2 months!",
      avatar: "MH",
      rating: 5,
      role: "E-commerce Consultant"
    },
    {
      name: "Fatima Sheikh",
      feedback: "From zero knowledge to profitable business in just 3 months. Amazing course!",
      avatar: "FS",
      rating: 5,
      role: "Online Store Owner"
    },
    {
      name: "Ali Raza",
      feedback: "The support and guidance exceeded my expectations. Now running 3 stores!",
      avatar: "AR",
      rating: 5,
      role: "Multi-Store Owner"
    },
    {
      name: "Ayesha Khan",
      feedback: "Life-changing program. Worth every penny. Highly recommend to everyone!",
      avatar: "AY",
      rating: 5,
      role: "Digital Marketing Expert"
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-slate-50/50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
          <h2 className="font-montserrat font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-primary mb-4 sm:mb-6 px-2">
            Hear From Our Successful Students
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
            Real stories from real students who have transformed their lives through our program
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-4 sm:p-6 shadow-2xl border-0 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-500 transform hover:scale-105 hover:shadow-premium group rounded-xl sm:rounded-2xl ring-1 ring-primary/5 mx-2 sm:mx-0">
              <div className="flex items-center space-x-4 mb-6">
                <Avatar className="w-16 h-16 ring-2 ring-accent/20">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold text-lg">
                    {testimonial.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-montserrat font-bold text-lg text-primary">{testimonial.name}</h4>
                  <p className="text-sm text-accent font-medium">{testimonial.role}</p>
                  <div className="flex space-x-1 mt-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                </div>
              </div>
              <blockquote className="text-muted-foreground italic leading-relaxed group-hover:text-primary transition-colors duration-300">
                "{testimonial.feedback}"
              </blockquote>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};