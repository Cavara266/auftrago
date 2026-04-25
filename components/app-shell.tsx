"use client"

import Link from "next/link"
import { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export default function AppShell({ children }: Props) {

  return (

<div className="min-h-screen bg-app">

{/* NAV */}

<header className="border-b border-white/10">

<div className="container-app py-4 flex items-center justify-between">

<Link
href="/"
className="text-white font-bold text-lg"
>
Auftrago
</Link>

<nav className="flex gap-6">

<Link href="/dashboard" className="nav-link">
Dashboard
</Link>

<Link href="/leads" className="nav-link">
Leads
</Link>

<Link href="/anbieter" className="nav-link">
Anbieter
</Link>

</nav>

</div>

</header>


{/* CONTENT */}

<main className="container-app py-10">

{children}

</main>

</div>

  )
}