type TimeStringFormat = 'HHMMSS' | 'HHMM'

export const toTimeString = (time: unknown, format: TimeStringFormat) => {
  const milliseconds = Number(time)
  if (Number.isNaN(milliseconds)) {
    return 'NaN'
  }
  const timeInSeconds = milliseconds / 1000
  const hours = Math.floor(timeInSeconds / 3600)
  const minutes = Math.floor((timeInSeconds - (hours * 3600)) / 60)
  const seconds = Math.floor(timeInSeconds - (hours * 3600) - (minutes * 60))
  const timeString = (
    format === 'HHMMSS'
      ? `${hours}h ${minutes}m ${seconds}s`
      : `${hours}h ${minutes}m`
  )
  return timeString
}