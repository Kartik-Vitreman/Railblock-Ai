import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi } from './api'

export interface User {
  id: string
  email: string
  full_name: string
  role: 'ADMINISTRATION' | 'OPERATIONS' | 'WORKERS' | string
  department?: string
  designation?: string
  division?: string
  clearance?: string
  permissions?: string[]
}

export const PRESET_USERS: Record<string, User> = {
  ADMINISTRATION: {
    id: 'usr-admin',
    email: 'admin.srdom@cr.railnet.gov.in',
    full_name: 'Shri V. R. Sharma, IRTS',
    designation: 'Senior Divisional Operations Manager (Sr. DOM)',
    department: 'Administration & Traffic Dispatch',
    division: 'Central Railway — Mumbai Division (HQ)',
    role: 'ADMINISTRATION',
    clearance: 'Class-A Executive Sanction',
    permissions: ['SANCTION_BLOCKS', 'SIGN_CIRCULARS', 'OVERRIDE_INTERLOCKING', 'AUDIT_ACCESS', 'OPTIMIZE_SCHEDULE'],
  },
  OPERATIONS: {
    id: 'usr-operations',
    email: 'controller.mum@cr.railnet.gov.in',
    full_name: 'Shri A. K. Deshmukh',
    designation: 'Chief Section Controller (Suburban & Ghat)',
    department: 'Railway Operational Department',
    division: 'Central Control Office, CSMT Mumbai',
    role: 'OPERATIONS',
    clearance: 'Traffic Movement & Headway Control',
    permissions: ['VIEW_LIVE_TRAINS', 'REGULATE_HEADWAYS', 'VALIDATE_MANUAL_SHIFT', 'ACKNOWLEDGE_CAUTION_ORDERS'],
  },
  WORKERS: {
    id: 'usr-worker',
    email: 'pway.sse@cr.railnet.gov.in',
    full_name: 'Shri R. N. Patil',
    designation: 'Senior Section Engineer (P-Way / Track Machine)',
    department: 'Engineering Field Workers & Maintenance',
    division: 'Kalyan — Karjat Engineering Depot',
    role: 'WORKERS',
    clearance: 'P-Way Requisition & Machine Roster',
    permissions: ['REQUISITION_MAINTENANCE', 'REPORT_USFD_DEFECT', 'REQUEST_MACHINE_ROSTER', 'LOG_TRACK_TAMPING'],
  },
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (token: string, userData?: User) => Promise<void>
  switchUser: (role: 'ADMINISTRATION' | 'OPERATIONS' | 'WORKERS') => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(PRESET_USERS.ADMINISTRATION)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const initAuth = async () => {
      const savedRole = localStorage.getItem('railblock_active_role')
      const token = localStorage.getItem('railblock_access_token')

      if (savedRole && PRESET_USERS[savedRole]) {
        setUser(PRESET_USERS[savedRole])
      } else if (token) {
        try {
          const userData = await authApi.getMe()
          setUser(userData)
        } catch {
          setUser(PRESET_USERS.ADMINISTRATION)
        }
      } else {
        localStorage.setItem('railblock_access_token', 'railblock-admin-token')
        localStorage.setItem('railblock_active_role', 'ADMINISTRATION')
        setUser(PRESET_USERS.ADMINISTRATION)
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (token: string, userData?: User) => {
    localStorage.setItem('railblock_access_token', token)
    if (userData) {
      localStorage.setItem('railblock_active_role', userData.role)
      setUser(userData)
      return
    }
    try {
      const data = await authApi.getMe()
      localStorage.setItem('railblock_active_role', data.role)
      setUser(data)
    } catch {
      setUser(PRESET_USERS.ADMINISTRATION)
    }
  }

  const switchUser = async (role: 'ADMINISTRATION' | 'OPERATIONS' | 'WORKERS') => {
    try {
      const res = await authApi.login({ role })
      localStorage.setItem('railblock_access_token', res.access_token)
      localStorage.setItem('railblock_active_role', role)
      setUser(res.user || PRESET_USERS[role])
    } catch {
      localStorage.setItem('railblock_active_role', role)
      setUser(PRESET_USERS[role])
    }
  }

  const logout = () => {
    localStorage.removeItem('railblock_access_token')
    localStorage.removeItem('railblock_active_role')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, switchUser, logout }}>
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
