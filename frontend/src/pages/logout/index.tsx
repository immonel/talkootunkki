import axios from "axios"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const LogoutPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    axios.post('/api/auth/logout')
      .then(() => navigate('/login'))
  }, [ navigate ])

  return <p>Logging out...</p>
}

export default LogoutPage