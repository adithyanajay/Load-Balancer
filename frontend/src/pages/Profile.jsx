import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Pencil } from "lucide-react"

export default function Profile() {
  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)

  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@dynamiq.com",
    role: "System Administrator",
    location: "India",
    organization: "DynamiQ Cloud",
  })

  const handleChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false")
    navigate("/login")
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
        <p className="text-sm text-gray-500">Manage your account details</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-sm">

        {/* Top Section */}
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-xl overflow-hidden ring-2 ring-white">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              alt="Admin"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {profile.name}
            </h2>
            <p className="text-sm text-gray-500">{profile.role}</p>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="ml-auto flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-white/60 hover:bg-white transition border border-gray-200"
          >
            <Pencil className="w-4 h-4" />
            {isEditing ? "Done" : "Edit"}
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Name */}
          <div>
            <label className="text-xs text-gray-500">Full Name</label>
            <div className="mt-1 bg-white/60 border border-gray-200 rounded-lg px-3 py-2">
              {isEditing ? (
                <input
                  className="w-full bg-transparent outline-none"
                  value={profile.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              ) : (
                <span>{profile.name}</span>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs text-gray-500">Email</label>
            <div className="mt-1 bg-white/60 border border-gray-200 rounded-lg px-3 py-2">
              {isEditing ? (
                <input
                  className="w-full bg-transparent outline-none"
                  value={profile.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              ) : (
                <span>{profile.email}</span>
              )}
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="text-xs text-gray-500">Role</label>
            <div className="mt-1 bg-white/60 border border-gray-200 rounded-lg px-3 py-2">
              {profile.role}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-xs text-gray-500">Location</label>
            <div className="mt-1 bg-white/60 border border-gray-200 rounded-lg px-3 py-2">
              {isEditing ? (
                <input
                  className="w-full bg-transparent outline-none"
                  value={profile.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                />
              ) : (
                <span>{profile.location}</span>
              )}
            </div>
          </div>

          {/* Organization */}
          <div>
            <label className="text-xs text-gray-500">Organization</label>
            <div className="mt-1 bg-white/60 border border-gray-200 rounded-lg px-3 py-2">
              {isEditing ? (
                <input
                  className="w-full bg-transparent outline-none"
                  value={profile.organization}
                  onChange={(e) => handleChange("organization", e.target.value)}
                />
              ) : (
                <span>{profile.organization}</span>
              )}
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Signed in as{" "}
            <span className="font-medium text-gray-700">
              {profile.name}
            </span>
          </p>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition shadow-sm"
          >
            Sign Out
          </button>
        </div>

      </div>
    </div>
  )
}