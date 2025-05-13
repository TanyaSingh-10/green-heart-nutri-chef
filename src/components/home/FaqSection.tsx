
import React from 'react';
import SectionHeading from '../ui/SectionHeading';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FaqSection: React.FC = () => {
  const faqs = [
    {
      question: "What can I expect from my initial consultation?",
      answer: "During your initial consultation, we'll discuss your health history, current eating habits, lifestyle factors, and specific goals. We'll perform basic measurements and assessments to create a baseline. This comprehensive approach helps us develop a personalized nutrition plan that aligns with your needs and preferences. The session typically lasts 60-90 minutes."
    },
    {
      question: "How long does it typically take to see results?",
      answer: "Many clients report feeling more energetic and experiencing improved digestion within the first 1-2 weeks of following their personalized nutrition plan. Physical changes like weight loss or muscle definition typically become noticeable after 3-4 weeks of consistent adherence to the plan. However, lasting transformations and health improvements generally take 2-3 months of committed effort."
    },
    {
      question: "Are the diet plans suitable for people with food allergies or specific dietary requirements?",
      answer: "Absolutely! We specialize in creating customized nutrition plans that accommodate food allergies, intolerances, and specific dietary requirements. Whether you follow a vegetarian, vegan, gluten-free, dairy-free, or other specialized diet, we'll craft a plan that meets your nutritional needs while respecting your dietary restrictions. Your health and safety are our top priorities."
    },
    {
      question: "How do I maintain my results after reaching my initial goals?",
      answer: "After achieving your initial goals, we'll work together to develop a sustainable maintenance plan. This typically includes gradually increasing caloric intake, introducing more food variety, and implementing long-term lifestyle strategies. We offer follow-up sessions to monitor progress and make adjustments as needed. Many clients find that the healthy habits they've developed become second nature, making maintenance much easier."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-nutrition-50">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading 
          label="FAQ" 
          heading="Frequently asked questions" 
          centered
        />

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="bg-white shadow-md rounded-xl overflow-hidden">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left px-6 py-4 text-gray-800 hover:text-nutrition-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
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

export default FaqSection;
