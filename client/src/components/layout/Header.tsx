import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, Menu, X, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart-context";

const categories = [
  {
    name: "Electronics",
    subcategories: ["Phones", "Laptops", "Tablets", "Accessories"],
  },
  {
    name: "Fashion",
    subcategories: ["Men", "Women", "Kids", "Shoes"],
  },
  {
    name: "Home & Living",
    subcategories: ["Furniture", "Decor", "Kitchen", "Bedding"],
  },
  {
    name: "Sports",
    subcategories: ["Fitness", "Outdoor", "Team Sports", "Accessories"],
  },
];

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { itemCount, setIsOpen } = useCart();

  const isActive = (path: string) => location === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search:", searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="bg-primary text-primary-foreground text-sm py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
          <span>Free shipping on orders over $50</span>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/faq" className="hover:underline">Help</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                    <span className="text-lg font-semibold">Home</span>
                  </Link>
                  <Link href="/products" onClick={() => setMobileMenuOpen(false)}>
                    <span className="text-lg font-semibold">All Products</span>
                  </Link>
                  {categories.map((cat) => (
                    <div key={cat.name} className="space-y-2">
                      <span className="text-lg font-semibold">{cat.name}</span>
                      <div className="pl-4 space-y-1">
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub}
                            href={`/products?category=${cat.name}&sub=${sub}`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <span className="block text-muted-foreground">{sub}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                  <Link href="/blogs" onClick={() => setMobileMenuOpen(false)}>
                    <span className="text-lg font-semibold">Blog</span>
                  </Link>
                  <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                    <span className="text-lg font-semibold">Contact</span>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>

            <Link href="/">
              <span className="text-2xl font-bold text-foreground" data-testid="link-logo">
                ShopHub
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Link href="/">
                <Button
                  variant={isActive("/") ? "secondary" : "ghost"}
                  data-testid="link-home"
                >
                  Home
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-1" data-testid="button-categories">
                    Categories <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  {categories.map((cat) => (
                    <DropdownMenuItem key={cat.name} asChild>
                      <Link href={`/products?category=${cat.name}`}>
                        {cat.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/products">
                <Button
                  variant={isActive("/products") ? "secondary" : "ghost"}
                  data-testid="link-products"
                >
                  All Products
                </Button>
              </Link>
              
              <Link href="/blogs">
                <Button
                  variant={isActive("/blogs") ? "secondary" : "ghost"}
                  data-testid="link-blog"
                >
                  Blog
                </Button>
              </Link>
            </nav>
          </div>

          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
          </form>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="lg:hidden" data-testid="button-search-mobile">
              <Search className="h-5 w-5" />
            </Button>
            
            <Link href="/admin">
              <Button variant="ghost" size="icon" data-testid="link-account">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setIsOpen(true)}
              data-testid="button-cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  data-testid="badge-cart-count"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
