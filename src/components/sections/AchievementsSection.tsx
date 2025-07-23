import { Card } from '@/components/ui/card';
import { Trophy, Award, Users, Star } from 'lucide-react';

export const AchievementsSection = () => {
  const achievements = [
    {
      image: "/lovable-uploads/563ffb69-5e88-42a8-9627-5c4327181240.png",
      title: "Best Teacher Award",
      description: "Recognizing outstanding performance"
    },
    {
      image: "/lovable-uploads/6ad70b31-9a43-43e4-808d-04b5cb36ff42.png",
      title: "Excellence Certificate",
      description: "Achievement in e-commerce training"
    },
    {
      image: "/lovable-uploads/6bd9f11a-0298-4360-b767-de3df666c974.png",
      title: "Golden Achievement",
      description: "Top performer recognition"
    },
    {
      image: "/lovable-uploads/5b2eb777-5b43-47af-b70d-ddc48619b63c.png",
      title: "Graduation Ceremony",
      description: "Our successful batch completion"
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-brand-light-blue">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <Trophy className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-accent" />
            <Star className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
            <Award className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-accent" />
          </div>
          <h2 className="font-montserrat font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-primary mb-4 sm:mb-6 px-2">
            Our Journey & Achievements
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
            Celebrating success stories and milestones of our students and academy
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {achievements.map((achievement, index) => (
            <Card key={index} className="overflow-hidden shadow-premium border-0 bg-background hover:shadow-elegant transition-all duration-300 transform hover:scale-105 group mx-2 sm:mx-0">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={achievement.image} 
                  alt={achievement.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4 sm:p-6 text-center">
                <h3 className="font-montserrat font-semibold text-base sm:text-lg text-primary mb-2">
                  {achievement.title}
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  {achievement.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <p className="text-sm sm:text-base lg:text-lg text-primary font-semibold bg-accent/20 inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-full">
            Join our success story today!
          </p>
        </div>
      </div>
    </section>
  );
};