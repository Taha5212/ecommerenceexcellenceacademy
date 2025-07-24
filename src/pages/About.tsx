import { Card } from '@/components/ui/card';
import { CheckCircle, Target, Users, Award } from 'lucide-react';
import { Navigation } from '@/components/Navigation';

export const About = () => {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-background via-brand-light-blue/30 to-background">
      {/* Hero Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <h1 className="font-montserrat font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary mb-6">
              About <span className="text-brand-gold">Ecommerence Excellence Academy</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Pakistan's leading institute for Amazon FBA course, dropshipping in Urdu, and digital marketing training. 
              We help students learn online business and start successful ecommerce stores.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="animate-slide-in-left">
              <img 
                src="/lovable-uploads/563ffb69-5e88-42a8-9627-5c4327181240.png" 
                alt="Ecommerence Excellence Academy - Best Amazon FBA course in Pakistan and digital marketing training"
                className="w-full h-auto rounded-2xl shadow-premium"
              />
            </div>
            <div className="animate-slide-in-right space-y-6">
              <h2 className="font-montserrat font-bold text-2xl sm:text-3xl lg:text-4xl text-primary">
                Best Ecommerce Training in Pakistan
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Ecommerence Excellence Academy is recognized as the best ecommerce training in Pakistan. 
                We specialize in teaching Amazon FBA course in Pakistan, comprehensive dropshipping in Urdu, 
                and practical digital marketing course that helps students make money online.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Our mission is to empower Pakistani youth to learn online business through proven strategies. 
                Whether you want to start ecommerce store, excel in freelancing and ecommerce, or master 
                digital marketing skills, our Urdu ecommerce course provides the perfect foundation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 sm:py-20 bg-white/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <h2 className="font-montserrat font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-primary mb-6">
              Why Choose Our Amazon FBA Course in Pakistan?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover what makes Ecommerence Excellence Academy the top choice for learning online business and digital marketing course in Pakistan.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <Card className="p-6 text-center border-0 shadow-card hover:shadow-premium transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-brand-teal rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-montserrat font-bold text-lg text-primary mb-2">
                Best Ecommerce Training
              </h3>
              <p className="text-muted-foreground text-sm">
                Recognized as Pakistan's premier institute for Amazon FBA course and digital marketing training.
              </p>
            </Card>

            <Card className="p-6 text-center border-0 shadow-card hover:shadow-premium transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-gold to-brand-gold/80 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-montserrat font-bold text-lg text-primary mb-2">
                Urdu Ecommerce Course
              </h3>
              <p className="text-muted-foreground text-sm">
                Learn dropshipping in Urdu and digital marketing in your native language for better understanding.
              </p>
            </Card>

            <Card className="p-6 text-center border-0 shadow-card hover:shadow-premium transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-teal to-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-montserrat font-bold text-lg text-primary mb-2">
                Learn Online Business
              </h3>
              <p className="text-muted-foreground text-sm">
                Comprehensive training to start ecommerce store and develop freelancing and ecommerce skills.
              </p>
            </Card>

            <Card className="p-6 text-center border-0 shadow-card hover:shadow-premium transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-blue/80 to-brand-teal/80 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-montserrat font-bold text-lg text-primary mb-2">
                Make Money Online
              </h3>
              <p className="text-muted-foreground text-sm">
                Proven strategies and practical training to help you make money online through ecommerce.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Courses */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <h2 className="font-montserrat font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-primary mb-6">
              Our Comprehensive Digital Marketing Course
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Ecommerence Excellence Academy offers the most comprehensive curriculum to learn online business in Pakistan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 border-0 shadow-premium hover:shadow-elegant transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-brand-blue to-brand-teal rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">FBA</span>
                </div>
                <h3 className="font-montserrat font-bold text-xl text-primary mb-4">
                  Amazon FBA Course in Pakistan
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Master Amazon FBA with our comprehensive course designed specifically for the Pakistani market. 
                  Learn product research, sourcing, listing optimization, and scaling strategies.
                </p>
              </div>
            </Card>

            <Card className="p-8 border-0 shadow-premium hover:shadow-elegant transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-brand-gold to-brand-gold/80 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">DS</span>
                </div>
                <h3 className="font-montserrat font-bold text-xl text-primary mb-4">
                  Dropshipping in Urdu
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Learn dropshipping in Urdu with practical examples and case studies. 
                  Start your ecommerce store without inventory and scale your online business.
                </p>
              </div>
            </Card>

            <Card className="p-8 border-0 shadow-premium hover:shadow-elegant transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-brand-teal to-brand-blue rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">DM</span>
                </div>
                <h3 className="font-montserrat font-bold text-xl text-primary mb-4">
                  Digital Marketing Course
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Complete digital marketing course covering Facebook ads, Google ads, SEO, and social media marketing. 
                  Perfect for freelancing and ecommerce business growth.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 sm:py-20 bg-brand-light-blue">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <h2 className="font-montserrat font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-primary mb-6">
              Students Making Money Online
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              See how our students have transformed their lives through our best ecommerce training in Pakistan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                achievement: "₹50,000/month",
                method: "Amazon FBA",
                description: "Started earning through Amazon FBA course in Pakistan within 3 months"
              },
              {
                achievement: "₹35,000/month", 
                method: "Dropshipping",
                description: "Built successful dropshipping business using our Urdu ecommerce course"
              },
              {
                achievement: "₹40,000/month",
                method: "Digital Marketing",
                description: "Freelancing success through our digital marketing course training"
              }
            ].map((story, index) => (
              <Card key={index} className="p-6 border-0 shadow-card hover:shadow-premium transition-all duration-300 hover:scale-105 bg-white/95">
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-gold mb-2">{story.achievement}</div>
                  <div className="font-semibold text-primary mb-3">{story.method}</div>
                  <p className="text-muted-foreground text-sm">{story.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
    </>
  );
};