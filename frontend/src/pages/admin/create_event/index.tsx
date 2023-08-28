import AdminPanelLink from "@components/admin/AdminPanelLink"
import EventForm from "@components/admin/EventForm"

const CreateEventPage = () => (
  <main className="flex flex-col">
    <AdminPanelLink />
    <EventForm />
  </main>
)

export default CreateEventPage