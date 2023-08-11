import React from "react"

interface ErrorMessageProps {
  message: string
}

const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <p className="text-red-600">{ message }</p>
)

export default ErrorMessage