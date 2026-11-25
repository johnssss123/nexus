import { useState, useEffect, useCallback } from 'react'

const BASE_URL = 'http://localhost:3001'

export function useResource<T extends { id: number }>(endpoint: string) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/${endpoint}`)
      if (!res.ok) throw new Error('Failed to fetch')
      setItems(await res.json())
      setError(null)
    } catch {
      setError(`Could not load ${endpoint}`)
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  useEffect(() => {
    load()
  }, [load])

  async function create(payload: Omit<T, 'id'>) {
    const res = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const newItem = await res.json()
    setItems((prev) => [...prev, newItem])
    return newItem
  }

  async function update(id: number, payload: Partial<T>) {
    const res = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const updated = await res.json()
    setItems((prev) => prev.map((item) => (item.id === id ? updated : item)))
    return updated
  }

  async function remove(id: number) {
    await fetch(`${BASE_URL}/${endpoint}/${id}`, { method: 'DELETE' })
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return { items, loading, error, create, update, remove }
}