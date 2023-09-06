import EventList from "@components/admin/EventList"
import Stats from "@components/admin/Stats"
import Code from "@components/common/Code"
import { useNavigate } from "react-router-dom"

const AdminPage = () => {
  const navigate = useNavigate()

  return (
    <main>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col gap-3">
          <Stats />
          <button
            onClick={() => navigate('/admin/create_event')}
            className="bg-cs-orange hover:bg-amber-700 rounded-xl p-3"
          >
            Create event
          </button>
        </div>
        <Code />
      </div>
      <EventList />
    </main>
  )
}

export default AdminPage