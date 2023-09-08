import { useNavigate } from "react-router-dom"

const tgLink = import.meta.env.VITE_TELEGRAM_GROUP_LINK || ''

const Banner = () => (
  <div className="flex items-center gap-5">
    <img className="invert dark:invert-0 w-16 pr-3 border-r" src="/campussection.png" />
    <div>
      <h3>Kylän talkoot</h3>
      <h3>Village Cleanup</h3>
    </div>
  </div>
)

const FrontPage = () => {
  const navigate = useNavigate()

  return (
    <main className="flex flex-col items-center gap-16 mt-10">
      <Banner />
      <div className="flex flex-col w-60 gap-3">
        <button
          onClick={() => navigate('/twa/register')}
          className="bg-cs-orange hover:bg-amber-700 rounded-xl p-4 w-full"
        >
          🧹 Register
        </button>
        {
          tgLink && 
            <a
              href={tgLink}
              className="
                rounded-xl p-4 w-full text-center
                bg-blue-400 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600
              "
            >
              Join the Telegram group
            </a>
        }
        <button
          onClick={() => navigate('/twa/leaderboards')}
          className="rounded-xl p-4 w-full
          bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-800"
        >
          🏆 Leaderboards
        </button>
        <button
          onClick={() => navigate('/twa/prizes')}
          className="rounded-xl p-4 w-full
          bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-800"
        >
          🏅 Prizes
        </button>
      </div>
    </main>
  )
}

export default FrontPage