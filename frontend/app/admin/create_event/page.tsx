import React from "react"
import EventForm from "./EventForm"
import AdminPanelLink from "../AdminPanelLink"

const Page = () => (
  <main className="flex flex-col">
    <AdminPanelLink />
    <EventForm />
  </main>
)

export default Page