"use client"
import React, { useEffect } from 'react'
import WebApp from '@twa-dev/sdk'
import Register from './Register'
import DebugInfo from '../DebugInfo'

const showDebugInfo = process.env.NODE_ENV === 'development'

export default function Home() {

  useEffect(() => {
    WebApp.BackButton.show()
    WebApp.BackButton.onClick(() => location.href = "/twa")
  }, [])
    
  return (
    <main>
      <div className="place-items-center">
        <Register />
        { showDebugInfo && <DebugInfo /> }
      </div>
    </main>
  )
}
