"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface VideoPreloaderProps {
  src: string
  lowQualitySrc?: string
  poster?: string
  className?: string
  onLoad?: () => void
  children?: React.ReactNode
}

export default function VideoPreloader({
  src,
  lowQualitySrc,
  poster,
  className = "",
  onLoad,
  children,
}: VideoPreloaderProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [connectionSpeed, setConnectionSpeed] = useState<"slow" | "fast">("fast")
  const [showLowQuality, setShowLowQuality] = useState(false)

  // Detect connection speed
  useEffect(() => {
    const connection =
      (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

    if (connection) {
      const updateConnectionSpeed = () => {
        const effectiveType = connection.effectiveType
        const isSlowConnection = ["slow-2g", "2g", "3g"].includes(effectiveType)
        setConnectionSpeed(isSlowConnection ? "slow" : "fast")

        // Show low quality version immediately for slow connections
        if (isSlowConnection && lowQualitySrc) {
          setShowLowQuality(true)
        }
      }

      updateConnectionSpeed()
      connection.addEventListener("change", updateConnectionSpeed)

      return () => {
        connection.removeEventListener("change", updateConnectionSpeed)
      }
    }
  }, [lowQualitySrc])

  // Progressive loading strategy
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    setIsLoading(true)

    // Start with low quality for slow connections
    if (connectionSpeed === "slow" && lowQualitySrc && !showLowQuality) {
      const lowQualityVideo = document.createElement("video")
      lowQualityVideo.src = lowQualitySrc
      lowQualityVideo.muted = true
      lowQualityVideo.preload = "auto"

      lowQualityVideo.addEventListener("canplay", () => {
        video.src = lowQualitySrc
        video.load()
        setShowLowQuality(true)

        // Start loading high quality in background
        setTimeout(() => {
          preloadHighQuality()
        }, 1000)
      })
    } else {
      preloadHighQuality()
    }

    function preloadHighQuality() {
      const highQualityVideo = document.createElement("video")
      highQualityVideo.src = src
      highQualityVideo.muted = true
      highQualityVideo.preload = "auto"

      const handleProgress = () => {
        if (highQualityVideo.buffered.length > 0) {
          const bufferedEnd = highQualityVideo.buffered.end(highQualityVideo.buffered.length - 1)
          const duration = highQualityVideo.duration
          if (duration > 0) {
            setLoadProgress((bufferedEnd / duration) * 100)
          }
        }
      }

      const handleCanPlayThrough = () => {
        video.src = src
        video.load()
        setIsLoaded(true)
        setIsLoading(false)
        onLoad?.()
      }

      const handleError = () => {
        console.error("Failed to load high quality video")
        setIsLoading(false)
        // Fallback to low quality if available
        if (lowQualitySrc && !showLowQuality) {
          video.src = lowQualitySrc
          video.load()
          setIsLoaded(true)
        }
      }

      highQualityVideo.addEventListener("progress", handleProgress)
      highQualityVideo.addEventListener("canplaythrough", handleCanPlayThrough)
      highQualityVideo.addEventListener("error", handleError)

      return () => {
        highQualityVideo.removeEventListener("progress", handleProgress)
        highQualityVideo.removeEventListener("canplaythrough", handleCanPlayThrough)
        highQualityVideo.removeEventListener("error", handleError)
      }
    }
  }, [src, lowQualitySrc, connectionSpeed, showLowQuality, onLoad])

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        className="object-cover w-full h-full"
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
        preload="none"
      />

      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center text-white">
              <div className="w-16 h-16 border-2 border-white/30 border-t-white rounded-full animate-spin mb-4 mx-auto" />
              <p className="text-sm mb-2">Loading video...</p>
              <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${loadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-xs mt-2 text-white/70">{Math.round(loadProgress)}%</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quality indicator */}
      {showLowQuality && !isLoaded && (
        <div className="absolute top-4 right-4 bg-black/50 px-2 py-1 rounded text-xs text-white/70">Loading HD...</div>
      )}

      {children}
    </div>
  )
}
