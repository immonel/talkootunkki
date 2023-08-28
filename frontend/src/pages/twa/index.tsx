import { useEffect, useState } from 'react'
import WebApp from '@twa-dev/sdk'
import axios from 'axios'
import FrontPage from '@/src/components/twa/FrontPage'
import LoggedIn from '@/src/components/twa/LoggedIn'

const baseUrl = import.meta.env.VITE_BACKEND_URL || ''

const TelegramWebApp = () => {
  const [ loggedIn, setLoggedIn ] = useState(false)
  const [ loading, setLoading ] = useState(true)
  const initData = WebApp.initData

  useEffect(() => {
    WebApp.BackButton.hide()

    axios.post(`${baseUrl}/api/register/check`, { initData })
      .then(() => {
        setLoggedIn(true)
        setLoading(false)
      })
      .catch(() => {
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

export default TelegramWebApp