"use client"

import { GridBody, DraggableContainer, GridItem } from "@/components/ui/infinite-drag-scroll"

const creativeWorks = [
  {
    id: 1,
    alt: "Abstract digital art with flowing colors",
    src: "/placeholder.svg?height=400&width=300&text=Digital+Art",
  },
  {
    id: 2,
    alt: "Modern brand identity design",
    src: "/placeholder.svg?height=400&width=300&text=Brand+Design",
  },
  {
    id: 3,
    alt: "Motion graphics animation frame",
    src: "/placeholder.svg?height=400&width=300&text=Motion+Graphics",
  },
  {
    id: 4,
    alt: "3D rendered architectural visualization",
    src: "/placeholder.svg?height=400&width=300&text=3D+Render",
  },
  {
    id: 5,
    alt: "Interactive web design mockup",
    src: "/placeholder.svg?height=400&width=300&text=Web+Design",
  },
  {
    id: 6,
    alt: "Typography and layout design",
    src: "/placeholder.svg?height=400&width=300&text=Typography",
  },
  {
    id: 7,
    alt: "Product photography with creative lighting",
    src: "/placeholder.svg?height=400&width=300&text=Photography",
  },
  {
    id: 8,
    alt: "Illustration and character design",
    src: "/placeholder.svg?height=400&width=300&text=Illustration",
  },
  {
    id: 9,
    alt: "Video editing and color grading",
    src: "/placeholder.svg?height=400&width=300&text=Video+Edit",
  },
  {
    id: 10,
    alt: "UI/UX interface design",
    src: "/placeholder.svg?height=400&width=300&text=UI+Design",
  },
  {
    id: 11,
    alt: "Creative campaign artwork",
    src: "/placeholder.svg?height=400&width=300&text=Campaign",
  },
  {
    id: 12,
    alt: "Experimental visual effects",
    src: "/placeholder.svg?height=400&width=300&text=VFX",
  },
  {
    id: 13,
    alt: "Packaging design concept",
    src: "/placeholder.svg?height=400&width=300&text=Packaging",
  },
  {
    id: 14,
    alt: "Environmental design visualization",
    src: "/placeholder.svg?height=400&width=300&text=Environment",
  },
  {
    id: 15,
    alt: "Sound visualization and audio design",
    src: "/placeholder.svg?height=400&width=300&text=Audio+Visual",
  },
  {
    id: 16,
    alt: "Interactive installation concept",
    src: "/placeholder.svg?height=400&width=300&text=Installation",
  },
  {
    id: 17,
    alt: "Fashion and textile design",
    src: "/placeholder.svg?height=400&width=300&text=Fashion",
  },
  {
    id: 18,
    alt: "Architectural visualization render",
    src: "/placeholder.svg?height=400&width=300&text=Architecture",
  },
]

export default function InteractiveGallery() {
  return (
    <section className="relative">
      {/* Overlay with instructions */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10 text-center">
        <p className="text-white/60 text-sm bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
          Drag to explore • Scroll to navigate
        </p>
      </div>

      <DraggableContainer variant="masonry">
        <GridBody>
          {creativeWorks.map((work) => (
            <GridItem key={work.id} className="relative h-54 w-36 md:h-96 md:w-64">
              <img
                src={work.src || "/placeholder.svg"}
                alt={work.alt}
                className="pointer-events-none absolute h-full w-full object-cover rounded-lg"
              />
              {/* Overlay with subtle gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
            </GridItem>
          ))}
        </GridBody>
      </DraggableContainer>
    </section>
  )
}
