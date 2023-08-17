"use client"
import React, { useEffect, useState } from 'react'
import WebApp from '@twa-dev/sdk'
import FrontPage from './FrontPage'
import axios from 'axios'
import LoggedIn from './LoggedIn'

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || ''

const Page = () => {
  const [ loggedIn, setLoggedIn ] = useState(false)
  const [ loading, setLoading ] = useState(true)
  const initData = WebApp.initData

  useEffect(() => {
    WebApp.BackButton.hide()

    axios.post(`${baseUrl}/api/register/check`, { initData })
      .then(ok => {
        setLoggedIn(true)
        setLoading(false)
      })
      .catch(error => {
        setLoggedIn(false)
        setLoading(false)
      })
  }, [ initData ])

  return (
    <div className='flex flex-col w-full mt-10 items-center'>
      { 
        !loading &&
        (loggedIn ? <LoggedIn initData={initData} setLoggedIn={setLoggedIn} /> : <FrontPage />)
      }
    </div>
  )
}

export default Page