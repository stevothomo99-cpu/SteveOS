import { AlertCircle, Briefcase, CheckCircle2, Circle, DollarSign, Flame, LineChart, Target } from 'lucide-react'
import { Card } from '../components/Card'
import { StatusPill } from '../components/StatusPill'

const criticalFive = [
  { title: 'Complete launch-critical testing', area: 'SiteMargin', status: 'amber' },
  { title: 'Review SiteMargin landing page', area: 'SiteMargin', status: 'amber' },
  { title: 'Contact first EBS Foundation Members', area: 'SiteMargin', status: 'amber' },
  { title: 'Set YFD weekly cash/profit checkpoint', area: 'YFD', status: 'green' },
  { title: 'Agree FocablyED owner roadmap', area: 'FocablyED', status: 'amber' },
]

const businesses = [
  { name: 'YFD', icon: Briefcase, health: 'green', metrics: [['Revenue', '$350k'], ['Target', '$500k'], ['Profit Goal', '$200k'], ['Staff', '4 + Steve']] },
  { name: 'SiteMargin', icon: LineChart, health: 'amber', metrics: [['MRR', '$0'], ['ARR', '$0'], ['Trials', '0'], ['Support', '0']] },
  { name: 'FocablyED', icon: Flame, health: 'amber', metrics: [['MRR', '$0'], ['ARR', '$0'], ['Parent Trials', '0'], ['Support', '0']] },
  { name: 'Investments', icon: DollarSign, health: 'amber', metrics: [['Portfolio', 'Manual'], ['Super', 'Manual'], ['Freedom', 'TBD'], ['Cash', 'TBD']] },
]

export default function Home() {
  const date = new Intl.DateTimeFormat('en-AU', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())

  return (
    <main className="min-h-screen px-6 py-6 md:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">SteveOS v0.1</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">Mission Control</h1>
          </div>
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">{date}</div>
        </header>

        <div className="grid gap-5 lg:grid-cols-12">
          <Card className="lg:col-span-7">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-sky-500/15 p-3 text-sky-300"><Target /></div>
              <div className="flex-1">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">The ONE</p>
                <h2 className="mt-3 text-3xl font-bold text-white">Finish SiteMargin testing</h2>
                <p className="mt-3 text-slate-400">If this is completed, the week is a win. Everything else is secondary.</p>
              </div>
              <StatusPill status="amber" />
            </div>
          </Card>

          <Card title="Calm Check" className="lg:col-span-5">
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-3"><CheckCircle2 className="text-emerald-300" size={18} /> Nothing critical is on fire.</div>
              <div className="flex items-center gap-3"><AlertCircle className="text-amber-300" size={18} /> SiteMargin is the focus.</div>
              <div className="rounded-xl bg-white/[0.04] p-3 text-slate-400">Do not open Outlook until you move The ONE forward.</div>
            </div>
          </Card>

          <Card title="Critical Five" className="lg:col-span-7">
            <div className="space-y-3">
              {criticalFive.map((item, index) => (
                <div key={item.title} className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-3">
                    <Circle size={18} className="text-slate-500" />
                    <div>
                      <p className="font-medium text-white">{index + 1}. {item.title}</p>
                      <p className="text-sm text-slate-500">{item.area}</p>
                    </div>
                  </div>
                  <StatusPill status={item.status} />
                </div>
              ))}
            </div>
          </Card>

          <Card title="CEO Notes" className="lg:col-span-5">
            <textarea className="min-h-[240px] w-full resize-none rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-slate-200 outline-none placeholder:text-slate-600" placeholder="What is taking up mental space? Capture it here, then get back to The ONE." />
          </Card>

          <div className="grid gap-5 lg:col-span-12 md:grid-cols-2 xl:grid-cols-4">
            {businesses.map((business) => {
              const Icon = business.icon
              return (
                <Card key={business.name}>
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-white/10 p-2 text-slate-200"><Icon size={18} /></div>
                      <h3 className="text-xl font-bold text-white">{business.name}</h3>
                    </div>
                    <StatusPill status={business.health} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {business.metrics.map(([label, value]) => (
                      <div key={label} className="rounded-xl bg-black/20 p-3">
                        <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
                        <p className="mt-1 text-lg font-semibold text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )
            })}
          </div>

          <Card title="Friday Win" className="lg:col-span-12">
            <input className="w-full rounded-xl border border-white/10 bg-black/30 p-4 text-slate-200 outline-none placeholder:text-slate-600" placeholder="This week’s biggest win..." />
          </Card>
        </div>
      </div>
    </main>
  )
}
