"use client"

import { Header } from "@/components/layout/Header"
import { Navigation } from "@/components/layout/Navigation"
import { FlightSearchForm } from "@/components/flights/FlightSearchForm"
import { FlightCard } from "@/components/flights/FlightCard"
import { FilterSidebar } from "@/components/flights/FilterSidebar"
import { PriceGraph } from "@/components/flights/PriceGraph"
import { flightStore } from "@/lib/store/flightStore"
import { Loader2, Filter } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import Dither from "@/components/ui/Dither"

export default function FlightsPage() {
  const { filteredFlights, isLoading, error, flights, currentPage, itemsPerPage, setCurrentPage } = flightStore()

   // Pagination Logic
   const totalItems = filteredFlights.length
   const totalPages = Math.ceil(totalItems / itemsPerPage)
   const startIndex = (currentPage - 1) * itemsPerPage
   const endIndex = startIndex + itemsPerPage
   const paginatedFlights = filteredFlights.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0 relative">
       <div className="fixed inset-0 z-0">
    <Dither
    waveColor={[0,0.5,0.5]}
    disableAnimation={false}
    enableMouseInteraction
    mouseRadius={0.3}
    colorNum={40}
    waveAmplitude={0.3}
    waveFrequency={3}
    waveSpeed={0.05}
  />
       </div>
       <Header />
       <main className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500 relative z-10">
           <div className="mb-8">
               <h1 className="text-3xl font-bold text-white mb-6">Find your perfect flight</h1>
               <FlightSearchForm />
           </div>

           {isLoading && (
               <div className="flex flex-col items-center justify-center py-20 w-full">
                   <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
                   <p className="text-muted-foreground">Searching best flights for you...</p>
               </div>
           )}

            {error && (
                <div className="mx-auto mt-8 w-full max-w-2xl rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-center text-red-500 backdrop-blur-sm">
                    {error}
                </div>
            )}

           {!isLoading && flights.length > 0 && (
               <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                   <div className="lg:col-span-1 hidden lg:block h-full">
                       <FilterSidebar className="sticky top-24" />
                   </div>
                   
                   <div className="lg:col-span-3 space-y-6">
                       {/* Price Graph */}
                       {flights.length > 0 && (
                           <div className="mb-8 animate-in slide-in-from-bottom-5 duration-500 delay-100">
                               <PriceGraph />
                           </div>
                       )}
                       
                       {/* Error */}

                       {/* Results */}
                       {!isLoading && filteredFlights.length > 0 && (
                           <div className="flex-1">
                               <div className="mb-6 flex items-center justify-between">
                                   <h2 className="text-lg font-semibold text-white">
                                       {filteredFlights.length} Flights Found
                                       {filteredFlights.length > 0 && <span className="text-sm font-normal text-muted-foreground ml-2">(Showing {startIndex + 1}-{Math.min(endIndex, totalItems)})</span>}
                                   </h2>
                                    {/* Mobile Filter Toggle */}
                                    <div className="lg:hidden">
                                        <Sheet>
                                            <SheetTrigger asChild>
                                                <Button variant="outline" size="sm" className="border-white/10 bg-white/5 hover:bg-white/10">
                                                    <Filter className="mr-2 h-4 w-4" /> Filters
                                                </Button>
                                            </SheetTrigger>
                                            <SheetContent side="left" className="w-full sm:max-w-[350px] border-r border-white/10 bg-[#000000] p-0 pt-12 overflow-y-auto">
                                                <div className="px-6"> 
                                                    <FilterSidebar />
                                                </div>
                                            </SheetContent>
                                        </Sheet>
                                   </div>
                               </div>

                               <div className="space-y-4">
                                   {paginatedFlights.map((flight, i) => (
                                       <FlightCard key={flight.id} flight={flight} index={i} />
                                   ))}
                               </div>

                               {/* Pagination Controls */}
                               {totalPages > 1 && (
                                   <div className="mt-8">
                                       <Pagination>
                                           <PaginationContent>
                                               <PaginationItem>
                                                   <PaginationPrevious 
                                                       className="cursor-pointer"
                                                       onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                       aria-disabled={currentPage === 1}
                                                   />
                                               </PaginationItem>
                                               
                                               {Array.from({ length: totalPages }).map((_, i) => (
                                                   <PaginationItem key={i}>
                                                       <PaginationLink 
                                                           className="cursor-pointer"
                                                           isActive={currentPage === i + 1}
                                                           onClick={() => setCurrentPage(i + 1)}
                                                       >
                                                           {i + 1}
                                                       </PaginationLink>
                                                   </PaginationItem>
                                               ))}

                                               <PaginationItem>
                                                   <PaginationNext 
                                                       className="cursor-pointer"
                                                       onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                                       aria-disabled={currentPage === totalPages}
                                                   />
                                               </PaginationItem>
                                           </PaginationContent>
                                       </Pagination>
                                   </div>
                               )}
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
