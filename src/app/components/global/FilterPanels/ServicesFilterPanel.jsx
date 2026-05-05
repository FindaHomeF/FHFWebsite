"use client"
import { Button } from "@/components/ui/button";
import { serviceCategories } from "@/lib/mockData";

const ServicesFilterPanel = ({ 
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
      {/* Listing Scope */}
      <div>
        <h3 className="font-bold mb-4">Listing Scope</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={scope === 'all' ? 'default' : 'outline'}
            onClick={() => onScopeChange?.('all')}
            className="rounded-full text-xs h-8"
            size="sm"
          >
            All Listings
          </Button>
          <Button
            variant={scope === 'my' ? 'default' : 'outline'}
            onClick={() => onScopeChange?.('my')}
            className="rounded-full text-xs h-8"
            size="sm"
          >
            My Listings
          </Button>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-bold mb-4">Service Cost</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm mb-2">Price Range (₦)</h4>
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

      {/* Service Categories */}
      <div>
        <h3 className="font-bold mb-4">Service Type</h3>
        <div className="flex flex-wrap gap-2">
          {serviceCategories.map((category) => (
            <Button
              key={category}
              variant={filters.serviceType.includes(category) ? 'default' : 'outline'}
              onClick={() => onFilterChange('serviceType', toggleSelection(filters.serviceType, category))}
              className="rounded-full text-xs h-8"
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-bold mb-4">Minimum Rating</h3>
        <div className="flex flex-wrap gap-2">
          {['Any', '3+', '4+', '4.5+', '5'].map((rating) => (
            <Button
              key={rating}
              variant={filters.rating === rating ? 'default' : 'outline'}
              onClick={() => onFilterChange('rating', rating)}
              className="rounded-full text-xs h-8"
              size="sm"
            >
              {rating === 'Any' ? 'Any' : `${rating} ⭐`}
            </Button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <h3 className="font-bold mb-4">Location</h3>
        <div className="flex flex-wrap gap-2">
          {['North Gate', 'South Gate', 'West Gate', 'Campus'].map((area) => (
            <Button
              key={area}
              variant={filters.location.includes(area) ? 'default' : 'outline'}
              onClick={() => onFilterChange('location', toggleSelection(filters.location, area))}
              className="rounded-full text-xs h-8"
              size="sm"
            >
              {area}
            </Button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="font-bold mb-4">Availability</h3>
        <div className="flex flex-wrap gap-2">
          {['Available Now', 'By Appointment', 'Weekends Only'].map((avail) => (
            <Button
              key={avail}
              variant={filters.availability.includes(avail) ? 'default' : 'outline'}
              onClick={() => onFilterChange('availability', toggleSelection(filters.availability, avail))}
              className="rounded-full text-xs h-8"
              size="sm"
            >
              {avail}
            </Button>
          ))}
        </div>
      </div>

      {/* Verification */}
      <div>
        <h3 className="font-bold mb-4">Verification</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filters.verified ? 'default' : 'outline'}
            onClick={() => onFilterChange('verified', !filters.verified)}
            className="rounded-full text-xs h-8"
            size="sm"
          >
            Verified Only
          </Button>
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
          SHOW {resultCount} PROVIDERS
        </Button>
      </div>
    </div>
  );
};

export default ServicesFilterPanel;

