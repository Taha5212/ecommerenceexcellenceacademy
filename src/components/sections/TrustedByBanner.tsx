import { Users } from 'lucide-react';
export const TrustedByBanner = () => {
  return <section className="bg-brand-light-blue py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-center space-x-3 sm:space-x-4 animate-fade-in">
          <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
          <p className="font-montserrat font-semibold text-lg sm:text-2xl lg:text-3xl text-primary text-center">Trusted by 1000+ Students</p>
        </div>
      </div>
    </section>;
};