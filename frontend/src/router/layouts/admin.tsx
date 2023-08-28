import Navbar from "@components/common/Navbar"
import { Outlet } from "react-router-dom"

const AdminLayout = () => (
  <div className="flex min-h-screen flex-col overflow-x-hidden">
    <Navbar />
    <div className="mx-10">
      <Outlet />
    </div>
  </div>
)

export default AdminLayout