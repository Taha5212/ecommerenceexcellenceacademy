import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const FAQSection = () => {
  const faqs = [
    {
      question: "What is the duration of the program?",
      answer: "The program is designed to be completed in 3 months with comprehensive training covering all aspects of e-commerce business development."
    },
    {
      question: "Do I need any prior experience in e-commerce?",
      answer: "No prior experience is required. Our program is designed for complete beginners and will take you from zero to profitable e-commerce business owner."
    },
    {
      question: "Is the training available online or in-person?",
      answer: "We offer both in-person and online training options to accommodate different learning preferences and schedules."
    },
    {
      question: "What kind of support do I get after completing the program?",
      answer: "You'll receive ongoing mentorship, access to our alumni network, and continued support to ensure your e-commerce success."
    },
    {
      question: "What is the investment for this program?",
      answer: "Please contact us for detailed pricing information. We offer flexible payment plans and the ROI typically pays for the program within the first few months."
    },
    {
      question: "How do I know if this program is right for me?",
      answer: "If you're serious about building a successful e-commerce business and willing to put in the work, this program is perfect for you. We provide all the tools, knowledge, and support you need."
    }
  ];

  return (
    <section className="py-20 bg-brand-light-blue">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-montserrat font-bold text-4xl lg:text-5xl text-primary mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get answers to the most common questions about our program
          </p>
        </div>

        <div className="max-w-4xl mx-auto animate-fade-in">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-background rounded-lg border-0 shadow-card px-6">
                <AccordionTrigger className="text-left font-semibold text-lg text-primary hover:text-accent transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
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