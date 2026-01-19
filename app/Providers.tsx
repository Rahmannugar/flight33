"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/lib/queryClient"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "next-themes"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster richColors />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
