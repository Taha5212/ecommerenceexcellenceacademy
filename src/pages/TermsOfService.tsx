import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/sections/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 sm:px-6 py-20 sm:py-24 max-w-4xl">
        <h1 className="font-montserrat font-bold text-2xl sm:text-3xl md:text-4xl mb-6 sm:mb-8 text-primary">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none text-foreground space-y-6">
          <p className="text-muted-foreground mb-8">
            <strong>Effective Date:</strong> January 1, 2025
          </p>

          <section className="space-y-4">
            <h2 className="font-semibold text-2xl text-primary">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the services provided by E Commerce Excellence Academy, 
              you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold text-2xl text-primary">2. Course Enrollment and Access</h2>
            <p>
              Upon successful enrollment and payment, you will receive access to the course materials 
              for the duration specified in your enrollment agreement. Access may be revoked if these 
              terms are violated.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold text-2xl text-primary">3. Payment Terms</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All course fees must be paid in full before accessing course materials</li>
              <li>Payments are processed securely through our approved payment processors</li>
              <li>All sales are final unless otherwise specified in our refund policy</li>
              <li>Prices are subject to change without notice</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold text-2xl text-primary">4. Intellectual Property</h2>
            <p>
              All course materials, including but not limited to videos, documents, and presentations, 
              are the intellectual property of E Commerce Excellence Academy. Unauthorized reproduction, 
              distribution, or sale of these materials is strictly prohibited.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold text-2xl text-primary">5. User Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Share your login credentials with others</li>
              <li>Reproduce or distribute course materials without permission</li>
              <li>Use the service for any illegal or unauthorized purpose</li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>Attempt to gain unauthorized access to any part of the service</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold text-2xl text-primary">6. Refund Policy</h2>
            <p>
              We offer a 7-day refund policy from the date of purchase. Refund requests must be 
              submitted in writing and will be reviewed on a case-by-case basis. No refunds will 
              be provided after 7 days or if significant progress has been made in the course.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold text-2xl text-primary">7. Limitation of Liability</h2>
            <p>
              E Commerce Excellence Academy shall not be liable for any indirect, incidental, 
              special, or consequential damages resulting from the use or inability to use our services, 
              even if we have been advised of the possibility of such damages.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold text-2xl text-primary">8. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective 
              immediately upon posting on our website. Your continued use of the service constitutes 
              acceptance of the modified terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold text-2xl text-primary">9. Termination</h2>
            <p>
              We may terminate or suspend your access to our services at any time, without prior 
              notice or liability, for any reason whatsoever, including breach of these terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold text-2xl text-primary">10. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
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

export default TermsOfService;