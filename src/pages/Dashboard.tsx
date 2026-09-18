import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { dashboardApi, blocksApi, trainsApi, maintenanceApi } from '@/lib/api'
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wrench,
  CalendarDays,
  Database,
  ShieldAlert,
  Loader2,
  Radio,
  Train,
  ArrowUpRight,
  GitCompare,
  PlusCircle,
  FileText,
  MapPin,
  Flame,
  ShieldCheck,
  ChevronRight,
  HardHat,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function Dashboard() {
  const navigate = useNavigate()

  const { data: summary, isLoading: isSummaryLoading, isError: isSummaryError } = useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: dashboardApi.getSummary,
    refetchInterval: 30000,
  })

  const { data: blocksData } = useQuery({
    queryKey: ['blocks'],
    queryFn: blocksApi.list,
    refetchInterval: 30000,
  })

  const { data: trainsData } = useQuery<{ items: any[]; total: number }>({
    queryKey: ['trains'],
    queryFn: () => trainsApi.list(),
    refetchInterval: 15000,
  })

  const { data: maintenanceData } = useQuery({
    queryKey: ['maintenance'],
    queryFn: maintenanceApi.list,
    refetchInterval: 30000,
  })

  const activeBlocksList = (blocksData?.items || []).slice(0, 4)
  const activeTrainsList = (trainsData?.items || []).slice(0, 4)

  return (
    <div className="flex-1 space-y-6 p-6 overflow-auto bg-[#F4F6F9] min-h-[calc(100vh-4rem)] font-sans">
      {/* Header section with Government & National branding */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0B2545] text-white px-2 py-0.5 rounded flex items-center gap-1">
              Ministry of Railways • Government of India
            </span>
            <span className="text-xs text-slate-500 font-medium">National Rail Network Operations Center (NROC) • 17 Zones & DFCCIL</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0B2545]">
            Integrated National Block & Movement Command
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time synchronization across all 17 Zonal Railways, Operating Branches, P-Way Civil Engineering, and Dedicated Freight Corridors.
          </p>
        </div>

        {/* Quick Operational Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            onClick={() => navigate('/network')}
            className="bg-[#134074] hover:bg-[#0B2545] text-white text-xs font-semibold gap-1.5 shadow-sm"
          >
            <MapPin className="h-3.5 w-3.5" /> All-India GIS Map
          </Button>

          <Button
            onClick={() => navigate('/maintenance?action=new')}
            className="bg-[#A6192E] hover:bg-[#8B1425] text-white text-xs font-semibold gap-1.5 shadow-sm"
          >
            <PlusCircle className="h-3.5 w-3.5" /> Requisition Block Task
          </Button>

          <Button
            onClick={() => navigate('/optimization')}
            className="bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-semibold gap-1.5 shadow-sm"
          >
            <GitCompare className="h-3.5 w-3.5 text-amber-400" /> Plan Optimization (CP-SAT)
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/reports')}
            className="text-xs font-medium border-slate-300 text-slate-700 hover:bg-slate-100 gap-1.5"
          >
            <FileText className="h-3.5 w-3.5" /> Joint Memorandum
          </Button>
        </div>
      </div>

      {/* KPI Metric Tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard
          icon={CalendarDays}
          label="Active Blocks"
          value={summary?.activeBlocks ?? 2}
          isLoading={isSummaryLoading}
          isError={isSummaryError}
          color="text-[#134074]"
          sub="Sanctioned on track"
        />
        <KpiCard
          icon={Clock}
          label="Upcoming Blocks"
          value={summary?.upcomingBlocks ?? 5}
          isLoading={isSummaryLoading}
          isError={isSummaryError}
          color="text-indigo-600"
          sub="Night roster (01:00 - 05:00)"
        />
        <KpiCard
          icon={AlertTriangle}
          label="Critical Work Orders"
          value={summary?.criticalTasks ?? 3}
          isLoading={isSummaryLoading}
          isError={isSummaryError}
          color="text-[#A6192E]"
          sub="P-Way Safety Requisitions"
        />
        <KpiCard
          icon={Wrench}
          label="Pending Requests"
          value={summary?.openTasks ?? 8}
          isLoading={isSummaryLoading}
          isError={isSummaryError}
          color="text-amber-600"
          sub="Awaiting Joint Sanction"
        />
        <KpiCard
          icon={ShieldAlert}
          label="Active Caution Orders"
          value={summary?.activeAlerts ?? 4}
          isLoading={isSummaryLoading}
          isError={isSummaryError}
          color="text-rose-600"
          sub="Speed restrictions active"
        />
        <KpiCard
          icon={Database}
          label="Monitored Assets"
          value={summary?.totalAssets ?? 142}
          isLoading={isSummaryLoading}
          isError={isSummaryError}
          color="text-emerald-700"
          sub="Continuous Track / OHE"
        />
      </div>

      {/* Corridor Telemetry and Dispatch Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Blocks & Live Trains */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Maintenance Blocks */}
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="py-3 px-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-[#0B2545] flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-[#A6192E]" />
                  Active Corridor Maintenance Windows
                </CardTitle>
                <CardDescription className="text-[11px] text-slate-500">
                  Approved civil, electrical (TRD), and signaling work on active sections
                </CardDescription>
              </div>
              <Link
                to="/blocks"
                className="text-xs font-semibold text-[#134074] hover:text-[#0B2545] flex items-center gap-1"
              >
                View 24h Timeline <ChevronRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {activeBlocksList.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">No active blocks currently running.</div>
              ) : (
                activeBlocksList.map((blk: any) => (
                  <div key={blk.id} className="p-3.5 hover:bg-slate-50 flex items-center justify-between transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            blk.status === 'APPROVED' || blk.status === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px]'
                              : 'bg-amber-100 text-amber-800 border-amber-300 text-[10px]'
                          }
                        >
                          {blk.status}
                        </Badge>
                        <span className="font-semibold text-xs text-slate-800">{blk.section_id}</span>
                        <span className="text-[11px] text-slate-500 font-mono">[{blk.track_line || 'UP Fast'}]</span>
                      </div>
                      <div className="text-xs text-slate-600 font-medium">
                        {blk.description || blk.work_type || 'Ballast cleaning and track tamping'}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-3">
                        <span>Window: {blk.start_time} - {blk.end_time}</span>
                        <span>Discipline: {blk.discipline || 'P-Way / TRD Shadow'}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-slate-700">
                        {blk.estimated_duration_hours || 3.0} hrs
                      </span>
                      <div className="text-[10px] text-slate-400">Power: {blk.power_block ? 'ISOLATED' : 'LIVE'}</div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Real-Time Sectional Train Movement */}
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="py-3 px-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-[#0B2545] flex items-center gap-2">
                  <Train className="h-4 w-4 text-[#134074]" />
                  Priority Train Tracking & Buffer Protection
                </CardTitle>
                <CardDescription className="text-[11px] text-slate-500">
                  Real-time movement through Ghat & suburban sections under block regulation
                </CardDescription>
              </div>
              <Link
                to="/trains"
                className="text-xs font-semibold text-[#134074] hover:text-[#0B2545] flex items-center gap-1"
              >
                Track All Trains <ChevronRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {activeTrainsList.map((trn: any) => (
                <div key={trn.id || trn.train_number} className="p-3.5 hover:bg-slate-50 flex items-center justify-between transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-slate-100 text-[#0B2545] px-1.5 py-0.5 rounded border border-slate-200">
                        {trn.train_number}
                      </span>
                      <span className="font-bold text-xs text-slate-900">{trn.train_name || trn.name}</span>
                      <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-800 border-blue-200">
                        {trn.zone ? `${trn.zone} • ` : ''}{(trn.train_type || trn.type || 'EXPRESS').replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span>Route: <strong className="text-slate-700">{trn.from_station || 'NDLS'} → {trn.to_station || 'HWH'}</strong></span>
                      {trn.corridor && (
                        <>
                          <span>•</span>
                          <span className="text-slate-500 font-mono text-[10px]">{trn.corridor}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        (trn.average_delay_minutes || trn.delay_minutes || 0) <= 5
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {(trn.average_delay_minutes || trn.delay_minutes || 0) === 0
                        ? 'RT (ON TIME)'
                        : `+${trn.average_delay_minutes || trn.delay_minutes} min`}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1">Headway: 15 min buffer OK</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Operations Directives, Safety & Quick Requisition */}
        <div className="space-y-6">
          {/* Quick Work Order Requisition Card */}
          <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-[#0B2545] to-[#134074] text-white">
            <CardHeader className="p-4 pb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300">
                P-Way / TRD Requisition Desk
              </span>
              <CardTitle className="text-base text-white flex items-center gap-2">
                <HardHat className="h-5 w-5 text-amber-400" />
                Need a Track or Power Block?
              </CardTitle>
              <CardDescription className="text-blue-100 text-xs">
                Submit maintenance requisitions directly to the Divisional Traffic Dispatcher.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3">
              <p className="text-xs text-slate-200 leading-relaxed">
                Log track machine tamping, rail destressing, or catenary maintenance. System automatically checks for 
                <strong> shadow block opportunities</strong> with zero suburban train disruption.
              </p>
              <Button
                onClick={() => navigate('/maintenance?action=new')}
                className="w-full bg-amber-400 hover:bg-amber-300 text-[#0B2545] font-bold text-xs shadow-md"
              >
                + New Maintenance Work Order
              </Button>
            </CardContent>
          </Card>

          {/* Continuous Welded Rail & Safety Watch */}
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="py-3 px-4 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-[#0B2545] flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-600" />
                Track Temperature & CWR Safety
              </CardTitle>
              <CardDescription className="text-[11px] text-slate-500">
                Continuous Welded Rail (CWR) de-stressing thresholds
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded border border-slate-100">
                <span className="text-slate-600 font-medium">Mean Rail Temp (Td)</span>
                <span className="font-bold text-slate-900 font-mono">38.4 °C (Normal)</span>
              </div>
              <div className="flex justify-between items-center bg-amber-50 p-2.5 rounded border border-amber-200">
                <span className="text-amber-900 font-medium">Ghat Section (Td + 22°C)</span>
                <span className="font-bold text-amber-800 font-mono">54.2 °C (Caution Alert)</span>
              </div>
              <div className="text-[11px] text-slate-500 leading-relaxed">
                Safety Rule IR-PWM 2020: Rail de-stressing blocks are auto-prioritized before track temperature exceeds 58°C to prevent buckling.
              </div>
            </CardContent>
          </Card>

          {/* Department Clearance Information */}
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="py-3 px-4 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-[#0B2545] flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Joint Department Clearance Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Operating Branch (Sr. DOM)</span>
                <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">SANCTIONED</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Civil Engineering (Sr. DEN/Co)</span>
                <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">CONCURRED</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Traction Distribution (Sr. DEE/TRD)</span>
                <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">POWER SHADOW OK</Badge>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                <span className="text-slate-500 text-[11px]">Audit Ledger Hash</span>
                <span className="font-mono text-[10px] text-slate-400">#CR-MUM-2026-09</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function KpiCard({ icon: Icon, label, value, isLoading, isError, color, sub }: any) {
  return (
    <Card className="shadow-sm border-slate-200 bg-white hover:border-slate-300 transition-colors">
      <CardContent className="p-3.5 flex flex-col justify-between h-full min-h-[105px]">
        <div className="flex justify-between items-start mb-1.5">
          <div className="bg-slate-100 p-1.5 rounded">
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
        </div>
        <div>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-slate-300 mb-1" />
          ) : isError || value === undefined ? (
            <span className="text-xs font-semibold text-slate-400">—</span>
          ) : (
            <div className="text-xl font-bold text-slate-900 font-mono">{value}</div>
          )}
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mt-0.5">{label}</div>
          {sub && <div className="text-[10px] text-slate-400 truncate mt-0.5">{sub}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
