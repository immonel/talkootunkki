import { ChangeEvent, FormEvent, useState } from "react"
import WebApp from "@twa-dev/sdk"
import { AxiosError, AxiosResponse } from "axios"
import ErrorMessage from "../../common/ErrorMessage";

const maxCodeLength = 6

// Truncate code to maxCodeLength and transform to upper case
const toTruncatedUpperCase = (code: string) => (
  code.length > maxCodeLength
    ? code.slice(0, maxCodeLength)
    : code
).toUpperCase()

type Props = {
  submit: (code: string) => Promise<AxiosResponse<unknown, unknown>>;
}

const Register = ({ submit }: Props) => {
  const [ code, setCode ] = useState('')
  const [ errorMessage, setErrorMessage ] = useState('')

  const setFormattedCode = (code: string) => setCode(toTruncatedUpperCase(code))

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    submit(code)
      .then(() => {
        setErrorMessage('')
        setFormattedCode('')
        window.location.href = '/twa'
      })
      .catch((error: AxiosError) => {
        error.response?.status === 400
          ? setErrorMessage('Invalid code')
          : setErrorMessage('Server error')
      })
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormattedCode(event.target.value)
  }
  
  const qrScanCallback = (code: string) => {
    setFormattedCode(code)
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
        { errorMessage && <ErrorMessage message={errorMessage} /> }
        <button className="bg-cs-orange hover:bg-amber-700 rounded-xl p-4 w-full">
          Register
        </button>
      </form>

      <button
        onClick={openQrScanPopup}
        className="bg-cs-orange hover:bg-amber-700 rounded-xl m-20 p-5"
      >
        <i className="bi-qr-code-scan text-5xl" />
      </button>
    </div>
  )
}

export default Register