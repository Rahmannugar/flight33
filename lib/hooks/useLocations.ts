import { useQuery } from "@tanstack/react-query"
import { useDebounce } from "./useDebounce"

interface Location {
  name: string
  iataCode: string
  address: {
    cityName: string
    countryName: string
  }
}

export function useLocations(query: string) {
  const debouncedQuery = useDebounce(query, 300)

  return useQuery({
    queryKey: ['locations', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) return []
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/locations?keyword=${debouncedQuery}`)
        if (!res.ok) return []
        return res.json() as Promise<Location[]>
      } catch (e) {
        return []
      }
    },
    enabled: debouncedQuery.length >= 2,
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}
