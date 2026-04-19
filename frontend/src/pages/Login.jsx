import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import AuthCard from "../components/login/AuthCard"

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      navigate("/")
    }
  }, [navigate])

  function handleSubmit(e) {
    e.preventDefault()

    const username = email.trim()
    const pass = password.trim()

    if (username === "admin" && pass === "anna123") {
      localStorage.setItem("isLoggedIn", "true")
      setError("")
      navigate("/")
    } else {
      setError("Invalid credentials")
    }
  }

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-[#f3e8ff] via-white to-[#ede9fe]">

      {/* LEFT */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center p-12 lg:pl-24">
        <div className="max-w-lg">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-purple-400 to-purple-600 shadow-2xl flex items-center justify-center">
              <span className="text-white text-5xl font-bold">D</span>
            </div>

            <h1 className="text-6xl font-bold tracking-tight">
              <span className="text-gray-900">Dynami</span>
              <span className="text-purple-600">Q</span>
            </h1>
          </div>

          <p className="text-gray-600 text-xl leading-relaxed">
            Enterprise cloud platform for modern infrastructure management.
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">

        <AuthCard className="bg-white shadow-2xl rounded-2xl">

          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-500">
              Sign in to your DynamiQ account
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* USERNAME */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Username
              </label>

              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />

                <input
                  type="text"
                  value={email}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition"
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error) setError("")
                  }}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>

              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="*******"
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition"
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (error) setError("")
                  }}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* BUTTON */}
            <button className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition shadow-lg">
              Sign In
            </button>
          </form>

        </AuthCard>
      </div>
    </div>
  )
}