import React from "react"
import Event from "../Event"

type PageProps = {
  params: {
    event_id: string
  }
}

const Page = ({ params }: PageProps) => {
  const { event_id } = params

  return (
    <main>
      <Event event_id={event_id} />
    </main>
  )
}

export default Page