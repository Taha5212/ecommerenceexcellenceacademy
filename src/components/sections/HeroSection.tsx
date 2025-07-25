import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, AlertCircle } from 'lucide-react';
export const HeroSection = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    message: ''
  });
  const [validationState, setValidationState] = useState({
    fullName: { isValid: true, message: '' },
    phone: { isValid: true, message: '' },
    email: { isValid: true, message: '' }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { trackClick } = useAnalytics();

  // Validation functions
  const validatePhone = useCallback((phone: string) => {
    if (!phone.trim()) {
      return { isValid: false, message: 'Phone number is required' };
    }
    // Enhanced phone validation - supports various formats
    const phoneRegex = /^[\+]?[\d\s\-\(\)\.\+]{10,15}$/;
    if (!phoneRegex.test(phone.trim())) {
      return { isValid: false, message: 'Please enter a valid phone number' };
    }
    return { isValid: true, message: '' };
  }, []);

  const validateEmail = useCallback((email: string) => {
    if (!email.trim()) {
      return { isValid: false, message: 'Email is required' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return { isValid: false, message: 'Please enter a valid email address' };
    }
    return { isValid: true, message: '' };
  }, []);

  const validateFullName = useCallback((name: string) => {
    if (!name.trim()) {
      return { isValid: false, message: 'Full name is required' };
    }
    if (name.trim().length < 2) {
      return { isValid: false, message: 'Name must be at least 2 characters' };
    }
    return { isValid: true, message: '' };
  }, []);

  // Optimized form submission with better error handling
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track form submission click
    trackClick('enrollment-form-submit', 'Enroll Now', 'button');
    
    setIsSubmitting(true);
    
    try {
      // Client-side validation
      const nameValidation = validateFullName(formData.fullName);
      const phoneValidation = validatePhone(formData.phone);
      const emailValidation = validateEmail(formData.email);

      // Update validation states for real-time feedback
      setValidationState({
        fullName: nameValidation,
        phone: phoneValidation,
        email: emailValidation
      });

      // Check if any validation failed
      if (!nameValidation.isValid || !phoneValidation.isValid || !emailValidation.isValid) {
        setIsSubmitting(false); // Important: Clear loading state on validation failure
        toast({
          title: "Form Validation Failed",
          description: "Please fix the errors and try again",
          variant: "destructive"
        });
        return;
      }

      // Get current user session for user_id
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || null;

      // Prepare submission data
      const submissionData = {
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim() || null,
        user_id: userId
      };

      console.log('Submitting form data:', submissionData); // Debug log

      // Submit to Supabase
      const { data, error } = await supabase
        .from('form_submissions')
        .insert(submissionData)
        .select(); // Add select to get the inserted data

      if (error) {
        console.error('Form submission error:', error);
        setIsSubmitting(false); // Clear loading state on error
        toast({
          title: "Submission Failed",
          description: `Error: ${error.message}. Please try again.`,
          variant: "destructive"
        });
        return;
      }

      console.log('Form submitted successfully:', data); // Debug log
      
      // Success feedback
      toast({
        title: "✅ Enrollment Request Submitted!",
        description: "We'll contact you within 24 hours with next steps.",
      });
      
      // Reset form and validation
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        message: ''
      });
      
      setValidationState({
        fullName: { isValid: true, message: '' },
        phone: { isValid: true, message: '' },
        email: { isValid: true, message: '' }
      });
      
    } catch (error) {
      console.error('Unexpected error:', error);
      setIsSubmitting(false); // Clear loading state on unexpected error
      toast({
        title: "Network Error",
        description: "Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      // This ensures loading state is always cleared
      setIsSubmitting(false);
    }
  }, [formData, validateFullName, validatePhone, validateEmail, trackClick, toast]);

  // Real-time input handling with validation
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Real-time validation for better UX
    if (field === 'phone') {
      const validation = validatePhone(value);
      setValidationState(prev => ({
        ...prev,
        phone: validation
      }));
    } else if (field === 'email') {
      const validation = validateEmail(value);
      setValidationState(prev => ({
        ...prev,
        email: validation
      }));
    } else if (field === 'fullName') {
      const validation = validateFullName(value);
      setValidationState(prev => ({
        ...prev,
        fullName: validation
      }));
    }
  }, [validatePhone, validateEmail, validateFullName]);
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
                  title="Ecommerence Excellence Academy - Best Amazon FBA course in Pakistan, learn dropshipping in Urdu and digital marketing" 
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
                Learn Online Business with
                <span className="text-brand-gold block bg-gradient-to-r from-brand-gold to-brand-gold/90 bg-clip-text text-transparent mt-1 sm:mt-2">
                  Ecommerence Excellence Academy
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-brand-blue/80 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0 px-2 sm:px-0">
                Best Amazon FBA course in Pakistan | Master dropshipping in Urdu, digital marketing course, and start your ecommerce store to make money online
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
                    <Label htmlFor="fullName" className="text-xs sm:text-sm font-semibold text-brand-blue/80 mb-2 sm:mb-3 block">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input 
                        id="fullName" 
                        type="text" 
                        placeholder="Enter your full name" 
                        value={formData.fullName} 
                        onChange={e => handleInputChange('fullName', e.target.value)} 
                        className={`h-12 sm:h-14 border-2 ${
                          validationState.fullName.isValid 
                            ? 'border-brand-blue/15 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20' 
                            : 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                        } transition-all duration-300 rounded-lg sm:rounded-xl bg-white/95 text-base sm:text-lg font-medium placeholder:text-muted-foreground/60 shadow-sm hover:shadow-md focus:shadow-lg pr-10`} 
                        required 
                      />
                      {!validationState.fullName.isValid && formData.fullName.length > 0 && (
                        <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
                      )}
                      {validationState.fullName.isValid && formData.fullName.length > 0 && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                      )}
                    </div>
                    {!validationState.fullName.isValid && (
                      <p className="text-red-500 text-xs mt-1">{validationState.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-xs sm:text-sm font-semibold text-brand-blue/80 mb-2 sm:mb-3 block">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="Enter your phone number" 
                        value={formData.phone} 
                        onChange={e => handleInputChange('phone', e.target.value)} 
                        className={`h-12 sm:h-14 border-2 ${
                          validationState.phone.isValid 
                            ? 'border-brand-blue/15 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20' 
                            : 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                        } transition-all duration-300 rounded-lg sm:rounded-xl bg-white/95 text-base sm:text-lg font-medium placeholder:text-muted-foreground/60 shadow-sm hover:shadow-md focus:shadow-lg pr-10`} 
                        required 
                      />
                      {!validationState.phone.isValid && formData.phone.length > 0 && (
                        <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
                      )}
                      {validationState.phone.isValid && formData.phone.length > 0 && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                      )}
                    </div>
                    {!validationState.phone.isValid && (
                      <p className="text-red-500 text-xs mt-1">{validationState.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-xs sm:text-sm font-semibold text-brand-blue/80 mb-2 sm:mb-3 block">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="Enter your email address" 
                        value={formData.email} 
                        onChange={e => handleInputChange('email', e.target.value)} 
                        className={`h-12 sm:h-14 border-2 ${
                          validationState.email.isValid 
                            ? 'border-brand-blue/15 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20' 
                            : 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                        } transition-all duration-300 rounded-lg sm:rounded-xl bg-white/95 text-base sm:text-lg font-medium placeholder:text-muted-foreground/60 shadow-sm hover:shadow-md focus:shadow-lg pr-10`} 
                        required 
                      />
                      {!validationState.email.isValid && formData.email.length > 0 && (
                        <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
                      )}
                      {validationState.email.isValid && formData.email.length > 0 && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                      )}
                    </div>
                    {!validationState.email.isValid && (
                      <p className="text-red-500 text-xs mt-1">{validationState.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-xs sm:text-sm font-semibold text-brand-blue/80 mb-2 sm:mb-3 block">
                      Message <span className="text-muted-foreground font-normal">(optional)</span>
                    </Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us about your goals and expectations (optional)" 
                      value={formData.message} 
                      onChange={e => handleInputChange('message', e.target.value)} 
                      className="min-h-[100px] border-2 border-brand-blue/15 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all duration-300 rounded-lg sm:rounded-xl bg-white/95 text-base sm:text-lg font-medium placeholder:text-muted-foreground/60 shadow-sm hover:shadow-md focus:shadow-lg resize-y" 
                      rows={4}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-12 sm:h-14 md:h-16 text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-brand-blue to-brand-blue/90 text-white hover:from-brand-gold hover:to-brand-gold/90 hover:text-brand-blue transition-all duration-500 transform hover:scale-[1.01] hover:shadow-2xl shadow-lg rounded-lg sm:rounded-xl border-0 ring-2 ring-brand-blue/20 hover:ring-brand-gold/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      <span className="hidden sm:inline">Submitting...</span>
                      <span className="sm:hidden">Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Enroll Now — Limited Seats Left</span>
                      <span className="sm:hidden">Enroll Now</span>
                    </>
                  )}
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