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
          className="
            w-full rounded-xl p-3 text-xl text-center
            bg-gray-200 dark:bg-gray-800
          "/>
        <button className="
          rounded-xl p-4 w-full
          bg-cs-orange hover:bg-amber-700
        ">
          Submit
        </button>
        <button onClick={skip} className="
          rounded-xl p-4 w-full
          bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-800
        ">
          Skip
        </button>
      </form>
    </div>
  )
}

export default EnterEmail