import { useEffect, useState } from 'react'
import WebApp from '@twa-dev/sdk'
import axios from 'axios'
import SelectAssociation from '@components/twa/register/SelectAssociation'
import EnterCode from '@components/twa/register/EnterCode'
import DebugInfo from '@components/twa/DebugInfo'
import EnterEmail from '@components/twa/register/EnterEmail'

const showDebugInfo = import.meta.env.DEV

type Stage = 'selectAssociation' | 'enterEmail' | 'enterCode'

const RegisterPage = () => {
  const [ stage, setStage ] = useState<Stage>('selectAssociation')
  const [ association, setAssociation ] = useState('')
  const [ email, setEmail ] = useState('')
  const initData = WebApp.initData
  const { username } = WebApp.initDataUnsafe.user || {}
  
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
      />
  }

  useEffect(() => {
    WebApp.BackButton.show()
    WebApp.BackButton.onClick(() => location.href = "/twa")
  }, [])
    
  return (
    <main className="mt-10 text-center">
      Register to Village Cleanup
      { stages[stage] }
      { showDebugInfo && <DebugInfo /> }
    </main>
  )
}

export default RegisterPage