'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { FiChevronDown, FiChevronUp, FiUsers, FiDollarSign } from 'react-icons/fi'

interface Persona {
  name: string
  age: number
  job_title: string
  primary_goal: string
  frustrations: string[]
  behavior_traits: string[]
  tech_familiarity: string
  income_level: string
  spending_behavior: string
}

interface PersonasSectionProps {
  personas: Persona[]
}

function techBadge(t: string) {
  switch (t?.toLowerCase()) {
    case 'high': return 'bg-green-50 text-green-700 border-green-200'
    case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'low': return 'bg-red-50 text-red-700 border-red-200'
    default: return 'bg-gray-50 text-gray-600 border-gray-200'
  }
}

const COLORS = [
  'from-purple-500 to-indigo-500',
  'from-indigo-500 to-blue-500',
  'from-violet-500 to-purple-500',
  'from-fuchsia-500 to-violet-500',
  'from-blue-500 to-cyan-500',
]

export default function PersonasSection({ personas }: PersonasSectionProps) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})

  if (!Array.isArray(personas) || personas.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-gray-400">
        No persona data available.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
          <FiUsers className="h-4 w-4 text-purple-600" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Target Personas</h2>
          <p className="text-[11px] text-gray-400">{personas.length} user profiles identified</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {personas.map((p, i) => (
          <Collapsible key={i} open={!!expanded[i]} onOpenChange={(o) => setExpanded(prev => ({ ...prev, [i]: o }))}>
            <Card className="rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border-gray-200/50 overflow-hidden">
              <div className={`h-1 bg-gradient-to-r ${COLORS[i % COLORS.length]}`} />
              <CollapsibleTrigger asChild>
                <CardHeader className="pb-2 cursor-pointer pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${COLORS[i % COLORS.length]} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                        {(p?.name ?? 'U')[0]}
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold text-gray-900">{p?.name ?? 'Unknown'}</CardTitle>
                        <p className="text-xs text-gray-500">{p?.job_title ?? ''}{p?.age ? ` | ${p.age}` : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge className={`text-[10px] ${techBadge(p?.tech_familiarity ?? '')}`}>
                        {p?.tech_familiarity ?? 'N/A'}
                      </Badge>
                      {expanded[i] ? <FiChevronUp className="h-4 w-4 text-gray-400" /> : <FiChevronDown className="h-4 w-4 text-gray-400" />}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CardContent className="pt-0 pb-4">
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">{p?.primary_goal ?? ''}</p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="text-[10px] border-gray-200">
                    <FiDollarSign className="h-2.5 w-2.5 mr-0.5" />
                    {p?.income_level ?? 'N/A'}
                  </Badge>
                </div>

                <CollapsibleContent>
                  <div className="space-y-3.5 mt-3.5 border-t border-gray-100 pt-3.5">
                    <div>
                      <p className="text-[10px] font-semibold uppercase text-gray-400 mb-1.5 tracking-wider">Spending Behavior</p>
                      <p className="text-xs text-gray-600">{p?.spending_behavior ?? 'N/A'}</p>
                    </div>
                    {Array.isArray(p?.frustrations) && p.frustrations.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold uppercase text-gray-400 mb-1.5 tracking-wider">Frustrations</p>
                        <ul className="space-y-1">
                          {p.frustrations.map((f, fi) => (
                            <li key={fi} className="text-xs text-gray-600 flex items-start gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-300 mt-1.5 shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {Array.isArray(p?.behavior_traits) && p.behavior_traits.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold uppercase text-gray-400 mb-1.5 tracking-wider">Behavior Traits</p>
                        <div className="flex flex-wrap gap-1.5">
                          {p.behavior_traits.map((t, ti) => (
                            <Badge key={ti} variant="secondary" className="text-[10px] bg-purple-50 text-purple-700 border-purple-200">{t}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </CardContent>
            </Card>
          </Collapsible>
        ))}
      </div>
    </div>
  )
}
