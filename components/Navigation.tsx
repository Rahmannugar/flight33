"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Plane } from "lucide-react"
import clsx from "clsx"

const items = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Flights",
    href: "/flights",
    icon: Plane,
  },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/90 backdrop-blur md:hidden">
      <ul className="flex h-16 items-center justify-around">
        {items.map(({ href, label, icon: Icon }) => {
         const active = pathname === href || pathname.startsWith(`${href}/`)

          return (
            <li key={href}>
              <Link
                href={href}
                className={clsx(
                  "flex flex-col items-center gap-1 text-xs transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
