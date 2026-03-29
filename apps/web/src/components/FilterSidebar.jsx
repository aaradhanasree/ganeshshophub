import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const FilterSidebar = ({ onFilterChange, isMobile = false }) => {
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [minRating, setMinRating] = useState(0);

  const categories = [
    'Car Batteries',
    'Bike Batteries',
    'Inverter Batteries',
    'UPS / Solar Batteries'
  ];

  const applyFilters = () => {
    onFilterChange({
      category: category || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minRating: minRating || undefined
    });
  };

  const clearFilters = () => {
    setCategory('');
    setPriceRange([0, 50000]);
    setMinRating(0);
    onFilterChange({});
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Filters</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs transition-all duration-200 active:scale-[0.98]"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">Category</Label>
        <RadioGroup value={category} onValueChange={setCategory}>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="" id="all" />
            <Label htmlFor="all" className="cursor-pointer">All Categories</Label>
          </div>
          {categories.map((cat) => (
            <div key={cat} className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value={cat} id={cat} />
              <Label htmlFor={cat} className="cursor-pointer">{cat}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">
          Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
        </Label>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={50000}
          step={500}
          className="mb-2"
        />
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">Minimum Rating</Label>
        <RadioGroup value={minRating.toString()} onValueChange={(val) => setMinRating(Number(val))}>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="0" id="rating-all" />
            <Label htmlFor="rating-all" className="cursor-pointer">All Ratings</Label>
          </div>
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
              <Label htmlFor={`rating-${rating}`} className="cursor-pointer">
                {rating}+ Stars
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Button
        onClick={applyFilters}
        className="w-full transition-all duration-200 active:scale-[0.98]"
      >
        Apply Filters
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="transition-all duration-200 active:scale-[0.98]">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Filter Products</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 border">
      <FilterContent />
    </div>
  );
};

export default FilterSidebar;