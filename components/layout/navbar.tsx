'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, MessageCircle, Heart, Trash2 } from 'lucide-react'
import { cn, whatsappLink } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useWishlist } from '@/hooks/use-wishlist'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import Image from 'next/image'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/collections', label: 'Collections' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { items, removeItem, isHydrated } = useWishlist()

  const generateWhatsAppMessage = () => {
    let message = 'Hi Celebrations team! 👋\n\nI am interested in the following items from my Wishlist:\n'
    items.forEach((item, i) => {
      message += `\n${i + 1}. *${item.title}*${item.priceRange ? ` (${item.priceRange})` : ''}`
    })
    message += '\n\nCould you please let me know about their availability and details?'
    return encodeURIComponent(message)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-[var(--ivory-cream)]/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl font-semibold tracking-tight text-[var(--deep-mahogany)]">
            Celebrations
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-[var(--celebration-gold)]',
                pathname === link.href
                  ? 'text-[var(--celebration-gold)]'
                  : 'text-[var(--deep-mahogany)]'
              )}
            >
              {link.label}
            </Link>
          ))}
          
          {/* Wishlist Trigger */}
          {isHydrated && (
            <Sheet>
              <SheetTrigger asChild>
                <button className="relative flex items-center gap-2 text-sm font-medium text-[var(--deep-mahogany)] transition-colors hover:text-[var(--celebration-gold)]">
                  <Heart className="h-5 w-5" />
                  {items.length > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--celebration-gold)] text-[10px] text-white">
                      {items.length}
                    </span>
                  )}
                  Wishlist
                </button>
              </SheetTrigger>
              <SheetContent className="flex w-full flex-col sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Your Wishlist</SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex-1 overflow-y-auto pr-4">
                  {items.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                      <Heart className="mb-4 h-12 w-12 text-gray-300" />
                      <p>Your wishlist is empty.</p>
                      <p className="mt-2 text-sm">Browse our collections to add some.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6">
                      {items.map((item) => (
                        <div key={`${item.source}-${item.id}`} className="flex items-center gap-4">
                          <div className="relative h-20 w-16 overflow-hidden rounded-md">
                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-[var(--deep-mahogany)]">{item.title}</h4>
                            {item.priceRange && <p className="text-sm text-gray-500">{item.priceRange}</p>}
                          </div>
                          <button
                            onClick={() => removeItem(item.id, item.source)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {items.length > 0 && (
                  <div className="mt-6 border-t pt-6">
                    <Button asChild className="w-full bg-[var(--celebration-gold)] text-white hover:bg-[var(--rich-chestnut)]">
                      <a href={whatsappLink(generateWhatsAppMessage())} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="mr-2 h-5 w-5" />
                        Send Wishlist to WhatsApp
                      </a>
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          )}
        </div>

        {/* Desktop WhatsApp Button */}
        <div className="hidden lg:block">
          <Button
            asChild
            className="bg-[var(--celebration-gold)] text-white hover:bg-[var(--rich-chestnut)]"
          >
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Us
            </a>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--deep-mahogany)] lg:hidden"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-[var(--ivory-cream)] shadow-xl lg:hidden"
          >
            <div className="flex h-full flex-col px-6 py-6">
              <div className="flex items-center justify-between">
                <span className="font-serif text-xl font-semibold text-[var(--deep-mahogany)]">
                  Celebrations
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--deep-mahogany)]"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="mt-8 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'py-3 text-lg font-medium transition-colors hover:text-[var(--celebration-gold)]',
                      pathname === link.href
                        ? 'text-[var(--celebration-gold)]'
                        : 'text-[var(--deep-mahogany)]'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-4">
                {isHydrated && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="w-full border-[var(--celebration-gold)] text-[var(--celebration-gold)]">
                        <Heart className="mr-2 h-5 w-5" />
                        View Wishlist ({items.length})
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="flex w-full flex-col sm:max-w-md">
                      <SheetHeader>
                        <SheetTitle>Your Wishlist</SheetTitle>
                      </SheetHeader>
                      <div className="mt-8 flex-1 overflow-y-auto pr-4">
                        {items.length === 0 ? (
                          <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                            <Heart className="mb-4 h-12 w-12 text-gray-300" />
                            <p>Your wishlist is empty.</p>
                            <p className="mt-2 text-sm">Browse our collections to add some.</p>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-6">
                            {items.map((item) => (
                              <div key={`${item.source}-${item.id}`} className="flex items-center gap-4">
                                <div className="relative h-20 w-16 overflow-hidden rounded-md">
                                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-[var(--deep-mahogany)]">{item.title}</h4>
                                  {item.priceRange && <p className="text-sm text-gray-500">{item.priceRange}</p>}
                                </div>
                                <button
                                  onClick={() => removeItem(item.id, item.source)}
                                  className="text-gray-400 hover:text-red-500"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {items.length > 0 && (
                        <div className="mt-6 border-t pt-6">
                          <Button asChild className="w-full bg-[var(--celebration-gold)] text-white hover:bg-[var(--rich-chestnut)]">
                            <a href={whatsappLink(generateWhatsAppMessage())} target="_blank" rel="noopener noreferrer">
                              <MessageCircle className="mr-2 h-5 w-5" />
                              Send Wishlist to WhatsApp
                            </a>
                          </Button>
                        </div>
                      )}
                    </SheetContent>
                  </Sheet>
                )}
                
                <Button
                  asChild
                  className="w-full bg-[var(--celebration-gold)] text-white hover:bg-[var(--rich-chestnut)]"
                  size="lg"
                >
                  <a
                    href={whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="h-5 w-5" />
                    WhatsApp Us
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          />
        )}
      </AnimatePresence>
    </header>
  )
}
