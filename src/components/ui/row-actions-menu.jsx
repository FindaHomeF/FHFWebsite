'use client'

import { useEffect, useRef, useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Table-safe row “⋯” menu (no Radix DropdownMenu — avoids broken triggers inside
 * overflow/stacking contexts and table layout quirks).
 */
export function RowActionsMenu({ actions, triggerClassName }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e) => {
      if (rootRef.current?.contains(e.target)) return
      setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    return () => document.removeEventListener('pointerdown', onPointerDown, true)
  }, [open])

  if (!actions?.length) return null

  return (
    <div ref={rootRef} className="relative inline-flex text-left">
      <button
        type="button"
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200',
          triggerClassName
        )}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-[500] mt-1 min-w-[11rem] overflow-hidden rounded-lg border border-black33 bg-white py-1 shadow-md"
        >
          {actions.map((a) => (
            <button
              key={a.id}
              type="button"
              role="menuitem"
              className={cn(
                'flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-100',
                a.destructive && 'text-red-600 hover:bg-red-50'
              )}
              onClick={() => {
                setOpen(false)
                a.onClick?.()
              }}
            >
              {a.icon ? <span className="flex shrink-0">{a.icon}</span> : null}
              <span>{a.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
