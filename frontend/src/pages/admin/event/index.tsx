import AdminPanelLink from "@components/admin/AdminPanelLink"
import AdminEventInfo from "@components/event/AdminEventInfo"
import { useParams } from "react-router-dom"

const EventAdminPage = () => {
  const { event_id } = useParams()

  return (
    <main className='flex flex-col min-h-screen'>
      <AdminPanelLink />
      { event_id && <AdminEventInfo event_id={event_id} /> }
    </main>
  )
}

export default EventAdminPage