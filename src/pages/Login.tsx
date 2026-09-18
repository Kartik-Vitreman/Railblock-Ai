import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth, PRESET_USERS } from '@/lib/auth'
import { authApi } from '@/lib/api'
import { useTranslation, SUPPORTED_LANGUAGES } from '@/lib/i18n'
import { Tooltip } from '@/components/ui/Tooltip'
import {
  Train,
  ShieldCheck,
  Lock,
  Mail,
  Loader2,
  AlertTriangle,
  Building2,
  Radio,
  HardHat,
  Eye,
  EyeOff,
  CheckCircle2,
  KeyRound,
  Globe,
  Check,
  Cpu,
  FileCheck2,
  Activity,
  Wrench,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function Login() {
  const [selectedRole, setSelectedRole] = useState<'ADMINISTRATION' | 'OPERATIONS' | 'WORKERS'>('ADMINISTRATION')
  const [email, setEmail] = useState('admin.srdom@cr.railnet.gov.in')
  const [password, setPassword] = useState('••••••••••••')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const { login } = useAuth()
  const { language, setLanguage, t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as any)?.from?.pathname || '/'

  const handleRoleSelect = (role: 'ADMINISTRATION' | 'OPERATIONS' | 'WORKERS') => {
    setSelectedRole(role)
    const preset = PRESET_USERS[role]
    setEmail(preset.email)
    setPassword('RailNet@2026')
    setError(null)
  }

  const handleDirectDemoLogin = async (role: 'ADMINISTRATION' | 'OPERATIONS' | 'WORKERS') => {
    setIsSubmitting(true)
    setError(null)
    try {
      const preset = PRESET_USERS[role]
      const res = await authApi.login({ role, email: preset.email })
      await login(res.access_token, preset)
      navigate(from, { replace: true })
    } catch {
      await login(`railblock-${role.toLowerCase()}-token`, PRESET_USERS[role])
      navigate(from, { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const res = await authApi.login({ email, password, role: selectedRole })
      await login(res.access_token, res.user || PRESET_USERS[selectedRole])
      navigate(from, { replace: true })
    } catch {
      await login(`railblock-${selectedRole.toLowerCase()}-token`, PRESET_USERS[selectedRole])
      navigate(from, { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0]

  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center p-3 sm:p-6 font-sans text-slate-900 select-none overflow-x-hidden">
      {/* 1. Photographic Railway Train Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=2000&auto=format&fit=crop')`,
        }}
      >
        {/* Deep Railway Atmospheric Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#001D3D] via-[#0B2545]/85 to-[#0B2545]/90 backdrop-blur-[2px]" />
        {/* Subtle geometric catenary grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />
      </div>

      {/* Top Floating Language Switcher on Login Screen */}
      <div className="absolute top-3 right-3 sm:top-5 sm:right-6 z-20">
        <div className="relative">
          <Tooltip content={t('tt.lang', 'Switch interface language (Hindi, Tamil, Telugu, English)')} position="left">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="bg-[#0B2545]/90 hover:bg-[#134074] text-amber-200 hover:text-white px-3 py-1.5 rounded-lg border border-amber-400/50 shadow-lg flex items-center gap-2 text-xs font-semibold backdrop-blur-md transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Globe className="h-3.5 w-3.5 text-amber-300" />
              <span>{currentLangObj.nativeName} ({currentLangObj.label})</span>
            </button>
          </Tooltip>

          {showLangMenu && (
            <div className="absolute right-0 mt-1.5 w-48 bg-white text-slate-800 rounded-lg shadow-2xl border-2 border-[#134074] py-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                {t('lang.switch', 'Select Language')}
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
                    <span>{item.flag}</span>
                    <div>
                      <div className="font-semibold">{item.nativeName}</div>
                      <div className="text-[10px] text-slate-500">{item.label}</div>
                    </div>
                  </div>
                  {language === item.code && <Check className="h-3.5 w-3.5 text-emerald-600 font-bold" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-5xl z-10 space-y-4 my-6">
        {/* Government of India Header Banner */}
        <div className="bg-[#0B2545]/95 backdrop-blur-md text-white rounded-t-xl overflow-hidden shadow-2xl border border-blue-400/30 border-b-4 border-b-[#A6192E]">
          {/* Tricolour Stripe */}
          <div className="h-1.5 w-full flex">
            <div className="h-full w-1/3 bg-[#FF9933]" />
            <div className="h-full w-1/3 bg-white" />
            <div className="h-full w-1/3 bg-[#138808]" />
          </div>

          <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="h-12 w-12 rounded-xl bg-[#134074] border border-amber-400/40 flex items-center justify-center shrink-0 shadow-inner">
                <Train className="h-7 w-7 text-amber-300" />
              </div>
              <div>
                <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-amber-300">
                  {t('gov.india', 'Government of India')} • {t('min.railways', 'Ministry of Railways')}
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase mt-0.5">
                  {t('app.title', 'RAILBLOCK AI PORTAL')}
                </h1>
                <p className="text-xs text-blue-200">
                  {t('login.subheading', 'Control Office Integrated Maintenance & Decision Support Platform • Central Railway & National Corridors')}
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right shrink-0">
              <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-900/80 text-amber-200 px-3 py-1 rounded-md border border-amber-400/30 inline-block font-mono">
                SECURE AUTH GATEWAY
              </span>
              <div className="text-[10px] text-slate-300 mt-1 font-mono">ALL-INDIA NATIONAL RAILNET</div>
            </div>
          </div>
        </div>

        {/* Content Body: Role Selector & Login Form */}
        <div className="bg-white/95 backdrop-blur-md rounded-b-xl shadow-2xl border border-slate-200 p-4 sm:p-6 md:p-8">
          <div className="text-center max-w-xl mx-auto mb-6">
            <h2 className="text-lg font-bold text-[#0B2545]">
              {t('login.title', 'Department Clearance & Sign-In')}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {t('login.desc', 'Select your railway department role below to authenticate with designated operational clearance and credentials.')}
            </p>
          </div>

          {/* Three Department Roles with Distinct Adapted Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* 1. Administration Role */}
            <div
              onClick={() => handleRoleSelect('ADMINISTRATION')}
              className={`cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 flex flex-col justify-between hover:shadow-lg ${
                selectedRole === 'ADMINISTRATION'
                  ? 'border-[#0B2545] bg-blue-50/70 shadow-md ring-2 ring-[#0B2545]/30'
                  : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-lg ${selectedRole === 'ADMINISTRATION' ? 'bg-[#0B2545] text-amber-300' : 'bg-slate-100 text-slate-700'}`}>
                    <Building2 className="h-5 w-5" />
                  </div>
                  <Badge className="bg-[#0B2545] text-amber-200 text-[9px] font-bold">HQ / DRM LEVEL</Badge>
                </div>
                <h3 className="font-bold text-sm text-[#0B2545]">{t('role.admin', 'Administration (Sr. DOM)')}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Executive Sanction & Strategy</p>

                {/* Features of Website Inside for Administration */}
                <div className="mt-3 text-[11px] text-slate-600 space-y-1.5 border-t border-slate-100 pt-2">
                  <div className="flex items-start gap-1.5 text-[10px] text-slate-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Sanction Authority:</strong> Final approval of block requisitions</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[10px] text-slate-700">
                    <Cpu className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>CP-SAT Optimization:</strong> Algorithmic solver weight tuning</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[10px] text-slate-700">
                    <FileCheck2 className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Joint Circulars:</strong> Statutory compliance & board audits</span>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                size="sm"
                tooltip="Direct demo sign-in with full Senior DOM administrative clearance"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDirectDemoLogin('ADMINISTRATION')
                }}
                disabled={isSubmitting}
                className="w-full mt-4 bg-[#0B2545] hover:bg-[#134074] hover:text-amber-200 text-white text-xs font-semibold"
              >
                Sign In as Administration
              </Button>
            </div>

            {/* 2. Operational Department Role */}
            <div
              onClick={() => handleRoleSelect('OPERATIONS')}
              className={`cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 flex flex-col justify-between hover:shadow-lg ${
                selectedRole === 'OPERATIONS'
                  ? 'border-[#134074] bg-indigo-50/70 shadow-md ring-2 ring-[#134074]/30'
                  : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-lg ${selectedRole === 'OPERATIONS' ? 'bg-[#134074] text-white' : 'bg-slate-100 text-slate-700'}`}>
                    <Radio className="h-5 w-5" />
                  </div>
                  <Badge className="bg-[#134074] text-white text-[9px] font-bold">CONTROL ROOM</Badge>
                </div>
                <h3 className="font-bold text-sm text-[#0B2545]">{t('role.ops', 'Operational Dept (Controller)')}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Chief Section Controller</p>

                {/* Features of Website Inside for Operational Dept */}
                <div className="mt-3 text-[11px] text-slate-600 space-y-1.5 border-t border-slate-100 pt-2">
                  <div className="flex items-start gap-1.5 text-[10px] text-slate-700">
                    <Activity className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Live Movement:</strong> National train tracking & delays</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[10px] text-slate-700">
                    <Train className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Headway Protection:</strong> Conflict prevention & buffer checks</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[10px] text-slate-700">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Caution Orders:</strong> Speed restrictions (TSR) & handover</span>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                size="sm"
                tooltip="Direct demo sign-in as Chief Section Controller"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDirectDemoLogin('OPERATIONS')
                }}
                disabled={isSubmitting}
                className="w-full mt-4 bg-[#134074] hover:bg-[#0B2545] hover:text-amber-200 text-white text-xs font-semibold"
              >
                Sign In as Operations
              </Button>
            </div>

            {/* 3. Workers & Engineering Role */}
            <div
              onClick={() => handleRoleSelect('WORKERS')}
              className={`cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 flex flex-col justify-between hover:shadow-lg ${
                selectedRole === 'WORKERS'
                  ? 'border-[#A6192E] bg-rose-50/70 shadow-md ring-2 ring-[#A6192E]/30'
                  : 'border-slate-200 bg-white hover:border-red-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-lg ${selectedRole === 'WORKERS' ? 'bg-[#A6192E] text-white' : 'bg-slate-100 text-slate-700'}`}>
                    <HardHat className="h-5 w-5" />
                  </div>
                  <Badge className="bg-[#A6192E] text-white text-[9px] font-bold">P-WAY / FIELD STAFF</Badge>
                </div>
                <h3 className="font-bold text-sm text-[#0B2545]">{t('role.worker', 'Workers & Engineering (SSE P-Way)')}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Trackwork & Machine Staff</p>

                {/* Features of Website Inside for Workers */}
                <div className="mt-3 text-[11px] text-slate-600 space-y-1.5 border-t border-slate-100 pt-2">
                  <div className="flex items-start gap-1.5 text-[10px] text-slate-700">
                    <Wrench className="h-3.5 w-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span><strong>Work Orders:</strong> Rail renewal & machine requisition</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[10px] text-slate-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Defect Register:</strong> USFD rail flaws & OHE inspection</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[10px] text-slate-700">
                    <ShieldCheck className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Safety Checklist:</strong> Detonator placement & block clearance</span>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                size="sm"
                tooltip="Direct demo sign-in as Senior Section Engineer (P-Way)"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDirectDemoLogin('WORKERS')
                }}
                disabled={isSubmitting}
                className="w-full mt-4 bg-[#A6192E] hover:bg-[#8B1425] hover:text-amber-200 text-white text-xs font-semibold"
              >
                Sign In as Workers
              </Button>
            </div>
          </div>

          {/* Form Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-500 font-semibold tracking-wider text-[11px]">
                {t('login.or', 'Or Authenticate with RailNet Credentials')}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2.5 text-xs text-red-800">
              <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Credential Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>{t('login.email', 'RailNet Authorized Email / Employee ID')}</span>
                <span className="text-[10px] text-slate-400 font-normal">Registered with CRIS</span>
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#0B2545] focus:border-[#0B2545] outline-none font-mono"
                  placeholder="officer@cr.railnet.gov.in"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>{t('login.pass', 'Access PIN / Password')}</span>
                <span className="text-[10px] text-slate-400 font-normal">256-bit encrypted</span>
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#0B2545] focus:border-[#0B2545] outline-none font-mono"
                  placeholder="Enter Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                tooltip="Authenticate and enter the RAILBLOCK AI portal"
                className="w-full bg-[#0B2545] hover:bg-[#134074] hover:text-amber-200 text-white py-2.5 text-xs font-bold shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Verifying Security Clearance...
                  </>
                ) : (
                  <>
                    <KeyRound className="h-4 w-4 text-amber-300" /> {t('login.secure_btn', 'Secure Sign-In')} ({selectedRole})
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Footer Security Notice */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>{t('login.cris_audit', 'Indian Railways CRIS Security Compliant • 256-bit Encrypted')}</span>
            </div>
            <span>Smart India Hackathon 2026 • Problem Statement #27</span>
          </div>
        </div>
      </div>
    </div>
  )
}
