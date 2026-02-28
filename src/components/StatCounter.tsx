import React from 'react'
import { useMotionValue, animate } from 'framer-motion'

interface Props {
  label: string
  value: number
  color?: string
}

export const StatCounter: React.FC<Props> = ({ label, value, color = '#fff' }) => {
  const mv = useMotionValue(0)
  const [display, setDisplay] = React.useState(0)

  React.useEffect(() => {
    const controls = animate(mv, value, {
      duration: 1.2,
      onUpdate(v) {
        setDisplay(Math.floor(v))
      }
    })
    return controls.stop
  }, [value, mv])

  return (
    <div className="flex justify-between text-sm" style={{ color }}>
      <span className="capitalize">{label}</span>
      <span>{display}</span>
    </div>
  )
}

export default StatCounter
