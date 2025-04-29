/** @format */

import { ProductCard } from "./ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart: (id: string) => void;
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}
