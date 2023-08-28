import { useEffect, useState } from 'react'
import WebApp from '@twa-dev/sdk'
import axios from 'axios'
import SelectAssociation from '@components/twa/register/SelectAssociation';
import Register from '@components/twa/register/Register';
import DebugInfo from '@components/twa/DebugInfo';

const showDebugInfo = import.meta.env.DEV

type Stage = 'selectAssociation' | 'register'

const RegisterPage = () => {
  const [ stage, setStage ] = useState<Stage>('selectAssociation')
  const [ associations, setAssociations ] = useState([])
  const [ selectedAssociation, setSelectedAssociation ] = useState('')
  const [ code, setCode ]   = useState('')
  const initData = WebApp.initData
  
  const register = async () => {
    const url = '/api/register'
    return axios.post(url, { code, initData, association: selectedAssociation })
  }
  
  const proceed = () => setStage('register')
  const stages = {
    selectAssociation:
      <SelectAssociation
        associations={associations}
        selected={selectedAssociation}
        setSelected={setSelectedAssociation}
        proceed={proceed}
      />,
    register:
      <Register
        code={code}
        setCode={setCode}
        register={register}  
      />
  }

  useEffect(() => {
    WebApp.BackButton.show()
    WebApp.BackButton.onClick(() => location.href = "/twa")

    axios.get('/api/events/current/associations')
      .then(response => setAssociations(response.data))
      .catch(error => console.log('Failed to fetch associations', error))
  }, [])
    
  return (
    <main>
      <div className="place-items-center">
        { stages[stage] }
        { showDebugInfo && <DebugInfo /> }
      </div>
    </main>
  )
}

export default RegisterPage