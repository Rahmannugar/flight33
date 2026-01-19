"use client"

import * as React from "react"
import { useFlightStore } from "@/store/flightStore"
import { useFlights } from "@/lib/hooks/useFlights"
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
                "flex h-14 w-full items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-sm ring-offset-background transition-all duration-300 hover:bg-white/10 hover:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 focus:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50",
                !value && "text-white/40",
                value && "text-white font-medium"
            )}
        >
            <span className="flex items-center gap-3 truncate">
                <Calendar className="h-4 w-4 text-white/50" />
                {value || placeholder}
            </span>
        </button>
      )
  }

  return (
    <motion.form 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        onSubmit={handleSearch} 
        className={cn("flex flex-col gap-8 rounded-3xl border border-white/10 bg-black/20 p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden", className)}
    >
       {/* Glass Shine Effect */}
       <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />

       {/* Top Row: Locations */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-50">
          <LocationInput 
             label="Origin"
             value={searchParams.origin} 
             onChange={(v) => setSearchParams({ origin: v })} 
             placeholder="City or Airport"
             icon="departure"
          />
          <LocationInput 
             label="Destination"
             value={searchParams.destination} 
             onChange={(v) => setSearchParams({ destination: v })} 
             placeholder="City or Airport"
             icon="arrival"
          />
       </div>

       {/* Middle Row: Dates & Passengers */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            <div className="lg:col-span-1">
                <label className="mb-2 block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Departure</label>
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
                <label className="mb-2 block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Return</label>
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
            <div className="lg:col-span-2 grid grid-cols-2 gap-6">
                <div>
                     <label className="mb-2 block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Travelers</label>
                     <div className="h-14 flex items-center rounded-xl border border-white/5 bg-white/5 px-4 transition-all duration-300 hover:bg-white/10 hover:border-white/20 focus-within:bg-white/10 focus-within:ring-1 focus-within:ring-white/20">
                        <Users className="mr-3 h-4 w-4 text-white/50" />
                        <Select 
                            value={String(searchParams.adults)} 
                            onValueChange={(v) => setSearchParams({ adults: Number(v) })}
                        >
                            <SelectTrigger className="h-full border-0 bg-transparent p-0 focus:ring-0 text-sm font-medium text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0A0A0A] border-white/10 text-white">
                                {[1,2,3,4,5,6,7,8,9].map(n => (
                                    <SelectItem key={n} value={String(n)} className="focus:bg-white/10 focus:text-white cursor-pointer">{n} Adult{n > 1 ? 's' : ''}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                     </div>
                </div>

                <div>
                     <label className="mb-2 block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Class</label>
                     <div className="h-14 flex items-center rounded-xl border border-white/5 bg-white/5 px-4 transition-all duration-300 hover:bg-white/10 hover:border-white/20 focus-within:bg-white/10 focus-within:ring-1 focus-within:ring-white/20">
                        <Briefcase className="mr-3 h-4 w-4 text-white/50" />
                        <Select 
                            value={searchParams.travelClass} 
                            onValueChange={(v: any) => setSearchParams({ travelClass: v })}
                        >
                            <SelectTrigger className="h-full border-0 bg-transparent p-0 focus:ring-0 text-sm font-medium w-full text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0A0A0A] border-white/10 text-white">
                                <SelectItem value="ECONOMY" className="focus:bg-white/10 focus:text-white cursor-pointer">Economy</SelectItem>
                                <SelectItem value="PREMIUM_ECONOMY" className="focus:bg-white/10 focus:text-white cursor-pointer">Prem. Eco</SelectItem>
                                <SelectItem value="BUSINESS" className="focus:bg-white/10 focus:text-white cursor-pointer">Business</SelectItem>
                                <SelectItem value="FIRST" className="focus:bg-white/10 focus:text-white cursor-pointer">First</SelectItem>
                            </SelectContent>
                        </Select>
                     </div>
                </div>
            </div>
       </div>

       {/* Submit */}
       <div className="pt-2 relative z-10">
            <Button 
                size="lg" 
                type="submit" 
                disabled={isPending}
                className="h-14 w-full cursor-pointer rounded-xl bg-white text-black text-lg font-bold tracking-tight shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.01] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isPending ? (
                    <span className="flex items-center gap-2">
                         <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                         Searching...
                    </span>
                ) : (
                    <>
                        <Search className="mr-2 h-5 w-5" />
                        Find Flights
                    </>
                )}
            </Button>
       </div>
    </motion.form>
  )
}
