import { useMemo } from "react"
import { flightStore } from "@/lib/store/flightStore"

export function usePriceTrends() {
  const { filteredFlights } = flightStore()
  
  const chartData = useMemo(() => {
    if (!filteredFlights || !filteredFlights.length) return []

    // Initialize 24 hourly buckets
    const hourlyGroups: number[][] = Array.from({ length: 24 }, () => [])

    filteredFlights.forEach(flight => {
        const firstSegment = flight.segments[0]
        const date = new Date(firstSegment.departureTime)
        const hour = date.getHours()
        if (hour >= 0 && hour < 24) {
            hourlyGroups[hour].push(flight.price)
        }
    })

    return hourlyGroups.map((prices, hour) => {
        if (!prices.length) return null
        const minPrice = Math.min(...prices)
        return {
            hour: `${hour.toString().padStart(2, '0')}:00`,
            price: minPrice,
            count: prices.length
        }
    }).filter(Boolean)
  }, [filteredFlights])

  return { chartData }
}
