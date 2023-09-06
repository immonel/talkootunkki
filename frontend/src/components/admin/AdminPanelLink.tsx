import { useNavigate } from "react-router-dom"

const AdminPanelLink = () => {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate("/admin")}
      className="flex items-center gap-3 mb-5"
    >
      <i className="bi-arrow-left text-2xl" />
      <h1>Admin panel</h1>
    </button>
  )
}

export default AdminPanelLink