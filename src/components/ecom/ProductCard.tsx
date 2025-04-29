/** @format */

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  onAddToCart?: (id: string) => void;
}

export function ProductCard({
  id,
  name,
  price,
  image,
  description,
  onAddToCart,
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/shop/${id}`} className="cursor-pointer">
        <div className="relative aspect-square">
          <Image src={image} alt={name} fill className="object-cover" />
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-1">{name}</CardTitle>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
        </CardHeader>
      </Link>
      <CardContent>
        <div className="text-lg font-bold">${price.toFixed(2)}</div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => onAddToCart?.(id)}>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
