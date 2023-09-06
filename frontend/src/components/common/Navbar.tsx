import { useNavigate } from "react-router-dom"

const Navbar = () => {
  const navigate = useNavigate()

  return (
    <nav className="flex bg-cs-orange p-4 mb-10 justify-between">
      <button onClick={() => navigate("/admin")}>
        Admin panel
      </button>
      <button onClick={() => navigate("/logout")}>
        Log out
      </button>
    </nav>
  )
}
export default Navbar