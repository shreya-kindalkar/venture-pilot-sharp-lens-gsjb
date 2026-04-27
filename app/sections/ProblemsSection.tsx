'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { FiAlertTriangle, FiChevronDown, FiChevronUp, FiAlertCircle, FiInfo, FiShield, FiDollarSign, FiTrendingDown } from 'react-icons/fi'

interface Problem {
  title: string
  category: string
  severity: string
  frequency: number
  description: string
  impact: string
  affected_personas: string[]
}

interface ProblemsSectionProps {
  problems: Problem[]
}

function severityColor(s: string) {
  switch (s?.toLowerCase()) {
    case 'critical': return 'bg-red-50 text-red-700 border-red-200'
    case 'high': return 'bg-orange-50 text-orange-700 border-orange-200'
    case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'low': return 'bg-gray-50 text-gray-600 border-gray-200'
    default: return 'bg-gray-50 text-gray-600 border-gray-200'
  }
}

function severityDot(s: string) {
  switch (s?.toLowerCase()) {
    case 'critical': return 'bg-red-500'
    case 'high': return 'bg-orange-500'
    case 'medium': return 'bg-amber-500'
    case 'low': return 'bg-gray-400'
    default: return 'bg-gray-400'
  }
}

function categoryIcon(c: string) {
  switch (c?.toLowerCase()) {
    case 'value_prop': return <FiAlertCircle className="h-4 w-4 text-blue-500" />
    case 'ux_friction': return <FiInfo className="h-4 w-4 text-purple-500" />
    case 'pricing': return <FiDollarSign className="h-4 w-4 text-emerald-500" />
    case 'trust': return <FiShield className="h-4 w-4 text-orange-500" />
    case 'market_relevance': return <FiTrendingDown className="h-4 w-4 text-cyan-600" />
    default: return <FiAlertTriangle className="h-4 w-4 text-gray-400" />
  }
}

function categoryLabel(c: string) {
  switch (c?.toLowerCase()) {
    case 'value_prop': return 'Value Prop'
    case 'ux_friction': return 'UX Friction'
    case 'pricing': return 'Pricing'
    case 'trust': return 'Trust'
    case 'market_relevance': return 'Market'
    default: return (c ?? '').replace(/_/g, ' ')
  }
}

function categoryColor(c: string) {
  switch (c?.toLowerCase()) {
    case 'value_prop': return 'bg-blue-50 text-blue-600 border-blue-200'
    case 'ux_friction': return 'bg-purple-50 text-purple-600 border-purple-200'
    case 'pricing': return 'bg-emerald-50 text-emerald-600 border-emerald-200'
    case 'trust': return 'bg-orange-50 text-orange-600 border-orange-200'
    case 'market_relevance': return 'bg-cyan-50 text-cyan-600 border-cyan-200'
    default: return 'bg-gray-50 text-gray-600 border-gray-200'
  }
}

function FrequencyBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-amber-400 to-red-400 rounded-full transition-all duration-500" style={{ width: `${(value / 10) * 100}%` }} />
      </div>
      <span className="text-[10px] font-medium text-gray-500">{value}/10</span>
    </div>
  )
}

export default function ProblemsSection({ problems }: ProblemsSectionProps) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})

  if (!Array.isArray(problems) || problems.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-gray-400">
        No problems detected.
      </div>
    )
  }

  const sorted = [...problems].sort((a, b) => {
    const order: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }
    return (order[a?.severity?.toLowerCase() ?? ''] ?? 4) - (order[b?.severity?.toLowerCase() ?? ''] ?? 4)
  })

  const criticalCount = problems.filter(p => p?.severity?.toLowerCase() === 'critical').length
  const highCount = problems.filter(p => p?.severity?.toLowerCase() === 'high').length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
            <FiAlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Identified Problems</h2>
            <p className="text-[11px] text-gray-400">{problems.length} issues detected</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {criticalCount > 0 && (
            <Badge className="text-[10px] bg-red-50 text-red-700 border-red-200">{criticalCount} Critical</Badge>
          )}
          {highCount > 0 && (
            <Badge className="text-[10px] bg-orange-50 text-orange-700 border-orange-200">{highCount} High</Badge>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {sorted.map((p, i) => (
          <Collapsible key={i} open={!!expanded[i]} onOpenChange={(o) => setExpanded(prev => ({ ...prev, [i]: o }))}>
            <Card className={`rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md border-gray-200/50 overflow-hidden ${p?.severity?.toLowerCase() === 'critical' ? 'border-l-2 border-l-red-400' : ''}`}>
              <CollapsibleTrigger asChild>
                <CardContent className="pt-4 pb-3 cursor-pointer">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="mt-0.5">{categoryIcon(p?.category ?? '')}</div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className="text-sm font-medium text-gray-900">{p?.title ?? 'Untitled'}</span>
                          <Badge className={`text-[10px] border ${severityColor(p?.severity ?? '')}`}>
                            <span className={`h-1.5 w-1.5 rounded-full mr-1 ${severityDot(p?.severity ?? '')}`} />
                            {p?.severity ?? 'N/A'}
                          </Badge>
                          <Badge variant="outline" className={`text-[10px] border ${categoryColor(p?.category ?? '')}`}>
                            {categoryLabel(p?.category ?? '')}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-1">{p?.description ?? ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] text-gray-400 mb-0.5">Frequency</p>
                        <FrequencyBar value={p?.frequency ?? 0} />
                      </div>
                      {expanded[i] ? <FiChevronUp className="h-4 w-4 text-gray-400" /> : <FiChevronDown className="h-4 w-4 text-gray-400" />}
                    </div>
                  </div>
                </CardContent>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0 pb-4 space-y-3 border-t border-gray-100 mt-1">
                  <div className="pt-3">
                    <p className="text-[10px] font-semibold uppercase text-gray-400 mb-1.5 tracking-wider">Full Description</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{p?.description ?? ''}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-red-50/50 border border-red-100">
                    <p className="text-[10px] font-semibold uppercase text-red-400 mb-1 tracking-wider">Impact</p>
                    <p className="text-xs text-red-700">{p?.impact ?? ''}</p>
                  </div>
                  <div className="sm:hidden">
                    <p className="text-[10px] text-gray-400 mb-0.5">Frequency</p>
                    <FrequencyBar value={p?.frequency ?? 0} />
                  </div>
                  {Array.isArray(p?.affected_personas) && p.affected_personas.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase text-gray-400 mb-1.5 tracking-wider">Affected Personas</p>
                      <div className="flex flex-wrap gap-1.5">
                        {p.affected_personas.map((a, ai) => (
                          <Badge key={ai} variant="secondary" className="text-[10px] bg-purple-50 text-purple-700 border-purple-200">{a}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>
    </div>
  )
}
