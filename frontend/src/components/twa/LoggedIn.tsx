import { useEffect, useState } from "react";
import LoginInfoCard from "./LoginInfoCard";
import { useNavigate } from "react-router-dom";

const tgLink = import.meta.env.VITE_TELEGRAM_GROUP_LINK

const LoggedIn = () => {
  const participation = JSON.parse(window.localStorage.getItem('participation') || '')
  const { start_date } = participation
  const [ elapsedTime, setElapsedTime ] = useState(Date.now() - start_date)
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Date.now() - start_date)
    }, 1000)

    return () => clearInterval(interval)
  }, [ start_date ])

  return (
    <div className='flex flex-col gap-6 w-full items-center'>
      <LoginInfoCard { ...participation } elapsedTime={elapsedTime} />
      <p>Happy cleaning! 🧹🦊</p>
      <small className="w-2/3 text-center">
        Remember to check out at the starting point before the event ends.
        <b>You will need to scan the QR code again</b> to finish your participation and to
        qualify for the competition!
      </small>
      <div className="flex flex-col w-80 gap-3 items-center">
        <button
          onClick={() => navigate('/twa/finish')}
          className="bg-cs-orange hover:bg-amber-700 rounded-xl p-4 w-11/12 text-center"
        >
          🚪 Check out
        </button>
        {
          tgLink && 
            <a
              href={tgLink}
              className="
                rounded-xl p-4 w-11/12 text-center
                bg-blue-400 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600
              "
            >
              Join the Telegram group
            </a>
        }
        <button
          onClick={() => navigate('/twa/leaderboards')}
          className="
            rounded-xl p-4 w-11/12 text-center
            bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-800
          ">
          🏆 Leaderboards
        </button>
        <button
          onClick={() => navigate('/twa/prizes')}
          className="rounded-xl p-4 w-11/12 text-center
          bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-800"
        >
          🏅 Prizes
        </button>
      </div>
    </div>
  )
}
export default LoggedIn