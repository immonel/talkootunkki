import { useEffect } from 'react'
import WebApp from '@twa-dev/sdk'
import axios from 'axios'
import EnterCode from '@components/twa/register/EnterCode'
import DebugInfo from '@components/twa/DebugInfo'
import { useNavigate } from 'react-router-dom'

const showDebugInfo = import.meta.env.DEV

const FinishPage = () => {
  const initData = WebApp.initData
  const navigate = useNavigate()
  
  const finish = async (code: string) => {
    const url = '/api/register/finish'
    return axios.post(url, { code, initData })
  }

  const handleSuccessfulFinish = () => {
    window.localStorage.clear()
    navigate('/twa')
  }

  useEffect(() => {
    WebApp.BackButton.show()
    WebApp.BackButton.onClick(() => navigate("/twa"))
  }, [ navigate ])
    
  return (
    <main className="mt-3 text-center">
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