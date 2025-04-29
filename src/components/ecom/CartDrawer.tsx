/** @format */

import { Button } from "@/components/ui/button";
import { CartItem } from "./CartItem";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

interface CartDrawerProps {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export function CartDrawer({
  items,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}: CartDrawerProps) {
  const router = useRouter();
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    onCheckout();
    router.push("/shop/checkout");
  };

  return (
    <div className="fixed inset-y-0 right-0 flex flex-col w-full sm:w-96 bg-background border-l">
      <div className="flex items-center gap-3 px-6 py-4 border-b">
        <ShoppingBag className="w-5 h-5" />
        <h2 className="font-semibold">Your Cart</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-6">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Your cart is empty</p>
          </div>
        ) : (
          <div className="divide-y">
            {items.map((item) => (
              <CartItem
                key={item.id}
                {...item}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemove}
              />
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="p-6 border-t">
          <div className="flex justify-between mb-4">
            <span className="font-medium">Total</span>
            <span className="font-medium">${total.toFixed(2)}</span>
          </div>
          <Button className="w-full" onClick={handleCheckout}>
            Checkout
          </Button>
        </div>
      )}
    </div>
  );
}
