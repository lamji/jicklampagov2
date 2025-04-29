/** @format */

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";

interface ProductFiltersProps {
  onSearch: (query: string) => void;
  onSort: (value: string) => void;
  onPriceRangeChange: (min: number, max: number) => void;
}

export function ProductFilters({
  onSearch,
  onSort,
  onPriceRangeChange,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg">
      <div className="flex-1">
        <Input
          placeholder="Search products..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="flex gap-4">
        <Select onValueChange={onSort}>
          <SelectTrigger className="w-[160px]">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="name-asc">Name: A to Z</SelectItem>
            <SelectItem value="name-desc">Name: Z to A</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            placeholder="Min"
            className="w-20"
            onChange={(e) =>
              onPriceRangeChange(Number(e.target.value), Infinity)
            }
          />
          <span>-</span>
          <Input
            type="number"
            placeholder="Max"
            className="w-20"
            onChange={(e) => onPriceRangeChange(0, Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}
