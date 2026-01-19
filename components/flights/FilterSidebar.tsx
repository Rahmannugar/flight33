"use client"

import * as React from "react"
import { useFlightStore } from "@/store/flightStore"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { RefreshCw, Filter } from "lucide-react"

export function FilterSidebar({ className }: { className?: string }) {
  const { filters, priceRange, uniqueAirlines, setFilters, resetFilters } = useFlightStore()
  
  // Don't show if max price is 0 (initial state)
  if (priceRange[1] === 0) return null

  return (
    <div className={cn("space-y-8 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md h-fit", className)}>
        <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                <Filter className="h-4 w-4 text-blue-400" />
                Filters
            </h3>
            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 cursor-pointer px-2 text-xs hover:bg-white/10 hover:text-white text-muted-foreground">
                <RefreshCw className="mr-2 h-3 w-3" />
                Reset
            </Button>
        </div>

        {/* Price Filter */}
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">Max Price</span>
                <span className="text-sm text-blue-400 font-mono font-bold">${filters.maxPrice ?? priceRange[1]}</span>
            </div>
            <div className="relative h-6 flex items-center">
                <input 
                    type="range" 
                    min={priceRange[0]} 
                    max={priceRange[1]} 
                    step={10}
                    value={filters.maxPrice ?? priceRange[1]}
                    onChange={(e) => setFilters({ maxPrice: Number(e.target.value) })}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:bg-white/20 transition-colors"
                />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
            </div>
        </div>

        <div className="h-px bg-white/10" />

        {/* Stops */}
        <div className="space-y-4">
            <span className="text-sm font-medium text-white block">Stops</span>
            <div className="space-y-3">
                {[0, 1, 2].map(stop => (
                    <label key={stop} className="flex items-center space-x-3 cursor-pointer group select-none">
                        <div className="relative flex items-center">
                            <input 
                                type="checkbox"
                                checked={filters.stops.includes(stop)}
                                onChange={(e) => {
                                    const newStops = e.target.checked 
                                      ? [...filters.stops, stop]
                                      : filters.stops.filter(s => s !== stop)
                                    setFilters({ stops: newStops })
                                }}
                                className="peer appearance-none h-5 w-5 rounded border border-white/20 bg-white/5 checked:bg-blue-600 checked:border-blue-600 focus:ring-0 transition-all"
                            />
                            <svg className="absolute w-3.5 h-3.5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 peer-checked:opacity-100 text-white transition-opacity" viewBox="0 0 14 14" fill="none">
                                <path d="M3 8L6 11L11 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">
                            {stop === 0 ? "Non-stop" : `${stop} Stop${stop > 1 ? '+' : ''}`}
                        </span>
                    </label>
                ))}
            </div>
        </div>

        <div className="h-px bg-white/10" />

        {/* Airlines */}

    </div>
  )
}
