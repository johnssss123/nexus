import { useState } from 'react'
import { useResource } from '../hooks/useResource'
import type { Project } from '../types'

const statusColors: Record<Project['status'], string> = {
  Planning: 'bg-slate-100 text-slate-700',
  Active: 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
}

function Projects() {
  const { items: projects, loading, error, create, remove } = useResource<Project>('projects')
  const [name, setName] = useState('')
  const [deadline, setDeadline] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    await create({ name, status: 'Planning', deadline })
    setName('')
    setDeadline('')
  }

  return (
    <div className="px-8 py-8 max-w-4xl">
      <h1 className="text-2xl font-semibold text-slate-900">Projects</h1>
      <p className="text-slate-500 mt-1">Track active and upcoming work</p>

      <form onSubmit={handleSubmit} className="mt-6 flex gap-3 bg-white p-4 rounded-lg border border-slate-200">
        <input type="text" placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)}
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">Add</button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 bg-white rounded-lg border border-slate-200 overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-slate-500">Loading...</p>
        ) : projects.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">No projects yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500 border-b border-slate-200">
              <tr><th className="px-4 py-3 font-medium">Name</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Deadline</th><th className="px-4 py-3 font-medium text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((project) => (
                <tr key={project.id}>
                  <td className="px-4 py-3 text-slate-900">{project.name}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>{project.status}</span></td>
                  <td className="px-4 py-3 text-slate-600">{project.deadline || '—'}</td>
                  <td className="px-4 py-3 text-right"><button onClick={() => remove(project.id)} className="text-red-600 hover:underline text-sm">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Projects