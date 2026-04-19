import { useEffect } from "react"
import Routes from "./app/routes"
import { connectDashboardWS } from "./store/dashboardStore"
import AuthGuard from "./components/login/AuthGuard"

export default function App() {
  useEffect(() => {
    connectDashboardWS("ws://100.53.13.182:8080/api/v1/dashboard/ws")
  }, [])

  return (
    <AuthGuard>
      <Routes />
    </AuthGuard>
  )
}