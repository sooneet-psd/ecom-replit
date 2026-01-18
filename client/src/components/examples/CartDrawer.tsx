import { CartDrawer } from "../shop/CartDrawer";
import { CartProvider, useCart } from "@/lib/cart-context";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

function CartWithItems() {
  const { addItem, setIsOpen, isOpen } = useCart();
  
  useEffect(() => {
    addItem({
      id: 1,
      name: "Wireless Bluetooth Headphones Pro",
      price: 79.99,
      image: "https://placehold.co/400x300/94a3b8/ffffff?text=Headphones",
    });
    addItem({
      id: 2,
      name: "Premium Leather Wallet",
      price: 49.99,
      image: "https://placehold.co/400x300/78716c/ffffff?text=Wallet",
    });
  }, []);

  return (
    <div className="p-4">
      <Button onClick={() => setIsOpen(true)}>Open Cart</Button>
      <CartDrawer />
    </div>
  );
}

export default function CartDrawerExample() {
  return (
    <CartProvider>
      <CartWithItems />
    </CartProvider>
  );
}
