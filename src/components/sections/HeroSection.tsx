import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
export const HeroSection = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: ''
  });
  const {
    toast
  } = useToast();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!formData.fullName.trim()) {
      toast({
        title: "Full Name Required",
        description: "Please enter your full name",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.phone.trim()) {
      toast({
        title: "Phone Number Required", 
        description: "Please enter your phone number",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address", 
        variant: "destructive"
      });
      return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email Format",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    // Phone validation (basic)
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Enrollment Request Submitted!",
      description: "We'll contact you soon with next steps.",
      variant: "default"
    });
    
    setFormData({
      fullName: '',
      phone: '',
      email: ''
    });
  };
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  return <section id="hero" className="relative min-h-screen bg-gradient-hero overflow-hidden">
      {/* Enhanced Professional Background */}
      <div className="absolute inset-0">
        {/* Modern geometric texture */}
        <div className="absolute inset-0 opacity-[0.015]">
          <svg className="w-full h-full" viewBox="0 0 200 200" preserveAspectRatio="none">
            <defs>
              <pattern id="modernGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1.5" fill="currentColor" className="text-brand-blue" />
                <path d="M60,30 L30,30 M30,60 L30,30" stroke="currentColor" strokeWidth="0.5" className="text-brand-blue" opacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#modernGrid)" />
          </svg>
        </div>
        
        {/* Professional wave elements */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-32 opacity-[0.02]" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,40 Q300,80 600,40 T1200,40 L1200,120 L0,120 Z" fill="url(#professionalGradient)" />
            <defs>
              <linearGradient id="professionalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--brand-blue))" />
                <stop offset="50%" stopColor="hsl(var(--brand-teal))" />
                <stop offset="100%" stopColor="hsl(var(--brand-gold))" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {/* Refined accent blurs */}
        <div className="absolute top-1/4 right-1/5 w-96 h-96 bg-gradient-to-br from-brand-blue/[0.02] to-brand-teal/[0.015] rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/6 w-80 h-80 bg-gradient-to-tr from-brand-gold/[0.02] to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative container px-3 sm:px-4 md:px-6 pt-20 pb-12 sm:pt-24 sm:pb-16 lg:pt-32 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-20 items-center min-h-[calc(100vh-5rem)] sm:min-h-[calc(100vh-6rem)] lg:min-h-[calc(100vh-8rem)]">
          {/* Left side - Video */}
          <div className="animate-slide-in-left">
            <Card className="overflow-hidden shadow-premium border-0 bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl ring-1 ring-brand-blue/5 hover:shadow-elegant transition-all duration-700 hover:scale-[1.01] hover:ring-brand-blue/10 mx-1 sm:mx-0">
              <div className="aspect-video p-1">
                <iframe 
                  src="https://www.youtube.com/embed/cPbFSvDd9aU" 
                  title="E-Commerce Excellence Academy" 
                  className="w-full h-full rounded-2xl shadow-lg" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            </Card>
          </div>

          {/* Right side - Form */}
          <div className="animate-slide-in-right space-y-8 lg:space-y-10">
            <div className="text-center lg:text-left space-y-4 sm:space-y-6">
              <h1 className="font-montserrat font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-brand-blue leading-[1.1] tracking-tight px-2 sm:px-0">
                Transform Your Future with 
                <span className="text-brand-gold block bg-gradient-to-r from-brand-gold to-brand-gold/90 bg-clip-text text-transparent mt-1 sm:mt-2">
                  E-Commerce Excellence Academy
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-brand-blue/80 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0 px-2 sm:px-0">
                Master Amazon FBA, Dropshipping & Digital Marketing in just 3 months
              </p>
            </div>

            <Card className="p-3 sm:p-4 md:p-6 lg:p-8 xl:p-12 shadow-premium border-0 bg-white/97 backdrop-blur-md rounded-xl sm:rounded-2xl lg:rounded-3xl ring-1 ring-brand-blue/8 hover:shadow-elegant transition-all duration-700 hover:scale-[1.005] hover:ring-brand-blue/12 mx-1 sm:mx-0">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="text-center mb-6 sm:mb-8">
                  <h3 className="font-montserrat font-bold text-xl sm:text-2xl md:text-3xl text-brand-blue bg-gradient-to-r from-brand-blue to-brand-teal bg-clip-text text-transparent mb-3 sm:mb-4">
                    Enroll Now
                  </h3>
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-50 to-red-100 rounded-full border border-red-200">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                    <p className="text-red-600 font-semibold text-sm">Limited Seats Left</p>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <Label htmlFor="fullName" className="text-xs sm:text-sm font-semibold text-brand-blue/80 mb-2 sm:mb-3 block">Full Name</Label>
                    <Input 
                      id="fullName" 
                      type="text" 
                      placeholder="Enter your full name" 
                      value={formData.fullName} 
                      onChange={e => handleInputChange('fullName', e.target.value)} 
                      className="h-12 sm:h-14 border-2 border-brand-blue/15 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all duration-300 rounded-lg sm:rounded-xl bg-white/95 text-base sm:text-lg font-medium placeholder:text-muted-foreground/60 shadow-sm hover:shadow-md focus:shadow-lg" 
                      required 
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-xs sm:text-sm font-semibold text-brand-blue/80 mb-2 sm:mb-3 block">Phone Number</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="Enter your phone number" 
                      value={formData.phone} 
                      onChange={e => handleInputChange('phone', e.target.value)} 
                      className="h-12 sm:h-14 border-2 border-brand-blue/15 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all duration-300 rounded-lg sm:rounded-xl bg-white/95 text-base sm:text-lg font-medium placeholder:text-muted-foreground/60 shadow-sm hover:shadow-md focus:shadow-lg" 
                      required 
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-xs sm:text-sm font-semibold text-brand-blue/80 mb-2 sm:mb-3 block">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email address" 
                      value={formData.email} 
                      onChange={e => handleInputChange('email', e.target.value)} 
                      className="h-12 sm:h-14 border-2 border-brand-blue/15 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all duration-300 rounded-lg sm:rounded-xl bg-white/95 text-base sm:text-lg font-medium placeholder:text-muted-foreground/60 shadow-sm hover:shadow-md focus:shadow-lg" 
                      required 
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 sm:h-14 md:h-16 text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-brand-blue to-brand-blue/90 text-white hover:from-brand-gold hover:to-brand-gold/90 hover:text-brand-blue transition-all duration-500 transform hover:scale-[1.01] hover:shadow-2xl shadow-lg rounded-lg sm:rounded-xl border-0 ring-2 ring-brand-blue/20 hover:ring-brand-gold/30"
                >
                  <span className="hidden sm:inline">Enroll Now — Limited Seats Left</span>
                  <span className="sm:hidden">Enroll Now</span>
                </Button>

                <p className="text-center text-brand-gold font-bold text-base sm:text-lg mt-4 sm:mt-6 bg-gradient-to-r from-brand-gold to-brand-gold/80 bg-clip-text text-transparent">
                  "Transform your future in just 3 months!"
                </p>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>;
};