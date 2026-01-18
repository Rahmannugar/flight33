import { Header } from "@/components/Header"
import { Navigation } from "@/components/Navigation"

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-16 pb-24">
        <h1 className="text-3xl font-semibold">
          Discover flight prices intelligently
        </h1>
      </main>
      <Navigation />
    </>
  )
}
