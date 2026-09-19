export interface RailwayZone {
  code: string
  name: string
  hindi_name: string
  hq: string
  divisions: string[]
  route_km: number
  active_trains_count: number
  color: string
}

export interface NationalCorridor {
  code: string
  name: string
  trunk_type: 'GOLDEN_QUADRILATERAL' | 'DIAGONAL' | 'DFC' | 'COASTAL' | 'DECCAN'
  from_city: string
  to_city: string
  distance_km: number
  zones_traversed: string[]
  key_stations: string[]
  daily_trains: number
  status: 'OPTIMAL' | 'HIGH_CONGESTION' | 'MAINTENANCE_WINDOW_ACTIVE'
}

export interface Section {
  id: string
  name: string
  code: string
  zone: string
  division: string
  corridor: string
  from_station: string
  to_station: string
  length_km: number
  line_type: string
  max_speed_kmh: number
}

export interface Asset {
  id: string
  asset_code: string
  name: string
  asset_type: 'TRACK' | 'BRIDGE' | 'SIGNAL' | 'OHE' | 'TURNOUT' | 'POINT_MACHINE' | 'KAVACH'
  section_id: string
  condition: 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL'
  criticality_score: number
  failure_risk: number
  last_inspection: string
  next_due_inspection: string
  status: 'OPERATIONAL' | 'RESTRICTED' | 'MAINTENANCE_DUE' | 'DEFECTIVE'
}

export interface Train {
  id: string
  train_number: string
  train_name: string
  train_type: 'VANDE_BHARAT' | 'RAJDHANI' | 'SHATABDI' | 'SUPERFAST' | 'PASSENGER' | 'FREIGHT'
  zone: string
  corridor: string
  route_summary: string
  from_station: string
  to_station: string
  departure_time: string
  arrival_time: string
  is_daily: boolean
  is_active: boolean
  average_delay_minutes: number
  max_speed_kmh: number
  priority_tier: number
  current_section?: string
  next_station?: string
  current_speed_kmh?: number
  kavach_equipped?: boolean
}

export interface TrainSchedule {
  id: string
  train_id: string
  train_number: string
  section_id: string
  section_code: string
  scheduled_arrival: string
  scheduled_departure: string
  day_of_week: number
}

export interface MaintenanceRequest {
  id: string
  title: string
  description: string
  asset_id: string
  section_id: string
  category: 'CIVIL_TRACK' | 'ELECTRICAL_TRD' | 'SIGNAL_TELECOM' | 'MECHANICAL'
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  status: 'PENDING' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'SCHEDULED' | 'REJECTED'
  estimated_duration_hours: number
  deadline: string
  created_at: string
  assigned_block_id: string | null
  priority_score: number
  affected_train_count: number
  zone?: string
  corridor?: string
}

export type UserRole = 'ADMIN' | 'PLANNER' | 'WORKER' | 'VIEWER'

export interface UserProfile {
  id: string
  email: string
  name: string
  full_name: string
  role: UserRole
  department: string
  designation: string
  division: string
  clearance: string
  permissions: string[]
  created_at?: string
  status?: 'ACTIVE' | 'SUSPENDED'
}

export type ComplaintCategory =
  | 'Track / Infrastructure Issue'
  | 'Signal & Telecom Issue'
  | 'Electrical / Traction Issue'
  | 'Asset Failure'
  | 'Safety Issue'
  | 'Train Operation Issue'
  | 'Block Planning Issue'
  | 'Maintenance Issue'
  | 'TRACK_DEFECT'
  | 'SIGNAL_FAILURE'
  | 'OHE_TRACTION'
  | 'SAFETY_HAZARD'
  | 'STATION_AMENITY'
  | 'TRAIN_DELAY_ISSUE'
  | 'OTHER'
  | string

export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Critical' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type ComplaintStatus =
  | 'Submitted'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Closed'
  | 'SUBMITTED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED'

export interface ComplaintTimelineItem {
  id: string
  timestamp: string
  user_id: string
  user_name: string
  user_role: string
  action: string
  notes: string
}

export interface Complaint {
  id: string
  title: string
  category: ComplaintCategory
  description: string
  location: string
  station?: string
  zone?: string
  section_id?: string
  asset_id?: string
  block_id?: string
  incident_time?: string
  priority: ComplaintPriority
  supporting_file?: string
  status: ComplaintStatus
  submitted_by_id?: string
  submitted_by_name?: string
  submitted_by_email?: string
  submitted_by_role?: string
  reported_by_id?: string
  reported_by_name?: string
  reported_by_role?: UserRole | string
  assigned_to_id?: string | null
  assigned_to_name?: string | null
  assigned_to_role?: UserRole | string | null
  assigned_department?: string
  worker_notes?: string
  investigation_notes?: string
  resolution_details?: string
  resolution_summary?: string
  admin_response?: string
  resolved_at?: string | null
  closed_at?: string | null
  created_at: string
  updated_at: string
  timeline?: ComplaintTimelineItem[]
}

export interface AuditLogItem {
  id: string
  action: string
  user: string
  user_id?: string
  user_role?: string
  entity_type: string
  entity_id: string
  details: string
  timestamp: string
  previous_status?: string
  new_status?: string
  resolution_info?: string
}

export interface BlockRequest {
  id: string
  block_type: 'TRAFFIC' | 'POWER_OHE' | 'INTEGRATED' | 'SIGNAL'
  section_id: string
  section_name: string
  start_time: string
  end_time: string
  requested_duration_hours: number
  status: 'REQUESTED' | 'DRAFT' | 'PROPOSED' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED'
  department: string
  purpose: string
  approving_officer: string | null
  approval_timestamp: string | null
  assigned_task_ids: string[]
  affected_train_ids: string[]
  safety_precautions: string[]
  zone?: string
  corridor?: string
}

export interface Alert {
  id: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  alert_type: 'SAFETY_RISK' | 'WINDOW_CONFLICT' | 'OVERDUE_MAINTENANCE' | 'TRAIN_DELAY'
  title: string
  message: string
  section_id: string
  zone?: string
  created_at: string
  acknowledged: boolean
}

export interface UserAccountDTO {
  id: string
  email: string
  full_name: string
  role: UserRole
  department: string
  designation: string
  division: string
  clearance: string
  permissions: string[]
  is_active: boolean
  last_login?: string
}

export interface SystemSettingsDTO {
  maintenance_window_mode: string
  auto_dispatch_kavach: boolean
  enforce_strict_headway_seconds: number
  interlocking_override_protection: boolean
  audit_retention_days: number
  solver_timeout_seconds: number
  division_code: string
  emergency_protocol_active: boolean
}

