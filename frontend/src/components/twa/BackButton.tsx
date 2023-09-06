import { useNavigate } from "react-router-dom"

const BackButton = () => {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(-1)}
      className="
        rounded-lg p-1 w-12 h-12 absolute left-4
        bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-800
      "
    >
      <i className="bi-arrow-left-short text-4xl" />
    </button>
  )
}

export default BackButton