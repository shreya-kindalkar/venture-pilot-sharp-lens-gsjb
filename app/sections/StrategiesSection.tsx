'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { FiChevronDown, FiChevronUp, FiZap, FiArrowRight, FiTarget } from 'react-icons/fi'

interface Strategy {
  priority: number
  title: string
  effort: string
  expected_impact: string
  rationale: string
  problem_solved: string
  success_metric: string
}

interface StrategiesSectionProps {
  strategies: Strategy[]
}

function effortColor(e: string) {
  switch (e?.toLowerCase()) {
    case 'low': return 'bg-green-50 text-green-700 border-green-200'
    case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'high': return 'bg-red-50 text-red-700 border-red-200'
    default: return 'bg-gray-50 text-gray-600 border-gray-200'
  }
}

export default function StrategiesSection({ strategies }: StrategiesSectionProps) {
  const sorted = Array.isArray(strategies) ? [...strategies].sort((a, b) => (a?.priority ?? 99) - (b?.priority ?? 99)) : []
  const [expanded, setExpanded] = useState<Record<number, boolean>>(() => {
    const init: Record<number, boolean> = {}
    if (sorted.length > 0) init[0] = true
    if (sorted.length > 1) init[1] = true
    return init
  })

  if (!Array.isArray(strategies) || strategies.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-gray-400">
        No strategies available.
      </div>
    )
  }

  const topStrategy = sorted[0]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
          <FiZap className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Recommended Strategies</h2>
          <p className="text-[11px] text-gray-400">{strategies.length} action plans generated</p>
        </div>
      </div>

      {/* Next Best Action - Featured Card */}
      {topStrategy && (
        <Card className="rounded-2xl shadow-md border-purple-200/50 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-violet-500" />
          <CardHeader className="pb-2 pt-4">
            <div className="flex items-center gap-2">
              <FiArrowRight className="h-4 w-4 text-purple-600" />
              <CardTitle className="text-[11px] font-bold text-purple-600 uppercase tracking-widest">Next Best Action</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pb-5">
            <h3 className="text-base font-semibold text-gray-900 mb-2">{topStrategy?.title ?? 'Untitled'}</h3>
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">{topStrategy?.expected_impact ?? ''}</p>
            <div className="flex flex-wrap gap-2">
              <Badge className={`text-[10px] border ${effortColor(topStrategy?.effort ?? '')}`}>{topStrategy?.effort ?? 'N/A'} effort</Badge>
              <Badge variant="outline" className="text-[10px] border-gray-200 text-gray-500">
                <FiTarget className="h-2.5 w-2.5 mr-1" />
                {topStrategy?.problem_solved ?? 'N/A'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Strategies */}
      <div className="space-y-3">
        {sorted.map((s, i) => (
          <Collapsible key={i} open={!!expanded[i]} onOpenChange={(o) => setExpanded(prev => ({ ...prev, [i]: o }))}>
            <Card className="rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border-gray-200/50">
              <CollapsibleTrigger asChild>
                <CardContent className="pt-4 pb-3 cursor-pointer">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-xs font-bold shrink-0 shadow-sm">
                        #{s?.priority ?? i + 1}
                      </div>
                      <div className="min-w-0">
                        <span className="text-sm font-medium block truncate text-gray-900">{s?.title ?? 'Untitled'}</span>
                        <span className="text-xs text-gray-500">{s?.expected_impact ?? ''}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={`text-[10px] border ${effortColor(s?.effort ?? '')}`}>{s?.effort ?? 'N/A'}</Badge>
                      {expanded[i] ? <FiChevronUp className="h-4 w-4 text-gray-400" /> : <FiChevronDown className="h-4 w-4 text-gray-400" />}
                    </div>
                  </div>
                </CardContent>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0 pb-4 border-t border-gray-100 mt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                    <div className="p-3 rounded-xl bg-gray-50/80 border border-gray-100">
                      <p className="text-[10px] font-semibold uppercase text-gray-400 mb-1.5 tracking-wider">Rationale</p>
                      <p className="text-xs text-gray-600">{s?.rationale ?? ''}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50/80 border border-gray-100">
                      <p className="text-[10px] font-semibold uppercase text-gray-400 mb-1.5 tracking-wider">Problem Solved</p>
                      <p className="text-xs text-gray-600">{s?.problem_solved ?? ''}</p>
                    </div>
                  </div>
                  <div className="mt-3 p-3 rounded-xl bg-purple-50/50 border border-purple-100">
                    <p className="text-[10px] font-semibold uppercase text-purple-400 mb-1.5 tracking-wider">Success Metric</p>
                    <p className="text-xs text-purple-700">{s?.success_metric ?? ''}</p>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>
    </div>
  )
}
