"use client"
import React, { ChangeEvent, FormEvent, useState } from "react"
import WebApp from "@twa-dev/sdk"
import axios, { AxiosError } from "axios"

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
const maxCodeLength = 6

const headers = {
  headers: {
    'Content-Type': 'application/json'
  }
}

// Truncate code to maxCodeLength and transform to upper case
const formatCode = (code: string) => (
  code.length > maxCodeLength
    ? code.slice(0, maxCodeLength)
    : code
).toUpperCase()

interface ErrorProps {
  message: string
}

const Error = ({ message }: ErrorProps) => (
  <p className="text-red-600">{ message }</p>
)

const Register = () => {
  const [ code, _setCode ]   = useState('')
  const [ errorMessage, setErrorMessage ] = useState('')
  const url = `${baseUrl}/api/register`
  const initData = WebApp.initData

  const setCode = (code: string) => _setCode(formatCode(code))

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    axios.post(url, { code, initData }, headers)
      .then(() => {
        setErrorMessage('')
        setCode('')
        WebApp.showAlert("nauraa")
      })
      .catch((error: AxiosError) => {
        error.response?.status === 400
          ? setErrorMessage('Invalid code')
          : setErrorMessage('Server error')
      })
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value)
  }
  
  const qrScanCallback = (code: string) => {
    setCode(code)
    WebApp.closeScanQrPopup()
  }

  const openQrScanPopup = () => {
    WebApp.showScanQrPopup(
      { text: 'The code is available at the starting point' },
      qrScanCallback
    )
  }

  return (
    <div className="flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-60 mt-10 gap-3 text-center"
      >
        Register to Village Cleanup
        <input
          value={code}
          onChange={handleChange}
          className="w-full rounded-xl bg-gray-800 p-3 text-4xl text-center"
        />
        { errorMessage && <Error message={errorMessage} /> }
        <button className="bg-cs-orange rounded-xl p-4 w-full">
          Register
        </button>
      </form>

      <button
        onClick={openQrScanPopup}
        className="bg-cs-orange rounded-xl m-20 p-5"
      >
        <i className="bi-qr-code-scan text-5xl" />
      </button>
    </div>
  )
}

export default Register