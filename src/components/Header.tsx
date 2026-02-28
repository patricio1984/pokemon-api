import React, { useEffect, useState } from 'react'

const Header: React.FC = () => {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setExpanded(window.scrollY > 50)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header ${expanded ? 'expanded' : 'collapsed'}`}>
      <div className="flex items-center gap-2">
        <span className="dot bg-yellow w-3 h-3 rounded-full" />
        <span className="font-terminal text-yellow">API</span>
      </div>
      <nav className="nav ml-auto flex gap-6 text-yellow font-code uppercase text-xs">
        <a href="#">Home</a>
        <a href="#">Docs</a>
        <a href="#">About</a>
      </nav>
    </header>
  )
}

export default Header
