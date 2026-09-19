import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi } from './api'
import { UserRole } from '@/types'

export interface User {
  id: string
  username?: string
  email: string
  name?: string
  full_name: string
  role: UserRole
  department: string
  designation: string
  division: string
  clearance: string
  permissions: string[]
  status?: string
  last_login?: string | null
}

export const OFFICIAL_DEMO_ACCOUNTS: Record<UserRole, {
  id: string
  username: string
  email: string
  password: string
  name: string
  full_name: string
  role: UserRole
  department: string
  designation: string
  division: string
  clearance: string
  permissions: string[]
}> = {
  ADMIN: {
    id: 'usr-admin',
    username: 'admin',
    email: 'admin@railnet.gov.in',
    password: 'RailNet@2026',
    name: 'Shri V. R. Sharma, IRTS',
    full_name: 'Shri V. R. Sharma, IRTS',
    role: 'ADMIN',
    department: 'Administration & Traffic Sanction',
    designation: 'Senior Divisional Operations Manager (Sr. DOM)',
    division: 'Central Railway — Mumbai Division (HQ)',
    clearance: 'Class-A Final Human Approval Authority',
    permissions: ['*'],
  },
  PLANNER: {
    id: 'usr-planner',
    username: 'planner',
    email: 'planner@railnet.gov.in',
    password: 'RailNet@2026',
    name: 'Shri A. K. Deshmukh',
    full_name: 'Shri A. K. Deshmukh',
    role: 'PLANNER',
    department: 'Operating Department',
    designation: 'Chief Section Controller (Traffic & Planning)',
    division: 'Central Control Office, CSMT Mumbai',
    clearance: 'Corridor Capacity & Optimization Planning',
    permissions: ['READ_ALL', 'CREATE_PLAN', 'SUBMIT_PLAN', 'SIMULATE', 'REPORT_COMPLAINT'],
  },
  WORKER: {
    id: 'usr-worker',
    username: 'worker',
    email: 'worker@railnet.gov.in',
    password: 'RailNet@2026',
    name: 'Shri R. N. Patil',
    full_name: 'Shri R. N. Patil',
    role: 'WORKER',
    department: 'Civil Engineering & P-Way Depot',
    designation: 'Senior Section Engineer (P-Way / Field Staff)',
    division: 'Kalyan — Karjat Engineering Depot',
    clearance: 'Field Execution & Observation Reporting',
    permissions: ['READ_ASSIGNED', 'CREATE_WORK_ORDER', 'RECORD_DEFECT', 'RESOLVE_COMPLAINT', 'REPORT_COMPLAINT'],
  },
  VIEWER: {
    id: 'usr-viewer',
    username: 'viewer',
    email: 'viewer@railnet.gov.in',
    password: 'RailNet@2026',
    name: 'Smt. Priya Nair',
    full_name: 'Smt. Priya Nair',
    role: 'VIEWER',
    department: 'Commercial & Station Operations',
    designation: 'Station Superintendent / Rail Safety Observer',
    division: 'Mumbai Division',
    clearance: 'Operational Observation & Problem Reporting',
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
  refreshProfile: () => Promise<void>
  logout: () => Promise<void>
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
      localStorage.removeItem('railblock_access_token')
      setUser(null)
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('railblock_access_token')
      if (token) {
        try {
          const userData = await authApi.getMe()
          setUser(userData)
        } catch {
          // Token expired or invalid - clear it
          localStorage.removeItem('railblock_access_token')
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setIsLoading(false)
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

  const logout = async () => {
    try {
      await authApi.logout()
    } catch {
      // ignore network errors
    } finally {
      localStorage.removeItem('railblock_access_token')
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginAsAccount, refreshProfile, logout }}>
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
