import React, { useState, useEffect } from 'react'
import { getTimes } from './getTime'

const Timer = ({ path, challenge }: any) => {
  const [time, setTime] = useState<number | null>(null)
  useEffect(() => {
    setTime(getTimes({ path, challenge }))
  }, [path, challenge])
  return <div>{time}</div>
}

export { Timer }
