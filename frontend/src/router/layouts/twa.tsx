import BackButton from "@components/twa/BackButton";
import { Outlet, useLocation } from "react-router-dom";

const TWALayout = () => {
  const location = useLocation()
  const backButtonVisible = location.pathname !== '/twa'

  return (
    <div className="
      flex min-h-screen flex-col items-center overflow-x-hidden
      bg-[--tg-theme-bg-color]
      text-[--tg-theme-text-color]
    ">
      { backButtonVisible && <BackButton /> }
      <Outlet />
    </div>
  )
}

export default TWALayout