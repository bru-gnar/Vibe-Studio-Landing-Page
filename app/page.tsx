"use client"

import { useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ppEditorialNewUltralightItalic, inter } from "./fonts"
import Link from "next/link"
import Navigation from "@/components/Navigation"
import BrandCarousel from "@/components/BrandCarousel"
import InteractiveGallery from "@/components/InteractiveGallery"
import FeatureCard from "@/components/FeatureCard"
import Footer from "@/components/Footer"
import OptimizedVideo from "@/components/OptimizedVideo"

export default function Home() {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])
  const titleY = useTransform(scrollYProgress, [0, 0.5], [0, 100])

  const handleVideoLoad = () => {
    setVideoLoaded(true)
  }

  return (
    <div className="bg-[#141414] min-h-screen">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <div ref={containerRef} className="relative h-screen w-full overflow-hidden">
        {/* Video Background */}
        <motion.div className="absolute inset-0 w-full h-full" style={{ opacity, scale }}>
          <div className="absolute inset-0 bg-black/20 z-10" /> {/* Subtle overlay for text readability */}
          <OptimizedVideo
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Vibe%20Studio%20Video%20%283%29-UuvzfCsEKuZgVB77VhDmIn6x3wqVfU.mov"
            className="w-full h-full"
            autoPlay={true}
            muted={true}
            loop={true}
            playsInline={true}
            preloadStrategy="auto"
            onLoad={handleVideoLoad}
            intersectionThreshold={0}
            poster="/placeholder.svg?height=1080&width=1920"
          />
        </motion.div>

        {/* Hero Content */}
        <motion.div className="absolute inset-0 flex items-center justify-center z-20" style={{ y: titleY }}>
          <div className="text-center px-4">
            <motion.h1
              className={`${ppEditorialNewUltralightItalic.className} text-6xl md:text-9xl font-light italic text-white tracking-tighter mb-6 drop-shadow-2xl`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: videoLoaded ? 1 : 0.8, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Vibe Studio
            </motion.h1>
            <motion.p
              className={`${inter.className} text-white/90 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-lg`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: videoLoaded ? 1 : 0.8, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              Create immersive digital experiences with our cutting-edge design tools
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: videoLoaded ? 1 : 0.8, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="mt-8"
            >
              <Link
                href="#explore"
                className="px-8 py-3 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 rounded-full text-white transition-all duration-300 shadow-lg"
              >
                Explore Studio
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Video Loading Indicator */}
        {!videoLoaded && (
          <motion.div
            className="absolute inset-0 bg-[#141414] flex items-center justify-center z-30"
            initial={{ opacity: 1 }}
            animate={{ opacity: videoLoaded ? 0 : 1 }}
            transition={{ duration: 0.5 }}
            style={{ pointerEvents: videoLoaded ? "none" : "auto" }}
          >
            <div className="text-center text-white">
              <div className="w-16 h-16 border-2 border-white/30 border-t-white rounded-full animate-spin mb-4 mx-auto" />
              <p className="text-sm opacity-70">Loading experience...</p>
            </div>
          </motion.div>
        )}

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: videoLoaded ? 1 : 0.5 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <div className="flex flex-col items-center">
            <span className="text-white/70 text-sm mb-2 drop-shadow">Scroll to explore</span>
            <div className="w-0.5 h-8 bg-white/50 animate-pulse"></div>
          </div>
        </motion.div>
      </div>

      {/* Brand Carousel */}
      <BrandCarousel />

      {/* Interactive Gallery - Moodboard Section */}
      <section id="moodboard" className="relative">
        <InteractiveGallery />
      </section>

      {/* Features Section */}
      <section id="featured" className="py-24 px-4 md:px-8 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className={`${ppEditorialNewUltralightItalic.className} text-4xl md:text-6xl font-light italic text-white/80 tracking-tighter mb-6`}
            >
              Features
            </h2>
            <p className={`${inter.className} text-white/50 text-lg max-w-2xl mx-auto`}>
              Explore what's possible with Vibe Studio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-video relative overflow-hidden rounded-lg">
              <OptimizedVideo
                src="https://static.cdn-luma.com/files/58ab7363888153e3/Logo%20Exported.mp4"
                className="w-full h-full"
                autoPlay={true}
                muted={true}
                loop={true}
                playsInline={true}
                preloadStrategy="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <h3 className={`${ppEditorialNewUltralightItalic.className} text-2xl text-white`}>Brand Identity</h3>
              </div>
            </div>
            <div className="aspect-video relative overflow-hidden rounded-lg">
              <OptimizedVideo
                src="https://static.cdn-luma.com/files/58ab7363888153e3/Animation%20Exported%20(4).mp4"
                className="w-full h-full"
                autoPlay={true}
                muted={true}
                loop={true}
                playsInline={true}
                preloadStrategy="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <h3 className={`${ppEditorialNewUltralightItalic.className} text-2xl text-white`}>Motion Graphics</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Craft Your Vision Section */}
      <section id="craft-vision" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className={`${ppEditorialNewUltralightItalic.className} text-4xl md:text-6xl font-light italic text-white/80 tracking-tighter mb-6`}
          >
            Craft Your Vision
          </h2>
          <p className={`${inter.className} text-white/50 text-lg max-w-2xl mx-auto`}>
            Powerful tools to bring your creative ideas to life with precision and style
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            title="Imagine"
            description="Kick off your creative flow with concept tools that help you brainstorm, storyboard, and explore visual directions."
            videoSrc="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/social___bruner___A_surreal_cinematic_scene_of_a_man_in_a_sharp_blac_2e4bd350-8459-451d-8aaf-eb8e001217b7_2-snZtjy3Sdh8CJd5wd418IyPir9oaii.mp4"
          />
          <FeatureCard
            title="Build"
            description="Use node-based control and custom templates to design, animate, and edit with precision."
            videoSrc="https://static.cdn-luma.com/files/58ab7363888153e3/Jitter%20Exported%20Poster.mp4"
          />
          <FeatureCard
            title="Refine"
            description="Polish your project with guided adjustments, alternate cuts, and intelligent enhancements."
            videoSrc="https://static.cdn-luma.com/files/58ab7363888153e3/Exported%20Web%20Video.mp4"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className={`${ppEditorialNewUltralightItalic.className} text-4xl md:text-6xl font-light italic text-white/80 tracking-tighter mb-6`}
          >
            Ready to Create?
          </h2>
          <p className={`${inter.className} text-white/50 text-lg max-w-2xl mx-auto mb-8`}>
            Join our community of creators and start building immersive experiences today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-3 bg-white text-[#141414] hover:bg-white/90 rounded-full transition-all duration-300 font-medium"
            >
              Get Started
            </Link>
            <Link
              href="/demo"
              className="px-8 py-3 bg-transparent border border-white/30 text-white hover:bg-white/10 rounded-full transition-all duration-300"
            >
              Watch Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
