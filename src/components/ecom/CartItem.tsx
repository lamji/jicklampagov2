/** @format */

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({
  id,
  name,
  price,
  quantity,
  image,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  return (
    <div className="flex gap-4 py-4 border-b">
      <div className="relative w-24 h-24">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover rounded-md"
        />
      </div>
      <div className="flex flex-col flex-1 gap-1">
        <div className="flex justify-between">
          <h3 className="font-medium">{name}</h3>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            onClick={() => onRemove(id)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">${price.toFixed(2)}</div>
        <div className="flex items-center gap-2 mt-auto">
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8"
            onClick={() => onUpdateQuantity(id, quantity - 1)}
            disabled={quantity <= 1}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="w-8 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8"
            onClick={() => onUpdateQuantity(id, quantity + 1)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
