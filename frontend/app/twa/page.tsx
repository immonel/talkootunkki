"use client"
import React, { useEffect, useState } from 'react'
import WebApp from '@twa-dev/sdk'
import FrontPage from './FrontPage'
import axios from 'axios'
import LoggedIn from './LoggedIn'

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || ''

const Page = () => {
  const [ loggedIn, setLoggedIn ] = useState(false)
  const initData = WebApp.initData

  useEffect(() => {
    WebApp.BackButton.hide()

    axios.post(`${baseUrl}/api/register/check`, { initData })
      .then(ok => setLoggedIn(true))
      .catch(error => setLoggedIn(false))
  }, [ initData ])

  return (
    <>
      { loggedIn ? <LoggedIn initData={initData} setLoggedIn={setLoggedIn} /> : <FrontPage /> }
    </>
  )
}

export default Page