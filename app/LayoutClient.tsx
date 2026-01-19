"use client"

import { appStore } from "@/lib/store/appStore"
import { LoadingScreen } from "@/components/layout/Loader"
import { useState, useEffect } from "react"

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const booting = appStore((s) => s.booting)
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    if (!booting) {
      const t = setTimeout(() => setShowLoader(false), 1000)
      return () => clearTimeout(t)
    }
  }, [booting])

  return (
    <>
      {showLoader && (
        <div 
          className={`fixed inset-0 z-[9999] transition-opacity duration-1000 ease-in-out ${
            booting ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <LoadingScreen />
        </div>
      )}
      <div className={`${booting ? "overflow-hidden h-screen" : ""}`}>
         {children}
      </div>
    </>
  )
}
