import { Link } from "wouter";
import { Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">ShopHub</h3>
            <p className="text-muted-foreground text-sm">
              Your trusted destination for quality products at great prices. We deliver excellence with every order.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>123 Commerce Street, NY 10001</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@shophub.com</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/products">
                <span className="hover:text-foreground transition-colors" data-testid="link-footer-products">All Products</span>
              </Link>
              <Link href="/products?category=Electronics">
                <span className="hover:text-foreground transition-colors">Electronics</span>
              </Link>
              <Link href="/products?category=Fashion">
                <span className="hover:text-foreground transition-colors">Fashion</span>
              </Link>
              <Link href="/products?category=Home">
                <span className="hover:text-foreground transition-colors">Home & Living</span>
              </Link>
              <Link href="/blogs">
                <span className="hover:text-foreground transition-colors" data-testid="link-footer-blog">Blog</span>
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Customer Service</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/contact">
                <span className="hover:text-foreground transition-colors" data-testid="link-footer-contact">Contact Us</span>
              </Link>
              <Link href="/faq">
                <span className="hover:text-foreground transition-colors" data-testid="link-footer-faq">FAQ</span>
              </Link>
              <Link href="/faq#shipping">
                <span className="hover:text-foreground transition-colors">Shipping Info</span>
              </Link>
              <Link href="/faq#returns">
                <span className="hover:text-foreground transition-colors">Returns & Refunds</span>
              </Link>
              <Link href="/faq#privacy">
                <span className="hover:text-foreground transition-colors">Privacy Policy</span>
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Newsletter</h4>
            <p className="text-sm text-muted-foreground">
              Subscribe for exclusive deals and updates.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log("Newsletter signup submitted");
              }}
              className="flex gap-2"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1"
                data-testid="input-newsletter"
              />
              <Button type="submit" data-testid="button-newsletter-submit">
                Subscribe
              </Button>
            </form>
            <div className="flex items-center gap-4 pt-2">
              <div className="text-xs text-muted-foreground">Secure payments:</div>
              <div className="flex gap-2 text-muted-foreground text-xs">
                <span className="px-2 py-1 bg-muted rounded">Visa</span>
                <span className="px-2 py-1 bg-muted rounded">MC</span>
                <span className="px-2 py-1 bg-muted rounded">Stripe</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; 2024 ShopHub. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/faq#terms">
              <span className="hover:text-foreground transition-colors">Terms of Service</span>
            </Link>
            <Link href="/faq#privacy">
              <span className="hover:text-foreground transition-colors">Privacy Policy</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
