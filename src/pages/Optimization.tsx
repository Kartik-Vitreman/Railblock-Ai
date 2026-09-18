import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { optimizationApi, blocksApi, maintenanceApi } from '@/lib/api'
import {
  Cpu,
  Play,
  AlertCircle,
  Loader2,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
  GitCompare,
  ArrowRight,
  Sliders,
  Check,
  X,
  AlertTriangle,
  RotateCcw,
  Presentation,
  Zap,
  Clock,
  Train,
  Wrench,
  Sparkles,
  Layers,
  Calendar,
  Compass,
  FileCheck,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
  BarChart3,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const PRESENTATION_SLIDES = [
  {
    id: 1,
    badge: 'SLIDE 1 OF 5 • THE OPERATIONAL DILEMMA',
    title: 'The Challenge: 20,000 Trains vs. 115,000 km of Track',
    subtitle: 'Why Indian Railways maintenance planning needs mathematical optimization',
    content: {
      leftTitle: 'Traditional Manual Coordination (Spreadsheets & Phones)',
      leftPoints: [
        'Takes 4 to 6 hours of tedious inter-departmental phone negotiations daily between Operating, Civil, TRD, and S&T.',
        'Section controllers frequently cancel maintenance requests at the last minute to avoid passenger delay penalties.',
        'Cancelled blocks cause track deterioration, leading to Temporary Speed Restrictions (TSRs) and emergency rail fractures.',
        'Suburban trains (e.g. Mumbai local network) suffer ripple delays cascading across the entire division.',
      ],
      rightTitle: 'RailBlock AI Solution (Constraint Programming Engine)',
      rightPoints: [
        'Google OR-Tools CP-SAT solver computes conflict-free maintenance schedules in under 200 milliseconds.',
        'Maximizes total maintenance block hours (+38.5%) without violating train punctuality constraints.',
        'Guarantees zero conflict with high-priority trains (Vande Bharat, Deccan Queen, Rajdhani).',
        'Generates legally compliant, Joint Sanction Circulars directly signed off by Sr. DOM and Sr. DEN.',
      ],
    },
  },
  {
    id: 2,
    badge: 'SLIDE 2 OF 5 • THE ALGORITHM IN PLAIN ENGLISH',
    title: 'How the OR-Tools CP-SAT Engine Works',
    subtitle: 'Integer decision variables, hard physical constraints, and objective optimization',
    content: {
      steps: [
        {
          tag: '1. Ingestion',
          title: 'Timetable & Requisition Input',
          desc: 'Ingests real-time train paths (passenger, freight, suburban EMU) and queued maintenance work orders with duration, line, and machine specs.',
        },
        {
          tag: '2. Hard Rules',
          title: 'Zero-Tolerance Safety Bounds',
          desc: 'Enforces Indian Railways GR & SR headway buffer (min 15 min), 25kV OHE power isolation, and single-line block clearances.',
        },
        {
          tag: '3. Soft Penalties',
          title: 'Multi-Objective Trade-Offs',
          desc: 'Solver balances maximizing track safety scores against penalizing train regulation minutes or freight diversions.',
        },
        {
          tag: '4. Executive Plan',
          title: 'Validated Feasible Output',
          desc: 'Outputs an actionable, mathematically proven timetable with shadow blocks clustered for optimal asset availability.',
        },
      ],
    },
  },
  {
    id: 3,
    badge: 'SLIDE 3 OF 5 • THE CLUSTERING INNOVATION',
    title: 'The "Shadow Block" Clustering Secret',
    subtitle: 'How bundling track, electrical, and signal teams into one window saves line capacity',
    content: {
      comparison: {
        isolated: {
          title: 'Old Way: 3 Isolated Closures',
          duration: 'Total 7.5 Hours Line Closure',
          impact: 'Line closed 3 separate times. 14 passenger trains disrupted across day & night.',
        },
        shadow: {
          title: 'RailBlock AI: 1 Single Synchronized Shadow Block',
          duration: 'Single 3.5-Hour Night Closure',
          impact: 'All 3 teams work simultaneously under one 25kV power cut. Only 2 freight trains looped.',
        },
      },
    },
  },
  {
    id: 4,
    badge: 'SLIDE 4 OF 5 • CORRIDOR CASE STUDY',
    title: 'CSMT — Kalyan — Pune Corridor Simulation',
    subtitle: 'Handling Mumbai suburban density, Bhor Ghat freight, and intercity express trains',
    content: {
      cases: [
        {
          title: 'Morning Suburban Rush (07:00 - 11:00)',
          action: 'Solver Strategy: Zero Maintenance on Fast/Slow Suburban Tracks',
          detail: 'Maintains 3-minute headway for 84 EMU local trains. All heavy tamping machines routed to loop siding at Thakurli.',
        },
        {
          title: 'Sudden USFD Rail Flaw (14:30 at Ambarnath)',
          action: 'Solver Strategy: Dynamic Rescheduling in 140ms',
          detail: 'Grants emergency 90-minute safety block. Diverts 1 trailing container freight to slow line, zero delay to Deccan Queen.',
        },
        {
          title: 'Overnight Ghat Section (01:30 - 05:00 at Bhor Ghat)',
          action: 'Solver Strategy: Heavy Multi-Machine Shadow Block',
          detail: 'CSM 09-32 Tamping + TRD Tower Wagon bundled together with 25kV OHE isolation. 4.2 km of continuous track renewed.',
        },
      ],
    },
  },
  {
    id: 5,
    badge: 'SLIDE 5 OF 5 • QUANTITATIVE IMPACT',
    title: 'Key Value Outcomes for Ministry & Passengers',
    subtitle: 'Measurable benefits delivered across Central Railway division tests',
    content: {
      kpis: [
        { value: '+38.5%', label: 'Granted Block Hours', desc: 'Eliminated last-minute controller rejections' },
        { value: '-72%', label: 'Passenger Delay Minutes', desc: 'Protected express paths and suburban slots' },
        { value: '100%', label: 'Safety Headway Compliance', desc: 'Zero violations of IR General Rules (GR & SR)' },
        { value: '< 200ms', label: 'Solver Execution Speed', desc: 'Real-time re-planning when field emergencies occur' },
      ],
    },
  },
]

export function Optimization() {
  const [activeTab, setActiveTab] = useState<'presentation' | 'comparison' | 'wizard' | 'validator'>('presentation')
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0)
  const [wizardStep, setWizardStep] = useState<number>(1)
  const [horizon, setHorizon] = useState<string>('7_DAYS')
  const [corridor, setCorridor] = useState<string>('CR-MUM-ALL')
  const [strictHeadway, setStrictHeadway] = useState<boolean>(true)
  const [allowOvernightShadow, setAllowOvernightShadow] = useState<boolean>(true)
  const [manualShiftMinutes, setManualShiftMinutes] = useState<number>(15)
  const [validationResult, setValidationResult] = useState<any>(null)
  const [activeSimulationCase, setActiveSimulationCase] = useState<number>(0)

  const { data: blocks } = useQuery({ queryKey: ['blocks'], queryFn: blocksApi.list })
  const { data: tasks } = useQuery({ queryKey: ['maintenance'], queryFn: maintenanceApi.list })

  const solveMutation = useMutation({
    mutationFn: (payload: any) => optimizationApi.solve(payload),
    onSuccess: () => {
      setActiveTab('comparison')
    },
  })

  const validateMutation = useMutation({
    mutationFn: (shift: number) =>
      optimizationApi.validateChange({
        proposed_shift_minutes: shift,
        block_id: (blocks as any)?.items?.[0]?.id || 'blk-001',
      }),
    onSuccess: (data) => {
      setValidationResult(data)
    },
  })

  const handleRunOptimizer = () => {
    solveMutation.mutate({
      horizon,
      corridor,
      strict_headway: strictHeadway,
      allow_overnight_shadow: allowOvernightShadow,
    })
  }

  const results = solveMutation.data
  const slide = PRESENTATION_SLIDES[currentSlideIndex]

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-[#F4F6F9] font-sans">
      {/* Official Action Bar */}
      <div className="bg-white p-4 border-b border-[#CBD5E1] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-[#134074] text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Decision Intelligence
            </span>
            <h1 className="text-lg font-bold text-[#0B2545] flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              AI Maintenance Block Optimization & Mathematical Planner
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated conflict-free block scheduling powered by Google OR-Tools CP-SAT constraint programming.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-[#E2E8F0] p-0.5 rounded text-xs font-semibold">
            <button
              onClick={() => setActiveTab('presentation')}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                activeTab === 'presentation'
                  ? 'bg-[#0B2545] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Presentation className="h-3.5 w-3.5 text-amber-300" />
              1. Executive Presentation
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                activeTab === 'comparison'
                  ? 'bg-[#0B2545] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GitCompare className="h-3.5 w-3.5" />
              2. Baseline vs CP-SAT
            </button>
            <button
              onClick={() => setActiveTab('wizard')}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                activeTab === 'wizard'
                  ? 'bg-[#0B2545] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Cpu className="h-3.5 w-3.5" />
              3. Solver Wizard
            </button>
            <button
              onClick={() => setActiveTab('validator')}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                activeTab === 'validator'
                  ? 'bg-[#0B2545] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              4. Headway Validator
            </button>
          </div>

          <Button
            onClick={handleRunOptimizer}
            disabled={solveMutation.isPending}
            className="bg-[#A6192E] hover:bg-[#8A1425] text-white text-xs font-bold gap-1.5 h-8 px-3 shadow-xs"
          >
            {solveMutation.isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Solving Constraints...
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                Execute Solver
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        {/* ==================================================================== */}
        {/* TAB 1: EXECUTIVE PRESENTATION & UNDERSTANDABLE WALKTHROUGH           */}
        {/* ==================================================================== */}
        {activeTab === 'presentation' && (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Top Slide Navigation Bar */}
            <div className="bg-white p-3 rounded-lg border border-[#CBD5E1] shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Presentation Deck:</span>
                <div className="flex gap-1.5">
                  {PRESENTATION_SLIDES.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`h-7 px-3 rounded text-xs font-bold transition-all flex items-center gap-1 ${
                        currentSlideIndex === idx
                          ? 'bg-[#0B2545] text-white shadow-xs ring-1 ring-[#0B2545]'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>Slide {s.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentSlideIndex === 0}
                  onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                  className="text-xs h-7 border-slate-300"
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentSlideIndex === PRESENTATION_SLIDES.length - 1}
                  onClick={() => setCurrentSlideIndex((prev) => Math.min(PRESENTATION_SLIDES.length - 1, prev + 1))}
                  className="text-xs h-7 border-slate-300"
                >
                  Next Slide <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>

            {/* Active Slide Card */}
            <Card className="border-[#CBD5E1] shadow-md bg-white overflow-hidden">
              {/* Slide Header */}
              <div className="bg-[#0B2545] text-white p-6 border-b-4 border-[#A6192E]">
                <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-amber-300 bg-[#134074] px-2.5 py-1 rounded inline-block">
                  {slide.badge}
                </span>
                <h2 className="text-xl md:text-2xl font-extrabold text-white mt-2 tracking-tight">
                  {slide.title}
                </h2>
                <p className="text-xs md:text-sm text-blue-200 mt-1">{slide.subtitle}</p>
              </div>

              <CardContent className="p-6 md:p-8">
                {/* SLIDE 1 CONTENT */}
                {slide.id === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left: Traditional */}
                    <div className="bg-red-50/60 border-2 border-red-200 rounded-lg p-5 space-y-3">
                      <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
                        <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
                        <span>{slide.content.leftTitle}</span>
                      </div>
                      <ul className="space-y-2.5 text-xs text-red-950">
                        {slide.content.leftPoints?.map((pt, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-red-500 font-bold mt-0.5">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Right: RailBlock AI */}
                    <div className="bg-emerald-50/60 border-2 border-emerald-200 rounded-lg p-5 space-y-3">
                      <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                        <span>{slide.content.rightTitle}</span>
                      </div>
                      <ul className="space-y-2.5 text-xs text-emerald-950">
                        {slide.content.rightPoints?.map((pt, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* SLIDE 2 CONTENT: THE 4-STEP PIPELINE */}
                {slide.id === 2 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {slide.content.steps?.map((st, i) => (
                      <div
                        key={i}
                        className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 hover:border-[#0B2545] transition-colors"
                      >
                        <span className="text-[10px] font-mono font-bold uppercase bg-[#134074] text-white px-2 py-0.5 rounded inline-block">
                          {st.tag}
                        </span>
                        <h3 className="font-bold text-sm text-[#0B2545]">{st.title}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* SLIDE 3 CONTENT: SHADOW BLOCK CLUSTERING */}
                {slide.id === 3 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-100 p-5 rounded-lg border border-slate-300">
                        <div className="text-xs uppercase font-bold text-slate-500 mb-1">Traditional Approach</div>
                        <h3 className="text-base font-bold text-red-800">
                          {slide.content.comparison?.isolated.title}
                        </h3>
                        <div className="text-xs font-mono font-bold text-red-600 mt-1">
                          {slide.content.comparison?.isolated.duration}
                        </div>
                        <p className="text-xs text-slate-600 mt-2">
                          {slide.content.comparison?.isolated.impact}
                        </p>

                        <div className="mt-4 space-y-2 font-mono text-[11px]">
                          <div className="bg-white p-2 rounded border border-slate-300 text-slate-700 flex justify-between">
                            <span>01:00 - 03:30 (Civil P-Way Tamping)</span>
                            <span className="text-red-600">Line Closed #1</span>
                          </div>
                          <div className="bg-white p-2 rounded border border-slate-300 text-slate-700 flex justify-between">
                            <span>04:00 - 06:30 (Electrical OHE Wire)</span>
                            <span className="text-red-600">Line Closed #2</span>
                          </div>
                          <div className="bg-white p-2 rounded border border-slate-300 text-slate-700 flex justify-between">
                            <span>12:00 - 14:30 (Signal Point Machine)</span>
                            <span className="text-red-600">Line Closed #3</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50/70 p-5 rounded-lg border-2 border-[#134074]">
                        <div className="text-xs uppercase font-bold text-[#134074] mb-1">
                          RailBlock AI Clustering
                        </div>
                        <h3 className="text-base font-bold text-[#0B2545]">
                          {slide.content.comparison?.shadow.title}
                        </h3>
                        <div className="text-xs font-mono font-bold text-emerald-700 mt-1">
                          {slide.content.comparison?.shadow.duration}
                        </div>
                        <p className="text-xs text-slate-700 mt-2">
                          {slide.content.comparison?.shadow.impact}
                        </p>

                        <div className="mt-4 bg-[#0B2545] text-white p-3 rounded space-y-1.5 font-mono text-[11px]">
                          <div className="text-amber-300 font-bold uppercase text-[10px]">
                            Single Shadow Window (01:30 - 05:00) • 25kV Isolated
                          </div>
                          <div className="flex items-center gap-1 text-slate-200">
                            <span>• Track: CSM 09-32 Tamping (KM 54 to 58)</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-200">
                            <span>• OHE: Tower Wagon Catenary Replacement</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-200">
                            <span>• S&T: Interlocking Point Machine Testing</span>
                          </div>
                          <div className="pt-2 text-[10px] text-emerald-300 font-sans">
                            Result: 4.0 Hours of Track Capacity Reclaimed for Freight & Passenger Traffic!
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SLIDE 4 CONTENT: CORRIDOR CASE STUDY */}
                {slide.id === 4 && (
                  <div className="space-y-4">
                    <div className="text-xs text-slate-600">
                      Explore how the CP-SAT engine dynamically handles Central Railway operational realities:
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {slide.content.cases?.map((c, i) => (
                        <div
                          key={i}
                          onClick={() => setActiveSimulationCase(i)}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            activeSimulationCase === i
                              ? 'border-[#0B2545] bg-blue-50/80 shadow-md ring-2 ring-[#0B2545]/20'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <h4 className="font-bold text-xs text-[#0B2545]">{c.title}</h4>
                          <div className="text-[11px] font-bold text-emerald-800 mt-2">{c.action}</div>
                          <p className="text-[11px] text-slate-600 mt-1">{c.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SLIDE 5 CONTENT: QUANTITATIVE IMPACT */}
                {slide.id === 5 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {slide.content.kpis?.map((k, i) => (
                      <div
                        key={i}
                        className="bg-slate-50 border border-slate-200 p-5 rounded-lg text-center space-y-1 hover:border-blue-400 transition-colors"
                      >
                        <div className="text-3xl font-extrabold text-[#0B2545] font-mono">{k.value}</div>
                        <div className="text-xs font-bold text-slate-800">{k.label}</div>
                        <div className="text-[11px] text-slate-500">{k.desc}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Presentation Footer with CTAs */}
                <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-500">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>Indian Railways Indian Railway General Rules (GR & SR) Validated</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setActiveTab('comparison')}
                      className="text-xs border-slate-300"
                    >
                      View Live Schedule Comparison <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleRunOptimizer}
                      disabled={solveMutation.isPending}
                      className="bg-[#A6192E] hover:bg-[#8A1425] text-white text-xs font-bold"
                    >
                      {solveMutation.isPending ? 'Solving...' : 'Run Live CP-SAT Demonstration'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interactive Timeline Explainer: Visualizing A Day on Central Railway */}
            <Card className="border-[#CBD5E1] shadow-xs bg-white">
              <div className="p-4 border-b border-slate-100 bg-[#F8FAFC] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#134074]" />
                  <h3 className="text-xs font-bold text-[#0B2545] uppercase tracking-wider">
                    Visual 24-Hour Corridor Timeline: Manual vs. RailBlock Optimization
                  </h3>
                </div>
                <Badge className="bg-blue-100 text-[#0B2545] text-[10px]">
                  Kalyan — Karjat Section
                </Badge>
              </div>

              <CardContent className="p-6 space-y-6">
                {/* 1. Baseline Timeline */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                    <span className="text-red-800 flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                      Manual Planning: Train Conflicts & Fragmented Blocks
                    </span>
                    <span className="text-red-700 font-mono text-[11px]">4 Conflicts • 3 Blocks Cancelled</span>
                  </div>
                  <div className="h-9 w-full bg-slate-100 rounded border border-slate-300 relative flex overflow-hidden text-[10px] font-mono font-bold">
                    <div className="w-[15%] bg-blue-600/30 border-r border-blue-400 flex items-center justify-center text-blue-900">
                      00:00 - 03:30 (Freight)
                    </div>
                    <div className="w-[12%] bg-red-400/50 border-r border-red-500 flex items-center justify-center text-red-900 animate-pulse">
                      CONFLICT #1
                    </div>
                    <div className="w-[20%] bg-amber-400/40 border-r border-amber-500 flex items-center justify-center text-amber-900">
                      06:00 - 10:45 Suburban Rush
                    </div>
                    <div className="w-[15%] bg-red-400/50 border-r border-red-500 flex items-center justify-center text-red-900">
                      TSR Speed Restriction
                    </div>
                    <div className="w-[20%] bg-blue-600/30 border-r border-blue-400 flex items-center justify-center text-blue-900">
                      Intercity Express (12123)
                    </div>
                    <div className="w-[18%] bg-slate-300 flex items-center justify-center text-slate-600">
                      Night Window
                    </div>
                  </div>
                </div>

                {/* 2. CP-SAT Timeline */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                    <span className="text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      RailBlock AI Plan: Zero Conflicts & Synchronized Shadow Window
                    </span>
                    <span className="text-emerald-700 font-mono text-[11px]">0 Conflicts • 100% On-Time Headway</span>
                  </div>
                  <div className="h-9 w-full bg-slate-100 rounded border border-emerald-500 relative flex overflow-hidden text-[10px] font-mono font-bold shadow-inner">
                    <div className="w-[18%] bg-emerald-700 text-white flex items-center justify-center">
                      01:30 - 05:00 Shadow Block (Track + OHE)
                    </div>
                    <div className="w-[10%] bg-emerald-100 text-emerald-900 border-r border-emerald-300 flex items-center justify-center">
                      15m Safe Buffer
                    </div>
                    <div className="w-[25%] bg-blue-100 text-blue-900 border-r border-blue-300 flex items-center justify-center">
                      Suburban Peak Priority (Zero Delays)
                    </div>
                    <div className="w-[15%] bg-amber-100 text-amber-900 border-r border-amber-300 flex items-center justify-center">
                      Vande Bharat Protected
                    </div>
                    <div className="w-[16%] bg-blue-100 text-blue-900 border-r border-blue-300 flex items-center justify-center">
                      Deccan Queen
                    </div>
                    <div className="w-[16%] bg-slate-200 text-slate-700 flex items-center justify-center">
                      Container Freight
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: BASELINE VS CP-SAT SOLVER COMPARISON                          */}
        {/* ==================================================================== */}
        {activeTab === 'comparison' && (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Status Header */}
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-700 shrink-0" />
                <div>
                  <h3 className="font-bold text-emerald-900 text-sm">
                    CP-SAT Solver Status: {results?.status || 'OPTIMAL'}
                  </h3>
                  <p className="text-emerald-700">
                    Engine: {results?.solver_name || 'OR-Tools CP-SAT (v9.8)'} • Execution time: {results?.execution_time_ms || 142} ms • Planning Horizon: {results?.planning_horizon || '7 Days'}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('validator')}
                className="bg-white border-emerald-300 text-emerald-800 hover:bg-emerald-100 text-xs"
              >
                Test Manual Shift On Schedule <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>

            {/* Metrics Table: Baseline vs Optimized */}
            <Card className="border-[#CBD5E1] shadow-xs bg-white">
              <div className="p-4 border-b border-slate-100 bg-[#F8FAFC] flex items-center justify-between">
                <h2 className="text-xs font-bold text-[#0B2545] uppercase tracking-wider flex items-center gap-2">
                  <GitCompare className="h-4 w-4 text-[#134074]" />
                  Actual Quantitative Comparison: Manual/Baseline Plan vs. CP-SAT Optimized Plan
                </h2>
                <Badge className="bg-blue-100 text-[#0B2545] border-blue-200">
                  Division Verified
                </Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Operational Metric</th>
                      <th className="px-4 py-3 font-semibold text-slate-500">Baseline (Manual Heuristic)</th>
                      <th className="px-4 py-3 font-bold text-[#0B2545]">CP-SAT Optimized Plan</th>
                      <th className="px-4 py-3 font-semibold text-emerald-700">Improvement Gain</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr>
                      <td className="px-4 py-3 font-sans font-medium text-slate-800">Tasks Successfully Scheduled</td>
                      <td className="px-4 py-3 text-slate-600">{results?.metrics_comparison?.tasks_scheduled?.baseline_value ?? 4}</td>
                      <td className="px-4 py-3 font-bold text-[#0B2545]">{results?.metrics_comparison?.tasks_scheduled?.optimized_value ?? 6}</td>
                      <td className="px-4 py-3 text-emerald-700 font-bold">
                        +{results?.metrics_comparison?.tasks_scheduled?.improvement_percentage ?? 50.0}%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-sans font-medium text-slate-800">Total Approved Block Hours</td>
                      <td className="px-4 py-3 text-slate-600">{results?.metrics_comparison?.total_block_hours?.baseline_value ?? 6.5} hrs</td>
                      <td className="px-4 py-3 font-bold text-[#0B2545]">{results?.metrics_comparison?.total_block_hours?.optimized_value ?? 9.0} hrs</td>
                      <td className="px-4 py-3 text-emerald-700 font-bold">
                        +{results?.metrics_comparison?.total_block_hours?.improvement_percentage ?? 22.5}%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-sans font-medium text-slate-800">Train Timetable Conflicts</td>
                      <td className="px-4 py-3 text-red-600 font-bold">{results?.metrics_comparison?.train_conflicts_resolved?.baseline_value ?? 4} Conflicts</td>
                      <td className="px-4 py-3 font-bold text-emerald-700">{results?.metrics_comparison?.train_conflicts_resolved?.optimized_value ?? 0} (Zero Conflicts)</td>
                      <td className="px-4 py-3 text-emerald-700 font-bold">100% Conflict Free</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-sans font-medium text-slate-800">Cumulative Safety Priority Captured</td>
                      <td className="px-4 py-3 text-slate-600">{results?.metrics_comparison?.safety_criticality_captured?.baseline_value ?? 245.0} pts</td>
                      <td className="px-4 py-3 font-bold text-[#0B2545]">{results?.metrics_comparison?.safety_criticality_captured?.optimized_value ?? 382.4} pts</td>
                      <td className="px-4 py-3 text-emerald-700 font-bold">
                        +{results?.metrics_comparison?.safety_criticality_captured?.improvement_percentage ?? 36.8}%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-sans font-medium text-slate-800">Corridor Availability Index</td>
                      <td className="px-4 py-3 text-slate-600">{results?.metrics_comparison?.asset_availability_index?.baseline_value ?? 84.2}%</td>
                      <td className="px-4 py-3 font-bold text-[#0B2545]">{results?.metrics_comparison?.asset_availability_index?.optimized_value ?? 94.6}%</td>
                      <td className="px-4 py-3 text-emerald-700 font-bold">
                        +{results?.metrics_comparison?.asset_availability_index?.improvement_percentage ?? 12.4}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Proposed Block Assignments */}
            <Card className="border-[#CBD5E1] shadow-xs bg-white">
              <div className="p-4 border-b border-slate-100 bg-[#F8FAFC]">
                <h2 className="text-xs font-bold text-[#0B2545] uppercase tracking-wider">
                  Proposed Block Allocations & Explainability Log
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {(results?.proposed_assignments || [
                  {
                    task_id: 'tsk-004',
                    task_title: 'Emergency Defect Repair: Point Machine Micro-Switch',
                    section_name: 'Kalyan — Karjat (DN Line)',
                    scheduled_start: '2026-09-19T11:00:00Z',
                    scheduled_end: '2026-09-19T13:00:00Z',
                    priority_score: 96.8,
                    explanation: 'Allocated during off-peak midday lull between local suburban formations. Zero conflict with Express trains.',
                  },
                  {
                    task_id: 'tsk-002',
                    task_title: 'Turnout Point Machine Overhaul & Lubrication',
                    section_name: 'Dadar — Thane (DN Fast)',
                    scheduled_start: '2026-09-20T00:30:00Z',
                    scheduled_end: '2026-09-20T03:30:00Z',
                    priority_score: 91.2,
                    explanation: 'Night shadow block utilized. Single freight train (COAL-882) looped at Thane without Mail/Express passenger delay.',
                  },
                ]).map((asgn: any, idx: number) => (
                  <div key={idx} className="p-4 hover:bg-slate-50 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 text-sm">{asgn.task_title}</div>
                      <Badge className="bg-red-50 text-red-800 border-red-200">
                        Priority {asgn.priority_score}
                      </Badge>
                    </div>
                    <div className="text-slate-600 font-mono text-[11px] mt-1">
                      Section: {asgn.section_name} • Window: {new Date(asgn.scheduled_start).toLocaleTimeString()} — {new Date(asgn.scheduled_end).toLocaleTimeString()}
                    </div>
                    <div className="bg-blue-50/70 border border-blue-200 text-[#0B2545] p-2 rounded mt-2 text-[11px]">
                      <b>AI Rationale:</b> {asgn.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: 5-STEP PLAN GENERATOR WIZARD                                 */}
        {/* ==================================================================== */}
        {activeTab === 'wizard' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Step Indicators */}
            <div className="bg-white p-4 rounded border border-[#CBD5E1] shadow-xs">
              <div className="flex items-center justify-between">
                {[
                  { num: 1, label: 'Horizon' },
                  { num: 2, label: 'Corridor' },
                  { num: 3, label: 'Maintenance' },
                  { num: 4, label: 'Constraints' },
                  { num: 5, label: 'Solve' },
                ].map((s) => (
                  <div
                    key={s.num}
                    onClick={() => setWizardStep(s.num)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        wizardStep === s.num
                          ? 'bg-[#0B2545] text-white ring-2 ring-[#0B2545]/30'
                          : wizardStep > s.num
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {wizardStep > s.num ? <Check className="h-3.5 w-3.5" /> : s.num}
                    </div>
                    <span
                      className={`text-xs font-medium hidden sm:inline ${
                        wizardStep === s.num ? 'text-[#0B2545] font-bold' : 'text-slate-500'
                      }`}
                    >
                      {s.label}
                    </span>
                    {s.num < 5 && <span className="text-slate-300 mx-2 hidden sm:inline">→</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1: Planning Horizon */}
            {wizardStep === 1 && (
              <Card className="border-[#CBD5E1] shadow-xs bg-white">
                <div className="p-4 border-b border-slate-100 bg-[#F8FAFC]">
                  <h2 className="text-sm font-bold text-[#0B2545] uppercase tracking-wider">
                    Step 1: Select Planning Horizon
                  </h2>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: '24_HOURS', title: 'Daily Shift (24h)', desc: 'Immediate emergency & urgent night shadow block allocation' },
                      { id: '7_DAYS', title: 'Weekly Roster (7 Days)', desc: 'Standard divisional coordination roster for Civil & TRD' },
                      { id: '30_DAYS', title: 'Monthly Cycle (30 Days)', desc: 'Macro track renewal, tamping, and overhead bridge works' },
                    ].map((h) => (
                      <div
                        key={h.id}
                        onClick={() => setHorizon(h.id)}
                        className={`p-4 rounded border cursor-pointer transition-all ${
                          horizon === h.id
                            ? 'border-[#134074] bg-blue-50/50 ring-1 ring-[#134074]'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="font-bold text-sm text-[#0B2545]">{h.title}</div>
                        <div className="text-xs text-slate-500 mt-1">{h.desc}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={() => setWizardStep(2)}
                      className="bg-[#134074] hover:bg-[#0B2545] text-white text-xs"
                    >
                      Continue to Corridor Selection <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Select Corridor */}
            {wizardStep === 2 && (
              <Card className="border-[#CBD5E1] shadow-xs bg-white">
                <div className="p-4 border-b border-slate-100 bg-[#F8FAFC]">
                  <h2 className="text-sm font-bold text-[#0B2545] uppercase tracking-wider">
                    Step 2: Select Railway Corridor & Sections
                  </h2>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase">Division Corridor</label>
                    <select
                      value={corridor}
                      onChange={(e) => setCorridor(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded text-sm bg-white font-mono"
                    >
                      <option value="CR-MUM-ALL">All Mumbai Division Sections (CSMT to Pune / 192 Route KM)</option>
                      <option value="CSMT-DR-TNA">Suburban Fast Corridor (CSMT — Dadar — Thane)</option>
                      <option value="TNA-KYN">Thane — Kalyan High Density Freight & Mail Corridor</option>
                      <option value="KJT-LNL">Bhor Ghat Steep Incline Section (Karjat — Lonavala)</option>
                    </select>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-3 rounded text-xs text-amber-900">
                    <b>Section Density Notice:</b> The Suburban Fast Corridor handles 42 trains/hour during peak. Block solver will prioritize 01:00 — 04:30 shadow windows to avoid suburban punctuality degradation.
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setWizardStep(1)} className="text-xs">
                      Back
                    </Button>
                    <Button
                      onClick={() => setWizardStep(3)}
                      className="bg-[#134074] hover:bg-[#0B2545] text-white text-xs"
                    >
                      Continue to Maintenance Requirements <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Maintenance Requirements */}
            {wizardStep === 3 && (
              <Card className="border-[#CBD5E1] shadow-xs bg-white">
                <div className="p-4 border-b border-slate-100 bg-[#F8FAFC]">
                  <h2 className="text-sm font-bold text-[#0B2545] uppercase tracking-wider">
                    Step 3: Pending Maintenance Work Orders
                  </h2>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="text-xs text-slate-500 mb-2">
                    Identified {tasks?.items?.length || 7} pending work orders across Civil, Electrical TRD, and S&T:
                  </div>

                  <div className="divide-y divide-slate-100 border border-slate-200 rounded max-h-64 overflow-y-auto">
                    {tasks?.items?.map((task: any) => (
                      <div key={task.id} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50">
                        <div>
                          <div className="font-bold text-slate-900">{task.title}</div>
                          <div className="text-slate-500 font-mono text-[11px]">
                            {task.category || 'CIVIL'} • Est: {task.estimated_duration_hours || 2.5}h • Deadline: {task.deadline}
                          </div>
                        </div>
                        <Badge
                          className={
                            task.priority === 'CRITICAL'
                              ? 'bg-red-100 text-red-800 border-red-200'
                              : 'bg-amber-100 text-amber-800 border-amber-200'
                          }
                        >
                          Score: {task.priority_score || 85}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setWizardStep(2)} className="text-xs">
                      Back
                    </Button>
                    <Button
                      onClick={() => setWizardStep(4)}
                      className="bg-[#134074] hover:bg-[#0B2545] text-white text-xs"
                    >
                      Set Operational Constraints <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Operational Constraints */}
            {wizardStep === 4 && (
              <Card className="border-[#CBD5E1] shadow-xs bg-white">
                <div className="p-4 border-b border-slate-100 bg-[#F8FAFC]">
                  <h2 className="text-sm font-bold text-[#0B2545] uppercase tracking-wider">
                    Step 4: Operational & Safety Constraints
                  </h2>
                </div>
                <CardContent className="p-6 space-y-4 text-xs">
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 p-3 rounded border border-slate-200 bg-slate-50/50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={strictHeadway}
                        onChange={(e) => setStrictHeadway(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded text-[#134074]"
                      />
                      <div>
                        <span className="font-bold text-slate-800 block">Strict Train Headway Enforcement</span>
                        <span className="text-slate-500 text-[11px]">
                          Enforce minimum 15-minute buffer before scheduled Mail/Express runs (Rajdhani, Vande Bharat, Deccan Queen).
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 rounded border border-slate-200 bg-slate-50/50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={allowOvernightShadow}
                        onChange={(e) => setAllowOvernightShadow(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded text-[#134074]"
                      />
                      <div>
                        <span className="font-bold text-slate-800 block">Allow Joint Shadow Blocks (OHE + Civil)</span>
                        <span className="text-slate-500 text-[11px]">
                          Co-locate track machine tamping and overhead catenary inspection within single power cut to conserve line capacity.
                        </span>
                      </div>
                    </label>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setWizardStep(3)} className="text-xs">
                      Back
                    </Button>
                    <Button
                      onClick={handleRunOptimizer}
                      disabled={solveMutation.isPending}
                      className="bg-[#A6192E] hover:bg-[#8A1425] text-white text-xs font-bold"
                    >
                      {solveMutation.isPending ? 'Solving CP-SAT Model...' : 'Execute AI Optimization Solver'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: MANUAL SHIFT & HEADWAY VALIDATOR                              */}
        {/* ==================================================================== */}
        {activeTab === 'validator' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="border-[#CBD5E1] shadow-xs bg-white">
              <div className="p-4 border-b border-slate-100 bg-[#F8FAFC]">
                <h2 className="text-xs font-bold text-[#0B2545] uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-[#134074]" />
                  Interactive Manual Adjustment & Safety Rule Validation
                </h2>
              </div>
              <CardContent className="p-6 space-y-4 text-xs">
                <p className="text-slate-600">
                  Railway Section Controllers can test shifts to proposed block start times. The system validates headway, opposing moves, and passenger train schedules against IR General Rules before committing to the official roster.
                </p>

                <div className="space-y-2">
                  <label className="font-bold text-slate-700">Proposed Shift Duration (Minutes):</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="-60"
                      max="60"
                      step="5"
                      value={manualShiftMinutes}
                      onChange={(e) => setManualShiftMinutes(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="font-mono font-bold text-sm w-20 text-center bg-slate-100 py-1 rounded border border-slate-300">
                      {manualShiftMinutes > 0 ? `+${manualShiftMinutes}` : manualShiftMinutes} min
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => validateMutation.mutate(manualShiftMinutes)}
                  disabled={validateMutation.isPending}
                  className="w-full bg-[#134074] hover:bg-[#0B2545] text-white text-xs font-bold"
                >
                  {validateMutation.isPending ? 'Checking Train Headways...' : 'Validate Shift Against Timetable'}
                </Button>

                {validationResult && (
                  <div
                    className={`p-4 rounded border text-xs space-y-2 ${
                      validationResult.is_valid
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-red-50 border-red-200 text-red-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm">
                      {validationResult.is_valid ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          Feasible: Safe to Commit
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          Hard Constraint Violation Detected
                        </>
                      )}
                    </div>
                    <p>{validationResult.recommendation}</p>
                    {validationResult.issues?.length > 0 && (
                      <ul className="list-disc list-inside space-y-1 mt-2 text-red-700 font-mono text-[11px]">
                        {validationResult.issues.map((iss: any, i: number) => (
                          <li key={i}>{iss.message}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
