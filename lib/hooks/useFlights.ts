import { useMutation } from "@tanstack/react-query"
import { useFlightStore } from "@/store/useFlightStore" // We will move this later or keep usage if we just rename file
import { FlightSearchParams } from "@/types"

export function useFlights() {
  const { setSearchResults, setError, setLoading } = useFlightStore()

  return useMutation({
    mutationFn: async (params: FlightSearchParams) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/flights/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      })
      
      if (!res.ok) throw new Error('Search failed')
      return res.json()
    },
    onMutate: () => {
      setLoading(true)
      setError(null)
    },
    onSuccess: (data) => {
      setSearchResults(data)
    },
    onError: (error) => {
      setError(error.message)
    },
    onSettled: () => {
      setLoading(false)
    }
  })
}
