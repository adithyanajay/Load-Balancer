export default function VMStatusPill({ status }) {
  const styles = {
    ACTIVE: "bg-status-running/20 text-green-700",
    SUSPECT: "bg-status-warning/20 text-yellow-700",
    DISABLED: "bg-status-stopped/20 text-red-700",
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status]}`}>
      {status}
    </span>
  )
}

