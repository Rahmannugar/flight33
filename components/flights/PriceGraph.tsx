"use client"

import { useMemo } from "react"
import { useFlightStore } from "@/store/flightStore"
import { usePriceTrends } from "@/lib/hooks/usePriceTrends" // Need to ensure this export matches
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { cn } from "@/lib/utils"
import { TrendingUp, Loader2 } from "lucide-react"

export function PriceGraph({ className }: { className?: string }) {
  const { searchId } = useFlightStore()
  const { data: trendData, isLoading } = usePriceTrends(searchId || undefined)

  const chartData = useMemo(() => {
    if (!trendData || !trendData.length) return []
    // Assuming backend returns buckets or similar, if backend returns { min, max, ... } or buckets
    // The previous frontend mock logic did buckets. 
    // Backend `price-trends` route (which I should check content of) likely returns something particular.
    // Checking `price-trends.route.ts`... it returns buckets!
    
    // Backend Buckets Example: { hour: 0, minPrice: 200, count: 5 }
    // We map it to chart friendly format
     return trendData.map((b: any) => ({
        hour: `${b.hour.toString().padStart(2, '0')}:00`,
        price: b.minPrice || 0,
        hasData: b.count > 0
    })).filter((b: any) => b.hasData) 
  }, [trendData])

  if (!searchId) return null
  if (isLoading) return <div className={cn("h-[350px] w-full flex items-center justify-center rounded-xl border border-white/10 bg-white/5 backdrop-blur-md", className)}><Loader2 className="animate-spin text-blue-400" /></div>
  if (!chartData.length) return null

  return (
    <div className={cn("h-[350px] w-full rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-lg", className)}>
       <div className="flex items-center gap-2 mb-6">
           <TrendingUp className="h-5 w-5 text-blue-400" />
           <h3 className="font-semibold text-lg text-white">Price Trends</h3>
           <span className="text-xs text-muted-foreground ml-auto bg-white/5 px-2 py-1 rounded-full border border-white/10">By Departure Time</span>
       </div>
       
       <div className="h-[250px] w-full">
         <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
               <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
               <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
               <XAxis 
                  dataKey="hour" 
                  stroke="#ffffff50" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  minTickGap={30}
               />
               <YAxis 
                  stroke="#ffffff50" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(v) => `$${v}`} 
                  width={60}
               />
               <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #ffffff20', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
                  formatter={(value: any) => [`$${value}`, 'Min Price']}
                  cursor={{ stroke: '#ffffff20', strokeWidth: 2 }}
               />
               <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                  animationDuration={500}
               />
            </AreaChart>
         </ResponsiveContainer>
       </div>
    </div>
  )
}
