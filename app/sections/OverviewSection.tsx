'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FiTrendingUp, FiUsers, FiAlertTriangle, FiTarget, FiActivity, FiZap, FiArrowRight } from 'react-icons/fi'

interface Scores {
  idea_score: number
  adoption_probability: number
  risk_score: number
  justification: string
}

interface Metadata {
  completed_stages: string[]
  failed_stages: string[]
  timestamp: string
}

interface OverviewSectionProps {
  scores: Scores | null
  metadata: Metadata | null
  personaCount: number
  problemCount: number
  strategyCount: number
  simulationCount: number
  onJump: (tab: string) => void
}

function ScoreRing({ value, max, label, color, icon }: { value: number; max: number; label: string; color: string; icon: React.ReactNode }) {
  const pct = max > 0 ? Math.min(Math.max(value, 0), max) / max : 0
  const isPercentage = max === 100
  const displayVal = isPercentage ? `${value}%` : `${value}/${max}`
  const circumference = 2 * Math.PI * 36
  const strokeDashoffset = circumference * (1 - pct)

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-24 w-24">
        <svg className="h-24 w-24 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" fill="none" stroke="#f3f4f6" strokeWidth="6" />
          <circle
            cx="40" cy="40" r="36" fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-gray-900">{displayVal}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-xs font-medium text-gray-600">{label}</span>
      </div>
    </div>
  )
}

function RiskIndicator({ value }: { value: number }) {
  const label = value <= 3 ? 'Low Risk' : value <= 6 ? 'Medium Risk' : 'High Risk'
  const color = value <= 3 ? '#22c55e' : value <= 6 ? '#eab308' : '#ef4444'
  const badgeClass = value <= 3 ? 'bg-green-50 text-green-700 border-green-200' : value <= 6 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-red-50 text-red-700 border-red-200'

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-24 w-24">
        <svg className="h-24 w-24 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" fill="none" stroke="#f3f4f6" strokeWidth="6" />
          <circle cx="40" cy="40" r="36" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 36}`} strokeDashoffset={`${2 * Math.PI * 36 * (1 - value / 10)}`} className="transition-all duration-1000 ease-out" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-gray-900">{value}/10</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <FiAlertTriangle className="h-3.5 w-3.5 text-gray-400" />
        <Badge className={`text-[10px] ${badgeClass}`}>{label}</Badge>
      </div>
    </div>
  )
}

export default function OverviewSection({ scores, metadata, personaCount, problemCount, strategyCount, simulationCount, onJump }: OverviewSectionProps) {
  const failedStages = Array.isArray(metadata?.failed_stages) ? metadata.failed_stages.filter(Boolean) : []

  const summaryItems = [
    { key: 'personas', label: 'Personas', count: personaCount, icon: <FiUsers className="h-4 w-4 text-purple-500" />, color: 'bg-purple-50 hover:bg-purple-100/70' },
    { key: 'simulations', label: 'Simulations', count: simulationCount, icon: <FiActivity className="h-4 w-4 text-indigo-500" />, color: 'bg-indigo-50 hover:bg-indigo-100/70' },
    { key: 'problems', label: 'Problems', count: problemCount, icon: <FiAlertTriangle className="h-4 w-4 text-amber-500" />, color: 'bg-amber-50 hover:bg-amber-100/70' },
    { key: 'strategies', label: 'Strategies', count: strategyCount, icon: <FiZap className="h-4 w-4 text-emerald-500" />, color: 'bg-emerald-50 hover:bg-emerald-100/70' },
  ]

  return (
    <div className="space-y-6">
      {failedStages.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <FiAlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-medium text-amber-800">Some pipeline stages encountered issues</p>
            <p className="text-xs text-amber-700 mt-0.5">Failed: {failedStages.join(', ')}</p>
          </div>
        </div>
      )}

      {/* Score Dashboard */}
      <Card className="rounded-2xl shadow-md border-gray-200/50 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-violet-500" />
        <CardHeader className="pb-2 pt-5">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-900">
            <FiTrendingUp className="h-4 w-4 text-purple-600" />
            Score Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="flex items-center justify-center gap-8 sm:gap-12 flex-wrap py-4">
            <ScoreRing value={scores?.idea_score ?? 0} max={10} label="Idea Score" color="#7c3aed" icon={<FiTarget className="h-3.5 w-3.5 text-purple-500" />} />
            <ScoreRing value={scores?.adoption_probability ?? 0} max={100} label="Adoption" color="#6366f1" icon={<FiUsers className="h-3.5 w-3.5 text-indigo-500" />} />
            <RiskIndicator value={scores?.risk_score ?? 0} />
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {summaryItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onJump(item.key)}
            className={`text-left p-4 rounded-xl border border-gray-100 ${item.color} transition-all duration-200 group shadow-sm`}
          >
            <div className="flex items-center justify-between mb-2">
              {item.icon}
              <FiArrowRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{item.count}</div>
            <div className="text-[11px] text-gray-500 font-medium mt-0.5">{item.label}</div>
          </button>
        ))}
      </div>

      {/* Justification */}
      {scores?.justification && (
        <Card className="rounded-2xl shadow-sm border-gray-200/50">
          <CardContent className="pt-5 pb-5">
            <p className="text-[10px] font-semibold uppercase text-purple-600/70 tracking-widest mb-2">Executive Summary</p>
            <p className="text-sm leading-relaxed text-gray-700">{scores.justification}</p>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      {metadata && (
        <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-400">
          {Array.isArray(metadata?.completed_stages) && metadata.completed_stages.length > 0 && (
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              {metadata.completed_stages.join(' / ')}
            </span>
          )}
          {metadata?.timestamp && <span>Generated: {metadata.timestamp}</span>}
        </div>
      )}
    </div>
  )
}
