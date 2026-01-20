"use client"

import { Flight } from "@/types"
import { Button } from "@/components/ui/button"
import { Plane, Check, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { flightStore } from "@/lib/store/flightStore"
import { motion } from "framer-motion"

export function FlightCard({ flight, index }: { flight: Flight; index: number }) {
  const { selectedFlightId, setSelectedFlight } = flightStore()
  const firstSegment = flight.segments[0]
  const lastSegment = flight.segments[flight.segments.length - 1]
  
  const isSelected = selectedFlightId === flight.id

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDuration = (min: number) => {
    const h = Math.floor(min / 60)
    const m = min % 60
    return `${h}h ${m}m`
  }

  const handleSelect = () => {
      if (isSelected) {
          setSelectedFlight(null)
      } else {
          setSelectedFlight(flight.id)
      }
  }

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
        className={cn(
            "group relative overflow-hidden rounded-xl border p-6 backdrop-blur-md transition-all",
            isSelected 
                ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10" 
                : "border-white/10 bg-white/5 hover:bg-white/10 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-500/30"
        )}
    >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Airline Info */}
            <div className="flex items-center gap-4 min-w-[180px]">
                 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Plane className="h-5 w-5" />
                 </div>
                 <div>
                    <h3 className="font-medium text-lg text-white">Airline - {flight.airline.code}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-white/5 border border-white/10", 
                            flight.stops === 0 ? "text-green-400 border-green-400/20 bg-green-400/10" : "text-amber-400 border-amber-400/20 bg-amber-400/10")}>
                           {flight.stops === 0 ? "Non-stop" : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
                        </span>
                    </div>
                 </div>
            </div>

            {/* Flight Times */}
            <div className="flex flex-1 items-center justify-center gap-4 px-4 sm:gap-8 bg-black/20 rounded-lg py-2 mx-2">
                 <div className="text-center">
                    <p className="text-2xl font-bold text-white tracking-tight">{formatTime(firstSegment.departureTime)}</p>
                    <p className="text-sm text-muted-foreground font-mono">{firstSegment.from}</p>
                 </div>
                 
                 <div className="flex flex-col items-center gap-1 w-full max-w-[120px]">
                    <p className="text-xs text-muted-foreground">{formatDuration(flight.durationMinutes)}</p>
                    <div className="relative flex w-full items-center">
                        <div className="h-[1px] w-full bg-white/20"></div>
                        <ArrowRight className="absolute right-0 h-3 w-3 text-white/50" />
                        {flight.stops > 0 && (
                            <div className="absolute left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-white/20"></div>
                        )}
                    </div>
                 </div>

                 <div className="text-center">
                    <p className="text-2xl font-bold text-white tracking-tight">{formatTime(lastSegment.arrivalTime)}</p>
                    <p className="text-sm text-muted-foreground font-mono">{lastSegment.to}</p>
                 </div>
            </div>

            {/* Price & Action */}
            <div className="flex flex-col items-center gap-3 sm:items-end min-w-[120px]">
                <div className="text-center sm:text-right">
                    <p className="text-3xl font-bold text-blue-400">${flight.price}</p>
                    <p className="text-xs text-muted-foreground">per adult</p>
                </div>
                <Button 
                    onClick={handleSelect}
                    className={cn(
                        "w-full sm:w-auto rounded-full px-6 cursor-pointer transition-all", 
                        isSelected 
                            ? "bg-blue-600 hover:bg-blue-700 text-white" 
                            : "bg-white text-black hover:bg-white/90"
                    )}
                >
                    {isSelected ? (
                        <>
                            <Check className="mr-2 h-4 w-4" />
                            Selected
                        </>
                    ) : "Select"}
                </Button>
            </div>
        </div>
    </motion.div>
  )
}
