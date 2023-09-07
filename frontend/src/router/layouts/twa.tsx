import BackButton from "@components/twa/BackButton";
import WebApp from "@twa-dev/sdk";
import { Outlet, useLocation } from "react-router-dom";

const TWALayout = () => {
  const location = useLocation()
  const backButtonVisible = location.pathname !== '/twa'
  const { colorScheme } = WebApp

  return (
    <div className={`
      flex min-h-screen flex-col items-center overflow-x-hidden
      bg-[--tg-theme-bg-color]
      text-[--tg-theme-text-color]
      ${colorScheme}
    `}>
      { backButtonVisible && <BackButton /> }
      <Outlet />
    </div>
  )
}

export default TWALayout