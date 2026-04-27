import { useEffect, useState } from 'react'
import WebApp from '@twa-dev/sdk'
import axios from 'axios'
import FrontPage from '@/src/components/twa/FrontPage'
import LoggedIn from '@/src/components/twa/LoggedIn'
import type { ParticipationCache, ParticipationWithParticipant } from '@/src/types'
import { storeParticipation } from '@/src/utils/participation'

const TelegramWebApp = () => {
  const [ loggedIn, setLoggedIn ] = useState(false)
  const [ loading, setLoading ] = useState(true)
  const [ participation, setParticipation ] = useState<ParticipationCache | null>(null)
  const initData = WebApp.initData

  useEffect(() => {
    WebApp.BackButton.hide()

    axios.post<ParticipationWithParticipant>('/api/register/check', { initData })
      .then((response) => {
        setParticipation(storeParticipation(response.data))
        setLoggedIn(true)
        setLoading(false)
      })
      .catch(() => {
        setLoggedIn(false)
        setLoading(false)
      })
  }, [ initData ])

  return (
    <div className='flex flex-col w-full items-center'>
      { 
        !loading &&
        (loggedIn && participation ? <LoggedIn participation={participation} /> : <FrontPage />)
      }
    </div>
  )
}

export default TelegramWebApp
