import { useEffect, useState } from 'react'
import WebApp from '@twa-dev/sdk'
import axios from 'axios'
import SelectAssociation from '@components/twa/register/SelectAssociation'
import EnterCode from '@components/twa/register/EnterCode'
import DebugInfo from '@components/twa/DebugInfo'

const showDebugInfo = import.meta.env.DEV

type Stage = 'selectAssociation' | 'enterCode'

const RegisterPage = () => {
  const [ stage, setStage ] = useState<Stage>('selectAssociation')
  const [ association, setAssociation ] = useState('')
  const initData = WebApp.initData
  
  const handleSelectAssociationSubmit = (association: string) => {
    setAssociation(association)
    setStage('enterCode')
  }

  const handleRegisterSubmit = async (code: string) => {
    const url = '/api/register'
    return axios.post(url, { code, initData, association })
  }
  
  const stages = {
    selectAssociation:
      <SelectAssociation
        onSubmit={handleSelectAssociationSubmit}
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