'use client'

import Link from 'next/link'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, Mail, Eye, EyeOff, AlertCircle, Cpu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'

function getErrorMessage(error: string | null) {
  switch (error) {
    case 'CredentialsSignin':
      return 'Invalid admin email or password.'
    case 'AccessDenied':
      return 'This Google account does not have admin access.'
    case 'Configuration':
      return 'Authentication is not configured correctly.'
    case 'unauthorized':
      return 'Please sign in with an admin account.'
    default:
      return null
  }
}

function AdminLoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, loginWithGoogle } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const callbackUrl = searchParams.get('callbackUrl') || '/admin'
  const queryError = getErrorMessage(searchParams.get('error'))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setError(null)
    setLoading(true)

    try {
      const result = await login({
        email,
        password
      })

      if (!result.success) {
        setError(result.error || 'Invalid email or password')
        return
      }

      router.push(callbackUrl)
      router.refresh()
    } catch {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError(null)
    setGoogleLoading(true)

    try {
      await loginWithGoogle(callbackUrl)
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 mb-4"
          >
            <Cpu className="w-10 h-10 text-primary" />
          </motion.div>

          <h1 className="text-2xl font-bold text-foreground mb-2">Admin Access</h1>

          <p className="text-muted-foreground text-sm">
            Sign in with Google or use your admin email and password
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {(error || queryError) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                {error || queryError}
              </motion.div>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={() => void handleGoogleLogin()}
              disabled={loading || googleLoading}
              className="w-full border-border/50 bg-background/50 hover:bg-background/80"
            >
              {googleLoading ? 'Redirecting to Google...' : 'Sign in with Google'}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Google sign-in does not require a password.
            </p>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/40" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or use email</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

                <Input
                  id="email"
                  type="email"
                  placeholder="admin@portfolio.dev"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-background/50 border-border/50 focus:border-primary"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
            Back to Portfolio
          </Link>
          <hr />
          <Link href="/admin/register" className="text-sm text-muted-foreground hover:text-primary">
            Register
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AdminLoginContent />
    </Suspense>
  )
}
