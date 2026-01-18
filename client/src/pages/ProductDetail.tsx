import { useState } from "react";
import { useParams, Link } from "wouter";
import { Star, Minus, Plus, Truck, Shield, ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart-context";
import { ProductGrid } from "@/components/shop/ProductGrid";

// todo: remove mock data
const productData: Record<number, any> = {
  1: {
    id: 1,
    name: "Wireless Bluetooth Headphones Pro",
    price: 79.99,
    originalPrice: 129.99,
    images: [
      "https://placehold.co/600x600/94a3b8/ffffff?text=Headphones+1",
      "https://placehold.co/600x600/64748b/ffffff?text=Headphones+2",
      "https://placehold.co/600x600/475569/ffffff?text=Headphones+3",
    ],
    rating: 4.5,
    reviewCount: 128,
    category: "Electronics",
    inStock: true,
    badge: "Best Seller",
    description: "Experience premium sound quality with our Wireless Bluetooth Headphones Pro. Featuring active noise cancellation, 40-hour battery life, and ultra-comfortable memory foam ear cushions.",
    specifications: {
      "Driver Size": "40mm",
      "Frequency Response": "20Hz - 20kHz",
      "Battery Life": "40 hours",
      "Bluetooth Version": "5.2",
      "Weight": "250g",
    },
    colors: ["Black", "White", "Navy"],
    sku: "WBH-PRO-001",
  },
};

const relatedProducts = [
  { id: 5, name: "Portable Bluetooth Speaker", price: 59.99, originalPrice: 79.99, image: "https://placehold.co/400x300/6b7280/ffffff?text=Speaker", rating: 4.6, reviewCount: 178, category: "Electronics", inStock: true },
  { id: 9, name: "Wireless Charging Pad", price: 34.99, image: "https://placehold.co/400x300/94a3b8/ffffff?text=Charger", rating: 4.2, reviewCount: 156, category: "Electronics", inStock: true },
  { id: 3, name: "Smart Watch Series 5", price: 299.99, originalPrice: 349.99, image: "https://placehold.co/400x300/64748b/ffffff?text=Watch", rating: 4.7, reviewCount: 256, category: "Electronics", inStock: true, badge: "New" },
  { id: 2, name: "Premium Leather Wallet", price: 49.99, image: "https://placehold.co/400x300/78716c/ffffff?text=Wallet", rating: 4.8, reviewCount: 89, category: "Fashion", inStock: true },
];

export default function ProductDetail() {
  const params = useParams<{ id: string }>();
  const productId = parseInt(params.id || "1");
  const product = productData[productId] || productData[1];

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        variant: selectedColor,
      });
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/products">
          <Button variant="ghost" className="mb-6 gap-2" data-testid="button-back">
            <ArrowLeft className="h-4 w-4" /> Back to Products
          </Button>
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <Badge className="absolute top-4 left-4">{product.badge}</Badge>
              )}
              {discount > 0 && (
                <Badge variant="destructive" className="absolute top-4 right-4">
                  -{discount}%
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                    selectedImage === idx ? "border-primary" : "border-transparent"
                  }`}
                  data-testid={`button-thumbnail-${idx}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                {product.category}
              </p>
              <h1 className="text-3xl font-bold mt-1" data-testid="text-product-title">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-primary text-primary"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold" data-testid="text-product-price">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            <Separator />

            <div>
              <Label className="font-medium mb-3 block">Color: {selectedColor}</Label>
              <div className="flex gap-2">
                {product.colors.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-md border transition-colors ${
                      selectedColor === color
                        ? "border-primary bg-primary/10"
                        : "border-border"
                    }`}
                    data-testid={`button-color-${color}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="font-medium mb-3 block">Quantity</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  data-testid="button-quantity-decrease"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium" data-testid="text-quantity">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  data-testid="button-quantity-increase"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                data-testid="button-add-to-cart"
              >
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" data-testid="button-wishlist">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="h-4 w-4" />
                <span>Free shipping over $50</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>30-day return policy</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
          </div>
        </div>

        <Tabs defaultValue="description" className="mt-12">
          <TabsList>
            <TabsTrigger value="description" data-testid="tab-description">Description</TabsTrigger>
            <TabsTrigger value="specifications" data-testid="tab-specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews" data-testid="tab-reviews">Reviews ({product.reviewCount})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-none">
              <p>{product.description}</p>
              <p className="mt-4">
                Our Wireless Bluetooth Headphones Pro are designed for audiophiles who demand the best. 
                The premium drivers deliver crystal-clear highs and deep, rich bass. Active noise 
                cancellation blocks out ambient noise so you can focus on your music.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="specifications" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">{key}</span>
                  <span className="font-medium">{value as string}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <p className="text-muted-foreground">
              Reviews coming soon. This feature will display customer reviews and ratings.
            </p>
          </TabsContent>
        </Tabs>

        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <ProductGrid products={relatedProducts} />
        </section>
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}
