export function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    green: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    red: 'bg-red-500/15 text-red-300 border-red-500/30',
    done: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  }
  return <span className={`rounded-full border px-2 py-1 text-xs font-medium ${styles[status] || styles.amber}`}>{status.toUpperCase()}</span>
}
