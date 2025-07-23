import { Users } from 'lucide-react';
export const TrustedByBanner = () => {
  return <section className="bg-brand-light-blue py-12">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-center space-x-4 animate-fade-in">
          <Users className="w-8 h-8 text-primary" />
          <p className="font-montserrat font-semibold text-2xl lg:text-3xl text-primary">Trusted by 1000+ Students</p>
        </div>
      </div>
    </section>;
};