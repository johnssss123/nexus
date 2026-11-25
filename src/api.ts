const BASE_URL = 'http://localhost:3001'

export async function getEmployees() {
  const response = await fetch(`${BASE_URL}/employees`)
  if (!response.ok) throw new Error('Failed to fetch employees')
  return response.json()
}

export async function createEmployee(name: string, role: string) {
  const response = await fetch(`${BASE_URL}/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, role }),
  })
  if (!response.ok) throw new Error('Failed to create employee')
  return response.json()
}