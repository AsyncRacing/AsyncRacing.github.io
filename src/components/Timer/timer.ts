import { Challenge, Path } from '../../model/ChallengeConfiguration'
import * as turf from '@turf/turf'
import { DateTime as LuxonDate } from 'luxon'

interface Props {
  path: Path
  challenge: Challenge
}

const getTimes = ({ path, challenge }: Props): number | null => {
  // Convert from an array of points -> the format that Turf.js wants
  const startLineTurf = turf.lineString([
    [challenge.start.points[0].latitude, challenge.start.points[0].longitude],
    [challenge.start.points[1].latitude, challenge.start.points[1].longitude],
  ])
  const endLineTurf = turf.lineString([
    [challenge.finish.points[0].latitude, challenge.finish.points[0].longitude],
    [challenge.finish.points[1].latitude, challenge.finish.points[1].longitude],
  ])
  let startLuxonTime: LuxonDate | null = null
  let endLuxonTime: LuxonDate | null = null
  for (let i = 0; i < path.length - 1; i++) {
    // Defining the points that make up the line as the current point, and the next point
    const segmentEndpoints = [
      [path[i].latitude, path[i].longitude],
      [path[i + 1].latitude, path[i + 1].longitude],
    ]
    // Convert into a line
    const lineToCheck = turf.lineString(segmentEndpoints)
    const sentinelLuxonTime = LuxonDate.fromJSDate(path[i].time)
    if (turf.lineIntersect(lineToCheck, startLineTurf).features.length > 0) {
      if (startLuxonTime === null) startLuxonTime = sentinelLuxonTime
      else if (startLuxonTime < sentinelLuxonTime)
        startLuxonTime = sentinelLuxonTime
    }
    if (turf.lineIntersect(lineToCheck, endLineTurf).features.length > 0) {
      if (endLuxonTime === null) endLuxonTime = sentinelLuxonTime
      else if (endLuxonTime > sentinelLuxonTime)
        endLuxonTime = sentinelLuxonTime
    }
  }
  if (startLuxonTime === null || endLuxonTime === null) {
    return null
  }
  return endLuxonTime.toMillis() - startLuxonTime.toMillis()
}
export { getTimes }
