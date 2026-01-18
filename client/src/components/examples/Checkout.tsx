import Checkout from "@/pages/Checkout";
import { CartProvider, useCart } from "@/lib/cart-context";
import { useEffect } from "react";

function CheckoutWithItems() {
  const { addItem } = useCart();
  
  useEffect(() => {
    addItem({
      id: 1,
      name: "Wireless Bluetooth Headphones Pro",
      price: 79.99,
      image: "https://placehold.co/400x300/94a3b8/ffffff?text=Headphones",
    });
    addItem({
      id: 3,
      name: "Smart Watch Series 5",
      price: 299.99,
      image: "https://placehold.co/400x300/64748b/ffffff?text=Watch",
    });
  }, []);

  return <Checkout />;
}

export default function CheckoutExample() {
  return (
    <CartProvider>
      <CheckoutWithItems />
    </CartProvider>
  );
}
