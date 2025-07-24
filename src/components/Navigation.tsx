import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Menu, X, User, LogOut, Settings, Lock, BarChart3 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { EditProfileModal } from '@/components/EditProfileModal';
import { ChangePasswordModal } from '@/components/ChangePasswordModal';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Courses', href: '#program' },
  { name: 'Instructor', href: '#instructor' },
  { name: 'Gallery', href: '#achievements' },
  { name: 'Contact', href: '#footer' },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, loading, signOut, displayName } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Logged Out",
        description: "You've been successfully logged out.",
      });
      navigate('/');
    }
    setIsOpen(false);
  };

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
    // Handle regular page navigation
    if (href.startsWith('/')) {
      navigate(href);
      setIsOpen(false);
      return;
    }
    
    // Handle anchor navigation
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
              className="flex items-center space-x-2 sm:space-x-3 font-montserrat font-bold text-white tracking-tight hover:text-brand-gold transition-all duration-300 cursor-pointer group text-left"
            >
              <img 
                src="/lovable-uploads/edcdc644-9512-4107-bcd0-0086c5bef308.png" 
                alt="E-commerce Excellence Academy Logo" 
                className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 object-contain filter brightness-0 invert"
              />
              <span className="hidden lg:block whitespace-nowrap text-xs sm:text-sm md:text-base lg:text-lg">
                E-commerce Excellence Academy
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Main Navigation Links */}
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group hover:scale-105 ${
                    (item.href.startsWith('/') && location.pathname === item.href) || 
                    (!item.href.startsWith('/') && activeSection === item.href.substring(1))
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
            
            {/* Auth Section */}
            <div className="flex items-center space-x-2 ml-4 border-l border-white/20 pl-4">
              {loading ? (
                <div className="px-4 py-2 text-sm text-white/50">Loading...</div>
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white/90 hover:text-brand-gold transition-all duration-300 rounded-lg hover:bg-white/10">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={profile?.avatar_url || ''} />
                        <AvatarFallback className="text-xs bg-white/20 text-white border border-white/30">
                          {displayName?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                       <span className="max-w-32 truncate">{displayName}</span>
                     </button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg z-[100]">
                     <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                       <BarChart3 className="h-4 w-4 mr-2" />
                       Dashboard
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => setShowEditProfile(true)} className="cursor-pointer">
                       <Settings className="h-4 w-4 mr-2" />
                       Edit Profile
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => setShowChangePassword(true)} className="cursor-pointer">
                       <Lock className="h-4 w-4 mr-2" />
                       Change Password
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                       <LogOut className="h-4 w-4 mr-2" />
                       Logout
                     </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/auth?tab=login')}
                    className="px-4 py-2 text-sm font-medium text-white/90 hover:text-brand-gold transition-all duration-300 rounded-lg hover:bg-white/10 hover:scale-105"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/auth?tab=signup')}
                    className="px-4 py-2 text-sm font-medium bg-brand-gold text-primary hover:bg-brand-gold/90 transition-all duration-300 rounded-lg hover:scale-105 shadow-lg"
                  >
                    Signup
                  </button>
                </>
              )}
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
            {/* Main Navigation Links */}
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
            
            {/* Mobile Auth Section */}
            <div className="border-t border-white/20 pt-3 mt-3 space-y-2">
              {loading ? (
                <div className="px-4 py-3 text-sm text-white/50">Loading...</div>
              ) : user ? (
                <>
                  <div className={`px-4 py-3 text-sm font-medium text-white/90 border border-white/20 rounded-lg flex items-center space-x-2 ${
                    isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                  }`}
                  style={{
                    transitionDelay: isOpen ? `${navItems.length * 50}ms` : '0ms'
                  }}>
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={profile?.avatar_url || ''} />
                      <AvatarFallback className="text-xs bg-white/20 text-white border border-white/30">
                        {displayName?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate">{displayName}</span>
                  </div>
                  <button
                    onClick={() => {
                      navigate('/dashboard');
                      setIsOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg transform hover:scale-105 text-white/90 hover:text-brand-gold hover:bg-white/10 ${
                      isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                    }`}
                    style={{
                      transitionDelay: isOpen ? `${(navItems.length + 1) * 50}ms` : '0ms'
                    }}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setShowEditProfile(true);
                      setIsOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg transform hover:scale-105 text-white/90 hover:text-brand-gold hover:bg-white/10 ${
                      isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                    }`}
                    style={{
                      transitionDelay: isOpen ? `${(navItems.length + 2) * 50}ms` : '0ms'
                    }}
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowChangePassword(true);
                      setIsOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg transform hover:scale-105 text-white/90 hover:text-brand-gold hover:bg-white/10 ${
                      isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                    }`}
                    style={{
                      transitionDelay: isOpen ? `${(navItems.length + 3) * 50}ms` : '0ms'
                    }}
                  >
                    Change Password
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`block w-full text-left px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg transform hover:scale-105 text-red-400 hover:text-red-300 hover:bg-white/10 ${
                      isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                    }`}
                    style={{
                      transitionDelay: isOpen ? `${(navItems.length + 4) * 50}ms` : '0ms'
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate('/auth?tab=login');
                      setIsOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg transform hover:scale-105 text-white/90 hover:text-brand-gold hover:bg-white/10 ${
                      isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                    }`}
                    style={{
                      transitionDelay: isOpen ? `${(navItems.length) * 50}ms` : '0ms'
                    }}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate('/auth?tab=signup');
                      setIsOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg transform hover:scale-105 bg-brand-gold text-primary hover:bg-brand-gold/90 shadow-lg ${
                      isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                    }`}
                    style={{
                      transitionDelay: isOpen ? `${(navItems.length + 1) * 50}ms` : '0ms'
                    }}
                  >
                    Signup
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Profile Management Modals */}
      <EditProfileModal 
        isOpen={showEditProfile} 
        onClose={() => setShowEditProfile(false)} 
      />
      <ChangePasswordModal 
        isOpen={showChangePassword} 
        onClose={() => setShowChangePassword(false)} 
      />
    </nav>
  );
};