"use client"

import { Header } from "@/components/layout/Header"
import { Navigation } from "@/components/layout/Navigation"
import { Button } from "@/components/ui/button"
import { motion, Variants } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Globe, TrendingUp } from "lucide-react"
import LiquidChrome from "@/components/ui/LiquidChrome"
import { flightStore } from "@/lib/store/flightStore"
import { useEffect } from "react"

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } },
}

export default function HomePage() {
  const resetSearch = flightStore((state) => state.resetSearch)

  useEffect(() => {
    resetSearch()
  }, [resetSearch])

  return (
    <>
      <div className="fixed inset-0 z-0">
         <LiquidChrome
            baseColor={[0, 0.1, 0.2]}
            speed={0.4}
            amplitude={0.3}
            interactive={true}
          />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />

        <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8 pb-32">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex max-w-4xl flex-col items-center space-y-10"
          >
            <motion.div variants={item} className="rounded-full bg-white/5 px-4 py-1.5 backdrop-blur-md border border-white/10">
              <span className="flex items-center gap-2 text-sm font-medium text-white">
                <Globe className="h-4 w-4 text-blue-400" />
                Explore the world
              </span>
            </motion.div>

            <motion.h1
              variants={item}
              className="text-5xl font-extrabold tracking-tight sm:text-7xl md:text-8xl bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent"
            >
              Discover flights <br className="hidden sm:block" />
              <span className="text-blue-400">intelligently.</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="max-w-2xl text-lg text-muted-foreground sm:text-xl"
            >
              Analyze price trends, find hidden deals, and book your next adventure with confidence using our advanced flight search engine.
            </motion.p>

            <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <Button asChild size="lg" className="h-12 rounded-full cursor-pointer px-8 text-base">
                <Link href="/flights">
                  Start Searching
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 rounded-full cursor-pointer border-white/10 bg-white/5 px-8 text-base backdrop-blur-sm hover:bg-white/10"
              >
                <Link href="#features">
                  <TrendingUp className="mr-2 h-4 w-4 text-blue-400" />
                  View Trends
                </Link>
              </Button>
            </motion.div>
          
          </motion.div>
        </main>
        
        <Navigation />
      </div>
    </>
  )
}
