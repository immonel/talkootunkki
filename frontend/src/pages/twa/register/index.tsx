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
  const [ associations, setAssociations ] = useState([])
  const [ selectedAssociation, setSelectedAssociation ] = useState('')
  const initData = WebApp.initData
  
  const register = async (code: string) => {
    const url = '/api/register'
    return axios.post(url, { code, initData, association: selectedAssociation })
  }
  
  const proceed = () => setStage('enterCode')
  const stages = {
    selectAssociation:
      <SelectAssociation
        associations={associations}
        selected={selectedAssociation}
        setSelected={setSelectedAssociation}
        proceed={proceed}
      />,
    enterCode:
      <EnterCode
        submit={register}
      />
  }

  useEffect(() => {
    WebApp.BackButton.show()
    WebApp.BackButton.onClick(() => location.href = "/twa")

    axios.get('/api/register/associations')
      .then(response => setAssociations(response.data))
      .catch(error => console.log('Failed to fetch associations', error))
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