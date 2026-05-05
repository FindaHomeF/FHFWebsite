"use client"
import { Button } from "@/components/ui/button";
import { declutteringCategories } from "@/lib/mockData";

const DeclutteredFilterPanel = ({ 
  filters, 
  scope = 'all',
  onScopeChange,
  onFilterChange, 
  onApplyFilters,
  onClearFilters,
  resultCount 
}) => {
  const toggleSelection = (array, value) => {
    if (array.includes(value)) {
      return array.filter(item => item !== value);
    } else {
      return [...array, value];
    }
  };

  return (
    <div className="space-y-8 p-4 max-lg:max-h-[70vh] overflow-y-auto">
      {typeof onScopeChange === 'function' ? (
        <div>
          <h3 className="font-bold mb-4">Listing Scope</h3>
          <div className="inline-flex rounded-full border border-black10 p-1 bg-white">
            <Button
              type="button"
              variant={scope === 'all' ? 'default' : 'outline'}
              className="rounded-full text-xs h-8"
              size="sm"
              onClick={() => onScopeChange('all')}
            >
              All Listings
            </Button>
            <Button
              type="button"
              variant={scope === 'my' ? 'default' : 'outline'}
              className="rounded-full text-xs h-8"
              size="sm"
              onClick={() => onScopeChange('my')}
            >
              My Listings
            </Button>
          </div>
        </div>
      ) : null}

      {/* Price Range */}
      <div>
        <h3 className="font-bold mb-4">Price Range</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm mb-2">Price (₦)</h4>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                value={filters.priceRange[0]} 
                onChange={(e) => onFilterChange('priceRange', [Number(e.target.value), filters.priceRange[1]])}
                className="border p-2 rounded w-full text-sm"
                placeholder="Min"
              />
              <span>→</span>
              <input 
                type="number" 
                value={filters.priceRange[1]} 
                onChange={(e) => onFilterChange('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                className="border p-2 rounded w-full text-sm"
                placeholder="Max"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-bold mb-4">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {declutteringCategories.map((category) => (
            <Button
              key={category}
              variant={filters.categories.includes(category) ? 'default' : 'outline'}
              onClick={() => onFilterChange('categories', toggleSelection(filters.categories, category))}
              className="rounded-full text-xs h-8"
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div>
        <h3 className="font-bold mb-4">Condition</h3>
        <div className="flex flex-wrap gap-2">
          {['Like New', 'Good', 'Fair', 'Used'].map((condition) => (
            <Button
              key={condition}
              variant={filters.condition.includes(condition) ? 'default' : 'outline'}
              onClick={() => onFilterChange('condition', toggleSelection(filters.condition, condition))}
              className="rounded-full text-xs h-8"
              size="sm"
            >
              {condition}
            </Button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="font-bold mb-4">Availability</h3>
        <div className="flex flex-wrap gap-2">
          {['Available', 'Reserved', 'Sold'].map((status) => (
            <Button
              key={status}
              variant={filters.availability.includes(status) ? 'default' : 'outline'}
              onClick={() => onFilterChange('availability', toggleSelection(filters.availability, status))}
              className="rounded-full text-xs h-8"
              size="sm"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4 sticky bottom-0 bg-white pb-4">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={onClearFilters}
        >
          CLEAR ALL
        </Button>
        <Button 
          className="w-full bg-primary" 
          onClick={onApplyFilters}
        >
          SHOW {resultCount} ITEMS
        </Button>
      </div>
    </div>
  );
};

export default DeclutteredFilterPanel;

