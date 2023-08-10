import React from "react"
import EventForm from "./EventForm"

const Page = () => (
  <main className="flex flex-col">
    <a href="/admin" className="flex items-center gap-3">
      <i className="bi-arrow-left text-2xl" />
      <h1>Admin panel</h1>
    </a>
    <EventForm />
  </main>
)

export default Page