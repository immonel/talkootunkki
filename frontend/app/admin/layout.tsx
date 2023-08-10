import React from "react"
import Navbar from "./Navbar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col overflow-x-hidden">
        <Navbar />
        <div className="mx-10">
          {children}
        </div>
      </body>
    </html>
  )
}
