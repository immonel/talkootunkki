import { useEffect } from "react"
import WebApp from "@twa-dev/sdk"
import CurrentEvent from "@/src/components/twa/CurrentEvent"
import { useNavigate } from "react-router-dom"

const TWALeaderboardPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    WebApp.BackButton.show()
    WebApp.BackButton.onClick(() => navigate("/twa"))
  }, [ navigate ])

  return (
    <main className='flex flex-col w-full min-h-screen mt-5 items-center'>
      <CurrentEvent />
    </main>
  )
}

export default TWALeaderboardPage