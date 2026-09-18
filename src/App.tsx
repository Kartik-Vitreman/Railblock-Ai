import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Dashboard } from '@/pages/Dashboard'
import { Login } from '@/pages/Login'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'

import { Assets } from '@/pages/Assets'
import { Maintenance } from '@/pages/Maintenance'
import { TrainOperations } from '@/pages/TrainOperations'
import { Network } from '@/pages/Network'

import { BlockPlanner } from '@/pages/BlockPlanner'
import { Optimization } from '@/pages/Optimization'
import { Simulation } from '@/pages/Simulation'
import { Scenarios } from '@/pages/Scenarios'
import { Alerts } from '@/pages/Alerts'
import { Reports } from '@/pages/Reports'
import { Audit } from '@/pages/Audit'

/**
 * RAILBLOCK AI ?" Application Router
 */
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Protected Operations Platform */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          
          <Route path="/blocks" element={<BlockPlanner />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/trains" element={<TrainOperations />} />
          <Route path="/network" element={<Network />} />
          <Route path="/optimization" element={<Optimization />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/scenarios" element={<Scenarios />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/audit" element={<Audit />} />
          
          {/* Catch-all ?" redirect unknown paths to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
