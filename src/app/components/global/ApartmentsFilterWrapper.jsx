"use client"
import { useState, useMemo } from "react";
import { CiFilter } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import SearchWithSuggestions from "./SearchWithSuggestions";
import ApartmentsFilterPanel from "./FilterPanels/ApartmentsFilterPanel";
import ApartmentsGrid from "./ApartmentsGrid";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMediaQuery } from '@/app/hooks/use-media-query';

const ApartmentsFilterWrapper = ({ items, scope = 'all', onScopeChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSort] = useState("popularity");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [panelFilters, setPanelFilters] = useState({
    priceRange: [5000, 500000],
    bedrooms: 'Any',
    bathrooms: 'Any',
    propertyType: [],
    furnishing: [],
    timeFromGate: 'Any',
    areas: [],
    amenities: [],
  });
  
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // Get suggestion text for search
  const getSuggestionText = (item) => {
    return `${item.category} - ${item.location || 'FUTA Area'}`;
  };

  // Apply all filters with useMemo for performance
  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...items];

    // Apply panel filters
    if (panelFilters.propertyType.length > 0) {
      filtered = filtered.filter(item => 
        panelFilters.propertyType.includes(item.category)
      );
    }

    if (panelFilters.bedrooms !== 'Any') {
      const beds = panelFilters.bedrooms === '5+' ? 5 : parseInt(panelFilters.bedrooms);
      filtered = filtered.filter(item => 
        panelFilters.bedrooms === '5+' ? (item.bedrooms || 2) >= 5 : (item.bedrooms || 2) === beds
      );
    }

    if (panelFilters.bathrooms !== 'Any') {
      const baths = panelFilters.bathrooms === '5+' ? 5 : parseInt(panelFilters.bathrooms);
      filtered = filtered.filter(item => 
        panelFilters.bathrooms === '5+' ? (item.bathrooms || 1) >= 5 : (item.bathrooms || 1) === baths
      );
    }

    if (panelFilters.areas.length > 0) {
      filtered = filtered.filter(item => 
        panelFilters.areas.some(area => (item.location || '').includes(area))
      );
    }

    if (panelFilters.priceRange[0] > 5000 || panelFilters.priceRange[1] < 500000) {
      filtered = filtered.filter(item => 
        (item.price || 120000) >= panelFilters.priceRange[0] && 
        (item.price || 120000) <= panelFilters.priceRange[1]
      );
    }

    // Apply search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        (item.category || '').toLowerCase().includes(term) ||
        (item.location || '').toLowerCase().includes(term) ||
        (item.title || '').toLowerCase().includes(term)
      );
    }

    // Apply sorting
    if (sortBy === 'lowest') {
      filtered.sort((a, b) => (a.price || 120000) - (b.price || 120000));
    } else if (sortBy === 'highest') {
      filtered.sort((a, b) => (b.price || 120000) - (a.price || 120000));
    } else if (sortBy === 'popularity') {
      filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return filtered;
  }, [items, panelFilters, searchTerm, sortBy]);

  const handleFilterChange = (key, value) => {
    setPanelFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setPanelFilters({
      priceRange: [5000, 500000],
      bedrooms: 'Any',
      bathrooms: 'Any',
      propertyType: [],
      furnishing: [],
      timeFromGate: 'Any',
      areas: [],
      amenities: [],
    });
  };

  const handleApplyFilters = () => {
    setIsFilterOpen(false);
  };

  const FilterPanelComponent = () => (
    <ApartmentsFilterPanel
      filters={panelFilters}
      scope={scope}
      onScopeChange={onScopeChange}
      onFilterChange={handleFilterChange}
      onApplyFilters={handleApplyFilters}
      onClearFilters={handleClearFilters}
      resultCount={filteredAndSortedItems.length}
    />
  );

  return (
    <>
      <div className='w-full'>
        <div className="w-[90%] mx-auto md:w-4/6 mt-8 lg:mt-16">
          <div className='flex max-lg:flex-col max-lg:gap-2 w-full items-center gap-x-3 lg:h-10'>
            <SearchWithSuggestions
              items={items}
              placeholder="Search for apartments by location, type, or amenities..."
              onSearch={setSearchTerm}
              getSuggestionText={getSuggestionText}
            />

            <div className='flex gap-x-3 max-lg:w-full'>
              {isDesktop ? (
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <CiFilter className='text-base'/>
                      Filter
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" 
                  className="w-[400px] sm:w-[540px] overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <FilterPanelComponent />
                  </SheetContent>
                </Sheet>
              ) : (
                <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <DrawerTrigger asChild>
                    <Button variant="outline" className="gap-2 bg-transparent
                    w-full lg:w-[100px] border-borderGray text-textPrimary hover:bg-primary/5">
                      <CiFilter className='text-base'/>
                      Filter
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader className={`text-left`}>
                      <DrawerTitle>
                        Filters
                      </DrawerTitle>
                    </DrawerHeader>
                    <FilterPanelComponent />
                  </DrawerContent>
                </Drawer>
              )}

              <Select value={sortBy} onValueChange={setSort}>
                <SelectTrigger 
                className="w-full lg:w-[100px] 
                border-borderGray text-textPrimary hover:bg-primary/5
                data-[placeholder]:text-textPrimary">
                  <SelectValue 
                  className='data-[placeholder]:text-textPrimary' 
                  placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lowest">Lowest First</SelectItem>
                  <SelectItem value="highest">Highest First</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <ApartmentsGrid 
        items={filteredAndSortedItems}
        itemsPerPage={12}
        title={scope === 'my' ? 'My Properties' : 'All Apartments'}
      />
    </>
  );
};

export default ApartmentsFilterWrapper;
