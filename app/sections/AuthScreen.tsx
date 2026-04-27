'use client'

import { useState } from 'react'
import { LoginForm, RegisterForm } from 'lyzr-architect/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { FiZap } from 'react-icons/fi'
import { HiOutlineSparkles } from 'react-icons/hi2'

export default function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('login')

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-indigo-50/50 to-slate-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2.5 mb-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <FiZap className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">VenturePilot</h1>
          </div>
          <p className="text-sm text-gray-500">
            AI-powered startup validation in 60 seconds
          </p>
        </div>

        <Card className="rounded-2xl shadow-xl shadow-purple-500/5 border-gray-200/80 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-violet-500" />
          <CardHeader className="pb-3 text-center pt-6">
            <CardTitle className="text-lg font-semibold text-gray-900">
              {mode === 'login' ? 'Welcome Back' : 'Get Started'}
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              {mode === 'login'
                ? 'Sign in to access your startup analyses'
                : 'Create an account to validate your ideas'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            {mode === 'login' ? (
              <LoginForm onSwitchToRegister={() => setMode('register')} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setMode('login')} />
            )}
          </CardContent>
        </Card>

        <div className="mt-6 flex items-center justify-center gap-4 text-[10px] text-gray-400">
          <span className="flex items-center gap-1">
            <HiOutlineSparkles className="h-3 w-3" />
            5 AI Agents
          </span>
          <span className="h-3 w-px bg-gray-200" />
          <span>60-Second Analysis</span>
          <span className="h-3 w-px bg-gray-200" />
          <span>Actionable Insights</span>
        </div>
      </div>
    </div>
  )
}
