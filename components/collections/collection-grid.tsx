'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MessageCircle, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { collections, categories, type Collection } from '@/lib/data/collections'
import { whatsappLink, cn } from '@/lib/utils'
import { useWishlist } from '@/hooks/use-wishlist'

export function CollectionGrid() {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const filteredCollections = activeCategory === 'all'
    ? collections
    : collections.filter((c) => c.category === activeCategory)

  return (
    <section className="bg-[var(--ivory-cream)] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
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

        {/* Collection Cards */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {filteredCollections.map((collection, index) => (
            <CollectionCard key={collection.id} collection={collection} index={index} />
          ))}
        </div>

        {filteredCollections.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-[var(--rich-chestnut)]">No collections found in this category.</p>
          </div>
        )}
      </div>
    </section>
  )
}

function CollectionCard({ collection, index }: { collection: Collection; index: number }) {
  const { items, addItem, removeItem, isInWishlist } = useWishlist()
  
  const inWishlist = isInWishlist(collection.id, 'collection')

  const toggleWishlist = () => {
    if (inWishlist) {
      removeItem(collection.id, 'collection')
    } else {
      addItem({
        id: collection.id,
        title: collection.title,
        image: collection.image,
        priceRange: collection.priceRange,
        source: 'collection',
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md">
        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[var(--celebration-gold)] shadow-sm backdrop-blur-sm transition-transform hover:scale-110 hover:bg-white"
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("h-5 w-5", inWishlist && "fill-current")} />
        </button>

        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={collection.image}
            alt={collection.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-serif text-xl font-semibold text-[var(--deep-mahogany)]">
            {collection.title}
          </h3>
          <p className="mt-2 text-sm text-[var(--rich-chestnut)] line-clamp-2">
            {collection.description}
          </p>
          {collection.priceRange && (
            <p className="mt-2 text-sm font-medium text-[var(--celebration-gold)]">
              {collection.priceRange}
            </p>
          )}

          {/* WhatsApp CTA */}
          <Button
            asChild
            className="mt-4 w-full bg-[var(--celebration-gold)] text-white hover:bg-[var(--rich-chestnut)]"
          >
            <a
              href={whatsappLink(`Hi, I'm interested in your ${collection.title} collection.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Enquire on WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
