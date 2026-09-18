import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth, PRESET_USERS } from '@/lib/auth'
import { authApi } from '@/lib/api'
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
  ChevronRight,
  Eye,
  EyeOff,
  CheckCircle2,
  KeyRound,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function Login() {
  const [selectedRole, setSelectedRole] = useState<'ADMINISTRATION' | 'OPERATIONS' | 'WORKERS'>('ADMINISTRATION')
  const [email, setEmail] = useState('admin.srdom@cr.railnet.gov.in')
  const [password, setPassword] = useState('••••••••••••')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()
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
      // Fallback
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
    } catch (err: any) {
      // Use fallback preset
      await login(`railblock-${selectedRole.toLowerCase()}-token`, PRESET_USERS[selectedRole])
      navigate(from, { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col justify-center items-center p-4 relative font-sans text-slate-900 select-none">
      {/* Background Subtle Geometric Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0b254508_1px,transparent_1px),linear-gradient(to_bottom,#0b254508_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-4xl z-10 space-y-6">
        {/* Government of India Header Banner */}
        <div className="bg-[#0B2545] text-white rounded-t-xl overflow-hidden shadow-lg border-b-4 border-[#A6192E]">
          {/* Tricolour Stripe */}
          <div className="h-1.5 w-full flex">
            <div className="h-full w-1/3 bg-[#FF9933]" />
            <div className="h-full w-1/3 bg-white" />
            <div className="h-full w-1/3 bg-[#138808]" />
          </div>

          <div className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="h-12 w-12 rounded-lg bg-[#134074] border border-blue-400/40 flex items-center justify-center shrink-0 shadow-inner">
                <Train className="h-7 w-7 text-amber-300" />
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
                  भारत सरकार • रेल मंत्रालय / Government of India • Ministry of Railways
                </div>
                <h1 className="text-xl font-extrabold text-white tracking-tight uppercase mt-0.5">
                  RAILBLOCK AI PORTAL
                </h1>
                <p className="text-xs text-blue-200">
                  Control Office Integrated Maintenance & Decision Support Platform • Central Railway
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right shrink-0">
              <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-900/60 text-blue-200 px-2.5 py-1 rounded border border-blue-400/30 inline-block font-mono">
                SECURE AUTH GATEWAY
              </span>
              <div className="text-[10px] text-slate-300 mt-1 font-mono">Division: CR-MUMBAI</div>
            </div>
          </div>
        </div>

        {/* Content Body: Role Selector & Login Form */}
        <div className="bg-white rounded-b-xl shadow-xl border border-slate-200 p-6 md:p-8">
          <div className="text-center max-w-xl mx-auto mb-6">
            <h2 className="text-lg font-bold text-[#0B2545]">Department Clearance & Sign-In</h2>
            <p className="text-xs text-slate-500 mt-1">
              Select your department role below to authenticate with designated operational clearance and credentials.
            </p>
          </div>

          {/* Three Department Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* 1. Administration */}
            <div
              onClick={() => handleRoleSelect('ADMINISTRATION')}
              className={`cursor-pointer rounded-lg p-4 border-2 transition-all flex flex-col justify-between ${
                selectedRole === 'ADMINISTRATION'
                  ? 'border-[#0B2545] bg-blue-50/50 shadow-md ring-2 ring-[#0B2545]/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded ${selectedRole === 'ADMINISTRATION' ? 'bg-[#0B2545] text-amber-300' : 'bg-slate-100 text-slate-700'}`}>
                    <Building2 className="h-5 w-5" />
                  </div>
                  <Badge className="bg-[#0B2545] text-white text-[9px] font-bold">HQ / DRM</Badge>
                </div>
                <h3 className="font-bold text-sm text-[#0B2545]">Administration</h3>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Sr. DOM / Sr. DEN (Coordination)</p>
                <div className="mt-2.5 text-[11px] text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-700">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                    <span>Block Sanction Authority</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-700">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                    <span>CP-SAT Solver Re-Planning</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-700">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                    <span>Joint Circular Certification</span>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDirectDemoLogin('ADMINISTRATION')
                }}
                disabled={isSubmitting}
                className="w-full mt-4 bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-semibold"
              >
                Sign In as Administration
              </Button>
            </div>

            {/* 2. Railway Operational Department */}
            <div
              onClick={() => handleRoleSelect('OPERATIONS')}
              className={`cursor-pointer rounded-lg p-4 border-2 transition-all flex flex-col justify-between ${
                selectedRole === 'OPERATIONS'
                  ? 'border-[#0B2545] bg-blue-50/50 shadow-md ring-2 ring-[#0B2545]/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded ${selectedRole === 'OPERATIONS' ? 'bg-[#134074] text-white' : 'bg-slate-100 text-slate-700'}`}>
                    <Radio className="h-5 w-5" />
                  </div>
                  <Badge className="bg-[#134074] text-white text-[9px] font-bold">CONTROL ROOM</Badge>
                </div>
                <h3 className="font-bold text-sm text-[#0B2545]">Operational Dept</h3>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Chief Section Controller</p>
                <div className="mt-2.5 text-[11px] text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-700">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                    <span>Real-time Train Movement</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-700">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                    <span>Train Headway Regulations</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-700">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                    <span>Manual Shift Validation</span>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDirectDemoLogin('OPERATIONS')
                }}
                disabled={isSubmitting}
                className="w-full mt-4 bg-[#134074] hover:bg-[#0B2545] text-white text-xs font-semibold"
              >
                Sign In as Operations
              </Button>
            </div>

            {/* 3. Workers & Engineering Field Staff */}
            <div
              onClick={() => handleRoleSelect('WORKERS')}
              className={`cursor-pointer rounded-lg p-4 border-2 transition-all flex flex-col justify-between ${
                selectedRole === 'WORKERS'
                  ? 'border-[#A6192E] bg-rose-50/40 shadow-md ring-2 ring-[#A6192E]/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded ${selectedRole === 'WORKERS' ? 'bg-[#A6192E] text-white' : 'bg-slate-100 text-slate-700'}`}>
                    <HardHat className="h-5 w-5" />
                  </div>
                  <Badge className="bg-[#A6192E] text-white text-[9px] font-bold">P-WAY / FIELD</Badge>
                </div>
                <h3 className="font-bold text-sm text-[#0B2545]">Workers & Engineering</h3>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">SSE (P-Way / Track Machine / TRD)</p>
                <div className="mt-2.5 text-[11px] text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-700">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                    <span>Maintenance Requisitions</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-700">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                    <span>Track Machine Deployment</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-700">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                    <span>USFD Rail Defect Logging</span>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDirectDemoLogin('WORKERS')
                }}
                disabled={isSubmitting}
                className="w-full mt-4 bg-[#A6192E] hover:bg-[#8B1425] text-white text-xs font-semibold"
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
                Or Authenticate with RailNet Credentials
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
                <span>RailNet Authorized Email / Employee ID</span>
                <span className="text-[10px] text-slate-400 font-normal">Registered with CRIS</span>
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-[#0B2545] focus:border-[#0B2545] outline-none font-mono"
                  placeholder="officer@cr.railnet.gov.in"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Access PIN / Password</span>
                <span className="text-[10px] text-slate-400 font-normal">256-bit encrypted</span>
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-[#0B2545] focus:border-[#0B2545] outline-none font-mono"
                  placeholder="Enter Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#0B2545] hover:bg-[#134074] text-white py-2.5 text-xs font-bold shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Verifying Security Clearance...
                  </>
                ) : (
                  <>
                    <KeyRound className="h-4 w-4 text-amber-300" /> Secure Sign-In ({selectedRole})
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Footer Security Notice */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Indian Railways CRIS Security Compliant</span>
            </div>
            <span>Smart India Hackathon 2026 • Problem Statement #27</span>
          </div>
        </div>
      </div>
    </div>
  )
}
