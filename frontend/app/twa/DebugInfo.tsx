"use client"
import React from "react"
import WebApp from "@twa-dev/sdk"

const DebugInfo = () => {
  const userData = WebApp.initData
  const userInfo = userData
    ? JSON.stringify(WebApp.initDataUnsafe, null, 2)
    : "No Telegram user data"

  const colorInfo = JSON.stringify(WebApp.themeParams, null, 2)

  return (
    <div className="flex max-w-xs flex-wrap bg-gray-900 p-5 m-10 rounded-xl break-all">
      <pre className="w-full whitespace-pre-wrap">
        User info:
        <br />
        <br />
        { userInfo }
        <br />
        { colorInfo }
      </pre>
    </div>
  )
}

export default DebugInfo