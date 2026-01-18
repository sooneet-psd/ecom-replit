import { Link } from "wouter";
import { ArrowRight, Truck, Shield, RefreshCw, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductGrid } from "@/components/shop/ProductGrid";

// todo: remove mock data
const featuredProducts = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones Pro",
    price: 79.99,
    originalPrice: 129.99,
    image: "https://placehold.co/400x300/94a3b8/ffffff?text=Headphones",
    rating: 4.5,
    reviewCount: 128,
    category: "Electronics",
    inStock: true,
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Premium Leather Wallet",
    price: 49.99,
    image: "https://placehold.co/400x300/78716c/ffffff?text=Wallet",
    rating: 4.8,
    reviewCount: 89,
    category: "Fashion",
    inStock: true,
  },
  {
    id: 3,
    name: "Smart Watch Series 5",
    price: 299.99,
    originalPrice: 349.99,
    image: "https://placehold.co/400x300/64748b/ffffff?text=Watch",
    rating: 4.7,
    reviewCount: 256,
    category: "Electronics",
    inStock: true,
    badge: "New",
  },
  {
    id: 4,
    name: "Organic Cotton T-Shirt",
    price: 29.99,
    image: "https://placehold.co/400x300/a3a3a3/ffffff?text=T-Shirt",
    rating: 4.3,
    reviewCount: 45,
    category: "Fashion",
    inStock: true,
  },
  {
    id: 5,
    name: "Portable Bluetooth Speaker",
    price: 59.99,
    originalPrice: 79.99,
    image: "https://placehold.co/400x300/6b7280/ffffff?text=Speaker",
    rating: 4.6,
    reviewCount: 178,
    category: "Electronics",
    inStock: true,
  },
  {
    id: 6,
    name: "Running Shoes Elite",
    price: 129.99,
    image: "https://placehold.co/400x300/71717a/ffffff?text=Shoes",
    rating: 4.4,
    reviewCount: 92,
    category: "Sports",
    inStock: true,
    badge: "Popular",
  },
  {
    id: 7,
    name: "Ceramic Coffee Mug Set",
    price: 24.99,
    image: "https://placehold.co/400x300/a1a1aa/ffffff?text=Mugs",
    rating: 4.9,
    reviewCount: 203,
    category: "Home & Living",
    inStock: true,
  },
  {
    id: 8,
    name: "Yoga Mat Premium",
    price: 39.99,
    originalPrice: 54.99,
    image: "https://placehold.co/400x300/9ca3af/ffffff?text=Yoga+Mat",
    rating: 4.7,
    reviewCount: 67,
    category: "Sports",
    inStock: true,
  },
];

// todo: remove mock data
const categories = [
  { name: "Electronics", image: "https://placehold.co/300x200/334155/ffffff?text=Electronics", count: 245 },
  { name: "Fashion", image: "https://placehold.co/300x200/475569/ffffff?text=Fashion", count: 189 },
  { name: "Home & Living", image: "https://placehold.co/300x200/64748b/ffffff?text=Home", count: 156 },
  { name: "Sports", image: "https://placehold.co/300x200/78716c/ffffff?text=Sports", count: 98 },
];

const features = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
  { icon: Shield, title: "Secure Payment", desc: "100% protected" },
  { icon: RefreshCw, title: "Easy Returns", desc: "30 day returns" },
  { icon: Headphones, title: "24/7 Support", desc: "Always here to help" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-primary/20 via-background to-accent/20 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Discover Quality Products for Every Lifestyle
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Shop our curated collection of premium products with free shipping on orders over $50. Quality guaranteed.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild data-testid="button-shop-now">
                  <Link href="/products">
                    Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/products?category=New">New Arrivals</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent rounded-2xl" />
              <img
                src="https://placehold.co/600x400/e2e8f0/64748b?text=Shop+Now"
                alt="Featured products"
                className="rounded-2xl shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card border-y">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Shop by Category</h2>
              <p className="text-muted-foreground mt-1">Browse our popular categories</p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/products">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link key={category.name} href={`/products?category=${category.name}`}>
                <Card className="group overflow-visible hover-elevate cursor-pointer" data-testid={`card-category-${category.name}`}>
                  <div className="relative aspect-[3/2] overflow-hidden rounded-t-lg">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="font-semibold">{category.name}</p>
                      <p className="text-sm opacity-80">{category.count} products</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
              <p className="text-muted-foreground mt-1">Our most popular items</p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/products">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Card className="bg-primary text-primary-foreground overflow-hidden">
            <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Get 20% Off Your First Order
                </h2>
                <p className="opacity-90 mb-4">
                  Subscribe to our newsletter and receive exclusive deals and updates.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto md:mx-0">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded-md text-foreground bg-background"
                    data-testid="input-promo-email"
                  />
                  <Button variant="secondary" data-testid="button-subscribe">
                    Subscribe
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
