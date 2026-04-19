import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"

export default function AuthGuard({ children }) {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

    if (!isLoggedIn && location.pathname !== "/login") {
      navigate("/login")
    }

    if (isLoggedIn && location.pathname === "/login") {
      navigate("/")
    }
  }, [location])

  return children
}