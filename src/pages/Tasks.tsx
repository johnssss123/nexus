import { useState } from 'react'
import { useResource } from '../hooks/useResource'
import type { Task } from '../types'

function Tasks() {
  const { items: tasks, loading, error, create, update, remove } = useResource<Task>('tasks')
  const [title, setTitle] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    await create({ title, status: 'To Do', projectId: 1 })
    setTitle('')
  }

  async function cycleStatus(task: Task) {
    const next: Record<Task['status'], Task['status']> = { 'To Do': 'In Progress', 'In Progress': 'Done', Done: 'To Do' }
    await update(task.id, { status: next[task.status] })
  }

  return (
    <div className="px-8 py-8 max-w-4xl">
      <h1 className="text-2xl font-semibold text-slate-900">Tasks</h1>
      <p className="text-slate-500 mt-1">Click a status badge to advance it</p>

      <form onSubmit={handleSubmit} className="mt-6 flex gap-3 bg-white p-4 rounded-lg border border-slate-200">
        <input type="text" placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)}
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">Add</button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 space-y-2">
        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : tasks.length === 0 ? (
          <p className="text-sm text-slate-500">No tasks yet.</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="bg-white rounded-lg border border-slate-200 px-4 py-3 flex items-center justify-between">
              <span className="text-slate-900 text-sm">{task.title}</span>
              <div className="flex items-center gap-3">
                <button onClick={() => cycleStatus(task)} className={`px-2 py-1 rounded-full text-xs font-medium ${
                  task.status === 'Done' ? 'bg-green-100 text-green-700' : task.status === 'In Progress' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                }`}>{task.status}</button>
                <button onClick={() => remove(task.id)} className="text-red-600 hover:underline text-sm">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Tasks
