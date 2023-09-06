import { useEffect } from 'react'
import WebApp from '@twa-dev/sdk'
import axios from 'axios'
import EnterCode from '@components/twa/register/EnterCode'
import DebugInfo from '@components/twa/DebugInfo'

const showDebugInfo = import.meta.env.DEV

const FinishPage = () => {
  const initData = WebApp.initData
  
  const finish = async (code: string) => {
    const url = '/api/register/finish'
    return axios.post(url, { code, initData })
  }

  const handleSuccessfulFinish = () => {
    window.localStorage.clear()
    window.location.href = '/twa'
  }

  useEffect(() => {
    WebApp.BackButton.show()
    WebApp.BackButton.onClick(() => location.href = "/twa")
  }, [])
    
  return (
    <main className="mt-10 text-center">
      Check out of Village Cleanup
      <EnterCode
        onSubmit={finish}
        onSuccess={handleSuccessfulFinish}
      />
      { showDebugInfo && <DebugInfo /> }
    </main>
  )
}

export default FinishPage