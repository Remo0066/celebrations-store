'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, MapPin, Heart } from 'lucide-react'
import { galleryImages, galleryCategories, type GalleryImage } from '@/lib/data/gallery'
import { cn, STORE_INFO } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useWishlist } from '@/hooks/use-wishlist'

export function PhotoGrid() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const { addItem, removeItem, isInWishlist } = useWishlist()

  const filteredImages = activeCategory === 'all'
    ? galleryImages
    : galleryImages.filter((img) => img.category === activeCategory)

  const currentIndex = selectedImage
    ? filteredImages.findIndex((img) => img.id === selectedImage.id)
    : -1

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedImage(filteredImages[currentIndex - 1])
    }
  }

  const handleNext = () => {
    if (currentIndex < filteredImages.length - 1) {
      setSelectedImage(filteredImages[currentIndex + 1])
    }
  }

  return (
    <>
      <section className="bg-[var(--ivory-cream)] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {galleryCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  'rounded-full px-5 py-2.5 text-sm font-medium transition-colors',
                  activeCategory === category.id
                    ? 'bg-[var(--celebration-gold)] text-white'
                    : 'bg-white text-[var(--deep-mahogany)] hover:bg-[var(--soft-gold)]/30'
                )}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Masonry Grid */}
          <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="mb-4 break-inside-avoid"
              >
                <div className="group relative block w-full overflow-hidden rounded-xl">
                  <button
                    onClick={() => setSelectedImage(image)}
                    className="block w-full focus:outline-none focus:ring-2 focus:ring-[var(--celebration-gold)] focus:ring-offset-2"
                  >
                    <div
                      className={cn(
                        'relative w-full',
                        image.aspectRatio === 'portrait' && 'aspect-[3/4]',
                        image.aspectRatio === 'landscape' && 'aspect-[4/3]',
                        image.aspectRatio === 'square' && 'aspect-square'
                      )}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-[var(--deep-mahogany)]/0 transition-colors group-hover:bg-[var(--deep-mahogany)]/20" />
                    </div>
                  </button>
                  <button
                    onClick={(e: any) => {
                      e.stopPropagation();
                      if (isInWishlist(image.id, 'gallery')) {
                        removeItem(image.id, 'gallery');
                      } else {
                        addItem({
                          id: image.id,
                          title: image.alt || `Gallery Image ${image.id}`,
                          image: image.src,
                          source: 'gallery'
                        });
                      }
                    }}
                    className="absolute right-4 top-4 z-10 hidden h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[var(--celebration-gold)] shadow-sm backdrop-blur-sm transition-transform hover:scale-110 hover:bg-white flex"
                    aria-label={isInWishlist(image.id, 'gallery') ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart className={cn("h-5 w-5", isInWishlist(image.id, 'gallery') && "fill-current")} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Add Your Photo CTA */}
          <div className="mt-12 text-center">
            <p className="text-[var(--rich-chestnut)]">
              Shopped with us? Share your photos on Google Maps!
            </p>
            <Button
              asChild
              variant="outline"
              className="mt-4 border-[var(--celebration-gold)] text-[var(--celebration-gold)] hover:bg-[var(--celebration-gold)] hover:text-white"
            >
              <a
                href={STORE_INFO.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                Add Your Photo
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Close lightbox"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation */}
            {currentIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrev()
                }}
                className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {currentIndex < filteredImages.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
                className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            {/* Image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-h-[85vh] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={1200}
                height={800}
                className="max-h-[85vh] w-auto rounded-lg object-contain"
              />
              <p className="mt-4 text-center text-sm text-white/80">
                {selectedImage.alt}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
