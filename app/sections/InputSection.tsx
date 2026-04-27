'use client'

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FiZap, FiUsers, FiActivity, FiAlertTriangle, FiTarget, FiTrendingUp, FiArrowRight } from 'react-icons/fi'
import { HiOutlineSparkles, HiOutlineBeaker, HiOutlineShieldCheck, HiOutlineLightBulb } from 'react-icons/hi2'

interface InputSectionProps {
  idea: string
  setIdea: (v: string) => void
  onAnalyze: () => void
  loading: boolean
}

const EXAMPLE_IDEA = "An AI-powered meal planning app that creates personalized weekly meal plans based on dietary restrictions, budget constraints, and local grocery store availability, with automatic shopping list generation and one-click grocery delivery integration"

const AGENTS = [
  { icon: FiUsers, label: 'PersonaSim', desc: 'User personas' },
  { icon: FiActivity, label: 'BehaviorSim', desc: 'Adoption simulation' },
  { icon: FiAlertTriangle, label: 'ProblemDetect', desc: 'Risk analysis' },
  { icon: HiOutlineLightBulb, label: 'Strategy', desc: 'Action plans' },
  { icon: FiTarget, label: 'Scoring', desc: 'Final scores' },
]

const STEPS = [
  { num: '1', title: 'Describe Your Idea', desc: 'Enter your startup concept in a few sentences' },
  { num: '2', title: 'AI Analyzes', desc: '5 specialized agents evaluate your idea simultaneously' },
  { num: '3', title: 'Get Results', desc: 'Scores, personas, risks, and strategies in seconds' },
]

export default function InputSection({ idea, setIdea, onAnalyze, loading }: InputSectionProps) {
  const charCount = idea.length
  const isValid = charCount >= 10 && charCount <= 500

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-indigo-700 to-violet-800 pt-16 pb-20 px-4 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.1),transparent_70%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5 mb-6">
            <FiZap className="h-3.5 w-3.5 text-purple-200" />
            <span className="text-xs font-medium text-purple-100">Powered by 5 AI Specialists</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-4">
            Validate Your Startup<br className="hidden sm:block" /> in 60 Seconds
          </h1>
          <p className="text-base sm:text-lg text-purple-100/80 max-w-xl mx-auto mb-8">
            Get instant AI-powered analysis with personas, behavior simulations, risk detection, and strategic recommendations.
          </p>

          {/* Agent icons row */}
          <div className="flex items-center justify-center gap-3 sm:gap-5 flex-wrap">
            {AGENTS.map((a) => (
              <div key={a.label} className="flex flex-col items-center gap-1.5 group">
                <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
                  <a.icon className="h-4.5 w-4.5 text-purple-100" />
                </div>
                <span className="text-[10px] text-purple-200/70 font-medium">{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Input Card — pulled up into hero */}
      <div className="relative z-20 -mt-10 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <Card className="rounded-2xl shadow-2xl shadow-purple-500/10 border-gray-200/50 overflow-hidden">
            <div className="flex">
              <div className="w-1.5 bg-gradient-to-b from-purple-500 via-indigo-500 to-violet-500 shrink-0" />
              <CardContent className="flex-1 p-5 sm:p-6 space-y-4">
                <div>
                  <Textarea
                    placeholder="Describe your startup idea in detail... e.g., 'A platform that connects freelance designers with small businesses for quick branding projects, using AI to match based on style preferences and budget.'"
                    value={idea}
                    onChange={(e) => {
                      if (e.target.value.length <= 500) {
                        setIdea(e.target.value)
                      }
                    }}
                    rows={4}
                    className="resize-none text-sm rounded-xl border-gray-200 focus:border-purple-400 focus:ring-purple-400/20 bg-gray-50/50 placeholder:text-gray-400"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs ${charCount > 500 ? 'text-red-500' : charCount >= 10 ? 'text-gray-400' : 'text-gray-300'}`}>
                      {charCount}/500 {charCount < 10 && charCount > 0 ? `(${10 - charCount} more needed)` : ''}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIdea(EXAMPLE_IDEA)}
                      className="text-xs text-purple-500 hover:text-purple-700 font-medium transition-colors flex items-center gap-1"
                    >
                      <HiOutlineSparkles className="h-3 w-3" />
                      Try Example Idea
                    </button>
                  </div>
                </div>

                <Button
                  onClick={onAnalyze}
                  disabled={!isValid || loading}
                  className="w-full rounded-xl h-12 text-sm font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30 disabled:opacity-50 disabled:shadow-none"
                  size="lg"
                >
                  <FiZap className="h-4 w-4 mr-2" />
                  Analyze My Idea
                  <FiArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>

      {/* Social Proof / Preview */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <p className="text-center text-sm font-medium text-gray-500 mb-6">
          Your idea gets scored across 5 dimensions by specialized AI agents
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600">7/10</div>
            <div className="text-[11px] text-gray-500 mt-1 font-medium">Idea Score</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-indigo-600">65%</div>
            <div className="text-[11px] text-gray-500 mt-1 font-medium">Adoption Rate</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-violet-600">5/10</div>
            <div className="text-[11px] text-gray-500 mt-1 font-medium">Risk Level</div>
          </div>
        </div>
        <p className="text-center text-[11px] text-gray-400 mt-3">Sample scores from a recent analysis</p>
      </div>

      {/* How It Works */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STEPS.map((step) => (
            <div key={step.num} className="flex items-start gap-3 sm:flex-col sm:items-center sm:text-center">
              <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold shrink-0">
                {step.num}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{step.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer context */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-24 pt-4">
        <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <HiOutlineBeaker className="h-3.5 w-3.5" />
            45-60 sec analysis
          </span>
          <span className="flex items-center gap-1.5">
            <HiOutlineShieldCheck className="h-3.5 w-3.5" />
            Actionable feedback
          </span>
          <span className="flex items-center gap-1.5">
            <FiTrendingUp className="h-3.5 w-3.5" />
            Strategy recommendations
          </span>
        </div>
      </div>
    </div>
  )
}
