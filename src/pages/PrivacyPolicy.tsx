import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/sections/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 sm:px-6 py-20 sm:py-24 max-w-4xl">
        <h1 className="font-montserrat font-bold text-2xl sm:text-3xl md:text-4xl mb-6 sm:mb-8 text-primary">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none text-foreground space-y-6">
          <p className="text-muted-foreground mb-8">
            <strong>Effective Date:</strong> January 1, 2025
          </p>

          <section className="space-y-4">
            <h2 className="font-semibold text-2xl text-primary">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, 
              enroll in our courses, or contact us. This may include your name, email address, 
              phone number, and payment information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold text-2xl text-primary">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our educational services</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Communicate with you about courses, services, and promotional offers</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold text-2xl text-primary">3. Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except as described in this policy. We may share your information 
              with trusted service providers who assist us in operating our website and conducting our business.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold text-2xl text-primary">4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. However, no method of 
              transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold text-2xl text-primary">5. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience on our website, 
              analyze usage patterns, and personalize content. You can control cookie settings through 
              your browser preferences.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold text-2xl text-primary">6. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information. You may also 
              opt out of certain communications from us. To exercise these rights, please contact us 
              using the information provided below.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold text-2xl text-primary">7. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes 
              by posting the new policy on this page and updating the effective date.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold text-2xl text-primary">8. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy, please contact us at:
            </p>
            <div className="bg-secondary/20 p-4 rounded-lg">
              <p><strong>E Commerce Excellence Academy</strong></p>
              <p>Email: ecommerceexcellenceacademy@outlook.com</p>
              <p>Phone: +92 370 2041152</p>
              <p>Address: C-2, Block D, North Nazimabad, Karachi</p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;