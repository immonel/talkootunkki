import axios from 'axios';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

type Props = {
  children: JSX.Element;
}

const checkAuth = async () => (
  await axios.post('/api/auth/validate')
    .then(() => true)
    .catch(() => false)
)

const RequireAuth = ({ children }: Props) => {
  const [ auth, setAuth ] = useState(false)
  const [ loading, setLoading ] = useState(true)

  useEffect(() => {
    checkAuth().then(result => {
      setAuth(result)
      setLoading(false)
    })
  }, [])

  return (
    !loading && (
      auth ? children : <Navigate to='/login' />
    )
  )
}

export default RequireAuth