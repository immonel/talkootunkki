import React from "react"
import Link from "next/link";

const FrontPage = () => (
  <main className="flex flex-col items-center gap-10 mt-10">
    <div>
      <h3>Kylän talkoot</h3>
    </div>
    <div className="flex flex-col w-60 gap-5">
      <Link href="/twa/register" className="w-full">
        <button className="bg-cs-orange hover:bg-amber-700 rounded-xl p-4 w-full">
          Register
        </button>
      </Link>
      <Link href="/twa/leaderboards" className="w-full">
        <button className="bg-cs-orange hover:bg-amber-700 rounded-xl p-4 w-full">
          Leaderboards
        </button>
      </Link>
    </div>
  </main>
)

export default FrontPage