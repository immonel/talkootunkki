import React from "react"
import AdminPanelLink from "../../AdminPanelLink"
import Event from "../Event"

type PageProps = {
  params: {
    event_id: string
  }
}

const Page = ({ params }: PageProps) => {
  const { event_id } = params

  return (
    <main className='flex flex-col min-h-screen'>
      <AdminPanelLink />
      <Event event_id={event_id} />
    </main>
  )
}

export default Page