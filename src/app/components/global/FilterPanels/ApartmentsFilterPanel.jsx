"use client"
import { Button } from "@/components/ui/button";
import { apartmentCategories } from "@/lib/mockData";

const ApartmentsFilterPanel = ({ 
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

      {/* Property Specification */}
      <div>
        <h3 className="font-bold mb-4">Property Specification</h3>
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

          <div>
            <h4 className="text-sm mb-2">Bedrooms</h4>
            <div className="flex flex-wrap gap-2">
              {['Any', '1', '2', '3', '4', '5+'].map((option) => (
                <Button
                  key={option}
                  variant={filters.bedrooms === option ? 'default' : 'outline'}
                  onClick={() => onFilterChange('bedrooms', option)}
                  className="rounded-full text-xs h-8"
                  size="sm"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm mb-2">Bathrooms</h4>
            <div className="flex flex-wrap gap-2">
              {['Any', '1', '2', '3', '4', '5+'].map((option) => (
                <Button
                  key={option}
                  variant={filters.bathrooms === option ? 'default' : 'outline'}
                  onClick={() => onFilterChange('bathrooms', option)}
                  className="rounded-full text-xs h-8"
                  size="sm"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Property Type */}
      <div>
        <h3 className="font-bold mb-4">Property Type</h3>
        <div className="flex flex-wrap gap-2">
          {apartmentCategories.map((type) => (
            <Button
              key={type}
              variant={filters.propertyType.includes(type) ? 'default' : 'outline'}
              onClick={() => onFilterChange('propertyType', toggleSelection(filters.propertyType, type))}
              className="rounded-full text-xs h-8"
              size="sm"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {/* Furnishing Options */}
      <div>
        <h3 className="font-bold mb-4">Furnishing</h3>
        <div className="flex flex-wrap gap-2">
          {['Furnished', 'Unfurnished'].map((option) => (
            <Button
              key={option}
              variant={filters.furnishing.includes(option) ? 'default' : 'outline'}
              onClick={() => onFilterChange('furnishing', toggleSelection(filters.furnishing, option))}
              className="rounded-full text-xs h-8"
              size="sm"
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <h3 className="font-bold mb-4">Location</h3>
        <div className="space-y-3">
          <div>
            <h4 className="text-sm mb-2">Time From Gate (mins)</h4>
            <div className="flex flex-wrap gap-2">
              {['Any', '1-5', '5-10', '10-15', '15+'].map((option) => (
                <Button
                  key={option}
                  variant={filters.timeFromGate === option ? 'default' : 'outline'}
                  onClick={() => onFilterChange('timeFromGate', option)}
                  className="rounded-full text-xs h-8"
                  size="sm"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm mb-2">Areas</h4>
            <div className="flex flex-wrap gap-2">
              {['North Gate', 'South Gate', 'West Gate'].map((area) => (
                <Button
                  key={area}
                  variant={filters.areas.includes(area) ? 'default' : 'outline'}
                  onClick={() => onFilterChange('areas', toggleSelection(filters.areas, area))}
                  className="rounded-full text-xs h-8"
                  size="sm"
                >
                  {area}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h3 className="font-bold mb-4">Amenities</h3>
        <div className="flex flex-wrap gap-2">
          {['Water Supply', 'Security', 'Parking', 'Stable Electricity'].map((amenity) => (
            <Button
              key={amenity}
              variant={filters.amenities.includes(amenity) ? 'default' : 'outline'}
              onClick={() => onFilterChange('amenities', toggleSelection(filters.amenities, amenity))}
              className="rounded-full text-xs h-8"
              size="sm"
            >
              {amenity}
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
          SHOW {resultCount} PROPERTIES
        </Button>
      </div>
    </div>
  );
};

export default ApartmentsFilterPanel;

