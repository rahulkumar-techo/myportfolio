'use client'

import { useEffect, useState } from 'react'
import { Loader2, Monitor, Moon, Save, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAdminSettings } from '@/hooks/useSettings'
import type { SiteSettings } from '@/lib/types'

const defaultSettings: SiteSettings = {
  theme: 'dark',
  siteTitle: 'Developer Portfolio',
  siteTagline: 'Futuristic Developer Portfolio',
  adminPanelTitle: 'Admin Panel',
  bio: '',
  location: '',
  contactEmail: '',
  resumeUrl: '',
  githubUrl: '',
  linkedinUrl: '',
  twitterUrl: '',
  websiteUrl: ''
}

const themeOptions = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor }
] as const

export default function AdminSettingsPage() {
  const { settings, isLoading, error, updateSettings, setSettingsLocally } = useAdminSettings()
  const { setTheme } = useTheme()
  const [formData, setFormData] = useState<SiteSettings>(defaultSettings)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)

  useEffect(() => {
    if (settings) {
      setFormData({ ...defaultSettings, ...settings })
    }
  }, [settings])

  const handleThemeChange = (theme: SiteSettings['theme']) => {
    setFormData((current) => ({ ...current, theme }))
    void setSettingsLocally({ theme })
    setTheme(theme)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      await updateSettings(formData)
      setTheme(formData.theme)
      setSubmitMessage('Settings saved successfully.')
    } catch {
      setSubmitMessage('Unable to save settings right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return <p className="text-destructive">Failed to load settings.</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Control theme, branding, and public profile details from one place.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section className="glass-card rounded-2xl p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Branding</h2>
              <p className="text-sm text-muted-foreground">Update the primary text used across the admin and public site.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="site-title">Site Title</Label>
                <Input
                  id="site-title"
                  value={formData.siteTitle}
                  onChange={(event) => setFormData((current) => ({ ...current, siteTitle: event.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-panel-title">Admin Panel Title</Label>
                <Input
                  id="admin-panel-title"
                  value={formData.adminPanelTitle}
                  onChange={(event) => setFormData((current) => ({ ...current, adminPanelTitle: event.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="site-tagline">Tagline</Label>
              <Input
                id="site-tagline"
                value={formData.siteTagline}
                onChange={(event) => setFormData((current) => ({ ...current, siteTagline: event.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                rows={5}
                value={formData.bio}
                onChange={(event) => setFormData((current) => ({ ...current, bio: event.target.value }))}
              />
            </div>
          </section>

          <section className="glass-card rounded-2xl p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Public Contact</h2>
              <p className="text-sm text-muted-foreground">Manage the contact and social links exposed through your profile.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input
                  id="contact-email"
                  value={formData.contactEmail}
                  onChange={(event) => setFormData((current) => ({ ...current, contactEmail: event.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(event) => setFormData((current) => ({ ...current, location: event.target.value }))}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="resume-url">Resume URL</Label>
                <Input
                  id="resume-url"
                  value={formData.resumeUrl || ''}
                  onChange={(event) => setFormData((current) => ({ ...current, resumeUrl: event.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website-url">Website URL</Label>
                <Input
                  id="website-url"
                  value={formData.websiteUrl || ''}
                  onChange={(event) => setFormData((current) => ({ ...current, websiteUrl: event.target.value }))}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="github-url">GitHub URL</Label>
                <Input
                  id="github-url"
                  value={formData.githubUrl || ''}
                  onChange={(event) => setFormData((current) => ({ ...current, githubUrl: event.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin-url">LinkedIn URL</Label>
                <Input
                  id="linkedin-url"
                  value={formData.linkedinUrl || ''}
                  onChange={(event) => setFormData((current) => ({ ...current, linkedinUrl: event.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter-url">Twitter URL</Label>
                <Input
                  id="twitter-url"
                  value={formData.twitterUrl || ''}
                  onChange={(event) => setFormData((current) => ({ ...current, twitterUrl: event.target.value }))}
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="glass-card rounded-2xl p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Theme</h2>
              <p className="text-sm text-muted-foreground">Persist the dashboard and site theme across sessions.</p>
            </div>

            <div className="grid gap-3">
              {themeOptions.map((option) => {
                const Icon = option.icon
                const active = formData.theme === option.value

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleThemeChange(option.value)}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
                      active ? 'border-primary bg-primary/10 text-primary' : 'border-border/60 hover:bg-secondary/40'
                    }`}
                  >
                    <span className="inline-flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      {option.label}
                    </span>
                    <span className="text-xs uppercase tracking-wide">
                      {active ? 'Active' : 'Select'}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="glass-card rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Live Preview</h2>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-primary">{formData.adminPanelTitle || 'Admin Panel'}</p>
              <h3 className="mt-3 text-2xl font-semibold text-foreground">{formData.siteTitle || 'Developer Portfolio'}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{formData.siteTagline || 'Futuristic Developer Portfolio'}</p>
              <p className="mt-4 text-sm text-muted-foreground">{formData.bio || 'Your public bio preview appears here.'}</p>
            </div>

            {submitMessage ? (
              <p className={`text-sm ${submitMessage.includes('Unable') ? 'text-destructive' : 'text-primary'}`}>
                {submitMessage}
              </p>
            ) : null}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Settings
            </Button>
          </section>
        </div>
      </form>
    </div>
  )
}
