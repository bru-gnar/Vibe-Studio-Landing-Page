"use client"

import { motion } from "framer-motion"
import { ppEditorialNewUltralightItalic } from "@/app/fonts"

const brands = [
  { name: "NYU", logo: "/placeholder.svg?height=32&width=80&text=NYU" },
  { name: "Harvey", logo: "/placeholder.svg?height=32&width=80&text=Harvey" },
  { name: "Levi's", logo: "/placeholder.svg?height=32&width=80&text=Levi's" },
  { name: "NBCUniversal", logo: "/placeholder.svg?height=32&width=120&text=NBC" },
  { name: "Stanford", logo: "/placeholder.svg?height=32&width=100&text=Stanford" },
  { name: "USC", logo: "/placeholder.svg?height=32&width=80&text=USC" },
  { name: "MSCHF", logo: "/placeholder.svg?height=32&width=80&text=MSCHF" },
  { name: "Milk", logo: "/placeholder.svg?height=32&width=70&text=Milk" },
  { name: "Adobe", logo: "/placeholder.svg?height=32&width=80&text=Adobe" },
  { name: "Google", logo: "/placeholder.svg?height=32&width=90&text=Google" },
  { name: "Apple", logo: "/placeholder.svg?height=32&width=80&text=Apple" },
  { name: "Meta", logo: "/placeholder.svg?height=32&width=80&text=Meta" },
]

export default function BrandCarousel() {
  return (
    <section className="py-16 px-4 md:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            className={`${ppEditorialNewUltralightItalic.className} text-2xl md:text-3xl font-light italic text-white/70 tracking-tight`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Trusted by top creatives at
          </motion.h2>
        </div>

        {/* Infinite Scroll Animation */}
        <div className="overflow-hidden">
          <motion.div
            className="flex items-center space-x-12 md:space-x-16"
            animate={{ x: [0, -1920] }}
            transition={{
              duration: 30,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            {/* First set of brands */}
            {brands.map((brand, index) => (
              <div
                key={`first-${index}`}
                className="flex-shrink-0 opacity-40 hover:opacity-70 transition-opacity duration-300"
              >
                <img
                  src={brand.logo || "/placeholder.svg"}
                  alt={`${brand.name} logo`}
                  className="h-6 md:h-8 w-auto object-contain filter brightness-0 invert"
                />
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {brands.map((brand, index) => (
              <div
                key={`second-${index}`}
                className="flex-shrink-0 opacity-40 hover:opacity-70 transition-opacity duration-300"
              >
                <img
                  src={brand.logo || "/placeholder.svg"}
                  alt={`${brand.name} logo`}
                  className="h-6 md:h-8 w-auto object-contain filter brightness-0 invert"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
