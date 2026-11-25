import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/employees', label: 'Employees' },
  { to: '/projects', label: 'Projects' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/invoices', label: 'Invoices' },
]

function Layout() {
  const { user, logout } = useAuth()

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 shrink-0 bg-slate-900 text-slate-300 flex flex-col">
        <div className="px-6 py-5 border-b border-slate-800">
          <span className="text-white font-semibold text-lg tracking-tight">NEXUS</span>
          <p className="text-xs text-slate-500 mt-0.5">Business Operating System</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) => `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-slate-800">
          <p className="text-xs text-slate-400">{user?.name}</p>
          <button onClick={logout} className="text-xs text-slate-500 hover:text-white mt-1">Sign out</button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout