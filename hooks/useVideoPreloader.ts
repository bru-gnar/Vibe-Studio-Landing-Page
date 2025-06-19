"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"

interface VideoPreloaderOptions {
  src: string
  lowQualitySrc?: string
  poster?: string
  preloadStrategy?: "aggressive" | "lazy" | "adaptive"
}

interface VideoPreloaderReturn {
  videoRef: React.RefObject<HTMLVideoElement>
  isLoaded: boolean
  isLoading: boolean
  loadProgress: number
  error: string | null
  startPreload: () => void
}

export function useVideoPreloader({
  src,
  lowQualitySrc,
  poster,
  preloadStrategy = "adaptive",
}: VideoPreloaderOptions): VideoPreloaderReturn {
  const [videoRef, setVideoRef] = useState<React.RefObject<HTMLVideoElement>>({ current: null })
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [connectionSpeed, setConnectionSpeed] = useState<"slow" | "fast">("fast")

  // Detect connection speed
  useEffect(() => {
    const connection =
      (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

    if (connection) {
      const updateConnectionSpeed = () => {
        const effectiveType = connection.effectiveType
        setConnectionSpeed(["slow-2g", "2g", "3g"].includes(effectiveType) ? "slow" : "fast")
      }

      updateConnectionSpeed()
      connection.addEventListener("change", updateConnectionSpeed)

      return () => {
        connection.removeEventListener("change", updateConnectionSpeed)
      }
    }
  }, [])

  const startPreload = useCallback(() => {
    if (!videoRef.current || isLoading) return

    setIsLoading(true)
    setError(null)

    const video = videoRef.current
    const videoSrc = connectionSpeed === "slow" && lowQualitySrc ? lowQualitySrc : src

    // Create a new video element for preloading
    const preloadVideo = document.createElement("video")
    preloadVideo.preload = "auto"
    preloadVideo.muted = true

    const handleProgress = () => {
      if (preloadVideo.buffered.length > 0) {
        const bufferedEnd = preloadVideo.buffered.end(preloadVideo.buffered.length - 1)
        const duration = preloadVideo.duration
        if (duration > 0) {
          setLoadProgress((bufferedEnd / duration) * 100)
        }
      }
    }

    const handleCanPlayThrough = () => {
      setIsLoaded(true)
      setIsLoading(false)
      // Transfer the loaded video to the actual video element
      video.src = videoSrc
      video.load()
    }

    const handleError = () => {
      setError("Failed to load video")
      setIsLoading(false)
    }

    preloadVideo.addEventListener("progress", handleProgress)
    preloadVideo.addEventListener("canplaythrough", handleCanPlayThrough)
    preloadVideo.addEventListener("error", handleError)

    preloadVideo.src = videoSrc

    return () => {
      preloadVideo.removeEventListener("progress", handleProgress)
      preloadVideo.removeEventListener("canplaythrough", handleCanPlayThrough)
      preloadVideo.removeEventListener("error", handleError)
    }
  }, [src, lowQualitySrc, connectionSpeed, isLoading, videoRef])

  // Auto-start preload based on strategy
  useEffect(() => {
    if (preloadStrategy === "aggressive") {
      startPreload()
    }
  }, [preloadStrategy, startPreload])

  return {
    videoRef,
    isLoaded,
    isLoading,
    loadProgress,
    error,
    startPreload,
  }
}
