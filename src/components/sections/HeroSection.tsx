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
    if (!formData.fullName || !formData.phone || !formData.email) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Enrollment Request Submitted!",
      description: "We'll contact you soon with next steps."
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
  return <section id="hero" className="relative min-h-screen bg-gradient-to-br from-slate-50/50 via-white to-blue-50/30 overflow-hidden">
      {/* Enhanced Professional Background */}
      <div className="absolute inset-0">
        {/* Modern geometric texture */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="w-full h-full" viewBox="0 0 200 200" preserveAspectRatio="none">
            <defs>
              <pattern id="modernGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="currentColor" className="text-primary" />
                <path d="M40,20 L20,20 M20,40 L20,20" stroke="currentColor" strokeWidth="0.5" className="text-primary" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#modernGrid)" />
          </svg>
        </div>
        
        {/* Professional wave elements */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-24 opacity-[0.03]" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,40 Q300,80 600,40 T1200,40 L1200,120 L0,120 Z" fill="url(#professionalGradient)" />
            <defs>
              <linearGradient id="professionalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="50%" stopColor="hsl(var(--brand-teal))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {/* Refined accent blurs */}
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-primary/[0.02] to-brand-teal/[0.02] rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/5 w-60 h-60 bg-gradient-to-tr from-accent/[0.03] to-transparent rounded-full blur-2xl"></div>
      </div>

      <div className="relative container pt-24 pb-16 lg:py-32 my-[7px] mx-[23px] px-[14px] py-[73px]">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-screen px-[6px] mx-0 py-[77px] my-0">
          {/* Left side - Video */}
          <div className="animate-fade-in">
            <Card className="overflow-hidden shadow-2xl border-0 bg-white/90 backdrop-blur-sm rounded-2xl ring-1 ring-primary/10 hover:shadow-premium transition-all duration-500 hover:scale-[1.02]">
              <div className="aspect-video">
                <iframe src="https://www.youtube.com/embed/Y6h7VOsMqIk" title="E-Commerce Excellence Academy" className="w-full h-full rounded-2xl" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
            </Card>
          </div>

          {/* Right side - Form */}
          <div className="animate-fade-in space-y-8">
            <div className="text-center lg:text-left space-y-6">
              <h1 className="font-montserrat font-bold text-4xl lg:text-6xl xl:text-7xl text-primary leading-[1.1] tracking-tight">
                Transform Your Future with 
                <span className="text-accent block bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
                  E-Commerce Excellence
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-primary/80 font-medium leading-relaxed max-w-lg">
                Master Amazon FBA, Dropshipping & Digital Marketing in just 3 months
              </p>
            </div>

            <Card className="p-8 lg:p-10 shadow-2xl border-0 bg-white/95 backdrop-blur-md rounded-3xl ring-1 ring-primary/10 hover:shadow-premium transition-all duration-500 hover:scale-[1.01]">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="font-montserrat font-bold text-3xl text-primary bg-gradient-to-r from-primary to-brand-teal bg-clip-text text-transparent mb-3">
                    Enroll Now
                  </h3>
                  <p className="text-muted-foreground font-medium text-lg">Limited Seats Left</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <Label htmlFor="fullName" className="text-sm font-bold text-primary/80 mb-2 block">Full Name</Label>
                    <Input id="fullName" type="text" placeholder="Enter your full name" value={formData.fullName} onChange={e => handleInputChange('fullName', e.target.value)} className="h-14 border-2 border-primary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300 rounded-xl bg-white/90 text-lg font-medium placeholder:text-muted-foreground/60 shadow-sm hover:shadow-md" required />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-bold text-primary/80 mb-2 block">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="Enter your phone number" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} className="h-14 border-2 border-primary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300 rounded-xl bg-white/90 text-lg font-medium placeholder:text-muted-foreground/60 shadow-sm hover:shadow-md" required />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-bold text-primary/80 mb-2 block">Email Address</Label>
                    <Input id="email" type="email" placeholder="Enter your email address" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="h-14 border-2 border-primary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300 rounded-xl bg-white/90 text-lg font-medium placeholder:text-muted-foreground/60 shadow-sm hover:shadow-md" required />
                  </div>
                </div>

                <Button type="submit" className="w-full h-16 text-xl font-bold bg-gradient-to-r from-accent to-accent/90 text-primary hover:from-primary hover:to-brand-teal hover:text-white transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl shadow-lg rounded-xl border-0 ring-2 ring-accent/20 hover:ring-primary/30">
                  Enroll Now — Limited Seats Left
                </Button>

                <p className="text-center text-accent font-bold text-xl mt-6 bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
                  "Transform your future in just 3 months!"
                </p>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>;
};