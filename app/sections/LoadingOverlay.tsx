'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { FiCheckCircle, FiCircle, FiX } from 'react-icons/fi'
import { HiOutlineCog6Tooth } from 'react-icons/hi2'

const STAGES = [
  { label: 'Generating Personas', agent: 'PersonaSim' },
  { label: 'Simulating Behavior', agent: 'BehaviorSim' },
  { label: 'Analyzing Problems', agent: 'ProblemDetect' },
  { label: 'Building Strategy', agent: 'Strategy' },
  { label: 'Computing Scores', agent: 'Scoring' },
]

interface LoadingOverlayProps {
  onCancel: () => void
}

export default function LoadingOverlay({ onCancel }: LoadingOverlayProps) {
  const [currentStage, setCurrentStage] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const stageRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setElapsed(prev => prev + 1)
    }, 1000)
    stageRef.current = setInterval(() => {
      setCurrentStage(prev => (prev < STAGES.length - 1 ? prev + 1 : prev))
    }, 10000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (stageRef.current) clearInterval(stageRef.current)
    }
  }, [])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const progress = ((currentStage + 1) / STAGES.length) * 100

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900/20 via-indigo-900/10 to-background/95 backdrop-blur-md">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-sm space-y-6 shadow-2xl shadow-purple-500/10">
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center mb-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <HiOutlineCog6Tooth className="h-8 w-8 text-white animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>
          <p className="text-base font-semibold text-gray-900">Analyzing your idea</p>
          <p className="text-xs text-gray-400 mt-1">{formatTime(elapsed)} elapsed</p>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-400 text-right">{Math.round(progress)}% complete</p>
        </div>

        <div className="space-y-2.5">
          {STAGES.map((stage, i) => (
            <div key={stage.label} className="flex items-center gap-3 text-xs">
              {i < currentStage ? (
                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                  <FiCheckCircle className="h-3.5 w-3.5 text-green-600" />
                </div>
              ) : i === currentStage ? (
                <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                </div>
              ) : (
                <div className="h-5 w-5 rounded-full bg-gray-50 flex items-center justify-center">
                  <FiCircle className="h-3 w-3 text-gray-300" />
                </div>
              )}
              <div className="flex-1">
                <span className={`font-medium ${i < currentStage ? 'text-green-700' : i === currentStage ? 'text-gray-900' : 'text-gray-400'}`}>
                  {stage.label}
                </span>
              </div>
              <span className={`text-[10px] ${i <= currentStage ? 'text-gray-400' : 'text-gray-300'}`}>
                {stage.agent}
              </span>
            </div>
          ))}
        </div>

        <Button variant="ghost" size="sm" onClick={onCancel} className="w-full text-xs text-gray-400 hover:text-gray-600">
          <FiX className="h-3 w-3 mr-1" />
          Cancel Analysis
        </Button>
      </div>
    </div>
  )
}
