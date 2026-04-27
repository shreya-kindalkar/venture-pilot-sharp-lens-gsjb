'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FiTrash2, FiClock, FiChevronRight, FiX, FiAlertCircle } from 'react-icons/fi'

interface SavedAnalysis {
  _id: string
  title: string
  idea_text: string
  analysis_data: any
  file_url?: string
  createdAt?: string
}

interface SavedAnalysesProps {
  analyses: SavedAnalysis[]
  loading: boolean
  error: string | null
  onLoad: (analysis: SavedAnalysis) => void
  onDelete: (id: string) => void
  onClose: () => void
  deleteLoading: string | null
}

export default function SavedAnalyses({ analyses, loading, error, onLoad, onDelete, onClose, deleteLoading }: SavedAnalysesProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      onDelete(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
    }
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch {
      return ''
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white border-l border-gray-200 h-full flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <CardTitle className="text-sm font-semibold text-gray-900">Saved Analyses</CardTitle>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 bg-purple-50 text-purple-700 border-purple-200">{analyses.length}</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600">
            <FiX className="h-4 w-4" />
          </Button>
        </div>

        {error && (
          <div className="mx-4 mt-3 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2">
            <FiAlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        <ScrollArea className="flex-1 p-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-20" />
              ))}
            </div>
          ) : analyses.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm text-gray-500 font-medium">No saved analyses yet</p>
              <p className="text-xs text-gray-400 mt-1">Run an analysis and save it to see it here</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {analyses.map((analysis) => (
                <Card key={analysis._id} className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border-gray-200/50">
                  <CardContent className="p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <button
                        onClick={() => onLoad(analysis)}
                        className="flex-1 text-left group"
                      >
                        <p className="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                          {analysis.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                          {analysis.idea_text}
                        </p>
                        <div className="flex items-center gap-2 mt-2.5">
                          {analysis.createdAt && (
                            <span className="flex items-center gap-1 text-[10px] text-gray-400">
                              <FiClock className="h-3 w-3" />
                              {formatDate(analysis.createdAt)}
                            </span>
                          )}
                          <FiChevronRight className="h-3 w-3 text-gray-300 group-hover:text-purple-400 transition-colors ml-auto" />
                        </div>
                      </button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(analysis._id)}
                        disabled={deleteLoading === analysis._id}
                        className={`h-7 w-7 p-0 shrink-0 ${confirmDelete === analysis._id ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}
                      >
                        <FiTrash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    {confirmDelete === analysis._id && (
                      <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-[10px] text-red-500 font-medium">Delete this analysis?</p>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(null)} className="h-6 px-2 text-[10px]">
                            Cancel
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(analysis._id)} disabled={deleteLoading === analysis._id} className="h-6 px-2 text-[10px]">
                            {deleteLoading === analysis._id ? 'Deleting...' : 'Confirm'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}
