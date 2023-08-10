import React from "react"

export type LeaderboardDataRow = {
  association: string;
  totalTime: number;
}

type LeaderboardsProps = {
  data: LeaderboardDataRow[];
}

type LeaderboardRowProps = {
  data: LeaderboardDataRow
}

const toTimeString = (time: any) => {
  const milliseconds = Number(time)
  if (Number.isNaN(milliseconds)) {
    return 'NaN'
  }
  const timeInSeconds = milliseconds / 1000
  const hours = Math.floor(timeInSeconds / 3600)
  const minutes = Math.floor((timeInSeconds - (hours * 3600)) / 60)
  const seconds = Math.floor(timeInSeconds - (hours * 3600) - (minutes * 60))
  return `${hours}h ${minutes}m ${seconds}s`
}

const sortByTime = (associationA: LeaderboardDataRow, associationB: LeaderboardDataRow) => (
  associationB.totalTime - associationA.totalTime
)

const LeaderboardRow = ({ data }: LeaderboardRowProps) => (
  <tr>
    <td>{data.association}</td>
    <td>{toTimeString(data.totalTime)}</td>
  </tr>
)

const Leaderboards = ({ data }: LeaderboardsProps) => (
  <table>
    <thead>
      <tr>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {data.sort(sortByTime).map((row, index) => (
        <LeaderboardRow key={index} data={row} />
      ))}
    </tbody>
  </table>
)

export default Leaderboards