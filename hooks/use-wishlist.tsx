'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type WishlistItem = {
  id: string
  title: string
  image: string
  priceRange?: string
  source: 'collection' | 'gallery'
}

type WishlistContextType = {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (id: string, source: 'collection' | 'gallery') => void
  isInWishlist: (id: string, source: 'collection' | 'gallery') => boolean
  clearWishlist: () => void
  isHydrated: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from Local Storage
  useEffect(() => {
    const stored = localStorage.getItem('celebrations-wishlist')
    if (stored) {
      try {
        setItems(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse wishlist', e)
      }
    }
    setIsHydrated(true)
  }, [])

  // Save to Local Storage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('celebrations-wishlist', JSON.stringify(items))
    }
  }, [items, isHydrated])

  const addItem = (item: WishlistItem) => {
    setItems((prev: WishlistItem[]) => {
      if (prev.some((i: WishlistItem) => i.id === item.id && i.source === item.source)) return prev
      return [...prev, item]
    })
  }

  const removeItem = (id: string, source: 'collection' | 'gallery') => {
    setItems((prev: WishlistItem[]) => prev.filter((i: WishlistItem) => !(i.id === id && i.source === source)))
  }

  const isInWishlist = (id: string, source: 'collection' | 'gallery') => {
    return items.some((i: WishlistItem) => i.id === id && i.source === source)
  }

  const clearWishlist = () => {
    setItems([])
  }

  return (
    <WishlistContext.Provider
      value={{ items, addItem, removeItem, isInWishlist, clearWishlist, isHydrated }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}