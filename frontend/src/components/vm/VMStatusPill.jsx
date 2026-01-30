export default function VMStatusPill({ status }) {
  const styles = {
    UNDERLOAD: "bg-status-running/20 text-green-700 border border-green-200",
    OVERLOAD: "bg-status-stopped/20 text-red-700 border border-red-200",
  }

  return (
    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${styles[status] || styles.UNDERLOAD}`}>
      {status}
    </span>
  )
}
