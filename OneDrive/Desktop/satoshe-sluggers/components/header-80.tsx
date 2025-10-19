// components/header-80.tsx
"use client"

import { Button } from "@/components/ui/button"
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion"
import type React from "react"
import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

// Define the return type for the useRelume hook
interface RelumeValues {
  transformRef: React.RefObject<HTMLDivElement | null>
  yFirst: MotionValue<string>
  ySecond: MotionValue<string>
}

const useRelume = (): RelumeValues => {
  const transformRef = useRef<HTMLDivElement | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024) // lg breakpoint
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const { scrollYProgress } = useScroll({ 
    target: transformRef,
    offset: ["start end", "end start"]
  })
  const animatedScrollYProgress = useSpring(scrollYProgress, { bounce: 0 })

  // Different animation ranges based on screen size
  const scrollRange = isMobile ? 0.95 : isTablet ? 0.90 : 0.85
  const firstTransform = isMobile ? "-60vh" : isTablet ? "-75vh" : "-87.5vh"
  const secondTransform = isMobile ? "-25vh" : isTablet ? "-32vh" : "-39.6vh"

  const yFirst = useTransform(animatedScrollYProgress, [0, scrollRange], ["0vh", firstTransform])
  const ySecond = useTransform(animatedScrollYProgress, [0, scrollRange], ["0vh", secondTransform])

  return {
    transformRef,
    yFirst,
    ySecond,
  }
}

// Define the Header80 component as a React Functional Component
const Header80: React.FC = () => {
  const useActive = useRelume()
  return (
    <div style={{ position: 'relative' }}>
      <section id="relume" className="relative h-[150vh] px-[5%] md:h-[230vh] bg-background" ref={useActive.transformRef}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute top-0 right-auto bottom-0 left-0 z-10">
          <motion.div className="flex flex-col gap-[24vw] pt-[55vh]" style={{ y: useActive.yFirst }}>
            <div className="relative h-[35vw] pt-[120%] sm:h-auto w-[30vw] md:w-[28vw] lg:w-[22vw]">
              <Image
                src="/nfts/1.webp"
                fill
                className="rounded-image object-contain"
                alt="Satoshe Slugger Number 1"
                sizes="(max-width: 768px) 30vw, (max-width: 1024px) 28vw, 22vw"
                priority={false}
                quality={85}
                placeholder="empty"
              />
            </div>
            <div className="relative h-[35vw] pt-[120%] sm:h-auto left-[52vw] mt-[-46vw] w-[30vw] md:w-[28vw] lg:left-[58vw] lg:w-[22vw]">
              <Image
                src="/nfts/5.webp"
                fill
                className="rounded-image object-contain"
                alt="Satoshe Slugger Number 5"
                sizes="(max-width: 768px) 30vw, (max-width: 1024px) 28vw, 22vw"
                priority={false}
                quality={85}
                placeholder="empty"
              />
            </div>
            <div className="relative h-[35vw] pt-[120%] sm:h-auto left-[4vw] mt-[-5vw] w-[28vw] md:w-[26vw] lg:w-[20vw]">
              <Image
                src="/nfts/9.webp"
                fill
                className="rounded-image object-contain"
                alt="Satoshe Slugger Number 9"
                sizes="(max-width: 768px) 28vw, (max-width: 1024px) 26vw, 20vw"
                priority={false}
                quality={85}
                placeholder="empty"
              />
            </div>
            <div className="relative h-[35vw] pt-[120%] sm:h-auto left-[64vw] mt-[-45vw] w-[26vw] md:w-[24vw] lg:w-[18vw]">
              <Image
                src="/nfts/11.webp"
                fill
                className="rounded-image object-contain"
                alt="Satoshe Slugger Number 11"
                sizes="(max-width: 768px) 26vw, (max-width: 1024px) 24vw, 18vw"
                priority={false}
                quality={85}
                placeholder="empty"
              />
            </div>
          </motion.div>
        </div>
        <motion.div className="absolute top-0 right-0 bottom-0 left-auto z-0" style={{ y: useActive.ySecond }}>
          <div className="flex flex-col gap-[24vw] pt-[55vh]">
            <div className="relative h-[35vw] pt-[120%] opacity-75 sm:h-auto w-[28vw] md:w-[26vw] lg:w-[20vw]">
              <Image
                src="/nfts/120.webp"
                fill
                className="rounded-image object-contain"
                alt="Satoshe Slugger Number 120"
                sizes="(max-width: 768px) 28vw, (max-width: 1024px) 26vw, 20vw"
                priority={false}
                quality={85}
                placeholder="empty"
              />
            </div>
            <div className="relative h-[35vw] pt-[120%] opacity-75 sm:h-auto right-[50vw] mt-[-44vw] w-[26vw] md:w-[24vw] lg:right-[54vw] lg:w-[18vw]">
              <Image
                src="/nfts/634.webp"
                fill
                className="rounded-image object-contain"
                alt="Satoshe Slugger Number 634"
                sizes="(max-width: 768px) 26vw, (max-width: 1024px) 24vw, 18vw"
                priority={false}
                quality={85}
                placeholder="empty"
              />
            </div>
          </div>
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative z-20 text-center">
            <div className="mb-5 md:mb-6">
              <Image
                src="/brands/satoshe-sluggers/satoshe-sluggers-off-white-op.svg"
                alt="Satoshe Sluggers"
                width={600}
                height={300}
                className="w-full max-w-2xl mx-auto"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 60vw"
                quality={100}
                placeholder="empty"
              />
            </div>
            <p className="relative z-20 text-xl md:text-2xl lg:text-3xl font-bold text-[#FF0099]">
              NFTS THAT LEVEL THE PLAYING
              <br />
              FIELD FOR WOMEN&apos;S BASEBALL
            </p>
            <div className="relative z-20 mt-8 flex items-center justify-center gap-x-4 md:mt-10">
              <div className="relative group">
                {/* Enhanced glowing effect for the button */}
                <div className="absolute inset-0 rounded bg-blue-500/40 blur-xl group-hover:bg-blue-400/60 transition-all duration-300 scale-125"></div>
                <Link href="/nfts">
                  <Button
                    variant="outline"
                    className="relative z-10 text-xl md:text-2xl lg:text-3xl px-10 py-8 md:px-14 md:py-10 font-bold text-blue-400 border-blue-400 border hover:border-transparent hover:bg-[hsl(0,0%,4%)] transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] bg-neutral-900/80 rounded cursor-pointer"
                    title="BUY A SLUGGER"
                  >
                    BUY A SLUGGER
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 mt-[35rem] md:mt-[100vh]" />
      </div>
    </section>
    </div>
  )
}

export default Header80
