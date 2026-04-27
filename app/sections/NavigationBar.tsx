'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UserMenu } from 'lyzr-architect/client'
import { FiCopy, FiDownload, FiRefreshCw, FiX, FiZap, FiSave, FiFolder, FiCheck } from 'react-icons/fi'

interface NavigationBarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onRegenerate: () => void
  onCopy: () => void
  onDownload: () => void
  onClear: () => void
  loading: boolean
  copied: boolean
  fileUrl: string | null
  onDownloadFull: () => void
  counts: { personas: number; simulations: number; problems: number; strategies: number }
  onSave: () => void
  onOpenSaved: () => void
  savedCount: number
  saveLoading: boolean
  isSampleMode: boolean
}

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'personas', label: 'Personas' },
  { id: 'simulations', label: 'Simulations' },
  { id: 'problems', label: 'Problems' },
  { id: 'strategies', label: 'Strategy' },
]

export default function NavigationBar({
  activeTab,
  onTabChange,
  onRegenerate,
  onCopy,
  onDownload,
  onClear,
  loading,
  copied,
  fileUrl,
  onDownloadFull,
  counts,
  onSave,
  onOpenSaved,
  savedCount,
  saveLoading,
  isSampleMode,
}: NavigationBarProps) {
  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
              <FiZap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight text-gray-900">VenturePilot</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center bg-gray-100/70 rounded-lg p-0.5">
            {TABS.map((tab) => {
              const count = tab.id === 'overview' ? null
                : tab.id === 'personas' ? counts.personas
                : tab.id === 'simulations' ? counts.simulations
                : tab.id === 'problems' ? counts.problems
                : counts.strategies
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${isActive ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {tab.label}
                  {count !== null && count > 0 && (
                    <span className={`ml-1.5 text-[10px] ${isActive ? 'text-purple-600' : 'text-gray-400'}`}>
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-0.5">
            {!isSampleMode && (
              <Button variant="ghost" size="sm" onClick={onSave} disabled={saveLoading} className="text-xs h-8 px-2 text-gray-500 hover:text-purple-600">
                <FiSave className="h-3.5 w-3.5" />
                <span className="hidden lg:inline ml-1">{saveLoading ? 'Saving...' : 'Save'}</span>
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onOpenSaved} className="text-xs h-8 px-2 relative text-gray-500 hover:text-purple-600">
              <FiFolder className="h-3.5 w-3.5" />
              <span className="hidden lg:inline ml-1">Saved</span>
              {savedCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] flex items-center justify-center rounded-full bg-purple-600 text-white text-[9px] px-1 font-medium">{savedCount}</span>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={onRegenerate} disabled={loading} className="text-xs h-8 px-2 text-gray-500 hover:text-purple-600">
              <FiRefreshCw className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onCopy} className="text-xs h-8 px-2 text-gray-500 hover:text-purple-600">
              {copied ? <FiCheck className="h-3.5 w-3.5 text-green-500" /> : <FiCopy className="h-3.5 w-3.5" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={onDownload} className="text-xs h-8 px-2 text-gray-500 hover:text-purple-600">
              <FiDownload className="h-3.5 w-3.5" />
              <span className="hidden lg:inline ml-1">Report</span>
            </Button>
            {fileUrl && (
              <Button variant="outline" size="sm" onClick={onDownloadFull} className="text-xs h-8 px-2.5 border-purple-200 text-purple-600 hover:bg-purple-50">
                <FiDownload className="h-3.5 w-3.5 mr-1" />
                <span className="hidden lg:inline">Full</span>
              </Button>
            )}
            <div className="w-px h-5 bg-gray-200 mx-1" />
            <Button variant="ghost" size="sm" onClick={onClear} className="text-xs h-8 px-2 text-gray-400 hover:text-red-500">
              <FiX className="h-3.5 w-3.5" />
            </Button>
            <div className="ml-0.5 border-l border-gray-200 pl-1.5">
              <UserMenu />
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="flex md:hidden items-center gap-1 pb-2 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all duration-200 ${activeTab === tab.id ? 'bg-purple-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
