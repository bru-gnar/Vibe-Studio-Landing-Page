"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ppEditorialNewUltralightItalic, inter } from "@/app/fonts"
import OptimizedVideo from "./OptimizedVideo"

interface FeatureCardProps {
  title: string
  description: string
  videoSrc: string
}

export default function FeatureCard({ title, description, videoSrc }: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  // const videoRef = useRef<HTMLVideoElement>(null)

  // const handleMouseEnter = () => {
  //   setIsHovered(true)
  //   videoRef.current?.play()
  // }

  // const handleMouseLeave = () => {
  //   setIsHovered(false)
  //   if (videoRef.current) {
  //     videoRef.current.currentTime = 0
  //     videoRef.current.pause()
  //   }
  // }

  return (
    <motion.div
      className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden"
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
      // onMouseEnter={handleMouseEnter}
      // onMouseLeave={handleMouseLeave}
    >
      <div className="aspect-video relative overflow-hidden">
        {/* <video ref={videoRef} className="object-cover w-full h-full" muted loop playsInline>
          <source src={videoSrc} type="video/mp4" />
        </video> */}
        <OptimizedVideo
          src={videoSrc}
          lowQualitySrc={videoSrc.replace(".mp4", "_low.mp4")}
          className="w-full h-full"
          autoPlay={false}
          preloadStrategy="lazy"
          onLoad={() => console.log("Feature video loaded")}
        />
        <motion.div
          className="absolute inset-0 bg-black/40"
          animate={{ opacity: isHovered ? 0 : 0.4 }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <div className="p-6">
        <h3 className={`${ppEditorialNewUltralightItalic.className} text-2xl text-white mb-2`}>{title}</h3>
        <p className={`${inter.className} text-white/60`}>{description}</p>
      </div>
    </motion.div>
  )
}
