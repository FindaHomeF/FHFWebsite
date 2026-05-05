'use client';
import React, { memo } from 'react';
import { MoreHorizontal } from 'lucide-react';

const AdminTable = ({ 
  columns, 
  data, 
  currentPage,
  handlePageChange,
  handlePrevious,
  handleNext,
  paginationData,
  pageNumbers,
  statusBadgeStyles,
  getStatusBadge,
  onRowClick,
  actionsColumn = true,
  emptyMessage = 'No records available.'
}) => {
  // Get the current items based on the property name used
  const currentItems = paginationData?.currentProperties || paginationData?.currentServices || paginationData?.currentUsers || paginationData?.currentSubAdmins || paginationData?.currentTransactions || data || []
  const hasItems = currentItems.length > 0
  
  // Row component
  const TableRow = memo(({ item, index }) => {
    return (
      <tr 
        className={`text-xs hover:bg-gray-50 transition-colors border-b-2 border-b-white cursor-pointer ${
          index % 2 === 0 ? 'bg-black10' : 'bg-white'
        }`}
        onClick={() => onRowClick && onRowClick(item)}
      >
        {columns.map((column) => {
          const cellValue = item[column.key] || '';
          
          // Use custom render function if provided
          if (column.render) {
            return (
              <td key={column.key} className={`py-3 px-6 ${column.width || ''}`}>
                {column.render(item)}
              </td>
            );
          }
          
          if (column.key === 'status' && item.status) {
            return (
              <td key={column.key} className={`py-3 px-6 ${column.width || ''}`}>
                {getStatusBadge(item.status)}
              </td>
            );
          }
          
          return (
            <td 
              key={column.key} 
              className={`py-3 px-6 text-gray-800 ${column.width || ''} ${column.truncate ? 'truncate' : ''} ${column.fontMedium ? 'font-medium' : ''}`}
            >
              {cellValue}
            </td>
          );
        })}
        
        {actionsColumn && (
          <td className="py-3 px-6 w-16">
            <button 
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Handle actions menu
              }}
            >
              <MoreHorizontal className="w-4 h-4 text-gray-600" />
            </button>
          </td>
        )}
      </tr>
    );
  });

  return (
    <div>
      <div className="overflow-hidden shadow-sm rounded-lg relative h-[25rem]">
        <div className=" overflow-y-auto">
          <table key={currentPage} className="w-full table-fixed">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-sm text-black66">
              {columns.map((column) => (
                <th 
                  key={column.key}
                  className={`text-left py-4 px-6 font-semibold text-gray-700 ${column.width || ''}`}
                >
                  {column.label}
                </th>
              ))}
              {actionsColumn && (
                <th className="text-left py-4 px-6 font-semibold text-gray-700 w-16"></th>
              )}
            </tr>
          </thead>
          <tbody>
            {hasItems ? (
              currentItems.map((item, index) => (
                <TableRow 
                  key={`${item.id || item._id}-${currentPage}-${index}`} 
                  item={item} 
                  index={index} 
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (actionsColumn ? 1 : 0)}
                  className="px-6 py-10 text-center text-sm text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
        <p className="text-xs text-black66 py-3 text-right px-6">
          {hasItems
            ? `Showing ${(paginationData?.startIndex ?? 0) + 1}-${Math.min(
                paginationData?.endIndex ?? currentItems.length,
                paginationData?.totalItems ?? currentItems.length
              )} of ${paginationData?.totalItems ?? currentItems.length} items`
            : 'Showing 0 of 0 items'}
        </p>
        
        
      </div>

      {/* Pagination */}
      <div className="mt-7 w-full px-6 pb-6">
          <div className="flex-itc-jub space-x-2">
            {/* Previous Button */}
            <button 
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-black33 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {/* Page Numbers */}
            <div className="flex items-center gap-x-2">
              {pageNumbers.map((page, index) => (
                page === '...' ? (
                  <span key={index} className="px-2 text-gray-500">...</span>
                ) : (
                  <button
                    key={index}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 text-sm font-medium rounded-lg flex items-center justify-center transition-colors ${
                      page === currentPage
                        ? 'bg-primary text-white'
                        : 'text-gray-500 bg-white border border-black33 hover:bg-gray-50 hover:text-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}
            </div>
            
            {/* Next Button */}
            <button 
              onClick={handleNext}
              disabled={currentPage === paginationData.totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-black33 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
    </div>
  );
};

export default AdminTable;
