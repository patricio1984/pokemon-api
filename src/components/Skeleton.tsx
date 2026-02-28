import React from 'react'

type Props = {
  className?: string
}

export const Skeleton: React.FC<Props> = ({ className = '' }) => {
  return <div className={`skeleton ${className}`} />
}

export default Skeleton
