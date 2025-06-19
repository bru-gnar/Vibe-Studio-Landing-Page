"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"

interface OptimizedVideoProps {
  src: string
  lowQualitySrc?: string
  poster?: string
  className?: string
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  playsInline?: boolean
  onLoad?: () => void
  preloadStrategy?: "none" | "metadata" | "auto" | "lazy"
  intersectionThreshold?: number
}

export default function OptimizedVideo({
  src,
  lowQualitySrc,
  poster,
  className = "",
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  onLoad,
  preloadStrategy = "lazy",
  intersectionThreshold = 0.1,
}: OptimizedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [connectionSpeed, setConnectionSpeed] = useState<"slow" | "fast">("fast")
  const [currentSrc, setCurrentSrc] = useState<string | null>(null)
  const [loadProgress, setLoadProgress] = useState(0)
  const [hasError, setHasError] = useState(false)

  // Detect connection speed
  useEffect(() => {
    const connection =
      (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

    if (connection) {
      const updateConnectionSpeed = () => {
        const effectiveType = connection.effectiveType
        const isSlowConnection = ["slow-2g", "2g", "3g"].includes(effectiveType)
        setConnectionSpeed(isSlowConnection ? "slow" : "fast")
      }

      updateConnectionSpeed()
      connection.addEventListener("change", updateConnectionSpeed)

      return () => {
        connection.removeEventListener("change", updateConnectionSpeed)
      }
    }
  }, [])

  // Determine optimal video source
  useEffect(() => {
    const optimalSrc = (connectionSpeed === "slow" && lowQualitySrc ? lowQualitySrc : src) || null
    setCurrentSrc(optimalSrc)
  }, [src, lowQualitySrc, connectionSpeed])

  // Intersection Observer for lazy loading
  useEffect(() => {
    const video = videoRef.current
    if (!video || preloadStrategy !== "lazy") {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.unobserve(video)
          }
        })
      },
      { threshold: intersectionThreshold },
    )

    observer.observe(video)

    return () => {
      observer.disconnect()
    }
  }, [preloadStrategy, intersectionThreshold])

  // Video loading logic
  useEffect(() => {
    const video = videoRef.current
    if (!video || !currentSrc) return

    // Only load if not using lazy strategy or if in view
    if (preloadStrategy === "lazy" && !isInView) return

    const handleCanPlay = () => {
      setIsLoaded(true)
      onLoad?.()
    }

    const handleLoadStart = () => {
      setIsLoaded(false)
      setHasError(false)
    }

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
        const duration = video.duration
        if (duration > 0) {
          setLoadProgress((bufferedEnd / duration) * 100)
        }
      }
    }

    const handleError = () => {
      setHasError(true)
      console.error("Video failed to load:", currentSrc)
    }

    video.addEventListener("canplay", handleCanPlay)
    video.addEventListener("loadstart", handleLoadStart)
    video.addEventListener("progress", handleProgress)
    video.addEventListener("error", handleError)

    // Set preload attribute based on strategy
    if (preloadStrategy !== "lazy") {
      video.preload = preloadStrategy
    }

    // Load the video
    if (video.src !== currentSrc && currentSrc) {
      video.load()
    }

    // Auto play if enabled and conditions are met
    if (autoPlay && (preloadStrategy !== "lazy" || isInView)) {
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay prevented:", error)
        })
      }
    }

    return () => {
      video.removeEventListener("canplay", handleCanPlay)
      video.removeEventListener("loadstart", handleLoadStart)
      video.removeEventListener("progress", handleProgress)
      video.removeEventListener("error", handleError)
    }
  }, [currentSrc, isInView, preloadStrategy, autoPlay, onLoad])

  // Preload high quality version in background
  const preloadHighQuality = useCallback(() => {
    if (connectionSpeed === "slow" && currentSrc === lowQualitySrc && src !== lowQualitySrc) {
      const preloadVideo = document.createElement("video")
      preloadVideo.src = src
      preloadVideo.preload = "auto"
      preloadVideo.muted = true

      preloadVideo.addEventListener("canplaythrough", () => {
        // Switch to high quality after it's loaded
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.src = src
            setCurrentSrc(src)
          }
        }, 2000) // Wait 2 seconds before switching
      })
    }
  }, [connectionSpeed, currentSrc, lowQualitySrc, src])

  // Start preloading high quality after low quality is loaded
  useEffect(() => {
    if (isLoaded && connectionSpeed === "slow" && currentSrc === lowQualitySrc) {
      preloadHighQuality()
    }
  }, [isLoaded, connectionSpeed, currentSrc, lowQualitySrc, preloadHighQuality])

  if (hasError) {
    return (
      <div
        className={`relative ${className} bg-gradient-to-br from-gray-900 to-black flex items-center justify-center`}
      >
        <div className="text-center text-white/70 p-8">
          <div className="w-16 h-16 mx-auto mb-4 opacity-50">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <p className="text-sm mb-2">Video temporarily unavailable</p>
          <p className="text-xs opacity-50">Showing fallback background</p>
        </div>
        {poster && (
          <img
            src={poster || "/placeholder.svg"}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        className={`object-cover w-full h-full transition-opacity duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        poster={poster}
        preload="metadata"
        crossOrigin="anonymous"
        src={currentSrc || undefined}
      >
        {currentSrc && (
          <>
            <source src={currentSrc} type="video/mp4" />
            <source src={currentSrc.replace(".mov", ".webm")} type="video/webm" />
            <source src={currentSrc} type="video/quicktime" />
          </>
        )}
        Your browser does not support the video tag.
      </video>

      {/* Loading placeholder */}
      {!isLoaded && (
        <motion.div
          className="absolute inset-0 bg-[#141414] flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoaded ? 0 : 1 }}
          transition={{ duration: 1 }}
        >
          {poster ? (
            <img
              src={poster || "/placeholder.svg"}
              alt="Video poster"
              className="object-cover w-full h-full opacity-50"
            />
          ) : (
            <div className="text-center text-white/50">
              <div className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin mb-4 mx-auto" />
              <p className="text-sm">Loading video...</p>
              {loadProgress > 0 && (
                <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden mt-2 mx-auto">
                  <motion.div
                    className="h-full bg-white/50 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${loadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
