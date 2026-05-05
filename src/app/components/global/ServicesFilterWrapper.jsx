"use client"
import { useState, useMemo } from "react";
import { CiFilter } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import SearchWithSuggestions from "./SearchWithSuggestions";
import ServicesFilterPanel from "./FilterPanels/ServicesFilterPanel";
import ServicesGrid from "./ServicesGrid";
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

const ServicesFilterWrapper = ({ items, scope = 'all', onScopeChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSort] = useState("popularity");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [panelFilters, setPanelFilters] = useState({
    priceRange: [1000, 50000],
    serviceType: [],
    rating: 'Any',
    location: [],
    availability: [],
    verified: false,
  });
  
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // Get suggestion text for search
  const getSuggestionText = (item) => {
    return `${item.category}`;
  };

  // Apply all filters with useMemo for performance
  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...items];

    // Apply panel filters
    if (panelFilters.serviceType.length > 0) {
      filtered = filtered.filter(item => 
        panelFilters.serviceType.includes(item.category)
      );
    }

    if (panelFilters.rating !== 'Any') {
      const minRating = parseFloat(panelFilters.rating.replace('+', '').replace('⭐', ''));
      filtered = filtered.filter(item => 
        (item.rating || 4.0) >= minRating
      );
    }

    if (panelFilters.location.length > 0) {
      filtered = filtered.filter(item => 
        panelFilters.location.some(loc => (item.location || 'North Gate').includes(loc))
      );
    }

    if (panelFilters.verified) {
      filtered = filtered.filter(item => item.verified !== false);
    }

    if (panelFilters.priceRange[0] > 1000 || panelFilters.priceRange[1] < 50000) {
      filtered = filtered.filter(item => 
        (item.price || 5000) >= panelFilters.priceRange[0] && 
        (item.price || 5000) <= panelFilters.priceRange[1]
      );
    }

    // Apply search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        (item.category || '').toLowerCase().includes(term) ||
        (item.title || '').toLowerCase().includes(term)
      );
    }

    // Apply sorting
    if (sortBy === 'lowest') {
      filtered.sort((a, b) => (a.price || 5000) - (b.price || 5000));
    } else if (sortBy === 'highest') {
      filtered.sort((a, b) => (b.price || 5000) - (a.price || 5000));
    } else if (sortBy === 'popularity') {
      filtered.sort((a, b) => 
        ((b.rating || 4.0) * (b.featured ? 1.2 : 1)) - 
        ((a.rating || 4.0) * (a.featured ? 1.2 : 1))
      );
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
      priceRange: [1000, 50000],
      serviceType: [],
      rating: 'Any',
      location: [],
      availability: [],
      verified: false,
    });
  };

  const handleApplyFilters = () => {
    setIsFilterOpen(false);
  };

  const FilterPanelComponent = () => (
    <ServicesFilterPanel
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
        <div className="mx-auto lg:w-5/6 mt-8 lg:mt-16">
          <div className='flex max-lg:flex-col max-lg:gap-2 w-full items-center gap-x-3 lg:h-10'>
            <SearchWithSuggestions
              items={items}
              placeholder="Search for service providers by type, location, or rating..."
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

      <ServicesGrid 
        items={filteredAndSortedItems}
        itemsPerPage={12}
        title={scope === 'my' ? 'My Services' : 'All Services'}
      />
    </>
  );
};

export default ServicesFilterWrapper;
