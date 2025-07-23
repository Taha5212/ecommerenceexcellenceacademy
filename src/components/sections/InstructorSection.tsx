import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
export const InstructorSection = () => {
  const achievements = ["Certified E-commerce Expert", "Years of Industry Experience", "Thousands of Students Trained", "Proven Track Record"];
  return <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-montserrat font-bold text-4xl lg:text-5xl text-primary mb-6">
            Meet Your Instructor
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn from an industry expert who has helped thousands achieve e-commerce success
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden shadow-premium border-0">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left side - Image */}
              <div className="relative">
                <img src="/lovable-uploads/1cdcd1ba-b344-4a01-aa01-ccb5b1e409c4.png" alt="Anas - E-commerce Expert" className="w-full h-full object-cover min-h-[400px] lg:min-h-[600px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              </div>

              {/* Right side - Content */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="animate-fade-in">
                  <Badge variant="secondary" className="mb-4 bg-accent text-primary">
                    Lead Instructor
                  </Badge>
                  
                  <h3 className="font-montserrat font-bold text-4xl lg:text-5xl text-primary mb-6">Anas Hanif LLC</h3>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    Anas is a certified e-commerce expert with years of experience training students 
                    and helping businesses succeed online. He is dedicated to empowering students with 
                    practical skills and knowledge to excel in the global e-commerce landscape.
                  </p>

                  <div className="space-y-4 mb-8">
                    <h4 className="font-semibold text-xl text-primary mb-4">Key Achievements:</h4>
                    {achievements.map((achievement, index) => <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                        <span className="text-muted-foreground">{achievement}</span>
                      </div>)}
                  </div>

                  <div className="bg-gradient-accent p-6 rounded-lg">
                    <blockquote className="text-primary italic text-lg">
                      "My mission is to help every student build a profitable e-commerce business 
                      and achieve financial freedom through practical, actionable training."
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>;
};