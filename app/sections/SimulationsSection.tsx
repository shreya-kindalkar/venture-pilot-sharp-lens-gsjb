'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { FiBarChart2, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { HiOutlineArrowsUpDown } from 'react-icons/hi2'

interface Simulation {
  persona_name: string
  clarity_score: number
  adoption_score: number
  first_impression: string
  key_objections: string[]
  drop_off_point: string
  conversion_trigger: string
}

interface SimulationsSectionProps {
  simulations: Simulation[]
}

function scoreColor(val: number) {
  if (val >= 7) return 'text-green-700 bg-green-50 border-green-200'
  if (val >= 4) return 'text-amber-700 bg-amber-50 border-amber-200'
  return 'text-red-700 bg-red-50 border-red-200'
}

function scoreDot(val: number) {
  if (val >= 7) return 'bg-green-500'
  if (val >= 4) return 'bg-amber-500'
  return 'bg-red-500'
}

export default function SimulationsSection({ simulations }: SimulationsSectionProps) {
  const [sortKey, setSortKey] = useState<'clarity_score' | 'adoption_score' | null>(null)
  const [sortAsc, setSortAsc] = useState(true)
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

  if (!Array.isArray(simulations) || simulations.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-gray-400">
        No simulation data available.
      </div>
    )
  }

  const sorted = [...simulations].sort((a, b) => {
    if (!sortKey) return 0
    const diff = (a[sortKey] ?? 0) - (b[sortKey] ?? 0)
    return sortAsc ? diff : -diff
  })

  const toggleSort = (key: 'clarity_score' | 'adoption_score') => {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(true) }
  }

  const avgClarity = simulations.reduce((sum, s) => sum + (s?.clarity_score ?? 0), 0) / simulations.length
  const avgAdoption = simulations.reduce((sum, s) => sum + (s?.adoption_score ?? 0), 0) / simulations.length

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
          <FiBarChart2 className="h-4 w-4 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Behavior Simulations</h2>
          <p className="text-[11px] text-gray-400">{simulations.length} persona simulations completed</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="rounded-xl shadow-sm border-gray-200/50">
          <CardContent className="pt-4 pb-3">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Avg Clarity</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-2xl font-bold ${avgClarity >= 7 ? 'text-green-600' : avgClarity >= 4 ? 'text-amber-600' : 'text-red-600'}`}>
                {avgClarity.toFixed(1)}
              </span>
              <span className="text-xs text-gray-400">/10</span>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm border-gray-200/50">
          <CardContent className="pt-4 pb-3">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Avg Adoption</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-2xl font-bold ${avgAdoption >= 7 ? 'text-green-600' : avgAdoption >= 4 ? 'text-amber-600' : 'text-red-600'}`}>
                {avgAdoption.toFixed(1)}
              </span>
              <span className="text-xs text-gray-400">/10</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="rounded-2xl shadow-sm overflow-hidden border-gray-200/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80 border-b border-gray-100">
                <TableHead className="text-[11px] font-semibold text-gray-500">Persona</TableHead>
                <TableHead className="text-[11px] font-semibold text-gray-500 cursor-pointer select-none" onClick={() => toggleSort('clarity_score')}>
                  <span className="flex items-center gap-1">Clarity <HiOutlineArrowsUpDown className="h-3 w-3 text-gray-400" /></span>
                </TableHead>
                <TableHead className="text-[11px] font-semibold text-gray-500 cursor-pointer select-none" onClick={() => toggleSort('adoption_score')}>
                  <span className="flex items-center gap-1">Adoption <HiOutlineArrowsUpDown className="h-3 w-3 text-gray-400" /></span>
                </TableHead>
                <TableHead className="text-[11px] font-semibold text-gray-500 hidden md:table-cell">First Impression</TableHead>
                <TableHead className="text-[11px] w-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((s, i) => (
                <TableRow
                  key={i}
                  className={`cursor-pointer transition-colors duration-200 hover:bg-purple-50/30 ${expandedRow === i ? 'bg-purple-50/50' : ''}`}
                  onClick={() => setExpandedRow(expandedRow === i ? null : i)}
                >
                  <TableCell className="text-xs font-medium py-3 text-gray-900">{s?.persona_name ?? 'N/A'}</TableCell>
                  <TableCell className="py-3">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${scoreColor(s?.clarity_score ?? 0)}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${scoreDot(s?.clarity_score ?? 0)}`} />
                      {s?.clarity_score ?? 0}/10
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${scoreColor(s?.adoption_score ?? 0)}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${scoreDot(s?.adoption_score ?? 0)}`} />
                      {s?.adoption_score ?? 0}/10
                    </span>
                  </TableCell>
                  <TableCell className="text-xs max-w-xs truncate hidden md:table-cell text-gray-500">{s?.first_impression ?? ''}</TableCell>
                  <TableCell className="py-3">
                    {expandedRow === i ? <FiChevronUp className="h-3.5 w-3.5 text-gray-400" /> : <FiChevronDown className="h-3.5 w-3.5 text-gray-400" />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Expanded Detail */}
      {expandedRow !== null && sorted[expandedRow] && (
        <Card className="rounded-2xl shadow-sm border-purple-200/50 bg-purple-50/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-purple-700">{sorted[expandedRow]?.persona_name ?? 'N/A'} - Detailed Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="md:hidden">
              <p className="text-[10px] font-semibold uppercase text-gray-400 mb-1 tracking-wider">First Impression</p>
              <p className="text-gray-600">{sorted[expandedRow]?.first_impression ?? ''}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white border border-gray-100">
                <p className="text-[10px] font-semibold uppercase text-gray-400 mb-1 tracking-wider">Drop-off Point</p>
                <p className="text-gray-700">{sorted[expandedRow]?.drop_off_point ?? 'N/A'}</p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-gray-100">
                <p className="text-[10px] font-semibold uppercase text-gray-400 mb-1 tracking-wider">Conversion Trigger</p>
                <p className="text-gray-700">{sorted[expandedRow]?.conversion_trigger ?? 'N/A'}</p>
              </div>
            </div>
            {Array.isArray(sorted[expandedRow]?.key_objections) && sorted[expandedRow].key_objections.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold uppercase text-gray-400 mb-1.5 tracking-wider">Key Objections</p>
                <ul className="space-y-1 ml-1">
                  {sorted[expandedRow].key_objections.map((o: string, oi: number) => (
                    <li key={oi} className="text-gray-600 flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
