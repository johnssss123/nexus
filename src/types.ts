export interface Employee {
  id: number
  name: string
  role: string
}

export interface Project {
  id: number
  name: string
  status: 'Planning' | 'Active' | 'Completed'
  deadline: string
}

export interface Task {
  id: number
  title: string
  status: 'To Do' | 'In Progress' | 'Done'
  projectId: number
}

export interface Invoice {
  id: number
  client: string
  amount: number
  status: 'Paid' | 'Pending' | 'Overdue'
}