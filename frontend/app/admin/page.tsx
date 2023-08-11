import React from "react"
import Link from "next/link"
import EventList from "./EventList"
import Code from "../code/Code"

const Page = () => (
  <main>
    <div className="flex flex-row justify-between">
      <Link href='/admin/create_event'>
        <button className="bg-cs-orange hover:bg-amber-700 rounded-xl p-3">Create event</button>
      </Link>
      <Code />
    </div>
    <EventList />
  </main>
)

export default Page