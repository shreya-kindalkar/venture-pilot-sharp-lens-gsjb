'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { AuthProvider, ProtectedRoute, UserMenu } from 'lyzr-architect/client'
import { callAIAgent } from '@/lib/aiAgent'
import { copyToClipboard } from '@/lib/clipboard'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { FiAlertCircle, FiRefreshCw, FiZap, FiX, FiSave } from 'react-icons/fi'
import { HiOutlineSparkles } from 'react-icons/hi2'
import InputSection from './sections/InputSection'
import LoadingOverlay from './sections/LoadingOverlay'
import NavigationBar from './sections/NavigationBar'
import OverviewSection from './sections/OverviewSection'
import PersonasSection from './sections/PersonasSection'
import SimulationsSection from './sections/SimulationsSection'
import ProblemsSection from './sections/ProblemsSection'
import StrategiesSection from './sections/StrategiesSection'
import AuthScreen from './sections/AuthScreen'
import SavedAnalyses from './sections/SavedAnalyses'

const AGENT_ID = '69ec739f2d2419110b70f24f'

const THEME_VARS = {
  '--background': '250 20% 97%',
  '--foreground': '240 10% 10%',
  '--card': '0 0% 100%',
  '--card-foreground': '240 10% 10%',
  '--popover': '0 0% 100%',
  '--popover-foreground': '240 10% 10%',
  '--primary': '262 80% 50%',
  '--primary-foreground': '0 0% 100%',
  '--secondary': '250 15% 93%',
  '--secondary-foreground': '240 10% 20%',
  '--accent': '262 60% 95%',
  '--accent-foreground': '262 80% 40%',
  '--destructive': '0 70% 50%',
  '--destructive-foreground': '0 0% 100%',
  '--muted': '250 10% 92%',
  '--muted-foreground': '240 8% 46%',
  '--border': '250 12% 90%',
  '--input': '250 12% 85%',
  '--ring': '262 80% 50%',
  '--chart-1': '262 80% 50%',
  '--chart-2': '234 70% 55%',
  '--chart-3': '280 60% 55%',
  '--chart-4': '35 80% 50%',
  '--chart-5': '0 70% 50%',
  '--radius': '0.5rem',
} as React.CSSProperties

interface AnalysisResult {
  personas: any[]
  simulations: any[]
  problems: any[]
  strategies: any[]
  scores: { idea_score: number; adoption_probability: number; risk_score: number; justification: string } | null
  metadata: { completed_stages: string[]; failed_stages: string[]; timestamp: string } | null
}

interface SavedAnalysis {
  _id: string
  title: string
  idea_text: string
  analysis_data: any
  file_url?: string
  createdAt?: string
}

const SAMPLE_DATA: AnalysisResult = {
  personas: [
    { name: 'Sarah Chen', age: 32, job_title: 'Working Mom', primary_goal: 'Save time on meal planning while feeding family healthy food', frustrations: ['Spends 2+ hours weekly planning meals', 'Wastes food due to poor planning', 'Dietary restrictions make planning harder'], behavior_traits: ['Price-conscious', 'Mobile-first user', 'Values convenience'], tech_familiarity: 'high', income_level: '$75k-$100k', spending_behavior: 'Willing to pay for time-saving tools' },
    { name: 'Marcus Johnson', age: 45, job_title: 'Fitness Enthusiast', primary_goal: 'Track macros and maintain strict diet', frustrations: ['Existing apps dont integrate with local stores', 'Meal prep is time-consuming', 'Hard to find recipes meeting macro targets'], behavior_traits: ['Data-driven', 'Routine-oriented', 'Brand loyal'], tech_familiarity: 'medium', income_level: '$60k-$80k', spending_behavior: 'Spends on health and fitness tools' },
    { name: 'Emma Rodriguez', age: 28, job_title: 'College Student', primary_goal: 'Eat healthy on a tight budget', frustrations: ['Limited cooking skills', 'Small grocery budget', 'No time for elaborate meals'], behavior_traits: ['Social media influenced', 'Deal seeker', 'Quick adopter'], tech_familiarity: 'high', income_level: '$15k-$25k', spending_behavior: 'Extremely budget-conscious' },
    { name: 'David Park', age: 55, job_title: 'Retiree with Health Conditions', primary_goal: 'Manage diabetes through diet', frustrations: ['Complex dietary requirements', 'Overwhelmed by nutrition info', 'Needs simple interface'], behavior_traits: ['Cautious adopter', 'Prefers desktop', 'Values reliability'], tech_familiarity: 'low', income_level: '$40k-$60k', spending_behavior: 'Will pay premium for health benefits' },
    { name: 'Aisha Thompson', age: 38, job_title: 'Busy Professional', primary_goal: 'Automate grocery shopping entirely', frustrations: ['Decision fatigue after long workdays', 'Unhealthy takeout habit', 'Food waste from impulse buying'], behavior_traits: ['Efficiency-driven', 'Premium subscriber', 'Voice-command user'], tech_familiarity: 'high', income_level: '$120k+', spending_behavior: 'Happily pays for automation' },
  ],
  simulations: [
    { persona_name: 'Sarah Chen', clarity_score: 8, adoption_score: 9, first_impression: 'This solves my exact weekly struggle', key_objections: ['Is my local store supported?', 'Can it handle multiple dietary needs in one family?'], drop_off_point: 'Store integration setup', conversion_trigger: 'Seeing first auto-generated shopping list' },
    { persona_name: 'Marcus Johnson', clarity_score: 7, adoption_score: 6, first_impression: 'Interesting but need to verify macro tracking accuracy', key_objections: ['Macro calculations seem basic', 'No gym meal prep mode'], drop_off_point: 'Macro customization limits', conversion_trigger: 'Accurate macro breakdown per meal' },
    { persona_name: 'Emma Rodriguez', clarity_score: 9, adoption_score: 7, first_impression: 'Love it if its actually affordable', key_objections: ['Is the free tier useful?', 'Will it suggest expensive ingredients?'], drop_off_point: 'Paywall for budget features', conversion_trigger: 'Budget-filtered meal plans under $50/week' },
    { persona_name: 'David Park', clarity_score: 5, adoption_score: 4, first_impression: 'Looks complicated but could be helpful', key_objections: ['Too many features', 'Need doctor approval', 'Font too small'], drop_off_point: 'Account creation complexity', conversion_trigger: 'Doctor recommendation or endorsement' },
    { persona_name: 'Aisha Thompson', clarity_score: 8, adoption_score: 8, first_impression: 'Finally, true automation for groceries', key_objections: ['Does it work with my delivery service?', 'Can I use voice commands?'], drop_off_point: 'Manual recipe selection required', conversion_trigger: 'One-click ordering from meal plan' },
  ],
  problems: [
    { title: 'Store Integration Coverage Gap', category: 'value_prop', severity: 'critical', frequency: 8, description: 'Many users local stores may not be supported initially, breaking the core value proposition', impact: 'Users cannot complete the key workflow without store integration', affected_personas: ['Sarah Chen', 'Emma Rodriguez', 'Aisha Thompson'] },
    { title: 'Accessibility for Low-Tech Users', category: 'ux_friction', severity: 'high', frequency: 6, description: 'Interface complexity alienates older and less tech-savvy users', impact: 'Loses entire demographic of health-conscious older adults', affected_personas: ['David Park'] },
    { title: 'Budget Tier Limitations', category: 'pricing', severity: 'high', frequency: 7, description: 'Budget-conscious users need premium features to get real value', impact: 'Free tier may not demonstrate enough value to convert', affected_personas: ['Emma Rodriguez', 'Marcus Johnson'] },
    { title: 'Dietary Accuracy Concerns', category: 'trust', severity: 'medium', frequency: 5, description: 'Users with medical dietary needs require clinical-grade accuracy', impact: 'Liability concerns and user trust issues', affected_personas: ['David Park', 'Marcus Johnson'] },
    { title: 'Market Saturation in Meal Planning', category: 'market_relevance', severity: 'medium', frequency: 4, description: 'Competing with established players like Mealime, Yummly, and Eat This Much', impact: 'Harder user acquisition without clear differentiator', affected_personas: ['Sarah Chen', 'Aisha Thompson'] },
  ],
  strategies: [
    { priority: 1, title: 'Launch with Top 5 Grocery Chains First', effort: 'high', expected_impact: 'Covers 70% of target users store needs', rationale: 'Store integration is the core differentiator and top blocker', problem_solved: 'Store Integration Coverage Gap', success_metric: '70% of users find their primary store within first week' },
    { priority: 2, title: 'Build Simplified Mode for Accessibility', effort: 'medium', expected_impact: 'Opens 25% additional market segment', rationale: 'Large, underserved market of health-conscious older adults', problem_solved: 'Accessibility for Low-Tech Users', success_metric: 'Task completion rate >80% for users 50+' },
    { priority: 3, title: 'Freemium with Budget Meal Plans Free', effort: 'low', expected_impact: 'Increases free-to-paid conversion by 40%', rationale: 'Budget users need to see value before paying', problem_solved: 'Budget Tier Limitations', success_metric: 'Free user retention >60% at 30 days' },
    { priority: 4, title: 'Partner with Dietitians for Validation', effort: 'medium', expected_impact: 'Builds trust and enables medical use case', rationale: 'Professional endorsement removes liability concerns', problem_solved: 'Dietary Accuracy Concerns', success_metric: '3+ dietitian partnerships signed in 90 days' },
    { priority: 5, title: 'Position as Grocery-First, Not Recipe-First', effort: 'low', expected_impact: 'Clear differentiation from competitors', rationale: 'No competitor owns the grocery automation angle', problem_solved: 'Market Saturation in Meal Planning', success_metric: 'Users cite grocery integration as #1 reason for choosing app' },
  ],
  scores: { idea_score: 7, adoption_probability: 65, risk_score: 5, justification: 'Strong core value proposition with clear differentiator (grocery integration). Main risks are store coverage gaps and competitive pressure. High adoption potential among working parents and busy professionals. Budget-conscious and low-tech segments need dedicated solutions to capture.' },
  metadata: { completed_stages: ['PersonaSim', 'BehaviorSim', 'ProblemDetect', 'Strategy', 'Scoring'], failed_stages: [], timestamp: '2026-04-25T12:00:00Z' },
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: string }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: '' }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4 text-sm">{this.state.error}</p>
            <button onClick={() => this.setState({ hasError: false, error: '' })} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">Try again</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function SaveDialog({ onSave, onClose, defaultTitle, saving }: { onSave: (title: string) => void; onClose: () => void; defaultTitle: string; saving: boolean }) {
  const [title, setTitle] = useState(defaultTitle)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <Card className="w-full max-w-sm rounded-2xl shadow-2xl border-gray-200/50">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Save Analysis</h3>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-7 w-7 p-0 text-gray-400">
              <FiX className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <Label htmlFor="save-title" className="text-xs text-gray-500">Title</Label>
            <Input id="save-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter a title for this analysis" className="mt-1 text-sm rounded-xl" />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={onClose} className="text-xs rounded-lg">Cancel</Button>
            <Button size="sm" onClick={() => onSave(title)} disabled={!title.trim() || saving} className="text-xs rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
              <FiSave className="h-3 w-3 mr-1" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AppContent() {
  const [idea, setIdea] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [sampleMode, setSampleMode] = useState(false)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const abortRef = useRef(false)

  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [showSavedPanel, setShowSavedPanel] = useState(false)
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([])
  const [savedLoading, setSavedLoading] = useState(false)
  const [savedError, setSavedError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  const sectionRefs = {
    overview: useRef<HTMLDivElement>(null),
    personas: useRef<HTMLDivElement>(null),
    simulations: useRef<HTMLDivElement>(null),
    problems: useRef<HTMLDivElement>(null),
    strategies: useRef<HTMLDivElement>(null),
  }

  const parseResponse = useCallback((result: any): AnalysisResult | null => {
    let parsed: any = null
    if (result?.response?.result && typeof result.response.result === 'object') {
      parsed = result.response.result
    } else if (result?.response && typeof result.response === 'object') {
      parsed = result.response
    } else if (typeof result?.response === 'string') {
      try { parsed = JSON.parse(result.response) } catch { /* ignore */ }
      if (parsed?.result) parsed = parsed.result
    }
    if (!parsed) return null
    return {
      personas: Array.isArray(parsed.personas) ? parsed.personas : [],
      simulations: Array.isArray(parsed.simulations) ? parsed.simulations : [],
      problems: Array.isArray(parsed.problems) ? parsed.problems : [],
      strategies: Array.isArray(parsed.strategies) ? parsed.strategies : [],
      scores: parsed.scores && typeof parsed.scores === 'object' ? parsed.scores : null,
      metadata: parsed.metadata && typeof parsed.metadata === 'object' ? parsed.metadata : null,
    }
  }, [])

  const fetchSavedAnalyses = useCallback(async () => {
    setSavedLoading(true)
    setSavedError(null)
    try {
      const res = await fetch('/api/analyses')
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        setSavedAnalyses(json.data)
      } else {
        setSavedError(json.error ?? 'Failed to load saved analyses')
      }
    } catch (e: any) {
      setSavedError(e?.message ?? 'Failed to load saved analyses')
    } finally {
      setSavedLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSavedAnalyses()
  }, [fetchSavedAnalyses])

  const handleAnalyze = useCallback(async (inputIdea?: string) => {
    const text = inputIdea ?? idea
    if (text.length < 10) return
    setLoading(true)
    setError(null)
    setData(null)
    setFileUrl(null)
    setSaveMsg(null)
    setSaveError(null)
    abortRef.current = false
    setActiveAgentId(AGENT_ID)
    try {
      const result = await callAIAgent(text, AGENT_ID)
      if (abortRef.current) return
      const parsed = parseResponse(result)
      if (!parsed) {
        setError('Failed to parse agent response. The response structure was unexpected.')
        return
      }
      setData(parsed)
      const url = result?.module_outputs?.artifact_files?.[0]?.file_url
      if (url) setFileUrl(url)
    } catch (e: any) {
      if (!abortRef.current) {
        setError(e?.message ?? 'An unexpected error occurred during analysis.')
      }
    } finally {
      setLoading(false)
      setActiveAgentId(null)
    }
  }, [idea, parseResponse])

  const handleCancel = useCallback(() => {
    abortRef.current = true
    setLoading(false)
    setActiveAgentId(null)
  }, [])

  const handleCopy = useCallback(async () => {
    const displayData = sampleMode ? SAMPLE_DATA : data
    if (!displayData) return
    await copyToClipboard(JSON.stringify(displayData, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [data, sampleMode])

  const handleDownload = useCallback(() => {
    const displayData = sampleMode ? SAMPLE_DATA : data
    if (!displayData) return
    const lines: string[] = ['VENTUREPILOT - STARTUP VALIDATION REPORT', '='.repeat(45), '']
    if (displayData.scores) {
      lines.push('EXECUTIVE SUMMARY', '-'.repeat(20))
      lines.push(`Idea Score: ${displayData.scores.idea_score}/10`)
      lines.push(`Adoption Probability: ${displayData.scores.adoption_probability}%`)
      lines.push(`Risk Score: ${displayData.scores.risk_score}/10`)
      lines.push(`Justification: ${displayData.scores.justification}`)
      lines.push('')
    }
    lines.push('PERSONAS', '-'.repeat(20))
    if (Array.isArray(displayData.personas)) {
      displayData.personas.forEach((p: any) => {
        lines.push(`- ${p?.name ?? 'N/A'} (${p?.job_title ?? ''}): ${p?.primary_goal ?? ''}`)
      })
    }
    lines.push('', 'SIMULATIONS', '-'.repeat(20))
    if (Array.isArray(displayData.simulations)) {
      displayData.simulations.forEach((s: any) => {
        lines.push(`- ${s?.persona_name ?? 'N/A'}: Clarity ${s?.clarity_score ?? 0}/10, Adoption ${s?.adoption_score ?? 0}/10`)
      })
    }
    lines.push('', 'PROBLEMS', '-'.repeat(20))
    if (Array.isArray(displayData.problems)) {
      displayData.problems.forEach((p: any) => {
        lines.push(`[${(p?.severity ?? '?').toUpperCase()}] ${p?.title ?? ''}: ${p?.description ?? ''}`)
      })
    }
    lines.push('', 'STRATEGIES', '-'.repeat(20))
    if (Array.isArray(displayData.strategies)) {
      displayData.strategies.forEach((s: any) => {
        lines.push(`#${s?.priority ?? '?'} ${s?.title ?? ''} (${s?.effort ?? '?'} effort): ${s?.expected_impact ?? ''}`)
      })
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'venturepilot-report.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [data, sampleMode])

  const handleDownloadFull = useCallback(() => {
    if (!fileUrl) return
    const a = document.createElement('a')
    a.href = fileUrl
    a.download = 'venturepilot-full-report'
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }, [fileUrl])

  const handleClear = useCallback(() => {
    setData(null)
    setError(null)
    setFileUrl(null)
    setSampleMode(false)
    setActiveTab('overview')
    setSaveMsg(null)
    setSaveError(null)
  }, [])

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab)
    const ref = sectionRefs[tab as keyof typeof sectionRefs]
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  const handleSaveAnalysis = useCallback(async (title: string) => {
    if (!data || !idea) return
    setSaveLoading(true)
    setSaveMsg(null)
    setSaveError(null)
    try {
      const res = await fetch('/api/analyses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, idea_text: idea, analysis_data: data, file_url: fileUrl ?? '' }),
      })
      const json = await res.json()
      if (json.success) {
        setSaveMsg('Analysis saved successfully')
        setShowSaveDialog(false)
        await fetchSavedAnalyses()
      } else {
        setSaveError(json.error ?? 'Failed to save analysis')
      }
    } catch (e: any) {
      setSaveError(e?.message ?? 'Failed to save analysis')
    } finally {
      setSaveLoading(false)
    }
  }, [data, idea, fileUrl, fetchSavedAnalyses])

  const handleLoadAnalysis = useCallback((analysis: SavedAnalysis) => {
    const ad = analysis.analysis_data
    if (ad && typeof ad === 'object') {
      setData({
        personas: Array.isArray(ad.personas) ? ad.personas : [],
        simulations: Array.isArray(ad.simulations) ? ad.simulations : [],
        problems: Array.isArray(ad.problems) ? ad.problems : [],
        strategies: Array.isArray(ad.strategies) ? ad.strategies : [],
        scores: ad.scores && typeof ad.scores === 'object' ? ad.scores : null,
        metadata: ad.metadata && typeof ad.metadata === 'object' ? ad.metadata : null,
      })
      setIdea(analysis.idea_text ?? '')
      setFileUrl(analysis.file_url ?? null)
      setSampleMode(false)
      setError(null)
      setActiveTab('overview')
      setShowSavedPanel(false)
      setSaveMsg(null)
      setSaveError(null)
    }
  }, [])

  const handleDeleteAnalysis = useCallback(async (id: string) => {
    setDeleteLoading(id)
    try {
      const res = await fetch(`/api/analyses?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        await fetchSavedAnalyses()
      } else {
        setSavedError(json.error ?? 'Failed to delete analysis')
      }
    } catch (e: any) {
      setSavedError(e?.message ?? 'Failed to delete analysis')
    } finally {
      setDeleteLoading(null)
    }
  }, [fetchSavedAnalyses])

  const displayData = sampleMode ? SAMPLE_DATA : data
  const showResults = displayData !== null
  const showInput = !showResults && !loading

  const personaCount = Array.isArray(displayData?.personas) ? displayData.personas.length : 0
  const simulationCount = Array.isArray(displayData?.simulations) ? displayData.simulations.length : 0
  const problemCount = Array.isArray(displayData?.problems) ? displayData.problems.length : 0
  const strategyCount = Array.isArray(displayData?.strategies) ? displayData.strategies.length : 0

  const defaultSaveTitle = idea ? idea.slice(0, 50) + (idea.length > 50 ? '...' : '') : 'Untitled Analysis'

  return (
    <>
      {/* Top-right controls - Input view */}
      <div className="fixed top-3 right-3 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-xl px-3 py-1.5 shadow-sm">
        {!showResults && (
          <Button variant="ghost" size="sm" onClick={() => { setShowSavedPanel(true); fetchSavedAnalyses() }} className="text-xs h-7 px-2 mr-1 text-gray-500 hover:text-purple-600">
            Saved ({savedAnalyses.length})
          </Button>
        )}
        {!showResults && (
          <div className="border-l border-gray-200 pl-2">
            <UserMenu />
          </div>
        )}
        {showResults && (
          <>
            <Label htmlFor="sample-toggle" className="text-xs text-gray-500 cursor-pointer">Sample Data</Label>
            <Switch id="sample-toggle" checked={sampleMode} onCheckedChange={(v) => { setSampleMode(v); if (v) { setError(null) } }} />
          </>
        )}
      </div>

      {/* Sample toggle on input view - top left */}
      {!showResults && !loading && (
        <div className="fixed top-3 left-3 z-50">
          <Label htmlFor="sample-toggle-input" className="flex items-center gap-2 bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-xl px-3 py-1.5 shadow-sm cursor-pointer">
            <span className="text-xs text-gray-500">Sample Data</span>
            <Switch id="sample-toggle-input" checked={sampleMode} onCheckedChange={(v) => { setSampleMode(v); if (v) { setError(null) } }} />
          </Label>
        </div>
      )}

      {loading && <LoadingOverlay onCancel={handleCancel} />}

      {showInput && <InputSection idea={idea} setIdea={setIdea} onAnalyze={() => handleAnalyze()} loading={loading} />}

      {error && !showResults && (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-indigo-50/30 to-slate-50">
          <Card className="w-full max-w-md rounded-2xl shadow-xl border-gray-200/50">
            <CardContent className="pt-6 space-y-3 text-center">
              <div className="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
                <FiAlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <p className="text-sm font-semibold text-gray-900">Analysis Failed</p>
              <p className="text-xs text-gray-500">{error}</p>
              <div className="flex gap-2 justify-center pt-2">
                <Button size="sm" onClick={() => handleAnalyze()} className="text-xs rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600">
                  <FiRefreshCw className="h-3 w-3 mr-1" /> Retry
                </Button>
                <Button size="sm" variant="outline" onClick={() => { setIdea("An AI-powered meal planning app that creates personalized weekly meal plans based on dietary restrictions, budget constraints, and local grocery store availability, with automatic shopping list generation and one-click grocery delivery integration"); setError(null) }} className="text-xs rounded-lg">
                  <HiOutlineSparkles className="h-3 w-3 mr-1" /> Try Example
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showResults && (
        <>
          <NavigationBar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onRegenerate={() => handleAnalyze()}
            onCopy={handleCopy}
            onDownload={handleDownload}
            onClear={handleClear}
            loading={loading}
            copied={copied}
            fileUrl={fileUrl}
            onDownloadFull={handleDownloadFull}
            counts={{ personas: personaCount, simulations: simulationCount, problems: problemCount, strategies: strategyCount }}
            onSave={() => setShowSaveDialog(true)}
            onOpenSaved={() => { setShowSavedPanel(true); fetchSavedAnalyses() }}
            savedCount={savedAnalyses.length}
            saveLoading={saveLoading}
            isSampleMode={sampleMode}
          />

          {(saveMsg || saveError) && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
              {saveMsg && (
                <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-xs text-green-700 flex items-center justify-between">
                  <span>{saveMsg}</span>
                  <button onClick={() => setSaveMsg(null)} className="text-green-400 hover:text-green-600"><FiX className="h-3.5 w-3.5" /></button>
                </div>
              )}
              {saveError && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 flex items-center justify-between">
                  <span>{saveError}</span>
                  <button onClick={() => setSaveError(null)} className="text-red-400 hover:text-red-600"><FiX className="h-3.5 w-3.5" /></button>
                </div>
              )}
            </div>
          )}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20 space-y-10">
            <div ref={sectionRefs.overview}>
              <OverviewSection
                scores={displayData?.scores ?? null}
                metadata={displayData?.metadata ?? null}
                personaCount={personaCount}
                problemCount={problemCount}
                strategyCount={strategyCount}
                simulationCount={simulationCount}
                onJump={handleTabChange}
              />
            </div>
            <div ref={sectionRefs.personas}>
              <PersonasSection personas={Array.isArray(displayData?.personas) ? displayData.personas : []} />
            </div>
            <div ref={sectionRefs.simulations}>
              <SimulationsSection simulations={Array.isArray(displayData?.simulations) ? displayData.simulations : []} />
            </div>
            <div ref={sectionRefs.problems}>
              <ProblemsSection problems={Array.isArray(displayData?.problems) ? displayData.problems : []} />
            </div>
            <div ref={sectionRefs.strategies}>
              <StrategiesSection strategies={Array.isArray(displayData?.strategies) ? displayData.strategies : []} />
            </div>
          </div>
        </>
      )}

      {showSaveDialog && (
        <SaveDialog
          onSave={handleSaveAnalysis}
          onClose={() => setShowSaveDialog(false)}
          defaultTitle={defaultSaveTitle}
          saving={saveLoading}
        />
      )}

      {showSavedPanel && (
        <SavedAnalyses
          analyses={savedAnalyses}
          loading={savedLoading}
          error={savedError}
          onLoad={handleLoadAnalysis}
          onDelete={handleDeleteAnalysis}
          onClose={() => setShowSavedPanel(false)}
          deleteLoading={deleteLoading}
        />
      )}

      {/* Footer status bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/50 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className={`h-2 w-2 rounded-full ${activeAgentId ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
              <span className="text-[10px] font-medium text-gray-500">Validation Pipeline</span>
            </div>
            <span className="text-[10px] text-gray-400 hidden sm:inline">PersonaSim / BehaviorSim / ProblemDetect / Strategy / Scoring</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-5 w-5 rounded-md bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
              <FiZap className="h-2.5 w-2.5 text-white" />
            </div>
            <span className="text-[10px] font-semibold text-gray-500">VenturePilot</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default function Page() {
  return (
    <ErrorBoundary>
      <div style={THEME_VARS} className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-slate-50 text-foreground font-sans">
        <AuthProvider>
          <ProtectedRoute unauthenticatedFallback={<AuthScreen />}>
            <AppContent />
          </ProtectedRoute>
        </AuthProvider>
      </div>
    </ErrorBoundary>
  )
}
