import React from "react"
import type { LeaderboardAssociation as Association } from "../types";
import { toTimeString } from "../utils";

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
    <li className="px-4 py-3 flex items-center justify-between">
    <div className="flex items-center">
      <span className={`text-sm font-medium ${colourMap[index] || 'text-gray-900'}`}>{index + 1}.</span>
      <span className="ml-2 text-sm text-gray-600">{association.name}</span>
    </div>
    <span className="text-sm font-medium text-gray-900">{toTimeString(association.totalTime, 'HHMM')}</span>
    </li>
  )
}

const Leaderboard = ({ data }: LeaderboardProps) => (
  <div className="flex flex-col items-center w-10/12">
    <h2 className="text-2xl font-semibold mb-4">Leaderboard</h2>
    <div className="w-full max-w-md bg-white rounded-lg shadow text-">
      <ul className="divide-y divide-gray-200">
        {data.sort(sortByTime).map((association, index) => (
          <LeaderboardRow key={index} association={association} index={index} />
        ))}
      </ul>
    </div>
  </div>
)

export default Leaderboard