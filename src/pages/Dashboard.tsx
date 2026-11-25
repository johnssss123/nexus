const stats = [
  { label: 'Employees', value: '24' },
  { label: 'Active Projects', value: '7' },
  { label: 'Open Tasks', value: '38' },
  { label: 'Outstanding Invoices', value: '$12,400' },
]

function Dashboard() {
  return (
    <div className="px-8 py-8 max-w-6xl">
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
      <p className="text-slate-500 mt-1">Overview of your organization</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg border border-slate-200 p-5"
          >
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="text-2xl font-semibold text-slate-900 mt-2">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard