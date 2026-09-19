import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { complaintsApi, usersApi, getApiErrorMessage } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { useTranslation } from '@/lib/i18n'
import { Tooltip } from '@/components/ui/Tooltip'
import { Complaint, UserRole } from '@/types'
import {
  AlertTriangle,
  LifeBuoy,
  PlusCircle,
  Search,
  CheckCircle2,
  Clock,
  User,
  MapPin,
  Building2,
  Filter,
  RefreshCw,
  X,
  MessageSquare,
  ShieldCheck,
  HardHat,
  Trash2,
  ChevronRight,
  Send,
  SlidersHorizontal,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const CATEGORIES = [
  { value: 'TRACK_DEFECT', label: 'Track Defect / Rail Flaw', icon: HardHat, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { value: 'SIGNAL_FAILURE', label: 'Signal & Interlocking Failure', icon: AlertTriangle, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { value: 'OHE_TRACTION', label: 'OHE / Traction Power Cut', icon: SlidersHorizontal, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { value: 'SAFETY_HAZARD', label: 'Operational Safety Hazard', icon: ShieldCheck, color: 'text-red-700 bg-red-50 border-red-200' },
  { value: 'STATION_AMENITY', label: 'Station Platform & Amenity', icon: Building2, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { value: 'TRAIN_DELAY_ISSUE', label: 'Train Movement / Punctuality', icon: Clock, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  { value: 'OTHER', label: 'Other Operational Issue', icon: LifeBuoy, color: 'text-slate-600 bg-slate-50 border-slate-200' },
]

const PRIORITIES = [
  { value: 'LOW', label: 'Low', badgeColor: 'bg-slate-100 text-slate-700 border-slate-300' },
  { value: 'MEDIUM', label: 'Medium', badgeColor: 'bg-blue-100 text-blue-800 border-blue-300' },
  { value: 'HIGH', label: 'High', badgeColor: 'bg-amber-100 text-amber-800 border-amber-300' },
  { value: 'CRITICAL', label: 'Critical / Safety Risk', badgeColor: 'bg-rose-100 text-rose-800 border-rose-300 font-bold' },
]

export function Complaints() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()

  const [isNewModalOpen, setIsNewModalOpen] = useState(searchParams.get('action') === 'new')
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  // New Complaint Form State
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newCategory, setNewCategory] = useState<string>('TRACK_DEFECT')
  const [newPriority, setNewPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM')
  const [newLocation, setNewLocation] = useState('KM 128/4, Kalyan - Kasara Main Line')
  const [newStation, setNewStation] = useState('KYN')
  const [newZone, setNewZone] = useState('CR')
  const [formError, setFormError] = useState<string | null>(null)

  // Worker/Admin action states
  const [workerNotes, setWorkerNotes] = useState('')
  const [resolutionSummary, setResolutionSummary] = useState('')
  const [assignWorkerId, setAssignWorkerId] = useState('')

  // Queries
  const { data: complaintsData, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['complaints', statusFilter, categoryFilter],
    queryFn: () => complaintsApi.list({
      status: statusFilter !== 'ALL' ? statusFilter : undefined,
      category: categoryFilter !== 'ALL' ? categoryFilter : undefined,
    }),
    refetchInterval: 15000,
  })

  // Users query for Admin assignment
  const { data: usersData } = useQuery({
    queryKey: ['usersList'],
    queryFn: usersApi.list,
    enabled: user?.role === 'ADMIN',
  })

  const complaints: Complaint[] = (complaintsData?.items || []) as Complaint[]

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: any) => complaintsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] })
      setIsNewModalOpen(false)
      setNewTitle('')
      setNewDesc('')
      setFormError(null)
      searchParams.delete('action')
      setSearchParams(searchParams)
    },
    onError: (err) => {
      setFormError(getApiErrorMessage(err))
    },
  })

  const assignMutation = useMutation({
    mutationFn: ({ id, workerId, priority }: { id: string; workerId: string; priority?: string }) =>
      complaintsApi.assign(id, workerId, priority),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] })
      if (selectedComplaint && selectedComplaint.id === data.id) {
        setSelectedComplaint(data)
      }
    },
  })

  const workerUpdateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      complaintsApi.workerUpdate(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] })
      if (selectedComplaint && selectedComplaint.id === data.id) {
        setSelectedComplaint(data)
      }
      setWorkerNotes('')
      setResolutionSummary('')
    },
  })

  const statusUpdateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      complaintsApi.updateStatus(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] })
      if (selectedComplaint && selectedComplaint.id === data.id) {
        setSelectedComplaint(data)
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => complaintsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] })
      setSelectedComplaint(null)
    },
  })

  // Form Submit
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    createMutation.mutate({
      title: newTitle,
      description: newDesc,
      category: newCategory,
      priority: newPriority,
      location: newLocation,
      station: newStation,
      zone: newZone,
    })
  }

  // Filtered complaints
  const filteredComplaints = complaints.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchTitle = c.title.toLowerCase().includes(q)
      const matchDesc = c.description.toLowerCase().includes(q)
      const matchLoc = (c.location || '').toLowerCase().includes(q)
      const matchId = c.id.toLowerCase().includes(q)
      if (!matchTitle && !matchDesc && !matchLoc && !matchId) return false
    }
    return true
  })

  // Metrics
  const totalCount = complaints.length
  const submittedCount = complaints.filter((c) => String(c.status).toUpperCase() === 'SUBMITTED').length
  const inProgressCount = complaints.filter((c) => ['IN_PROGRESS', 'IN PROGRESS', 'ASSIGNED'].includes(String(c.status).toUpperCase())).length
  const resolvedCount = complaints.filter((c) => ['RESOLVED', 'CLOSED'].includes(String(c.status).toUpperCase())).length

  const getStatusBadge = (status: string) => {
    const s = String(status).toUpperCase()
    if (s === 'SUBMITTED') return <Badge className="bg-amber-100 text-amber-900 border-amber-300">SUBMITTED</Badge>
    if (s === 'ASSIGNED') return <Badge className="bg-blue-100 text-blue-900 border-blue-300">ASSIGNED</Badge>
    if (s === 'IN_PROGRESS' || s === 'IN PROGRESS') return <Badge className="bg-purple-100 text-purple-900 border-purple-300">IN PROGRESS</Badge>
    if (s === 'RESOLVED') return <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300">RESOLVED</Badge>
    if (s === 'CLOSED') return <Badge className="bg-slate-100 text-slate-800 border-slate-300">CLOSED</Badge>
    return <Badge>{status}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const p = PRIORITIES.find((item) => item.value === priority) || PRIORITIES[1]
    return <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${p.badgeColor}`}>{p.label}</span>
  }

  return (
    <div className="flex-1 space-y-5 p-3 sm:p-5 md:p-6 overflow-auto bg-[#F4F6F9] min-h-[calc(100vh-4rem)] font-sans">
      {/* Header Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-800 text-teal-100 px-2.5 py-0.5 rounded flex items-center gap-1">
              <LifeBuoy className="h-3 w-3" /> {t('complaints.title', 'Operational Problem & Complaint Reporting')}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              CRIS Integrated Ticketing System • Safety & Defect Redressal
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0B2545] tracking-tight">
            RailNet Problem & Incident Resolution Desk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Report track flaws, signaling delays, safety hazards, or station problems. Managed transparently under Indian Railways RBAC rules.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => refetch()}
            variant="outline"
            tooltip="Refresh complaint records"
            className="text-xs border-slate-300 hover:bg-slate-100 gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            onClick={() => setIsNewModalOpen(true)}
            tooltip="Report a new operational problem or defect"
            className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold gap-1.5 shadow-md"
          >
            <PlusCircle className="h-4 w-4 text-teal-200" />
            <span>Report Problem / Complaint</span>
          </Button>
        </div>
      </div>

      {/* Statistics Metric Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3.5 bg-white border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Complaints</div>
          <div className="mt-1 text-2xl font-black text-slate-900 font-mono">{totalCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Logged across division</div>
        </Card>
        <Card className="p-3.5 bg-amber-50/50 border-amber-200 shadow-xs">
          <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Pending Action</div>
          <div className="mt-1 text-2xl font-black text-amber-900 font-mono">{submittedCount}</div>
          <div className="text-[10px] text-amber-700 mt-0.5">Awaiting investigation</div>
        </Card>
        <Card className="p-3.5 bg-purple-50/50 border-purple-200 shadow-xs">
          <div className="text-[11px] font-bold text-purple-800 uppercase tracking-wider">Under Rectification</div>
          <div className="mt-1 text-2xl font-black text-purple-900 font-mono">{inProgressCount}</div>
          <div className="text-[10px] text-purple-700 mt-0.5">Field staff deployed</div>
        </Card>
        <Card className="p-3.5 bg-emerald-50/50 border-emerald-200 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Resolved / Closed</div>
          <div className="mt-1 text-2xl font-black text-emerald-900 font-mono">{resolvedCount}</div>
          <div className="text-[10px] text-emerald-700 mt-0.5">Action verified & signed off</div>
        </Card>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1 mr-1">
            <Filter className="h-3.5 w-3.5 text-slate-500" /> Filter:
          </span>

          {/* Status Pills */}
          {['ALL', 'SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#0B2545] text-white font-bold shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, location, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#0B2545] focus:border-[#0B2545] outline-none"
          />
        </div>
      </div>

      {/* Main Grid: Complaints List and Details Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Complaints List (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-3">
          {isLoading ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
              Loading complaints register...
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
              <LifeBuoy className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <div className="font-bold text-slate-700">No complaints matching filter</div>
              <p className="text-slate-400 mt-1">
                You can report a new operational problem or defect by clicking the button above.
              </p>
            </div>
          ) : (
            filteredComplaints.map((item) => {
              const isSelected = selectedComplaint?.id === item.id
              const catObj = CATEGORIES.find((c) => c.value === item.category) || CATEGORIES[6]
              const CatIcon = catObj.icon
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedComplaint(item)}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer bg-white ${
                    isSelected
                      ? 'border-[#0B2545] ring-2 ring-[#0B2545]/30 shadow-md'
                      : 'border-slate-200 hover:border-blue-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`p-2 rounded-lg shrink-0 border ${catObj.color}`}>
                        <CatIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border">
                            {item.id}
                          </span>
                          {getStatusBadge(item.status)}
                          {getPriorityBadge(item.priority)}
                        </div>
                        <h3 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 mt-1" />
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        {item.location} {item.station ? `(${item.station})` : ''}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3 text-slate-400" />
                        By: <strong className="text-slate-700">{item.reported_by_name}</strong> ({item.reported_by_role})
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400">
                      {new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Selected Complaint Detail & RBAC Actions (5 cols on desktop) */}
        <div className="lg:col-span-5">
          {selectedComplaint ? (
            <Card className="border-slate-200 shadow-sm bg-white sticky top-4">
              <CardHeader className="p-4 border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border">
                      {selectedComplaint.id}
                    </span>
                    {getStatusBadge(selectedComplaint.status)}
                  </div>
                  {getPriorityBadge(selectedComplaint.priority)}
                </div>
                <CardTitle className="text-base font-bold text-[#0B2545] mt-2">
                  {selectedComplaint.title}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Reported by {selectedComplaint.reported_by_name} ({selectedComplaint.reported_by_role}) • {selectedComplaint.zone} Zone
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 space-y-4 text-xs">
                {/* Location & Details */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <MapPin className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                    <span><strong>Location:</strong> {selectedComplaint.location}</span>
                  </div>
                  {selectedComplaint.station && (
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Building2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                      <span><strong>Nearest Station:</strong> {selectedComplaint.station}</span>
                    </div>
                  )}
                  <div className="text-slate-600 pt-1 leading-relaxed border-t border-slate-200">
                    {selectedComplaint.description}
                  </div>
                </div>

                {/* Assignment & Investigation Details */}
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-[#0B2545]" /> Investigation & Rectification Trail
                  </h4>

                  {selectedComplaint.assigned_to_name ? (
                    <div className="p-2.5 rounded bg-blue-50 border border-blue-200 text-blue-900">
                      <strong>Assigned Field Staff:</strong> {selectedComplaint.assigned_to_name}
                    </div>
                  ) : (
                    <div className="p-2.5 rounded bg-amber-50 border border-amber-200 text-amber-800">
                      Not yet assigned to field staff.
                    </div>
                  )}

                  {selectedComplaint.investigation_notes && (
                    <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-slate-700">
                      <strong>Investigation Notes:</strong> {selectedComplaint.investigation_notes}
                    </div>
                  )}

                  {selectedComplaint.resolution_summary && (
                    <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-900">
                      <strong>Resolution Summary:</strong> {selectedComplaint.resolution_summary}
                    </div>
                  )}
                </div>

                {/* ROLE-BASED ACTIONS */}
                {/* 1. Worker Actions */}
                {user?.role === 'WORKER' && (
                  <div className="space-y-3 pt-3 border-t border-slate-200">
                    <h4 className="font-bold text-[#A6192E] text-xs flex items-center gap-1.5">
                      <HardHat className="h-4 w-4" /> Field Staff Action Console
                    </h4>
                    <div className="space-y-2">
                      <textarea
                        rows={2}
                        placeholder="Add field inspection notes (e.g., Track inspected at KM 128/4, crack clamped with fishplate)..."
                        value={workerNotes}
                        onChange={(e) => setWorkerNotes(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded text-xs outline-none focus:ring-1 focus:ring-rose-500"
                      />
                      <textarea
                        rows={2}
                        placeholder="Resolution summary if work is completed..."
                        value={resolutionSummary}
                        onChange={(e) => setResolutionSummary(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded text-xs outline-none focus:ring-1 focus:ring-rose-500"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            workerUpdateMutation.mutate({
                              id: selectedComplaint.id,
                              payload: { worker_notes: workerNotes, resolution_summary: resolutionSummary, mark_resolved: false },
                            })
                          }}
                          disabled={workerUpdateMutation.isPending || (!workerNotes && !resolutionSummary)}
                          className="flex-1 bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold"
                        >
                          Save Field Notes
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            workerUpdateMutation.mutate({
                              id: selectedComplaint.id,
                              payload: { worker_notes: workerNotes, resolution_summary: resolutionSummary || 'Resolved by P-Way field inspection', mark_resolved: true },
                            })
                          }}
                          disabled={workerUpdateMutation.isPending}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Mark Resolved
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Admin Actions */}
                {user?.role === 'ADMIN' && (
                  <div className="space-y-3 pt-3 border-t border-slate-200">
                    <h4 className="font-bold text-[#0B2545] text-xs flex items-center gap-1.5">
                      <Building2 className="h-4 w-4" /> Admin Governance & Investigation
                    </h4>

                    {/* Assign Worker */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700">Assign Field Staff / Worker</label>
                      <div className="flex gap-2">
                        <select
                          value={assignWorkerId}
                          onChange={(e) => setAssignWorkerId(e.target.value)}
                          className="flex-1 p-1.5 border border-slate-300 rounded text-xs bg-white"
                        >
                          <option value="">Select Personnel...</option>
                          {(usersData?.items || []).map((u: any) => (
                            <option key={u.id} value={u.id}>
                              {u.full_name} ({u.role}) - {u.designation}
                            </option>
                          ))}
                        </select>
                        <Button
                          size="sm"
                          onClick={() => {
                            if (assignWorkerId) {
                              assignMutation.mutate({ id: selectedComplaint.id, workerId: assignWorkerId })
                            }
                          }}
                          disabled={!assignWorkerId || assignMutation.isPending}
                          className="bg-[#0B2545] text-white text-xs"
                        >
                          Assign
                        </Button>
                      </div>
                    </div>

                    {/* Status Advance */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => statusUpdateMutation.mutate({ id: selectedComplaint.id, payload: { status: 'IN_PROGRESS' } })}
                        className="text-xs"
                      >
                        Set In Progress
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => statusUpdateMutation.mutate({ id: selectedComplaint.id, payload: { status: 'RESOLVED', resolution_summary: 'Resolved after officer inspection' } })}
                        className="text-xs text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                      >
                        Resolve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => statusUpdateMutation.mutate({ id: selectedComplaint.id, payload: { status: 'CLOSED' } })}
                        className="text-xs text-slate-700 border-slate-300"
                      >
                        Close Ticket
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (confirm('Delete this complaint record permanently?')) {
                            deleteMutation.mutate(selectedComplaint.id)
                          }
                        }}
                        className="text-xs text-rose-700 border-rose-300 hover:bg-rose-50 ml-auto"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* 3. Viewer Status View */}
                {user?.role === 'VIEWER' && (
                  <div className="p-3 bg-teal-50 border border-teal-200 rounded text-[11px] text-teal-900 leading-relaxed">
                    <div className="font-bold mb-1">Viewer Redressal Tracking</div>
                    As a safety observer / station user, your report is logged in the CRIS database. Section Controllers and Field Engineers receive instantaneous alerts to rectify the issue.
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-slate-200 shadow-sm bg-white p-8 text-center text-xs text-slate-400">
              Select any complaint from the list to view full investigation trail and management controls.
            </Card>
          )}
        </div>
      </div>

      {/* New Complaint Modal Dialog */}
      {isNewModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#0B2545] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LifeBuoy className="h-5 w-5 text-amber-300" />
                <h3 className="font-bold text-sm">Report Operational Problem / Complaint</h3>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4 overflow-y-auto text-xs">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Problem Title / Summary *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rail defect detected at KM 128/4 or Signal aspect flicker"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs bg-white focus:ring-2 focus:ring-[#0B2545] outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Severity / Priority *</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded text-xs bg-white focus:ring-2 focus:ring-[#0B2545] outline-none"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Exact Track Location / KM *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KM 128/4, Up Through Line"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Nearest Station Code</label>
                  <input
                    type="text"
                    placeholder="e.g. KYN, IGP, TNA"
                    value={newStation}
                    onChange={(e) => setNewStation(e.target.value.toUpperCase())}
                    className="w-full p-2 border border-slate-300 rounded text-xs font-mono uppercase focus:ring-2 focus:ring-[#0B2545] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Detailed Description & Safety Impact *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe the operational issue, observations, potential risks to trains, or infrastructure malfunction..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Ticket will be attributed to <strong>{user?.full_name}</strong> ({user?.role}) and logged into the official register.</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsNewModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold gap-1.5 shadow-md"
                >
                  <Send className="h-3.5 w-3.5" />
                  {createMutation.isPending ? 'Submitting to CRIS...' : 'Submit Operational Complaint'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
