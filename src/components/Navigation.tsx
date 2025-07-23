import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '#hero' },
  { name: 'Courses', href: '#program' },
  { name: 'About Us', href: '#instructor' },
  { name: 'Gallery', href: '#achievements' },
  { name: 'Contact', href: '#footer' },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.href.substring(1));
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.substring(1));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-nav backdrop-blur-md shadow-elegant border-b border-white/10">
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex-shrink-0 min-w-0 flex-1 md:flex-none">
            <h2 className="font-montserrat font-bold text-sm sm:text-base md:text-xl text-white tracking-tight truncate">
              <span className="hidden sm:inline">E-Commerce Excellence</span>
              <span className="sm:hidden">E-Commerce</span>
            </h2>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group ${
                    activeSection === item.href.substring(1)
                      ? 'text-brand-gold bg-white/15 shadow-sm'
                      : 'text-white/90 hover:text-brand-gold hover:bg-white/10'
                  }`}
                >
                  {item.name}
                  <span className={`absolute bottom-0 left-1/2 w-0 h-0.5 bg-brand-gold transition-all duration-300 group-hover:w-3/4 group-hover:-translate-x-1/2 ${
                    activeSection === item.href.substring(1) ? 'w-3/4 -translate-x-1/2' : ''
                  }`}></span>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white hover:text-brand-gold hover:bg-white/10 transition-all duration-300 rounded-lg"
            >
              <div className="relative w-6 h-6">
                <Menu className={`h-6 w-6 transition-all duration-300 ${isOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`} />
                <X className={`h-6 w-6 absolute top-0 left-0 transition-all duration-300 ${isOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`} />
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gradient-nav/95 border-t border-white/20 backdrop-blur-sm">
            {navItems.map((item, index) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className={`block w-full text-left px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg transform ${
                  isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                } ${
                  activeSection === item.href.substring(1)
                    ? 'text-brand-gold bg-white/15 shadow-sm'
                    : 'text-white/90 hover:text-brand-gold hover:bg-white/10'
                }`}
                style={{
                  transitionDelay: isOpen ? `${index * 50}ms` : '0ms'
                }}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};