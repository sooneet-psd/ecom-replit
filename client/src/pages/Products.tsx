import { useState } from "react";
import { useSearch } from "wouter";
import { Grid3X3, List, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ProductCard, type Product } from "@/components/shop/ProductCard";

// todo: remove mock data
const allProducts: Product[] = [
  { id: 1, name: "Wireless Bluetooth Headphones Pro", price: 79.99, originalPrice: 129.99, image: "https://placehold.co/400x300/94a3b8/ffffff?text=Headphones", rating: 4.5, reviewCount: 128, category: "Electronics", inStock: true, badge: "Best Seller" },
  { id: 2, name: "Premium Leather Wallet", price: 49.99, image: "https://placehold.co/400x300/78716c/ffffff?text=Wallet", rating: 4.8, reviewCount: 89, category: "Fashion", inStock: true },
  { id: 3, name: "Smart Watch Series 5", price: 299.99, originalPrice: 349.99, image: "https://placehold.co/400x300/64748b/ffffff?text=Watch", rating: 4.7, reviewCount: 256, category: "Electronics", inStock: true, badge: "New" },
  { id: 4, name: "Organic Cotton T-Shirt", price: 29.99, image: "https://placehold.co/400x300/a3a3a3/ffffff?text=T-Shirt", rating: 4.3, reviewCount: 45, category: "Fashion", inStock: true },
  { id: 5, name: "Portable Bluetooth Speaker", price: 59.99, originalPrice: 79.99, image: "https://placehold.co/400x300/6b7280/ffffff?text=Speaker", rating: 4.6, reviewCount: 178, category: "Electronics", inStock: true },
  { id: 6, name: "Running Shoes Elite", price: 129.99, image: "https://placehold.co/400x300/71717a/ffffff?text=Shoes", rating: 4.4, reviewCount: 92, category: "Sports", inStock: true, badge: "Popular" },
  { id: 7, name: "Ceramic Coffee Mug Set", price: 24.99, image: "https://placehold.co/400x300/a1a1aa/ffffff?text=Mugs", rating: 4.9, reviewCount: 203, category: "Home & Living", inStock: true },
  { id: 8, name: "Yoga Mat Premium", price: 39.99, originalPrice: 54.99, image: "https://placehold.co/400x300/9ca3af/ffffff?text=Yoga+Mat", rating: 4.7, reviewCount: 67, category: "Sports", inStock: true },
  { id: 9, name: "Wireless Charging Pad", price: 34.99, image: "https://placehold.co/400x300/94a3b8/ffffff?text=Charger", rating: 4.2, reviewCount: 156, category: "Electronics", inStock: true },
  { id: 10, name: "Denim Jacket Classic", price: 89.99, originalPrice: 119.99, image: "https://placehold.co/400x300/6b7280/ffffff?text=Jacket", rating: 4.6, reviewCount: 78, category: "Fashion", inStock: false },
  { id: 11, name: "Stainless Steel Water Bottle", price: 19.99, image: "https://placehold.co/400x300/71717a/ffffff?text=Bottle", rating: 4.8, reviewCount: 234, category: "Sports", inStock: true },
  { id: 12, name: "Decorative Throw Pillow Set", price: 44.99, image: "https://placehold.co/400x300/a1a1aa/ffffff?text=Pillows", rating: 4.5, reviewCount: 89, category: "Home & Living", inStock: true },
];

const categories = ["Electronics", "Fashion", "Home & Living", "Sports"];

export default function Products() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const categoryParam = params.get("category");

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );
  const [inStockOnly, setInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredProducts = allProducts
    .filter((p) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (inStockOnly && !p.inStock) return false;
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low": return a.price - b.price;
        case "price-high": return b.price - a.price;
        case "rating": return b.rating - a.rating;
        case "newest": return b.id - a.id;
        default: return 0;
      }
    });

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 500]);
    setInStockOnly(false);
    setSearchQuery("");
  };

  const activeFilterCount =
    selectedCategories.length +
    (priceRange[0] > 0 || priceRange[1] < 500 ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  const FiltersContent = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-semibold mb-3 block">Search</Label>
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          data-testid="input-filter-search"
        />
      </div>

      <Separator />

      <div>
        <Label className="text-sm font-semibold mb-3 block">Categories</Label>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center gap-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
                data-testid={`checkbox-category-${category}`}
              />
              <label htmlFor={category} className="text-sm cursor-pointer">
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <Label className="text-sm font-semibold mb-3 block">
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </Label>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={500}
          step={10}
          className="mt-2"
          data-testid="slider-price-range"
        />
      </div>

      <Separator />

      <div className="flex items-center gap-2">
        <Checkbox
          id="inStock"
          checked={inStockOnly}
          onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
          data-testid="checkbox-in-stock"
        />
        <label htmlFor="inStock" className="text-sm cursor-pointer">
          In Stock Only
        </label>
      </div>

      {activeFilterCount > 0 && (
        <>
          <Separator />
          <Button variant="outline" className="w-full" onClick={clearFilters} data-testid="button-clear-filters">
            Clear All Filters
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="bg-muted/30 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">All Products</h1>
          <p className="text-muted-foreground mt-1">
            Showing {filteredProducts.length} products
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h2 className="font-semibold mb-4">Filters</h2>
              <FiltersContent />
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                  <SheetTrigger asChild className="lg:hidden">
                    <Button variant="outline" className="gap-2" data-testid="button-filters-mobile">
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters
                      {activeFilterCount > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {activeFilterCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FiltersContent />
                    </div>
                  </SheetContent>
                </Sheet>

                {selectedCategories.map((cat) => (
                  <Badge key={cat} variant="secondary" className="gap-1">
                    {cat}
                    <button onClick={() => toggleCategory(cat)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-44" data-testid="select-sort">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>

                <div className="hidden sm:flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    data-testid="button-view-grid"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    data-testid="button-view-list"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {viewMode === "grid" ? (
              <ProductGrid products={filteredProducts} />
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="flex gap-4 p-4 border rounded-lg">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-32 h-24 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground uppercase">{product.category}</p>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-lg font-bold mt-1">${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
