"use client"

import { Header } from "@/components/layout/Header"
import { Navigation } from "@/components/layout/Navigation"
import { FlightSearchForm } from "@/components/flights/FlightSearchForm"
import { FlightCard } from "@/components/flights/FlightCard"
import { FilterSidebar } from "@/components/flights/FilterSidebar"
import { PriceGraph } from "@/components/flights/PriceGraph"
import { useFlightStore } from "@/store/useFlightStore"
import { Loader2, Filter } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"


export default function FlightsPage() {
  const { filteredFlights, isLoading, error, flights } = useFlightStore()

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
       <Header />
       <main className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">
           <div className="mb-8">
               <h1 className="text-3xl font-bold text-white mb-6">Find your perfect flight</h1>
               <FlightSearchForm />
           </div>

           {(isLoading || flights.length > 0 || error) && (
               <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                   <div className="lg:col-span-1 hidden lg:block h-full">
                       <FilterSidebar className="sticky top-24" />
                   </div>
                   
                   <div className="lg:col-span-3 space-y-6">
                       {/* Price Graph */}
                       {!isLoading && flights.length > 0 && (
                           <div className="mb-8 animate-in slide-in-from-bottom-5 duration-500 delay-100">
                               <PriceGraph />
                           </div>
                       )}

                       {/* Loading */}
                       {isLoading && (
                           <div className="flex flex-col items-center justify-center py-20">
                               <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
                               <p className="text-muted-foreground">Searching best flights for you...</p>
                           </div>
                       )}
                       
                       {/* Error */}
                       {error && (
                           <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-500 text-center">
                               {error}
                           </div>
                       )}

                       {/* Results */}
                       {!isLoading && filteredFlights.length > 0 && (
                           <div className="space-y-4">
                               <div className="flex items-center justify-between pb-2">
                                   <h2 className="text-lg font-semibold text-white">
                                       {filteredFlights.length} Flights Found
                                   </h2>
                                   
                                   {/* Mobile Filter Toggle */}
                                   <div className="lg:hidden">
                                        <Sheet>
                                            <SheetTrigger asChild>
                                                <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10">
                                                    <Filter className="mr-2 h-4 w-4" /> Filters
                                                </Button>
                                            </SheetTrigger>
                                            <SheetContent side="left" className="w-[85vw] sm:w-[350px] border-r border-white/10 bg-[#0a0a0a] pt-12 overflow-y-auto">
                                                <FilterSidebar />
                                            </SheetContent>
                                        </Sheet>
                                   </div>
                               </div>
                               <div className="space-y-4">

                                   {filteredFlights.map((flight, i) => (
                                       <div key={flight.id} className="animate-in slide-in-from-bottom-5 duration-500" style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}>
                                           <FlightCard flight={flight} />
                                       </div>
                                   ))}
                               </div>
                           </div>
                       )}

                        {!isLoading && flights.length > 0 && filteredFlights.length === 0 && (
                           <div className="text-center py-10 text-muted-foreground bg-white/5 rounded-xl border border-white/10">
                               No flights match your filters. Try adjusting them.
                           </div>
                       )}
                   </div>
               </div>
           )}
       </main>
       <Navigation />
    </div>
  )
}
