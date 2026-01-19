import { create } from 'zustand'
import { Flight, FlightSearchParams, FlightSearchResult } from '@/types'

interface FilterState {
  maxPrice: number | null
  stops: number[] // 0, 1, 2+
  airlines: string[]
}

interface FlightState {
  searchParams: FlightSearchParams
  flights: Flight[] // Raw
  filteredFlights: Flight[] // Displayed
  isLoading: boolean
  error: string | null
  filters: FilterState
  
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

export const useFlightStore = create<FlightState>((set, get) => ({
  searchParams: defaultParams,
  flights: [],
  filteredFlights: [],
  isLoading: false,
  error: null,
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
      priceRange: [minPrice, maxPrice],
      error: null,
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
      
      // Apply filters immediately
      let result = state.flights

      if (updatedFilters.maxPrice !== null) {
        result = result.filter(f => f.price <= updatedFilters.maxPrice!)
      }

      if (updatedFilters.stops.length > 0) {
        // Simple logic forstops: if list includes the stop count, keep it. 
        // 2 means 2 or more technically in many UIs, but here exact match unless specified.
        result = result.filter(f => updatedFilters.stops.includes(f.stops))
      }

      if (updatedFilters.airlines.length > 0) {
        result = result.filter(f => updatedFilters.airlines.includes(f.airline.name))
      }

      return { filters: updatedFilters, filteredFlights: result }
    })
  },

  resetFilters: () => {
    const { flights, priceRange } = get()
    set({
        filters: { maxPrice: priceRange[1], stops: [], airlines: [] },
        filteredFlights: flights
    })
  }
}))
