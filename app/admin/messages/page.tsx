'use client'

import { useMemo, useState } from 'react'
import { Loader2, Mail, MailOpen, RefreshCw, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useMessages } from '@/hooks/useMessages'
import type { ContactMessage } from '@/lib/types'

export default function AdminMessagesPage() {
  const { messages, isLoading, error, updateMessage, deleteMessage } = useMessages()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [actionId, setActionId] = useState<string | null>(null)

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
      await updateMessage(message.id, { archived: true })

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
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground">Read, mark, archive, and delete incoming contact messages.</p>
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
                    Archive
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
