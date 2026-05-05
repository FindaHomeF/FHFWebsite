"use client"
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Pagination from "./Pagination";
import DeclutteredBox from "./DeclutteredBox";
import ActiveFilters from "./ActiveFilters";

const DeclutteredItemsGrid = ({ 
  items, 
  itemsPerPage = 12, 
  title = "All Decluttered Items",
  showTitle = true,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    featured: searchParams.get('filterType') === 'featured',
    recent: searchParams.get('filterType') === 'recent',
    category: searchParams.get('filterType') === 'category' ? searchParams.get('filterValue') : null,
  });

  // Apply filters to items
  const getFilteredItems = () => {
    let filtered = [...items];

    // Filter out items with zero inventory
    filtered = filtered.filter(item => {
      const inventory = item.inventory !== undefined ? item.inventory : null;
      return inventory === null || inventory > 0;
    });

    if (filters.featured) {
      filtered = filtered.filter(item => item.featured);
    }

    if (filters.recent) {
      filtered = filtered.sort((a, b) => b.datePosted - a.datePosted);
    }

    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    return filtered;
  };

  const filteredItems = getFilteredItems();

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleRemoveFilter = (filterType) => {
    if (filterType === 'all') {
      setFilters({ featured: false, recent: false, category: null });
      router.push(window.location.pathname);
    } else {
      setFilters(prev => ({
        ...prev,
        [filterType]: filterType === 'category' ? null : false
      }));
    }
  };

  return (
    <>
      <ActiveFilters filters={filters} onRemoveFilter={handleRemoveFilter} />
      
      <div className="w-[90%] md:w-5/6 mx-auto mt-6 md:mt-10 mb-10 md:mb-16">
        <div className="flex justify-between items-center mb-6">
          {showTitle ? (
            <h2 className="text-2xl md:text-3xl font-bold">
              {title}
            </h2>
          ) : (
            <span />
          )}
          <p className="text-gray-600">
            Showing {filteredItems.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, filteredItems.length)} of {filteredItems.length} items
          </p>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No items found matching your filters.</p>
            <Button 
              onClick={() => handleRemoveFilter('all')}
              className="mt-4 bg-primary"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 py-2">
              {currentItems.map((item) => (
                <div key={item.id}>
                  <DeclutteredBox image={item.image} border={true} item={item} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 md:mt-16">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default DeclutteredItemsGrid;
