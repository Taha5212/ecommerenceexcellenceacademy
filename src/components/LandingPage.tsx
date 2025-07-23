import { Navigation } from './Navigation';
import { HeroSection } from './sections/HeroSection';
import { TrustedByBanner } from './sections/TrustedByBanner';
import { ProgramSection } from './sections/ProgramSection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import { ImpactSection } from './sections/ImpactSection';
import { AchievementsSection } from './sections/AchievementsSection';
import { FAQSection } from './sections/FAQSection';
import { InstructorSection } from './sections/InstructorSection';
import { FinalCTASection } from './sections/FinalCTASection';
import { Footer } from './sections/Footer';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navigation />
      <HeroSection />
      <TrustedByBanner />
      <div id="program">
        <ProgramSection />
      </div>
      <TestimonialsSection />
      <ImpactSection />
      <div id="achievements">
        <AchievementsSection />
      </div>
      <FAQSection />
      <div id="instructor">
        <InstructorSection />
      </div>
      <FinalCTASection />
      <div id="footer">
        <Footer />
      </div>
    </div>
  );
};