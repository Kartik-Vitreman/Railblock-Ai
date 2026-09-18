import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation, SUPPORTED_LANGUAGES, SupportedLanguage } from '@/lib/i18n'
import { Tooltip } from '@/components/ui/Tooltip'
import {
  Clock,
  LogOut,
  Train,
  Building2,
  Radio,
  HardHat,
  ChevronDown,
  Globe,
  Menu,
  Check,
} from 'lucide-react'

interface HeaderProps {
  onToggleMobileMenu?: () => void
}

export function Header({ onToggleMobileMenu }: HeaderProps) {
  const { user, switchUser, logout } = useAuth()
  const { language, setLanguage, t } = useTranslation()
  const navigate = useNavigate()
  const [istTime, setIstTime] = useState<string>('')
  const [istDate, setIstDate] = useState<string>('')
  const [showRoleMenu, setShowRoleMenu] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)

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
      ? t('role.admin', 'ADMINISTRATION (SR. DOM)')
      : user?.role === 'OPERATIONS'
      ? t('role.ops', 'OPERATIONAL DEPT (CONTROLLER)')
      : t('role.worker', 'WORKERS (SSE P-WAY)')

  const roleIcon =
    user?.role === 'ADMINISTRATION' ? (
      <Building2 className="h-3.5 w-3.5 text-amber-300" />
    ) : user?.role === 'OPERATIONS' ? (
      <Radio className="h-3.5 w-3.5 text-blue-300" />
    ) : (
      <HardHat className="h-3.5 w-3.5 text-rose-300" />
    )

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0]

  return (
    <header className="w-full bg-[#0B2545] text-white border-b-2 border-[#A6192E] shadow-sm select-none z-30 relative">
      {/* Top Tricolour Ribbon */}
      <div className="h-1 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      <div className="px-3 sm:px-4 py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
        {/* Left: Mobile Menu Toggle + Ministry & System Identity */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Mobile hamburger menu toggle */}
          {onToggleMobileMenu && (
            <Tooltip content={t('tt.mobile_menu', 'Toggle navigation menu')} position="right">
              <button
                onClick={onToggleMobileMenu}
                className="lg:hidden p-2 bg-[#134074] hover:bg-[#1a5394] text-white rounded-md border border-blue-400/30 transition-colors cursor-pointer"
                aria-label="Toggle navigation"
              >
                <Menu className="h-4 w-4" />
              </button>
            </Tooltip>
          )}

          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded bg-[#134074] border border-blue-400/30 flex items-center justify-center shrink-0 shadow-inner">
            <Train className="h-5 w-5 sm:h-6 sm:w-6 text-amber-300" />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-[10px] sm:text-[11px] font-semibold tracking-wider text-amber-300 uppercase">
              <span>{t('gov.india', 'Government of India')}</span>
              <span className="text-blue-300 text-[10px]">|</span>
              <span className="text-slate-200">{t('min.railways', 'Ministry of Railways')}</span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <Link
                to="/"
                className="text-sm sm:text-base font-bold tracking-tight text-white uppercase font-sans hover:text-amber-200 transition-colors"
              >
                {t('app.title', 'RAILBLOCK AI')}
              </Link>
              <span className="text-[11px] text-blue-200 font-medium hidden xl:inline truncate max-w-md">
                — {t('app.subtitle', 'Integrated Maintenance Block Planning & Decision Support')}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Language Switcher, IST Clock, Role Clearance Switcher & Sign Out */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 text-xs">
          {/* 1. Language Button at Top (Hindi, Tamil, Telugu, English) */}
          <div className="relative">
            <Tooltip content={t('tt.lang', 'Change language / भाषा / மொழி / భాష')} position="bottom">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="bg-[#134074] hover:bg-[#1a5394] px-2.5 py-1.5 rounded border border-amber-400/40 text-amber-200 hover:text-white flex items-center gap-1.5 transition-all duration-200 font-medium shadow-sm active:scale-95 cursor-pointer"
              >
                <Globe className="h-3.5 w-3.5 text-amber-300" />
                <span className="font-bold text-[11px] tracking-wide font-sans">
                  {currentLangObj.nativeName} ({currentLangObj.label})
                </span>
                <ChevronDown className="h-3 w-3 text-amber-300 ml-0.5" />
              </button>
            </Tooltip>

            {/* Language Selection Dropdown Menu */}
            {showLangMenu && (
              <div className="absolute right-0 mt-1.5 w-48 bg-white text-slate-800 rounded-lg shadow-2xl border-2 border-[#134074] py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
                  <span>{t('lang.switch', 'Select Language')}</span>
                  <Globe className="h-3 w-3 text-slate-400" />
                </div>

                {SUPPORTED_LANGUAGES.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      setLanguage(item.code)
                      setShowLangMenu(false)
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-blue-50 transition-colors cursor-pointer ${
                      language === item.code ? 'bg-blue-50 font-bold text-[#0B2545]' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{item.flag}</span>
                      <div>
                        <div className="font-semibold text-xs">{item.nativeName}</div>
                        <div className="text-[10px] text-slate-500">{item.label}</div>
                      </div>
                    </div>
                    {language === item.code && <Check className="h-3.5 w-3.5 text-emerald-600 font-bold" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Live IST Clock */}
          <Tooltip content={t('tt.clock', 'Indian Standard Time (IST) synchronized with CRIS NTP')} position="bottom">
            <div className="bg-[#134074]/80 px-2.5 py-1 rounded border border-blue-400/20 text-slate-200 flex flex-col items-start font-mono cursor-default">
              <span className="text-[9px] uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1">
                <Clock className="h-2.5 w-2.5" /> {t('clock.ist', 'IST Control Clock')}
              </span>
              <span className="font-bold text-white text-[11px] sm:text-[12px] tracking-wide">
                {istTime || '12:00:00'} <span className="text-[10px] text-blue-200 font-sans font-normal hidden sm:inline">{istDate}</span>
              </span>
            </div>
          </Tooltip>

          {/* 3. Role Clearance & Department Switcher */}
          <div className="relative">
            <Tooltip content={t('tt.role', 'Switch operational role (Administration, Operations, Workers)')} position="bottom">
              <div
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="cursor-pointer bg-[#134074] hover:bg-[#1a5394] px-2.5 py-1 rounded border border-blue-400/30 flex items-center gap-2 transition-all duration-200 active:scale-95 shadow-sm"
              >
                <div className="flex flex-col text-right min-w-[120px] sm:min-w-[150px]">
                  <div className="flex items-center justify-end gap-1.5">
                    {roleIcon}
                    <span className="text-[9px] uppercase font-bold tracking-wider text-amber-300 truncate max-w-[130px] sm:max-w-none">
                      {roleLabel}
                    </span>
                  </div>
                  <span className="font-semibold text-white text-[10px] sm:text-[11px] truncate max-w-[140px] sm:max-w-[180px]">
                    {user?.full_name || 'Railway Officer'}
                  </span>
                </div>
                <ChevronDown className="h-3 w-3 text-blue-200" />
              </div>
            </Tooltip>

            {/* Role Switch Dropdown */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-1.5 w-72 bg-white text-slate-800 rounded-lg shadow-2xl border-2 border-[#134074] py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                  {t('role.switch', 'Switch Active Role Clearance')}
                </div>

                <button
                  onClick={() => handleRoleSwitch('ADMINISTRATION')}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-blue-50 transition-colors cursor-pointer ${
                    user?.role === 'ADMINISTRATION' ? 'bg-blue-50 font-bold text-[#0B2545]' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded bg-blue-100 text-[#0B2545]">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0B2545]">{t('role.admin', 'Administration (Sr. DOM)')}</div>
                      <div className="text-[10px] text-slate-500 font-normal">Sanction Authority & Solver Tuning</div>
                    </div>
                  </div>
                  {user?.role === 'ADMINISTRATION' && <span className="text-[10px] text-emerald-600 font-bold">ACTIVE</span>}
                </button>

                <button
                  onClick={() => handleRoleSwitch('OPERATIONS')}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-blue-50 transition-colors cursor-pointer ${
                    user?.role === 'OPERATIONS' ? 'bg-blue-50 font-bold text-[#134074]' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded bg-indigo-100 text-[#134074]">
                      <Radio className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#134074]">{t('role.ops', 'Operational Dept (Controller)')}</div>
                      <div className="text-[10px] text-slate-500 font-normal">Train Headways & Punctuality</div>
                    </div>
                  </div>
                  {user?.role === 'OPERATIONS' && <span className="text-[10px] text-emerald-600 font-bold">ACTIVE</span>}
                </button>

                <button
                  onClick={() => handleRoleSwitch('WORKERS')}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-rose-50 transition-colors cursor-pointer ${
                    user?.role === 'WORKERS' ? 'bg-rose-50 font-bold text-[#A6192E]' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded bg-rose-100 text-[#A6192E]">
                      <HardHat className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#A6192E]">{t('role.worker', 'Workers & Engineering (SSE P-Way)')}</div>
                      <div className="text-[10px] text-slate-500 font-normal">Field Trackwork & Defect Requisitions</div>
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
                  className="w-full text-left px-3 py-1.5 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" /> {t('sign.out', 'Sign Out of RailNet')}
                </button>
              </div>
            )}
          </div>

          {/* 4. Logout Button */}
          <Tooltip content={t('tt.logout', 'Sign out of current RailNet session')} position="bottom">
            <button
              onClick={() => {
                logout()
                navigate('/login')
              }}
              className="p-1.5 bg-[#134074]/80 hover:bg-red-900/60 text-slate-300 hover:text-red-200 rounded border border-blue-400/20 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </Tooltip>
        </div>
      </div>
    </header>
  )
}
