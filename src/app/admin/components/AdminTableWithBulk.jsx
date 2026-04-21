'use client'
import React, { memo, useState, useEffect, useMemo } from 'react'
import { MoreHorizontal, Check, CheckSquare, Square, CheckCircle2, Trash2, Download, XCircle, Ban, Power, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'

const AdminTableWithBulk = ({ 
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
  bulkActions = ['approve', 'delete', 'export'],
  onBulkAction
}) => {
  const [selectedItems, setSelectedItems] = useState([])
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)
  const [selectAll, setSelectAll] = useState(false)

  const currentItems = useMemo(
    () =>
      paginationData?.currentProperties ||
      paginationData?.currentServices ||
      paginationData?.currentUsers ||
      paginationData?.currentItems ||
      paginationData?.currentTransactions ||
      data ||
      [],
    [paginationData, data]
  )

  const toggleItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const toggleSelectAll = () => {
    if (selectAll || selectedItems.length === currentItems.length) {
      setSelectedItems([])
      setSelectAll(false)
    } else {
      setSelectedItems(currentItems.map(item => item.id || item._id))
      setSelectAll(true)
    }
  }

  // Update selectAll state when selectedItems changes
  useEffect(() => {
    if (selectedItems.length === currentItems.length && currentItems.length > 0) {
      setSelectAll(true)
    } else if (selectedItems.length < currentItems.length) {
      setSelectAll(false)
    }
  }, [selectedItems, currentItems])

  const handleBulkAction = (action) => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item')
      return
    }
    setPendingAction(action)
    setShowConfirmDialog(true)
  }

  const confirmBulkAction = () => {
    if (onBulkAction) {
      onBulkAction(pendingAction, selectedItems)
      toast.success(`${pendingAction} action completed for ${selectedItems.length} item(s)`)
    }
    setSelectedItems([])
    setSelectAll(false)
    setShowConfirmDialog(false)
    setPendingAction(null)
  }

  const getActionLabel = (action) => {
    const labels = {
      approve: 'Approve',
      delete: 'Delete',
      export: 'Export',
      reject: 'Reject',
      suspend: 'Suspend',
      activate: 'Activate',
      restore: 'Restore',
    }
    return labels[action] || action
  }

  const getActionIcon = (action) => {
    const icons = {
      approve: CheckCircle2,
      delete: Trash2,
      export: Download,
      reject: XCircle,
      suspend: Ban,
      activate: Power,
      restore: RotateCcw,
    }
    return icons[action] || CheckCircle2
  }

  const getActionDescription = (action, count) => {
    const normalizedAction = String(getActionLabel(action) || 'proceed').toLowerCase()
    if (action === 'delete' || action === 'reject') {
      return `Are you sure you want to ${normalizedAction} ${count} item(s)? This action cannot be undone.`
    }
    if (action === 'restore') {
      return `Are you sure you want to restore ${count} item(s)? They will return to active listings.`
    }
    return `Are you sure you want to ${normalizedAction} ${count} item(s)?`
  }

  const mobilePageNumbers = useMemo(() => {
    const totalPages = paginationData?.totalPages || 1
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, index) => index + 1)
    }
    if (currentPage <= 2) return [1, 2, '...', totalPages]
    if (currentPage >= totalPages - 1) return [1, '...', totalPages - 1, totalPages]
    return [1, '...', currentPage, '...', totalPages]
  }, [currentPage, paginationData?.totalPages])

  const TableRow = memo(({ item, index }) => {
    const itemId = item.id || item._id
    const isSelected = selectedItems.includes(itemId)

    return (
      <tr 
        className={`text-xs hover:bg-gray-50 transition-colors border-b-2 border-b-white cursor-pointer ${
          index % 2 === 0 ? 'bg-black10' : 'bg-white'
        } ${isSelected ? 'bg-blue-50' : ''}`}
        onClick={() => onRowClick && onRowClick(item)}
        onKeyDown={(event) => {
          if (!onRowClick) return
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onRowClick(item)
          }
        }}
        tabIndex={0}
        aria-label={`Open details for ${item?.title || item?.name || itemId}`}
      >
        <td className="py-2 px-3 md:py-3 md:px-6 w-12" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => toggleItem(itemId)}
            className="flex items-center justify-center"
            aria-label={isSelected ? `Deselect ${item?.title || itemId}` : `Select ${item?.title || itemId}`}
          >
            {isSelected ? (
              <CheckSquare className="h-4 w-4 text-primary" />
            ) : (
              <Square className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </td>
        {columns.map((column) => {
          const cellValue = item[column.key] || ''
          
          if (column.render) {
            return (
              <td key={column.key} className={`py-2 px-3 md:py-3 md:px-6 ${column.width || ''}`}>
                {column.render(item)}
              </td>
            )
          }
          
          if (column.key === 'status' && item.status) {
            return (
              <td key={column.key} className={`py-2 px-3 md:py-3 md:px-6 ${column.width || ''}`}>
                {getStatusBadge(item.status)}
              </td>
            )
          }
          
          return (
            <td 
              key={column.key} 
              className={`py-2 px-3 md:py-3 md:px-6 text-gray-800 ${column.width || ''} ${column.truncate ? 'truncate' : ''} ${column.fontMedium ? 'font-medium' : ''}`}
            >
              {cellValue}
            </td>
          )
        })}
        
        {actionsColumn && (
          <td className="py-2 px-3 md:py-3 md:px-6 w-16" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              onClick={(e) => {
                e.stopPropagation()
              }}
              aria-label={`More actions for ${item?.title || itemId}`}
            >
              <MoreHorizontal className="w-4 h-4 text-gray-600" />
            </button>
          </td>
        )}
      </tr>
    )
  })

  return (
    <div>
      {/* Bulk Actions Bar - Always reserve space to prevent layout shift */}
      {selectedItems.length > 0 ? (<div className="bg-primary/10  rounded-lg p-4 mb-4 flex items-center justify-between min-h-[60px]">
            <div className="flex items-center gap-2">
              {/* <CheckSquare className="h-5 w-5 text-primary" /> */}
              <span className="font-medium text-xs md:text-base text-gray-900">
                {selectedItems.length} item(s) selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              {bulkActions.map((action) => {
                const Icon = getActionIcon(action)
                const isDangerous = action === 'delete' || action === 'reject'
                return (
                  <Button
                    key={action}
                    variant={isDangerous ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => handleBulkAction(action)}
                    className={isDangerous ? 'border-red-600 text-red-600 hover:bg-red-50' : ''}
                    title={getActionLabel(action)}
                    aria-label={`${getActionLabel(action)} selected items`}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                )
              })}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedItems([])
                  setSelectAll(false)
                }}
              >
                Clear
              </Button>
            </div>
        </div>
      ) : 
      (<div className="invisible flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            <span className="font-medium">
              No items selected
            </span>
          </div>
      )}

      <div className="overflow-hidden shadow-sm rounded-lg relative min-h-[max-content] h-[18rem] md:h-[25rem]">
        <div className="overflow-y-auto">
          <table key={currentPage} className="w-full table-fixed">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-sm text-black66">
                <th className="text-left py-2 px-3 md:py-4 md:px-6 font-semibold text-gray-700 w-12">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="flex items-center justify-center"
                    aria-label={selectAll ? 'Deselect all rows' : 'Select all rows'}
                  >
                    {selectAll ? (
                      <CheckSquare className="h-4 w-4 text-primary" />
                    ) : (
                      <Square className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </th>
                {columns.map((column) => (
                  <th 
                    key={column.key}
                    className={`text-left py-2 px-3 md:py-4 md:px-6 font-semibold text-gray-700 ${column.width || ''}`}
                  >
                    {column.label}
                  </th>
                ))}
                {actionsColumn && (
                  <th className="text-left py-2 px-3 md:py-4 md:px-6 font-semibold text-gray-700 w-16"></th>
                )}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <TableRow 
                  key={`${item.id || item._id}-${currentPage}-${index}`} 
                  item={item} 
                  index={index} 
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-black66 py-3 text-right px-6">
        Showing {paginationData.startIndex + 1}-{Math.min(paginationData.endIndex, paginationData.totalItems)} of {paginationData.totalItems} items
      </p>

      {/* Pagination */}
      <div className="mt-7 w-full px-6 pb-6">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-black33 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="hidden md:flex items-center gap-x-2">
            {pageNumbers.map((page, index) => (
              page === '...' ? (
                <span key={index} className="px-2 text-gray-500">...</span>
              ) : (
                <button
                  type="button"
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

          <div className="flex md:hidden items-center gap-x-1">
            {mobilePageNumbers.map((page, index) => (
              page === '...' ? (
                <span key={`mobile-ellipsis-${index}`} className="px-1 text-gray-500">...</span>
              ) : (
                <button
                  type="button"
                  key={`mobile-page-${page}`}
                  onClick={() => handlePageChange(page)}
                  className={`min-w-8 h-8 px-2 text-xs font-medium rounded-lg flex items-center justify-center transition-colors ${
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
          
          <button
            type="button"
            onClick={handleNext}
            disabled={currentPage === paginationData.totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-black33 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Bulk Action</DialogTitle>
            <DialogDescription>
              {getActionDescription(pendingAction, selectedItems.length)}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmBulkAction}
              className={pendingAction === 'delete' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminTableWithBulk

