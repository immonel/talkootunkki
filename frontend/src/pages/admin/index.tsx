import EventList from "@components/admin/EventList"
import Stats from "@components/admin/Stats"
import Code from "@components/common/Code"

const AdminPage = () => (
  <main>
    <div className="flex flex-row justify-between">
      <div className="flex flex-col gap-3">
        <Stats />
        <a href='/admin/create_event'>
          <button className="bg-cs-orange hover:bg-amber-700 rounded-xl p-3">Create event</button>
        </a>
      </div>
      <Code />
    </div>
    <EventList />
  </main>
)

export default AdminPage