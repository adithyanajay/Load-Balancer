import { useEffect } from "react"
import Layout from "./components/layout/Layout"
import Routes from "./app/routes"
import { connectDashboardWS } from "./store/dashboardStore"

export default function App() {
  useEffect(() => {
    connectDashboardWS("ws://3.236.121.185:8080/api/v1/dashboard/ws")
  }, [])

  return (
    <Layout>
      <Routes />
    </Layout>
  )
}

