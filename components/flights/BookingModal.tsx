"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Plane } from "lucide-react"
import { useEffect } from "react"
import { createPortal } from "react-dom"

interface BookingModalProps {
  isOpen: boolean
  onClose?: () => void
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  // Prevent scrolling when modal is open
    useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (typeof window === "undefined") return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] p-8 text-center shadow-2xl"
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-50" />
              
              <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/20" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <Plane className="h-10 w-10 animate-pulse" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Booking Flight</h3>
                  <p className="text-gray-400">Navigating to booking platform...</p>
                </div>

                {/* Loading Bar */}
                <div className="h-1.5 w-full max-w-[200px] overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="h-full w-full bg-blue-500"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
