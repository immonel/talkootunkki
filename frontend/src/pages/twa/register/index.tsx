import { useEffect, useState } from 'react'
import WebApp from '@twa-dev/sdk'
import axios from 'axios'
import SelectAssociation from '@components/twa/register/SelectAssociation'
import EnterCode from '@components/twa/register/EnterCode'
import DebugInfo from '@components/twa/DebugInfo'
import EnterEmail from '@components/twa/register/EnterEmail'
import { useNavigate } from 'react-router-dom'

const showDebugInfo = import.meta.env.DEV

type Stage = 'selectAssociation' | 'enterEmail' | 'enterCode'

const RegisterPage = () => {
  const [ stage, setStage ] = useState<Stage>('selectAssociation')
  const [ association, setAssociation ] = useState('')
  const [ email, setEmail ] = useState('')
  const initData = WebApp.initData
  const { username, first_name, last_name } = WebApp.initDataUnsafe.user || {}
  const navigate = useNavigate()
  
  const handleSelectAssociationSubmit = (association: string) => {
    setAssociation(association)
    if (username) {
      setStage('enterCode')
    } else {
      setStage('enterEmail')
    }
  }

  const handleEmailSubmit = (email: string) => {
    setEmail(email)
    setStage('enterCode')
  }

  const handleRegisterSubmit = async (code: string) => {
    const url = '/api/register'
    return axios.post(url, { code, initData, association, email })
  }

  const handleSuccessfulRegistration = async () => {
    window.localStorage.setItem('participation', JSON.stringify({
      association,
      first_name,
      last_name,
      username,
      email,
      start_date: Date.now()
    }))
    navigate('/twa')
  }
  
  const stages = {
    selectAssociation:
      <SelectAssociation
        onSubmit={handleSelectAssociationSubmit}
      />,
    enterEmail:
      <EnterEmail
        onSubmit={handleEmailSubmit}
      />,
    enterCode:
      <EnterCode
        onSubmit={handleRegisterSubmit}
        onSuccess={handleSuccessfulRegistration}
      />
  }

  useEffect(() => {
    WebApp.BackButton.show()
    WebApp.BackButton.onClick(() => navigate("/twa"))
  }, [ navigate ])
    
  return (
    <main className="mt-3 text-center">
      Register to Village Cleanup
      <div className="mt-2">
        { stages[stage] }
        { showDebugInfo && <DebugInfo /> }
      </div>
    </main>
  )
}

export default RegisterPage