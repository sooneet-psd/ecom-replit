import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";

// todo: remove mock data
const faqCategories = [
  {
    title: "Ordering & Payment",
    id: "ordering",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. All transactions are secured with SSL encryption.",
      },
      {
        q: "Can I modify or cancel my order?",
        a: "You can modify or cancel your order within 1 hour of placing it. After that, please contact our customer service team for assistance.",
      },
      {
        q: "How do I apply a coupon code?",
        a: "Enter your coupon code in the designated field during checkout. The discount will be applied to your order total before payment.",
      },
    ],
  },
  {
    title: "Shipping & Delivery",
    id: "shipping",
    questions: [
      {
        q: "What are your shipping options?",
        a: "We offer Standard Shipping (7-10 days), FedEx Ground (3-5 days), Aramex Standard (4-6 days), and DHL Express (2-3 days). Free shipping is available on orders over $50.",
      },
      {
        q: "How is shipping calculated?",
        a: "Shipping costs are calculated based on the greater of actual weight or volumetric weight (L x W x H / 5000). We add 8cm to each dimension for packaging.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by destination.",
      },
      {
        q: "How can I track my order?",
        a: "Once your order ships, you'll receive an email with tracking information. You can also track your order through your account dashboard.",
      },
    ],
  },
  {
    title: "Returns & Refunds",
    id: "returns",
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 30-day return policy for most items. Products must be unused and in original packaging. Some items like personalized products are non-returnable.",
      },
      {
        q: "How do I initiate a return?",
        a: "Log into your account, go to Order History, and select 'Return Item' next to the product you wish to return. You'll receive a prepaid shipping label via email.",
      },
      {
        q: "How long do refunds take?",
        a: "Refunds are processed within 3-5 business days after we receive your return. The funds may take additional time to appear depending on your bank.",
      },
    ],
  },
  {
    title: "Products & Stock",
    id: "products",
    questions: [
      {
        q: "How do I know if an item is in stock?",
        a: "Stock availability is shown on each product page. If an item is out of stock, you can sign up for email notifications when it becomes available.",
      },
      {
        q: "Are product images accurate?",
        a: "We strive to display accurate colors and details. However, monitor settings may cause slight variations. Please refer to product descriptions for exact specifications.",
      },
    ],
  },
  {
    title: "Account & Privacy",
    id: "privacy",
    questions: [
      {
        q: "How do I create an account?",
        a: "Click 'Sign Up' in the header and fill in your details. You can also create an account during checkout.",
      },
      {
        q: "How is my personal information protected?",
        a: "We use industry-standard SSL encryption and never share your data with third parties without consent. Read our Privacy Policy for details.",
      },
      {
        q: "How do I reset my password?",
        a: "Click 'Forgot Password' on the login page and enter your email. You'll receive a link to create a new password.",
      },
    ],
  },
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = faqCategories
    .map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.questions.length > 0);

  return (
    <div className="min-h-screen">
      <div className="bg-muted/30 py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h1>
          <p className="text-muted-foreground mt-2">
            Find answers to common questions about orders, shipping, returns, and more.
          </p>
          <div className="relative max-w-md mx-auto mt-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-faq-search"
            />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No questions found matching your search.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredCategories.map((category) => (
              <section key={category.id} id={category.id}>
                <h2 className="text-xl font-semibold mb-4">{category.title}</h2>
                <Accordion type="single" collapsible className="border rounded-lg">
                  {category.questions.map((item, idx) => (
                    <AccordionItem key={idx} value={`${category.id}-${idx}`}>
                      <AccordionTrigger className="px-4 text-left" data-testid={`accordion-${category.id}-${idx}`}>
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 text-muted-foreground">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}
          </div>
        )}

        <div className="mt-12 text-center p-8 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-4">
            Our support team is here to help you with any questions.
          </p>
          <a href="/contact">
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium">
              Contact Support
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
