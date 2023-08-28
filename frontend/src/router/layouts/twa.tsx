import { Outlet } from "react-router-dom";

const TWALayout = () => (
  <div className="flex min-h-screen flex-col items-center overflow-x-hidden">
    <Outlet />
  </div>
)

export default TWALayout