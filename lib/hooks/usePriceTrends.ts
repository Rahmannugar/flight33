import { useQuery } from "@tanstack/react-query"

export function usePriceTrends(searchId: string | undefined) {
  return useQuery({
    queryKey: ['price-trends', searchId],
    queryFn: async () => {
      if (!searchId) return null
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/flights/price-trends?searchId=${searchId}`)
      if (!res.ok) throw new Error('Failed to fetch price trends')
      return res.json()
    },
    enabled: !!searchId
  })
}
