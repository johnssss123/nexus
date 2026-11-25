import { useState } from 'react'
import { useResource } from '../hooks/useResource'
import type { Invoice } from '../types'

const statusColors: Record<Invoice['status'], string> = {
  Paid: 'bg-green-100 text-green-700',
  Pending: 'bg-amber-100 text-amber-700',
  Overdue: 'bg-red-100 text-red-700',
}

function Invoices() {
  const { items: invoices, loading, error, create, remove } = useResource<Invoice>('invoices')
  const [client, setClient] = useState('')
  const [amount, setAmount] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!client.trim() || !amount) return
    await create({ client, amount: Number(amount), status: 'Pending' })
    setClient('')
    setAmount('')
  }

  const total = invoices.reduce((sum, inv) => sum + inv.amount, 0)

  return (
    <div className="px-8 py-8 max-w-4xl">
      <h1 className="text-2xl font-semibold text-slate-900">Invoices</h1>
      <p className="text-slate-500 mt-1">Total billed: ${total.toLocaleString()}</p>

      <form onSubmit={handleSubmit} className="mt-6 flex gap-3 bg-white p-4 rounded-lg border border-slate-200">
        <input type="text" placeholder="Client name" value={client} onChange={(e) => setClient(e.target.value)}
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)}
          className="w-32 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">Add</button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 bg-white rounded-lg border border-slate-200 overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-slate-500">Loading...</p>
        ) : invoices.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">No invoices yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500 border-b border-slate-200">
              <tr><th className="px-4 py-3 font-medium">Client</th><th className="px-4 py-3 font-medium">Amount</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-4 py-3 text-slate-900">{invoice.client}</td>
                  <td className="px-4 py-3 text-slate-600">${invoice.amount.toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[invoice.status]}`}>{invoice.status}</span></td>
                  <td className="px-4 py-3 text-right"><button onClick={() => remove(invoice.id)} className="text-red-600 hover:underline text-sm">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Invoices