"use client"
import React, { useEffect, useState } from 'react'
import WebApp from '@twa-dev/sdk'
import Register from './Register'
import DebugInfo from '../DebugInfo'
import SelectAssociation from './SelectAssociation'
import axios from 'axios'

const showDebugInfo = process.env.NODE_ENV === 'development'
const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';

type Stage = 'selectAssociation' | 'register'

export default function Home() {
  const [ stage, setStage ] = useState<Stage>('selectAssociation')
  const [ associations, setAssociations ] = useState([])
  const [ selectedAssociation, setSelectedAssociation ] = useState('')
  const [ code, setCode ]   = useState('')
  const initData = WebApp.initData
  
  const register = async () => {
    const url = `${baseUrl}/api/register`
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

    axios.get(`${baseUrl}/api/events/current/associations`)
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
