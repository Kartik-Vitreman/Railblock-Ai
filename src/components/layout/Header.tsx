import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bell,
  ShieldCheck,
  Clock,
  UserCheck,
  LogOut,
  Train,
  Building2,
  Radio,
  HardHat,
  ChevronDown,
  ArrowRightLeft,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function Header() {
  const { user, switchUser, logout } = useAuth()
  const navigate = useNavigate()
  const [istTime, setIstTime] = useState<string>('')
  const [istDate, setIstDate] = useState<string>('')
  const [showRoleMenu, setShowRoleMenu] = useState(false)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const istOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }
      const dateOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
      setIstTime(new Intl.DateTimeFormat('en-IN', istOptions).format(now))
      setIstDate(new Intl.DateTimeFormat('en-IN', dateOptions).format(now))
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleRoleSwitch = (role: 'ADMINISTRATION' | 'OPERATIONS' | 'WORKERS') => {
    switchUser(role)
    setShowRoleMenu(false)
  }

  const roleLabel =
    user?.role === 'ADMINISTRATION'
      ? 'ADMINISTRATION (SR. DOM)'
      : user?.role === 'OPERATIONS'
      ? 'OPERATIONAL DEPT (CONTROLLER)'
      : 'WORKERS (SSE P-WAY)'

  const roleIcon =
    user?.role === 'ADMINISTRATION' ? (
      <Building2 className="h-3 w-3 text-amber-300" />
    ) : user?.role === 'OPERATIONS' ? (
      <Radio className="h-3 w-3 text-blue-300" />
    ) : (
      <HardHat className="h-3 w-3 text-rose-300" />
    )

  return (
    <header className="w-full bg-[#0B2545] text-white border-b-2 border-[#A6192E] shadow-sm select-none z-30 relative">
      {/* Top Tricolour Ribbon */}
      <div className="h-1 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      <div className="px-4 py-2.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Ministry & System Identity */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded bg-[#134074] border border-blue-400/30 flex items-center justify-center shrink-0 shadow-inner">
            <Train className="h-6 w-6 text-amber-300" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-wider text-amber-300 uppercase">
                भारत सरकार / Government of India
              </span>
              <span className="text-blue-300 text-[10px]">|</span>
              <span className="text-[11px] font-semibold tracking-wider text-slate-200 uppercase">
                रेल मंत्रालय / Ministry of Railways
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <Link to="/" className="text-base font-bold tracking-tight text-white uppercase font-sans hover:text-blue-200">
                RAILBLOCK AI
              </Link>
              <span className="text-xs text-blue-200 font-medium hidden sm:inline">
                — Integrated Maintenance Block Planning & Decision Support System
              </span>
            </div>
          </div>
        </div>

        {/* Operational Context, Live Clock & Multi-Role User Switcher */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs">
          {/* Live IST Clock */}
          <div className="bg-[#134074]/80 px-2.5 py-1 rounded border border-blue-400/20 text-slate-200 flex flex-col items-start font-mono">
            <span className="text-[9px] uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1">
              <Clock className="h-2.5 w-2.5" /> IST Control Clock
            </span>
            <span className="font-bold text-white text-[12px] tracking-wide">
              {istTime || '12:00:00'} <span className="text-[10px] text-blue-200 font-sans font-normal">{istDate}</span>
            </span>
          </div>

          {/* Role Clearance & Department Switcher */}
          <div className="relative">
            <div
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="cursor-pointer bg-[#134074] hover:bg-[#1a5394] px-2.5 py-1 rounded border border-blue-400/30 flex items-center gap-2 transition-colors"
            >
              <div className="flex flex-col text-right min-w-[150px]">
                <div className="flex items-center justify-end gap-1.5">
                  {roleIcon}
                  <span className="text-[9px] uppercase font-bold tracking-wider text-amber-300">
                    {roleLabel}
                  </span>
                </div>
                <span className="font-semibold text-white text-[11px] truncate max-w-[180px]">
                  {user?.full_name || 'Shri V. R. Sharma, IRTS'}
                </span>
              </div>
              <ChevronDown className="h-3 w-3 text-blue-200" />
            </div>

            {/* Role Switch Dropdown */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-1 w-64 bg-white text-slate-800 rounded-md shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                  Switch Active Role Clearance
                </div>

                <button
                  onClick={() => handleRoleSwitch('ADMINISTRATION')}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-blue-50 transition-colors ${
                    user?.role === 'ADMINISTRATION' ? 'bg-blue-50 font-bold text-[#0B2545]' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-[#0B2545]" />
                    <div>
                      <div className="text-xs">Administration (Sr. DOM)</div>
                      <div className="text-[10px] text-slate-500 font-normal">Sanction & Executive</div>
                    </div>
                  </div>
                  {user?.role === 'ADMINISTRATION' && <span className="text-[10px] text-emerald-600 font-bold">ACTIVE</span>}
                </button>

                <button
                  onClick={() => handleRoleSwitch('OPERATIONS')}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-blue-50 transition-colors ${
                    user?.role === 'OPERATIONS' ? 'bg-blue-50 font-bold text-[#134074]' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Radio className="h-3.5 w-3.5 text-[#134074]" />
                    <div>
                      <div className="text-xs">Operational Dept (Controller)</div>
                      <div className="text-[10px] text-slate-500 font-normal">Train Headways & Movement</div>
                    </div>
                  </div>
                  {user?.role === 'OPERATIONS' && <span className="text-[10px] text-emerald-600 font-bold">ACTIVE</span>}
                </button>

                <button
                  onClick={() => handleRoleSwitch('WORKERS')}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-rose-50 transition-colors ${
                    user?.role === 'WORKERS' ? 'bg-rose-50 font-bold text-[#A6192E]' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <HardHat className="h-3.5 w-3.5 text-[#A6192E]" />
                    <div>
                      <div className="text-xs">Workers & Field Engineering</div>
                      <div className="text-[10px] text-slate-500 font-normal">SSE P-Way & Track Machines</div>
                    </div>
                  </div>
                  {user?.role === 'WORKERS' && <span className="text-[10px] text-emerald-600 font-bold">ACTIVE</span>}
                </button>

                <div className="border-t border-slate-100 my-1"></div>

                <button
                  onClick={() => {
                    logout()
                    navigate('/login')
                  }}
                  className="w-full text-left px-3 py-1.5 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                >
                  <LogOut className="h-3.5 w-3.5" /> Sign Out of RailNet
                </button>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              logout()
              navigate('/login')
            }}
            title="Logout Session"
            className="p-1.5 bg-[#134074]/60 hover:bg-red-900/50 text-slate-300 hover:text-red-300 rounded border border-blue-400/20 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  )
}
