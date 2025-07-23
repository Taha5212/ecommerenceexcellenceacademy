import { MapPin, Phone, Mail, Instagram } from 'lucide-react';
export const Footer = () => {
  return <footer className="bg-gradient-to-br from-[#0B1D39] via-primary to-brand-navy text-white py-16 relative overflow-hidden bg-sky-700">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/5 to-transparent"></div>
      
      <div className="container mx-auto px-6 relative">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in-up">
          {/* Company Info */}
          <div>
            <h3 className="font-montserrat font-bold text-2xl mb-4 text-accent">
              E-Commerce Excellence Academy
            </h3>
            <p className="text-white/80 leading-relaxed">
              Transforming lives through premium e-commerce education and practical training.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-white/80">C-2, Block D, North Nazimabad, Karachi</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-white/80">+92 370 2041152</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-white/80">ecommerceexcellenceacademy@outlook.com</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Follow Us</h4>
            <div className="space-y-3">
              <a href="https://instagram.com/ecommerce_excellence_academy" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-white/80 hover:text-accent transition-colors duration-300 group">
                <Instagram className="w-5 h-5 text-accent group-hover:scale-110 transition-transform duration-300" />
                <span>@ecommerce_excellence_academy</span>
              </a>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Legal</h4>
            <div className="space-y-3">
              <a href="#" className="block text-white/80 hover:text-accent transition-all duration-300 hover:translate-x-1">
                Privacy Policy
              </a>
              <a href="#" className="block text-white/80 hover:text-accent transition-all duration-300 hover:translate-x-1">
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-white/60">
            © 2025 E-Commerce Excellence Academy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
};