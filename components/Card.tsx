export function Card({ title, children, className = '' }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20 ${className}`}>
      {title && <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{title}</h2>}
      {children}
    </section>
  )
}
