import axios from 'axios'
import Router from './router'

const baseUrl = import.meta.env.VITE_BACKEND_URL || ''

function App() {
  axios.defaults.baseURL = baseUrl
  axios.defaults.withCredentials = true

  return (
    <Router />
  )
}

export default App
