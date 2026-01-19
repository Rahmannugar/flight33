"use client"

import * as React from "react"
import { useLocations } from "@/lib/hooks/useLocations"
import { Input } from "@/components/ui/input"
import { MapPin, Loader2, PlaneTakeoff, PlaneLanding, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Location {
  name: string
  iataCode: string
  address: {
    cityName: string
    countryName: string
  }
}

interface LocationInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  icon?: "departure" | "arrival"
}

export function LocationInput({ label, value, onChange, placeholder, className, icon }: LocationInputProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [focused, setFocused] = React.useState(false)

  const { data: locations, isLoading } = useLocations(value)

  const handleSelect = (loc: Location) => {
    onChange(loc.iataCode) 
    setIsOpen(false)
    setFocused(false)
  }

  const handleBlur = () => {
    setTimeout(() => {
        setFocused(false)
        setIsOpen(false)
    }, 200)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        e.preventDefault()
        if (locations && locations.length > 0) {
            handleSelect(locations[0])
        } else {
             setIsOpen(false)
        }
    }
  }

  const clearInput = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange("")
  }

  const Icon = icon === "arrival" ? PlaneLanding : icon === "departure" ? PlaneTakeoff : MapPin

  return (
    <div className={cn("relative w-full group", className)}>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-hover:text-blue-400 group-focus-within:text-blue-400">
          <Icon className="h-4 w-4" />
        </div>
        <Input 
            value={value}
            onChange={(e) => {
                onChange(e.target.value)
                setIsOpen(true)
            }}
            onFocus={() => {
                setFocused(true)
                if (value.length >= 2) setIsOpen(true)
            }}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="pl-10 pr-10 h-14 bg-white/5 border-white/10 backdrop-blur-md focus-visible:ring-blue-500/50 transition-all hover:bg-white/10 hover:border-white/20 text-base font-semibold placeholder:font-normal placeholder:text-muted-foreground/40"
            autoComplete="off"
        />
        
        {value && !isLoading && (
            <button 
                type="button"
                onClick={clearInput} 
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted-foreground/50 hover:text-white hover:bg-white/20 transition-all"
            >
                <X className="h-3 w-3" />
            </button>
        )}
        
        {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent p-1">
                <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
            </div>
        )}
      </div>

      {isOpen && locations && locations.length > 0 && (focused || isOpen) && (
        <div className="absolute z-50 mt-2 w-full min-w-[300px] rounded-xl border border-white/10 bg-[#0A0A0A]/95 p-1.5 text-popover-foreground shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100 max-h-[320px] overflow-y-auto custom-scrollbar ring-1 ring-white/5">
           {locations.map((loc, i) => (
             <button
                key={`${loc.iataCode}-${loc.name}`}
                type="button"
                className={cn(
                    "flex w-full items-start gap-4 rounded-lg px-4 py-3 text-sm hover:bg-white/10 text-left transition-colors group/item",
                    i === 0 && "bg-white/5" 
                )}
                onMouseDown={(e) => {
                    e.preventDefault() // Prevents focus loss
                    handleSelect(loc)
                }}
             >
                <div className="mt-0.5 rounded-full bg-white/5 p-2 text-muted-foreground group-hover/item:text-blue-400 group-hover/item:bg-blue-400/10 transition-colors">
                    <PlaneTakeoff className="h-4 w-4" />
                </div>
                <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-white truncate text-base">{loc.address.cityName}</span>
                        <span className="ml-2 bg-blue-500/10 px-2 py-0.5 rounded text-xs font-bold text-blue-400 font-mono tracking-wide">{loc.iataCode}</span>
                    </div>
                    <span className="text-xs text-muted-foreground truncate block mt-0.5 group-hover/item:text-white/70">{loc.name}, {loc.address.countryName}</span>
                </div>
             </button>
           ))}
        </div>
      )}
    </div>
  )
}

