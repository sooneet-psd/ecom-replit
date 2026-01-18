import Products from "@/pages/Products";
import { CartProvider } from "@/lib/cart-context";

export default function ProductsExample() {
  return (
    <CartProvider>
      <Products />
    </CartProvider>
  );
}
