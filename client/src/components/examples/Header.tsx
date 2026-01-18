import { Header } from "../layout/Header";
import { CartProvider } from "@/lib/cart-context";

export default function HeaderExample() {
  return (
    <CartProvider>
      <Header />
    </CartProvider>
  );
}
