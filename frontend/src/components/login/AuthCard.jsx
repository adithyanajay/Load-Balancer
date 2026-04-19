export default function AuthCard({ children }) {
  return (
    <div className="bg-white p-10 rounded-2xl shadow-[0_8px_30px_rgb(30,27,75,0.06)] w-full max-w-md border border-brand/10">
      {children}
    </div>
  )
}