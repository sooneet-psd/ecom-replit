import { ProductCard } from "../shop/ProductCard";
import { CartProvider } from "@/lib/cart-context";

const sampleProduct = {
  id: 1,
  name: "Wireless Bluetooth Headphones Pro",
  price: 79.99,
  originalPrice: 129.99,
  image: "https://placehold.co/400x300/e2e8f0/475569?text=Headphones",
  rating: 4.5,
  reviewCount: 128,
  category: "Electronics",
  inStock: true,
  badge: "Best Seller",
};

export default function ProductCardExample() {
  return (
    <CartProvider>
      <div className="w-72">
        <ProductCard product={sampleProduct} />
      </div>
    </CartProvider>
  );
}
