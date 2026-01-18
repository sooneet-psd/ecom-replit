import { ProductGrid } from "../shop/ProductGrid";
import { CartProvider } from "@/lib/cart-context";

const sampleProducts = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    originalPrice: 129.99,
    image: "https://placehold.co/400x300/e2e8f0/475569?text=Headphones",
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
    image: "https://placehold.co/400x300/e2e8f0/475569?text=Wallet",
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
    image: "https://placehold.co/400x300/e2e8f0/475569?text=Watch",
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
    image: "https://placehold.co/400x300/e2e8f0/475569?text=T-Shirt",
    rating: 4.3,
    reviewCount: 45,
    category: "Fashion",
    inStock: false,
  },
];

export default function ProductGridExample() {
  return (
    <CartProvider>
      <ProductGrid products={sampleProducts} />
    </CartProvider>
  );
}
