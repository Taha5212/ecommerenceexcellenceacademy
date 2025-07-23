import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // Only track sections on the home page
      if (location.pathname !== '/') return;
      
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
  }, [location.pathname]);

  const handleNavigation = (href: string) => {
    if (location.pathname !== '/') {
      // If not on home page, navigate to home first then scroll
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(href.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // If on home page, just scroll
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-nav backdrop-blur-md shadow-elegant border-b border-white/10">
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex-1 md:flex-none pr-4 md:pr-0">
            <button
              onClick={() => handleNavigation('#hero')}
              className="font-montserrat font-bold text-white tracking-tight hover:text-brand-gold transition-all duration-300 cursor-pointer group text-left whitespace-nowrap text-xs sm:text-sm md:text-base lg:text-lg"
            >
              Ecommerence Excellence Academy
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block flex-shrink-0">
            <div className="ml-4 lg:ml-10 flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group hover:scale-105 ${
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
                onClick={() => handleNavigation(item.href)}
                className={`block w-full text-left px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg transform hover:scale-105 ${
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