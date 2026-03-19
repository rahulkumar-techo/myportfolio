'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { fetchWithTimeout, readJsonResponse } from '@/lib/http'
import { useAdminSettings } from '@/hooks/useSettings'
import { useAdminProfile } from '@/hooks/useAdminProfile'
import type { SiteSettings } from '@/lib/types'

const defaultSettings: SiteSettings = {
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
  websiteUrl: '',
  adminNotificationSound: 'beep'
}

export default function AdminSettingsPage() {
  const { settings, isLoading, error, updateSettings } = useAdminSettings()
  const { profile, mutateProfile } = useAdminProfile()
  const [formData, setFormData] = useState<SiteSettings>(defaultSettings)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const avatarPreviewUrl = useMemo(
    () => avatarPreview || profile?.image || '/avatar.png',
    [avatarPreview, profile?.image]
  )
  useEffect(() => {
    if (settings) {
      const mergedSettings = { ...defaultSettings, ...settings }
      if (!hasUnsavedChanges) {
        setFormData(mergedSettings)
      }
    }
  }, [hasUnsavedChanges, settings])

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview)
      }
    }
  }, [avatarPreview])

  const requestAvatarSignature = async (file: File) => {
    const response = await fetchWithTimeout('/api/assets/signature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: file.name, fileType: file.type })
    })

    const result = await readJsonResponse<{
      error?: string
      data?: {
        cloudName?: string
        apiKey?: string
        timestamp?: number
        signature?: string
        folder?: string
        publicId?: string
        resourceType?: string
      }
    }>(response)

    if (!response.ok) {
      const rawMessage = result.isJson ? result.json?.error : result.raw
      throw new Error(rawMessage ? String(rawMessage) : 'Unable to start avatar upload.')
    }

    if (!result.isJson || !result.json?.data?.cloudName || !result.json?.data?.apiKey || !result.json?.data?.signature) {
      throw new Error('Unable to start avatar upload: invalid signature response.')
    }

    return result.json.data
  }

  const uploadAvatarToCloudinary = async (file: File) => {
    const signature = await requestAvatarSignature(file)
    const cloudName = signature.cloudName
    const apiKey = signature.apiKey
    const timestamp = signature.timestamp
    const signatureValue = signature.signature
    const folder = signature.folder
    const publicId = signature.publicId
    const resourceType = signature.resourceType ?? 'image'

    if (!cloudName || !apiKey || !timestamp || !signatureValue || !folder || !publicId) {
      throw new Error('Unable to start avatar upload: missing signature fields.')
    }

    const form = new FormData()
    form.append('file', file)
    form.append('api_key', apiKey)
    form.append('timestamp', String(timestamp))
    form.append('signature', signatureValue)
    form.append('folder', folder)
    form.append('public_id', publicId)

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
      method: 'POST',
      body: form
    })

    const result = await readJsonResponse<{
      error?: { message?: string }
      secure_url?: string
    }>(response)

    if (!response.ok || !result.isJson) {
      const message = result.isJson ? result.json?.error?.message : result.raw
      throw new Error(message ? String(message) : 'Unable to upload avatar.')
    }

    if (!result.json?.secure_url) {
      throw new Error('Unable to upload avatar: missing URL.')
    }

    return result.json.secure_url
  }

  const updateProfileImage = async (imageUrl: string) => {
    const response = await fetchWithTimeout('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl })
    })

    const result = await readJsonResponse<{ error?: string }>(response)

    if (!response.ok) {
      const rawMessage = result.isJson ? result.json?.error : result.raw
      throw new Error(rawMessage ? String(rawMessage) : 'Unable to update profile image.')
    }

    await mutateProfile()
  }

  const updateFormData = (updates: Partial<SiteSettings>) => {
    setFormData((current) => ({ ...current, ...updates }))
    setHasUnsavedChanges(true)
    setSubmitMessage(null)
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    if (!file) {
      setAvatarFile(null)
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview)
      }
      setAvatarPreview(null)
      return
    }

    if (!file.type.startsWith('image/')) {
      setSubmitMessage('Please choose a valid image file.')
      event.target.value = ''
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setSubmitMessage('Avatar image must be 2MB or smaller.')
      event.target.value = ''
      return
    }

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview)
    }

    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
    setHasUnsavedChanges(true)
    setSubmitMessage(null)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      if (avatarFile) {
        const uploadedUrl = await uploadAvatarToCloudinary(avatarFile)
        await updateProfileImage(uploadedUrl)
      }

      const nextSettings = await updateSettings(formData)
      const mergedSettings = { ...defaultSettings, ...nextSettings }
      setFormData(mergedSettings)
      setAvatarFile(null)
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview)
      }
      setAvatarPreview(null)
      setHasUnsavedChanges(false)
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
        <p className="text-muted-foreground">Control branding and public profile details from one place.</p>
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
                  onChange={(event) => updateFormData({ siteTitle: event.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-panel-title">Admin Panel Title</Label>
                <Input
                  id="admin-panel-title"
                  value={formData.adminPanelTitle}
                  onChange={(event) => updateFormData({ adminPanelTitle: event.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="site-tagline">Tagline</Label>
              <Input
                id="site-tagline"
                value={formData.siteTagline}
                onChange={(event) => updateFormData({ siteTagline: event.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                rows={5}
                value={formData.bio}
                onChange={(event) => updateFormData({ bio: event.target.value })}
              />
            </div>
          </section>

          <section className="glass-card rounded-2xl p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Profile Avatar</h2>
              <p className="text-sm text-muted-foreground">Update the avatar shown in the About section and admin header.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-avatar-file">Avatar Image</Label>
              <div className="flex flex-wrap items-center gap-4">
                <Image
                  src={avatarPreviewUrl}
                  alt="Profile avatar preview"
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-2xl object-cover border border-border/60"
                />
                <Input
                  id="profile-avatar-file"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>
              <p className="text-xs text-muted-foreground">Upload a 2MB or smaller image.</p>
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
                  onChange={(event) => updateFormData({ contactEmail: event.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(event) => updateFormData({ location: event.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="resume-url">Resume URL</Label>
                <Input
                  id="resume-url"
                  value={formData.resumeUrl || ''}
                  onChange={(event) => updateFormData({ resumeUrl: event.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website-url">Website URL</Label>
                <Input
                  id="website-url"
                  value={formData.websiteUrl || ''}
                  onChange={(event) => updateFormData({ websiteUrl: event.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="github-url">GitHub URL</Label>
                <Input
                  id="github-url"
                  value={formData.githubUrl || ''}
                  onChange={(event) => updateFormData({ githubUrl: event.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin-url">LinkedIn URL</Label>
                <Input
                  id="linkedin-url"
                  value={formData.linkedinUrl || ''}
                  onChange={(event) => updateFormData({ linkedinUrl: event.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter-url">Twitter URL</Label>
                <Input
                  id="twitter-url"
                  value={formData.twitterUrl || ''}
                  onChange={(event) => updateFormData({ twitterUrl: event.target.value })}
                />
              </div>
            </div>
          </section>

          <section className="glass-card rounded-2xl p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Admin Notifications</h2>
              <p className="text-sm text-muted-foreground">Control the sound when new messages arrive.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-notification-sound">Notification Sound</Label>
              <Select
                value={formData.adminNotificationSound || 'beep'}
                onValueChange={(value) =>
                  updateFormData({ adminNotificationSound: value as SiteSettings['adminNotificationSound'] })
                }
              >
                <SelectTrigger id="admin-notification-sound">
                  <SelectValue placeholder="Select sound" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beep">Beep</SelectItem>
                  <SelectItem value="chime">Chime</SelectItem>
                  <SelectItem value="soft">Soft</SelectItem>
                  <SelectItem value="none">Silent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>
        </div>

        <div className="space-y-6">
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

            {hasUnsavedChanges ? (
              <p className="text-sm text-muted-foreground">
                You have unsaved branding or profile changes.
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
