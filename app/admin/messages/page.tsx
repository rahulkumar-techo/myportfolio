'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Loader2, Mail, MailOpen, RefreshCw, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useMessages, type MessageFilter } from '@/hooks/useMessages'
import { useAdminSettings } from '@/hooks/useSettings'
import type { ContactMessage } from '@/lib/types'

export default function AdminMessagesPage() {
  const [filter, setFilter] = useState<MessageFilter>('active')
  const { messages, meta, isLoading, error, updateMessage, deleteMessage } = useMessages(filter)
  const { settings } = useAdminSettings()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [actionId, setActionId] = useState<string | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const lastTotalRef = useRef<number | null>(null)

  useEffect(() => {
    const unlockAudio = async () => {
      if (audioContextRef.current) {
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume()
        }
        return
      }

      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume()
        }
      } catch {
        audioContextRef.current = null
      }
    }

    // Comment: unlock audio on first user interaction so notifications can play later.
    const handleFirstInteraction = () => {
      void unlockAudio()
      window.removeEventListener('pointerdown', handleFirstInteraction)
      window.removeEventListener('keydown', handleFirstInteraction)
    }

    window.addEventListener('pointerdown', handleFirstInteraction)
    window.addEventListener('keydown', handleFirstInteraction)

    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction)
      window.removeEventListener('keydown', handleFirstInteraction)
    }
  }, [])

  const playNotification = () => {
    try {
      // Comment: simple admin sound when a new message arrives.
      const sound = settings?.adminNotificationSound ?? 'beep'
      if (sound === 'none') {
        return
      }

      const audioContext = audioContextRef.current
      if (!audioContext) {
        return
      }

      const gain = audioContext.createGain()
      gain.gain.value = sound === 'soft' ? 0.025 : 0.04
      gain.connect(audioContext.destination)

      const playTone = (frequency: number, start: number, duration: number) => {
        const osc = audioContext.createOscillator()
        osc.type = 'sine'
        osc.frequency.value = frequency
        osc.connect(gain)
        osc.start(start)
        osc.stop(start + duration)
      }

      const now = audioContext.currentTime

      if (sound === 'chime') {
        playTone(520, now, 0.12)
        playTone(780, now + 0.14, 0.16)
        return
      }

      if (sound === 'soft') {
        playTone(620, now, 0.18)
        return
      }

      playTone(740, now, 0.12)
    } catch {
      // Ignore audio failures (autoplay restrictions or missing device).
    }
  }

  useEffect(() => {
    const total = meta?.total ?? null
    if (total === null) {
      return
    }

    if (lastTotalRef.current === null) {
      lastTotalRef.current = total
      return
    }

    if (total > lastTotalRef.current) {
      playNotification()
    }

    lastTotalRef.current = total
  }, [meta?.total])

  const sortedMessages = useMemo(
    () =>
      [...messages].sort(
        (left: ContactMessage, right: ContactMessage) =>
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      ),
    [messages]
  )

  const selectedMessage =
    sortedMessages.find((message: ContactMessage) => message.id === selectedId) || sortedMessages[0] || null

  const handleSelect = async (message: ContactMessage) => {
    setSelectedId(message.id)

    if (!message.read) {
      setActionId(message.id)

      try {
        await updateMessage(message.id, { read: true })
      } finally {
        setActionId(null)
      }
    }
  }

  const toggleRead = async (message: ContactMessage) => {
    setActionId(message.id)

    try {
      await updateMessage(message.id, { read: !message.read })
    } finally {
      setActionId(null)
    }
  }

  const archiveMessage = async (message: ContactMessage) => {
    setActionId(message.id)

    try {
      await updateMessage(message.id, { archived: !message.archived })

      if (selectedMessage?.id === message.id) {
        setSelectedId(null)
      }
    } finally {
      setActionId(null)
    }
  }

  const removeMessage = async (message: ContactMessage) => {
    setActionId(message.id)

    try {
      await deleteMessage(message.id)

      if (selectedMessage?.id === message.id) {
        setSelectedId(null)
      }
    } finally {
      setActionId(null)
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
    return <p className="text-destructive">Failed to load messages.</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Messages</h1>
            <p className="text-muted-foreground">Read, mark, archive, and delete incoming contact messages.</p>
          </div>
          <div className="min-w-[180px]">
            <Select value={filter} onValueChange={(value: MessageFilter) => setFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="glass-card rounded-2xl p-4 space-y-3">
          {sortedMessages.length === 0 ? (
            <p className="rounded-xl border border-border/50 p-4 text-sm text-muted-foreground">
              No messages yet.
            </p>
          ) : null}

          {sortedMessages.map((message: ContactMessage) => (
            <button
              key={message.id}
              type="button"
              onClick={() => void handleSelect(message)}
              className={`w-full rounded-xl border p-4 text-left transition-colors ${
                selectedMessage?.id === message.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border/50 bg-secondary/20 hover:bg-secondary/40'
              }`}
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{message.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{message.email}</p>
                </div>

                {message.read ? (
                  <MailOpen className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Mail className="h-4 w-4 text-primary" />
                )}
              </div>

              <p className="truncate text-sm text-foreground">{message.subject}</p>
              {message.archived ? (
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">Archived</p>
              ) : null}
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(message.createdAt).toLocaleString()}
              </p>
            </button>
          ))}
        </div>

        <div className="glass-card rounded-2xl p-6">
          {selectedMessage ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{selectedMessage.subject}</h2>
                  <p className="text-sm text-muted-foreground">
                    From {selectedMessage.name} ({selectedMessage.email})
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={actionId === selectedMessage.id}
                    onClick={() => void toggleRead(selectedMessage)}
                  >
                    {actionId === selectedMessage.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-2 h-4 w-4" />
                    )}
                    Mark as {selectedMessage.read ? 'Unread' : 'Read'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    disabled={actionId === selectedMessage.id}
                    onClick={() => void archiveMessage(selectedMessage)}
                  >
                    {selectedMessage.archived ? 'Unarchive' : 'Archive'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    disabled={actionId === selectedMessage.id}
                    onClick={() => void removeMessage(selectedMessage)}
                  >
                    <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                    Delete
                  </Button>
                </div>
              </div>

              <Textarea value={selectedMessage.message} readOnly rows={14} className="resize-none" />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select a message to view its details.</p>
          )}
        </div>
      </div>
    </div>
  )
}
