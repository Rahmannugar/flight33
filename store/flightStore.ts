import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Flight, FlightSearchParams, FlightSearchResult } from '@/types'

interface FilterState {
  maxPrice: number | null
  stops: number[]
  airlines: string[]
}

interface FlightState {
  searchParams: FlightSearchParams
  flights: Flight[]
  filteredFlights: Flight[]
  isLoading: boolean
  error: string | null
  searchId: string | null
  filters: FilterState
  
  currentPage: number
  itemsPerPage: number
  setCurrentPage: (page: number) => void

  selectedFlightId: string | null
  setSelectedFlight: (id: string | null) => void
  
  setSearchParams: (params: Partial<FlightSearchParams>) => void
  setSearchResults: (results: FlightSearchResult) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  setFilters: (filters: Partial<FilterState>) => void
  resetFilters: () => void
  uniqueAirlines: string[]
  priceRange: [number, number]
}

const defaultParams: FlightSearchParams = {
  origin: '',
  destination: '',
  departureDate: '',
  adults: 1,
  travelClass: 'ECONOMY'
}

export const useFlightStore = create<FlightState>()(
  persist(
    (set, get) => ({
      searchParams: defaultParams,
      flights: [],
      filteredFlights: [],
      isLoading: false,
      error: null,
      searchId: null,
      
      currentPage: 1,
      itemsPerPage: 10,
      setCurrentPage: (page) => set({ currentPage: page }),

      selectedFlightId: null,
      setSelectedFlight: (id) => set({ selectedFlightId: id }),

      filters: {
        maxPrice: null,
        stops: [],
        airlines: []
      },
      
      uniqueAirlines: [],
      priceRange: [0, 0],

      setSearchParams: (params) => 
        set((state) => ({ searchParams: { ...state.searchParams, ...params } })),

      setSearchResults: (data) => {
        const prices = data.flights.map(f => f.price)
        const minPrice = prices.length ? Math.min(...prices) : 0
        const maxPrice = prices.length ? Math.max(...prices) : 1000
        const airlines = Array.from(new Set(data.flights.map(f => f.airline.name)))
        
        set({
          flights: data.flights,
          filteredFlights: data.flights,
          uniqueAirlines: airlines,
          searchId: data.meta.searchId,
          priceRange: [minPrice, maxPrice],
          error: null,
          currentPage: 1, // Reset page on new search
          filters: {
            maxPrice: maxPrice,
            stops: [],
            airlines: []
          }
        })
      },

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      setFilters: (newFilters) => {
        set((state) => {
          const updatedFilters = { ...state.filters, ...newFilters }
          
          
          let result = state.flights

          if (updatedFilters.maxPrice !== null) {
            result = result.filter(f => f.price <= updatedFilters.maxPrice!)
          }

          if (updatedFilters.stops.length > 0) {
            result = result.filter(f => updatedFilters.stops.includes(f.stops))
          }

          if (updatedFilters.airlines.length > 0) {
             result = result.filter(f => updatedFilters.airlines.includes(f.airline.name))
          }

          return { filters: updatedFilters, filteredFlights: result, currentPage: 1 }
        })
      },

      resetFilters: () => {
        const { flights, priceRange } = get()
        set({
            filters: { maxPrice: priceRange[1], stops: [], airlines: [] },
            filteredFlights: flights,
            currentPage: 1
        })
      }
    }),
    {
      name: 'flight-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ selectedFlightId: state.selectedFlightId, searchParams: state.searchParams }),
    }
  )
)
