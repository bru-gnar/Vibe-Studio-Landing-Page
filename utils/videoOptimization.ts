interface VideoQualityOptions {
  connection: "slow" | "fast"
  deviceType: "mobile" | "desktop"
  batteryLevel?: number
}

export function getOptimalVideoSrc(baseSrc: string, options: VideoQualityOptions): string {
  const { connection, deviceType, batteryLevel } = options

  // Use low quality for slow connections or low battery
  if (connection === "slow" || (batteryLevel && batteryLevel < 0.2)) {
    return baseSrc.replace(".mp4", "_low.mp4")
  }

  // Use medium quality for mobile devices on fast connections
  if (deviceType === "mobile" && connection === "fast") {
    return baseSrc.replace(".mp4", "_medium.mp4")
  }

  // Use high quality for desktop on fast connections
  return baseSrc
}

export function preloadVideo(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video")
    video.preload = "auto"
    video.muted = true

    video.addEventListener("canplaythrough", () => resolve())
    video.addEventListener("error", reject)

    video.src = src
  })
}

export function getVideoFormat(userAgent: string): "webm" | "mp4" {
  // Check for WebM support (more efficient)
  const supportsWebM = userAgent.includes("Chrome") || userAgent.includes("Firefox")
  return supportsWebM ? "webm" : "mp4"
}

export class VideoPreloadManager {
  private preloadedVideos = new Map<string, HTMLVideoElement>()
  private preloadQueue: string[] = []
  private maxConcurrentPreloads = 2
  private currentPreloads = 0

  async preload(src: string): Promise<void> {
    if (this.preloadedVideos.has(src)) {
      return Promise.resolve()
    }

    if (this.currentPreloads >= this.maxConcurrentPreloads) {
      this.preloadQueue.push(src)
      return Promise.resolve()
    }

    return this.startPreload(src)
  }

  private async startPreload(src: string): Promise<void> {
    this.currentPreloads++

    try {
      const video = document.createElement("video")
      video.preload = "auto"
      video.muted = true
      video.src = src

      await new Promise<void>((resolve, reject) => {
        video.addEventListener("canplaythrough", () => resolve())
        video.addEventListener("error", reject)
      })

      this.preloadedVideos.set(src, video)
    } catch (error) {
      console.error("Failed to preload video:", src, error)
    } finally {
      this.currentPreloads--
      this.processQueue()
    }
  }

  private processQueue(): void {
    if (this.preloadQueue.length > 0 && this.currentPreloads < this.maxConcurrentPreloads) {
      const nextSrc = this.preloadQueue.shift()
      if (nextSrc) {
        this.startPreload(nextSrc)
      }
    }
  }

  getPreloadedVideo(src: string): HTMLVideoElement | null {
    return this.preloadedVideos.get(src) || null
  }

  clear(): void {
    this.preloadedVideos.clear()
    this.preloadQueue = []
    this.currentPreloads = 0
  }
}

export const videoPreloadManager = new VideoPreloadManager()
