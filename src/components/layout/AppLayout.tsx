import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useRealtime } from '@/hooks/useRealtime'

/**
 * AppLayout — Root layout shell for RAILBLOCK AI
 *
 * Structure:
 * ┌──────────┬────────────────────────────┐
 * │          │  Header                    │
 * │ Sidebar  ├────────────────────────────┤
 * │          │  <Outlet /> (page content) │
 * └──────────┴────────────────────────────┘
 */
export function AppLayout() {
  const wsUrl = import.meta.env.VITE_WS_URL || ''
  useRealtime(wsUrl)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="bg-red-500 text-white text-center text-[10px] font-bold py-1 uppercase tracking-widest z-50">
          [ RAILBLOCK AI - SIH 2026 DEMO MODE - ALL DATA IS SIMULATED / SYNTHETIC ]
        </div>
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
