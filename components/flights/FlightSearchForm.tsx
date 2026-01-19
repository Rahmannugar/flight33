"use client"

import * as React from "react"
import { useFlightStore } from "@/store/useFlightStore"
import { useFlights } from "@/lib/hooks/useFlights" // New hook
import { LocationInput } from "./LocationInput"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Users, Briefcase, Calendar } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import ByteDatePicker from "byte-datepicker"
import "byte-datepicker/styles.css"

export function FlightSearchForm({ className }: { className?: string }) {
  const { searchParams, setSearchParams } = useFlightStore()
  const { mutate: searchFlights, isPending } = useFlights()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
        toast.error("Please fill in all required fields")
        return
    }

searchFlights(searchParams)
  }

  const handleDateChange = (date: Date | null, field: 'departureDate' | 'returnDate') => {
      if (!date) {
            setSearchParams({ [field]: '' })
            return
      }
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      setSearchParams({ [field]: `${year}-${month}-${day}` })
  }

  const CustomDateInput = ({ open, value, placeholder, label }: any) => {
      return (
        <button 
            type="button" 
            onClick={open}
            className={cn(
                "flex h-14 w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm ring-offset-background transition-all hover:bg-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
                !value && "text-muted-foreground/50",
                value && "text-white font-medium"
            )}
        >
            <span className="flex items-center gap-2 truncate">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {value || placeholder}
            </span>
        </button>
      )
  }

  return (
    <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onSubmit={handleSearch} 
        className={cn("flex flex-col gap-6 rounded-2xl border border-white/10 bg-[#0A0A0A]/80 p-6 backdrop-blur-xl shadow-2xl", className)}
    >
       
       {/* Top Row: Locations */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <LocationInput 
             label="Origin"
             value={searchParams.origin} 
             onChange={(v) => setSearchParams({ origin: v })} 
             placeholder="Where from?"
             icon="departure"
          />
          <LocationInput 
             label="Destination"
             value={searchParams.destination} 
             onChange={(v) => setSearchParams({ destination: v })} 
             placeholder="Where to?"
             icon="arrival"
          />
       </div>

       {/* Middle Row: Dates & Passengers */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-1">
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1">Departure</label>
                <div className="relative z-20">
                    <ByteDatePicker
                        value={searchParams.departureDate ? new Date(searchParams.departureDate) : null}
                        onChange={(d: any) => handleDateChange(d as Date | null, 'departureDate')}
                        placeholder="Select Date"
                        formatString="yyyy-mm-dd"
                        minDate={new Date()}
                        includeDays
                        hideInput
                    >
                        {(props: any) => <CustomDateInput {...props} value={searchParams.departureDate || ""} placeholder="Select Date" />}
                    </ByteDatePicker>
                </div>
            </div>

            <div className="lg:col-span-1">
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1">Return (Optional)</label>
                <div className="relative z-20">
                     <ByteDatePicker
                        value={searchParams.returnDate ? new Date(searchParams.returnDate) : null}
                        onChange={(d: any) => handleDateChange(d as Date | null, 'returnDate')}
                        placeholder="Return Date"
                        formatString="yyyy-mm-dd"
                        includeDays
                        minDate={searchParams.departureDate ? new Date(searchParams.departureDate) : new Date()}
                        hideInput
                    >
                         {(props: any) => <CustomDateInput {...props} value={searchParams.returnDate || ""} placeholder="One way" />}
                    </ByteDatePicker>
                </div>
            </div>

            {/* Travelers & Class */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                <div>
                     <label className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1">Travelers</label>
                     <div className="h-14 flex items-center rounded-xl border border-white/10 bg-white/5 px-3 hover:bg-white/10 transition-colors">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Select 
                            value={String(searchParams.adults)} 
                            onValueChange={(v) => setSearchParams({ adults: Number(v) })}
                        >
                            <SelectTrigger className="h-full border-0 bg-transparent p-0 focus:ring-0 text-sm font-medium">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[1,2,3,4,5,6,7,8,9].map(n => (
                                    <SelectItem key={n} value={String(n)}>{n} Adult{n > 1 ? 's' : ''}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                     </div>
                </div>

                <div>
                     <label className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1">Class</label>
                     <div className="h-14 flex items-center rounded-xl border border-white/10 bg-white/5 px-3 hover:bg-white/10 transition-colors">
                        <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Select 
                            value={searchParams.travelClass} 
                            onValueChange={(v: any) => setSearchParams({ travelClass: v })}
                        >
                            <SelectTrigger className="h-full border-0 bg-transparent p-0 focus:ring-0 text-sm font-medium w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ECONOMY">Economy</SelectItem>
                                <SelectItem value="PREMIUM_ECONOMY">Prem. Eco</SelectItem>
                                <SelectItem value="BUSINESS">Business</SelectItem>
                                <SelectItem value="FIRST">First</SelectItem>
                            </SelectContent>
                        </Select>
                     </div>
                </div>
            </div>
       </div>

       {/* Submit */}
       <div className="pt-2">
            <Button 
                size="lg" 
                type="submit" 
                disabled={isPending}
                className="h-14 w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-lg font-semibold shadow-xl shadow-blue-500/20 hover:from-blue-500 hover:to-blue-400 transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isPending ? (
                    <span className="flex items-center gap-2">
                         <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                         Searching...
                    </span>
                ) : (
                    <>
                        <Search className="mr-2 h-5 w-5" />
                        Find Best Flights
                    </>
                )}
            </Button>
       </div>
    </motion.form>
  )
}
