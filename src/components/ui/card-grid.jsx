'use client'
import React from 'react'

// Consistent card grid layout component
// Ensures proper mobile (90% width) and desktop layouts

const CardGrid = ({ 
  children, 
  cols = { mobile: 1, tablet: 2, desktop: 4 },
  gap = 'gap-3 md:gap-5',
  className = '',
  containerClassName = ''
}) => {
  // Grid column classes based on breakpoints - using full class names for Tailwind
  const getGridCols = () => {
    const mobileCols = cols.mobile || 1
    const tabletCols = cols.tablet || cols.mobile || 2
    const desktopCols = cols.desktop || 4
    
    const colMap = {
      1: 'grid-cols-1',
      2: 'md:grid-cols-2',
      3: 'md:grid-cols-3',
      4: 'lg:grid-cols-4'
    }
    
    return `${colMap[1]} ${tabletCols === 2 ? colMap[2] : tabletCols === 3 ? colMap[3] : colMap[2]} ${desktopCols === 4 ? colMap[4] : colMap[3]}`
  }

  // For flexible card widths on mobile
  const gridClasses = `grid ${getGridCols()} ${gap} py-2 ${className}`

  return (
    <div className={`w-[90%] max-w-full mx-auto ${containerClassName}`}>
      <div className={gridClasses}>
        {children}
      </div>
    </div>
  )
}

// Horizontal scrollable card container for mobile
export const CardScroll = ({ 
  children, 
  className = '',
  containerClassName = ''
}) => {
  return (
    <div className={`w-[90%] max-w-full mx-auto ${containerClassName}`}>
      <div className="overflow-x-auto w-full">
        <div className={`flex flex-nowrap md:grid md:grid-cols-4 gap-3 md:gap-5 py-3 pb-5 md:py-2 md:pb-0 ${className}`}>
          {children}
        </div>
      </div>
    </div>
  )
}

// Card wrapper with consistent sizing
export const CardWrapper = ({ 
  children, 
  className = '',
  minWidth = 'min-w-[280px] md:min-w-0'
}) => {
  return (
    <div className={`${minWidth} ${className}`}>
      {children}
    </div>
  )
}

export default CardGrid

