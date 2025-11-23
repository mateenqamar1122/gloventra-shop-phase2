import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "What is Gloventra Shop?",
      answer: "Gloventra Shop is an online retail platform offering a wide range of products, from electronics to fashion, all at competitive prices.",
    },
    {
      question: "How do I place an order?",
      answer: "To place an order, simply browse our products, add desired items to your cart, and proceed to checkout. Follow the on-screen instructions to complete your purchase.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and other secure payment gateways.",
    },
    {
      question: "How can I track my order?",
      answer: "Once your order has shipped, you will receive a tracking number via email. You can use this number on our website's 'Track Order' page or the carrier's website.",
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Products must be in their original condition and packaging. Please refer to our 'Returns & Refunds' page for full details.",
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we offer international shipping to many countries. Shipping costs and delivery times vary depending on the destination. You can check eligibility and costs at checkout.",
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach our customer support team via the 'Contact Us' page, email, or phone. Our support hours are Monday to Friday, 9 AM to 5 PM EST.",
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-foreground">Frequently Asked Questions</h1>
        <p className="text-lg text-center text-muted-foreground mb-12">
          Find answers to the most common questions about Gloventra Shop, our products, and services.
        </p>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Still have questions?</h2>
          <p className="text-muted-foreground mb-6">
            If you can't find the answer you're looking for, feel free to reach out to our customer support team.
          </p>
          <a href="/contact-us" className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;