import type { LeaderboardAssociation as Association } from "@/src/types";
import { toTimeString } from "@/src/utils";

type LeaderboardProps = {
  data: Association[];
}

type LeaderboardRowProps = {
  association: Association;
  index: number;
}

const sortByTime = (associationA: Association, associationB: Association) => (
  associationB.totalTime - associationA.totalTime
)

const LeaderboardRow = ({ association, index }: LeaderboardRowProps) => {
  const colourMap = [
    'text-yellow-400',
    'text-gray-400',
    'text-amber-800'
  ]
  return (
    <li className="
      px-4 py-3 flex items-center justify-between
      text-gray-700 dark:text-gray-300
    ">
      <div className="flex items-center">
        <span className={`text-sm w-5 font-medium ${colourMap[index]}`}>{index + 1}.</span>
        <span className="ml-2 text-sm">{association.name}</span>
      </div>
      <span className="text-sm font-medium">{toTimeString(association.totalTime, 'HHMM')}</span>
    </li>
  )
}

const Leaderboard = ({ data }: LeaderboardProps) => (
  <div className="flex flex-col items-center w-11/12">
    <h2 className="text-2xl font-semibold mb-8">Leaderboards</h2>
    <div className="w-full max-w-md bg-gray-200 dark:bg-gray-700 rounded-lg shadow">
      <ul className="divide-y divide-gray-300 dark:divide-gray-600">
        {data.sort(sortByTime).map((association, index) => (
          <LeaderboardRow key={index} association={association} index={index} />
        ))}
      </ul>
    </div>
  </div>
)

export default Leaderboard