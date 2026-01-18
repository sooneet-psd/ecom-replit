import Home from "@/pages/Home";
import { CartProvider } from "@/lib/cart-context";

export default function HomeExample() {
  return (
    <CartProvider>
      <Home />
    </CartProvider>
  );
}
