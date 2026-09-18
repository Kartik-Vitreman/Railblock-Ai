import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Train,
  CalendarDays,
  FileCheck2,
  Wrench,
  ClipboardList,
  AlertTriangle,
  Database,
  GitCompare,
  Film,
  FileText,
  MapPin,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  path: string
  icon: any
  badge?: string
}

interface NavSection {
  title: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    title: 'OPERATIONS',
    items: [
      { label: 'Train Operations', path: '/trains', icon: Train },
      { label: 'Block Planning', path: '/blocks', icon: CalendarDays },
      { label: 'Schedule & Roster', path: '/network', icon: MapPin },
    ],
  },
  {
    title: 'MAINTENANCE',
    items: [
      { label: 'Maintenance Requests', path: '/maintenance', icon: Wrench },
      { label: 'Asset Intelligence', path: '/assets', icon: Database },
      { label: 'Operational Alerts', path: '/alerts', icon: AlertTriangle },
    ],
  },
  {
    title: 'AI & DECISION SUPPORT',
    items: [
      { label: 'Plan Optimization', path: '/optimization', icon: GitCompare, badge: 'CP-SAT' },
      { label: 'What-If Simulation', path: '/simulation', icon: Film },
      { label: 'Scenario Catalog', path: '/scenarios', icon: ClipboardList },
      { label: 'Official Reports', path: '/reports', icon: FileText },
    ],
  },
  {
    title: 'ADMINISTRATION & COMPLIANCE',
    items: [
      { label: 'Audit Compliance', path: '/audit', icon: FileCheck2 },
    ],
  },
]

export function Sidebar() {
  return (
    <aside className="w-64 bg-[#0B2545] text-slate-200 border-r border-[#134074] flex flex-col shrink-0 select-none text-xs font-sans">
      {/* Top Main Dashboard Link */}
      <div className="p-3 border-b border-[#134074]">
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2.5 px-3 py-2 rounded font-medium transition-colors',
              isActive
                ? 'bg-[#134074] text-white border-l-4 border-amber-400 font-bold shadow-sm'
                : 'text-slate-300 hover:bg-[#134074]/60 hover:text-white',
            )
          }
        >
          <LayoutDashboard className="h-4 w-4 text-amber-400 shrink-0" />
          <span>Control Dashboard</span>
        </NavLink>
      </div>

      {/* Nav Sections */}
      <div className="flex-1 overflow-y-auto py-2 space-y-4 px-2">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-blue-300 uppercase">
              {section.title}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between px-3 py-1.5 rounded transition-colors group',
                      isActive
                        ? 'bg-[#134074] text-white font-semibold border-l-2 border-amber-400'
                        : 'text-slate-300 hover:bg-[#134074]/50 hover:text-white',
                    )
                  }
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="h-3.5 w-3.5 text-blue-300 group-hover:text-amber-300 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1 py-0.2 rounded font-mono font-bold">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              )
            })}
          </div>
        ))}
      </div>

      {/* Footer / Department Information */}
      <div className="p-3 border-t border-[#134074] bg-[#001D3D] text-[11px] text-slate-400">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-300">Central Railway</span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
            ONLINE
          </span>
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">Control Office Application Integration</div>
      </div>
    </aside>
  )
}
