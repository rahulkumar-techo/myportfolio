'use client'

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

type ConfirmationToastProps = {
  email?: string | null
}

export default function ConfirmationToast({ email }: ConfirmationToastProps) {
  const hasShownRef = useRef(false)

  useEffect(() => {
    if (hasShownRef.current) {
      return
    }

    hasShownRef.current = true

    toast.success('Subscription confirmed', {
      description: email
        ? `${email} will now receive updates when new blogs, projects, and assets go live.`
        : 'You will now receive updates when new blogs, projects, and assets go live.',
    })
  }, [email])

  return null
}
