const Banner = () => (
  <div className="flex items-center gap-5">
    <img className="invert dark:invert-0 w-16 pr-3 border-r" src="/campussection.png" />
    <div>
      <h3>Kylän talkoot</h3>
      <h3>Village Cleanup</h3>
    </div>
  </div>
)

const FrontPage = () => (
  <main className="flex flex-col items-center gap-16 mt-10">
    <Banner />
    <div className="flex flex-col w-60 gap-3">
      <a href="/twa/register" className="w-full">
        <button className="bg-cs-orange hover:bg-amber-700 rounded-xl p-4 w-full">
          🧹 Register
        </button>
      </a>
      <a href="/twa/leaderboards" className="w-full">
        <button className="rounded-xl p-4 w-full
          bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-800">
          🏆 Leaderboards
        </button>
      </a>
    </div>
  </main>
)

export default FrontPage