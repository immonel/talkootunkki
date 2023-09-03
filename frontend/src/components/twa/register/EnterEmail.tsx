import React, { ChangeEvent, FormEvent, useState } from "react"

const MAX_EMAIL_LENGTH = 64

type Props = {
  onSubmit: (association: string) => void;
}

const EnterEmail = ({ onSubmit }: Props) => {
  const [ email, setEmail ] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(email)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value
    if (newEmail.length <= MAX_EMAIL_LENGTH) {
      setEmail(newEmail)
    }
  }

  const skip = (event: React.MouseEvent) => {
    event.preventDefault()
    setEmail('')
    onSubmit('')
  }

  return (
    <div className="flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-60 mt-5 gap-3 text-center"
      >
        Enter your email
        <small>
          You do not seem to have a username set. You can give us your email
          so we can contact you for prizes!
        </small>
        <input
          value={email}
          type='email'
          onChange={handleChange}
          className="w-full rounded-xl bg-gray-800 p-3 text-xl text-center"
        />
        <button className="bg-cs-orange hover:bg-amber-700 rounded-xl p-4 w-full">
          Submit
        </button>
        <button onClick={skip} className="bg-slate-700 hover:bg-slate-800 rounded-xl p-4 w-full">
          Skip
        </button>
      </form>
    </div>
  )
}

export default EnterEmail