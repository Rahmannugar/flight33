"use client"

import { useState, useEffect } from "react"
import { flightStore } from "@/lib/store/flightStore"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { BookingModal } from "./BookingModal"
import { Flight } from "@/types"

export function BookFlightAction() {
  const { selectedFlightId, searchParams, flights, error } = flightStore()
  const [showModal, setShowModal] = useState(false)
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)

  useEffect(() => {
    if (selectedFlightId) {
      const flight = flights.find(f => f.id === selectedFlightId) || null
      setSelectedFlight(flight)
    } else {
      setSelectedFlight(null)
    }
  }, [selectedFlightId, flights])

  const handleBookFlight = () => {
    if (!selectedFlight) return
    setShowModal(true)

    // Delay redirect to show modal
    setTimeout(() => {
      const { origin, destination, departureDate, returnDate, travelClass, adults } = searchParams

      // Map Cabin Class
      const cabinMap: Record<string, string> = {
        'ECONOMY': 'economy',
        'PREMIUM_ECONOMY': 'premium',
        'BUSINESS': 'business',
        'FIRST': 'first'
      }
      const cabin = cabinMap[travelClass] || 'economy'

      // Map Passengers
      const passengerStr = `${adults}adult${adults > 1 ? 's' : ''}`

      // Construct Dates
      let datePath = `${departureDate}`
      if (returnDate) {
        datePath += `/${returnDate}`
      }

      const url = `https://booking.kayak.com/flights/${origin}-${destination}/${datePath}/${cabin}/${passengerStr}?ucs=1qeg127&sort=bestflight_a`
      
      window.location.href = url
    }, 2000)
  }

  return (
    <>
      <BookingModal isOpen={showModal} />
      
      <AnimatePresence>
        {selectedFlightId && !error && flights.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
          >
            <div className="relative group pointer-events-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                <Button
                    onClick={handleBookFlight}
                    size="lg"
                    className="relative h-14 pl-8 pr-6 rounded-full bg-black border border-white/10 text-white shadow-2xl hover:bg-black/80 cursor-pointer"
                >
                    <span className="flex items-center gap-3 text-lg font-medium">
                        Book Selected Flight
                        <span className="flex items-center justify-center bg-white/10 rounded-full h-8 w-8">
                            <ArrowRight className="h-4 w-4" />
                        </span>
                    </span>
                    
                    {/* Price Badge */}
                    <AnimatePresence>
                        {selectedFlight && (
                            <motion.span 
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="absolute -top-3 -right-3 flex h-8 min-w-[3rem] items-center justify-center rounded-full bg-blue-500 px-2 text-xs font-bold ring-4 ring-black"
                            >
                                ${selectedFlight.price}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
