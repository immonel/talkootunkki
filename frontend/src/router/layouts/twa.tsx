import { Outlet } from "react-router-dom";

const TWALayout = () => (
  <div className="
    flex min-h-screen flex-col items-center overflow-x-hidden
    bg-[--tg-theme-bg-color]
    text-[--tg-theme-text-color]
  ">
    <Outlet />
  </div>
)

export default TWALayout