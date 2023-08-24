"use client"
import React, { useEffect } from "react"
import WebApp from "@twa-dev/sdk"
import CurrentEvent from "../CurrentEvent"

const Page = () => {

  useEffect(() => {
    WebApp.BackButton.show()
    WebApp.BackButton.onClick(() => location.href = "/twa")
  }, [])

  return (
    <main className='flex flex-col w-full min-h-screen mt-10 items-center'>
      <CurrentEvent />
    </main>
  )
}

export default Page