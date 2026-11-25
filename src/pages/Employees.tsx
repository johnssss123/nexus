import { useState } from 'react'
import { useResource } from '../hooks/useResource'
import type { Employee } from '../types'

const PAGE_SIZE = 5

function Employees() {
  const { items: employees, loading, error, create, update, remove } = useResource<Employee>('employees')
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editRole, setEditRole] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !role.trim()) return
    await create({ name, role })
    setName('')
    setRole('')
  }

  function startEdit(employee: Employee) {
    setEditingId(employee.id)
    setEditName(employee.name)
    setEditRole(employee.role)
  }

  async function saveEdit(id: number) {
    await update(id, { name: editName, role: editRole })
    setEditingId(null)
  }

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="px-8 py-8 max-w-4xl">
      <h1 className="text-2xl font-semibold text-slate-900">Employees</h1>
      <p className="text-slate-500 mt-1">Manage your organization's people</p>

      <form onSubmit={handleSubmit} className="mt-6 flex gap-3 bg-white p-4 rounded-lg border border-slate-200">
        <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)}
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <input type="text" placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)}
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">Add</button>
      </form>

      <input type="text" placeholder="Search employees..." value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        className="mt-4 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-4 bg-white rounded-lg border border-slate-200 overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-slate-500">Loading...</p>
        ) : paged.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">No employees found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500 border-b border-slate-200">
              <tr><th className="px-4 py-3 font-medium">Name</th><th className="px-4 py-3 font-medium">Role</th><th className="px-4 py-3 font-medium text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paged.map((employee) =>
                editingId === employee.id ? (
                  <tr key={employee.id}>
                    <td className="px-4 py-2"><input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full rounded border border-slate-300 px-2 py-1 text-sm" /></td>
                    <td className="px-4 py-2"><input value={editRole} onChange={(e) => setEditRole(e.target.value)} className="w-full rounded border border-slate-300 px-2 py-1 text-sm" /></td>
                    <td className="px-4 py-2 text-right space-x-2">
                      <button onClick={() => saveEdit(employee.id)} className="text-indigo-600 hover:underline">Save</button>
                      <button onClick={() => setEditingId(null)} className="text-slate-500 hover:underline">Cancel</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={employee.id}>
                    <td className="px-4 py-3 text-slate-900">{employee.name}</td>
                    <td className="px-4 py-3 text-slate-600">{employee.role}</td>
                    <td className="px-4 py-3 text-right space-x-3">
                      <button onClick={() => startEdit(employee)} className="text-indigo-600 hover:underline text-sm">Edit</button>
                      <button onClick={() => remove(employee.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="disabled:opacity-40">Previous</button>
          <span>Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  )
}

export default Employees