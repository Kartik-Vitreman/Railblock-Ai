import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi } from './api'
import { UserRole } from '@/types'

export interface User {
  id: string
  email: string
  name?: string
  full_name: string
  role: UserRole
  department: string
  designation: string
  division: string
  clearance: string
  permissions: string[]
}

export const OFFICIAL_DEMO_ACCOUNTS: Record<UserRole, User> = {
  ADMIN: {
    id: 'USR-ADMIN-01',
    email: 'admin@railnet.gov.in',
    name: 'Shri V. R. Sharma, IRTS',
    full_name: 'Shri V. R. Sharma, IRTS',
    role: 'ADMIN',
    department: 'OPERATIONS',
    designation: 'Senior Divisional Operations Manager (Sr. DOM)',
    division: 'CR-BB (Mumbai CSMT)',
    clearance: 'LEVEL-1 EXECUTIVE / STATUTORY SANCTION',
    permissions: ['*'],
  },
  PLANNER: {
    id: 'USR-PLAN-02',
    email: 'planner@railnet.gov.in',
    name: 'Shri A. K. Deshmukh',
    full_name: 'Shri A. K. Deshmukh',
    role: 'PLANNER',
    department: 'TRAFFIC',
    designation: 'Chief Section Controller (Traffic & Planning)',
    division: 'CR-BB (Central Railway)',
    clearance: 'LEVEL-2 CONTROL OFFICE & SCHEDULING',
    permissions: ['READ_ALL', 'CREATE_PLAN', 'SUBMIT_PLAN', 'SIMULATE', 'REPORT_COMPLAINT'],
  },
  WORKER: {
    id: 'USR-WORK-03',
    email: 'worker@railnet.gov.in',
    name: 'Shri R. N. Patil',
    full_name: 'Shri R. N. Patil',
    role: 'WORKER',
    department: 'CIVIL_ENGINEERING',
    designation: 'Senior Section Engineer (P-Way / Field Staff)',
    division: 'CR-BB (Kalyan - Kasara)',
    clearance: 'LEVEL-3 FIELD WORK ORDER & DEFECT LOGGING',
    permissions: ['READ_ASSIGNED', 'CREATE_WORK_ORDER', 'RECORD_DEFECT', 'RESOLVE_COMPLAINT', 'REPORT_COMPLAINT'],
  },
  VIEWER: {
    id: 'USR-VIEW-04',
    email: 'viewer@railnet.gov.in',
    name: 'Smt. Priya Nair',
    full_name: 'Smt. Priya Nair',
    role: 'VIEWER',
    department: 'STATION_SERVICES',
    designation: 'Station Superintendent / Rail Safety Observer',
    division: 'CR-BB (Central Division)',
    clearance: 'LEVEL-4 READ ONLY & DEFECT / COMPLAINT REPORTING',
    permissions: ['READ_DASHBOARD', 'READ_TRAINS', 'READ_NETWORK', 'REPORT_COMPLAINT', 'VIEW_MY_COMPLAINTS'],
  },
}

// Backward compatibility alias
export const PRESET_USERS = OFFICIAL_DEMO_ACCOUNTS

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (token: string, userData?: User) => Promise<void>
  loginAsAccount: (email: string, password?: string) => Promise<User>
  switchUser: (role: UserRole) => Promise<void>
  refreshProfile: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshProfile = async () => {
    try {
      const data = await authApi.getMe()
      setUser(data)
    } catch {
      // If token invalid, sign in as default Admin account
      try {
        const res = await authApi.login({ email: OFFICIAL_DEMO_ACCOUNTS.ADMIN.email, password: 'RailNet@2026' })
        localStorage.setItem('railblock_access_token', res.access_token)
        setUser(res.user)
      } catch {
        setUser(null)
      }
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('railblock_access_token')
      if (token) {
        try {
          const userData = await authApi.getMe()
          setUser(userData)
          setIsLoading(false)
          return
        } catch {
          // Token expired or invalid
        }
      }

      // Default initialize with Admin official session
      try {
        const res = await authApi.login({ email: OFFICIAL_DEMO_ACCOUNTS.ADMIN.email, password: 'RailNet@2026' })
        localStorage.setItem('railblock_access_token', res.access_token)
        setUser(res.user)
      } catch {
        // fallback
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (token: string, userData?: User) => {
    localStorage.setItem('railblock_access_token', token)
    if (userData) {
      setUser(userData)
      return
    }
    try {
      const data = await authApi.getMe()
      setUser(data)
    } catch {
      // handled
    }
  }

  const loginAsAccount = async (email: string, password = 'RailNet@2026'): Promise<User> => {
    setIsLoading(true)
    try {
      const res = await authApi.login({ email, password })
      localStorage.setItem('railblock_access_token', res.access_token)
      setUser(res.user)
      return res.user
    } finally {
      setIsLoading(false)
    }
  }

  const switchUser = async (role: UserRole) => {
    const account = OFFICIAL_DEMO_ACCOUNTS[role]
    if (account) {
      await loginAsAccount(account.email, 'RailNet@2026')
    }
  }

  const logout = () => {
    localStorage.removeItem('railblock_access_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginAsAccount, switchUser, refreshProfile, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
