import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const FAQSection = () => {
  const faqs = [
    {
      question: "What makes Ecommerence Excellence Academy the best ecommerce training in Pakistan?",
      answer: "Ecommerence Excellence Academy offers comprehensive Amazon FBA course in Pakistan, dropshipping training in Urdu, and practical digital marketing course. Our proven curriculum helps students start successful ecommerce stores and make money online."
    },
    {
      question: "Can I learn Amazon FBA course in Pakistan with no experience?",
      answer: "Absolutely! Our Amazon FBA course in Pakistan is designed for complete beginners. We teach you step-by-step how to start an ecommerce store, find profitable products, and scale your online business to make money online."
    },
    {
      question: "Is dropshipping training available in Urdu language?",
      answer: "Yes, we provide comprehensive dropshipping training in Urdu. Our instructors teach digital marketing strategies and how to start ecommerce store using dropshipping model to help you learn online business effectively."
    },
    {
      question: "What digital marketing skills will I learn at Ecommerence Excellence Academy?",
      answer: "Our digital marketing course covers Facebook ads, Google ads, social media marketing, SEO, and conversion optimization. These skills are essential for freelancing and ecommerce success in the Pakistani market."
    },
    {
      question: "How can I start making money online after this ecommerce training?",
      answer: "After completing our best ecommerce training in Pakistan, you'll have the skills to start your ecommerce store, work as a freelancer, or offer digital marketing services. Many students start making money online within weeks of completing the course."
    },
    {
      question: "Do you provide support for freelancing and ecommerce business setup?",
      answer: "Yes, Ecommerence Excellence Academy provides ongoing mentorship for both freelancing and ecommerce ventures. We help you learn online business strategies and provide practical guidance to start and scale your digital business."
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-brand-light-blue">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          <h2 className="font-montserrat font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-primary mb-4 sm:mb-6 px-2">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
            Get answers to the most common questions about our program
          </p>
        </div>

        <div className="max-w-4xl mx-auto animate-fade-in">
          <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-background rounded-lg border-0 shadow-card px-4 sm:px-6 mx-2 sm:mx-0">
                <AccordionTrigger className="text-left font-semibold text-sm sm:text-base lg:text-lg text-primary hover:text-accent transition-colors py-4 sm:py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-sm sm:text-base pb-4 sm:pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};