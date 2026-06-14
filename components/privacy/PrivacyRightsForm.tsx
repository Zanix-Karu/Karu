'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { z } from 'zod'
import { Turnstile } from '@marsidev/react-turnstile'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const emailSchema = z.string().email().max(254).toLowerCase().trim()

type RequestType = 'deletion' | 'export' | 'objection'
type FormState = 'idle' | 'loading' | 'submitted' | 'error'

export function PrivacyRightsForm({ status }: { status?: string }) {
  const t = useTranslations('privacy_rights')
  const locale = useLocale()

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [requestType, setRequestType] = useState<RequestType>('deletion')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [state, setState] = useState<FormState>('idle')

  // Confirm-step state (reached via the emailed link → GET set a cookie → ?status=confirm)
  const [confirmState, setConfirmState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [confirmOutcome, setConfirmOutcome] = useState<string>('')

  const statusMessage =
    status === 'deleted' ? t('status_deleted')
    : status === 'objection' ? t('status_objection')
    : status === 'invalid' ? t('status_invalid')
    : status === 'error' ? t('status_error')
    : null

  const handleConfirm = async () => {
    setConfirmState('loading')
    try {
      const res = await fetch('/api/privacy/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        credentials: 'same-origin',
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json?.success) {
        setConfirmState('error')
        return
      }
      const outcome = json.data?.outcome as string
      // Export: turn the inline JSON into a client-side file download.
      if (outcome === 'exported' && json.data?.export) {
        const blob = new Blob([JSON.stringify(json.data.export, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'karu-data-export.json'
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
      }
      setConfirmOutcome(outcome)
      setConfirmState('done')
    } catch {
      setConfirmState('error')
    }
  }

  // ── Confirm step UI ────────────────────────────────────────────────────────
  if (status === 'confirm') {
    if (confirmState === 'done') {
      const msg =
        confirmOutcome === 'deleted' ? t('status_deleted')
        : confirmOutcome === 'objection' ? t('status_objection')
        : confirmOutcome === 'exported' ? t('status_exported')
        : t('confirm_done')
      return (
        <div className="border border-amber/30 bg-amber/[0.06] p-6" role="status" aria-live="polite">
          <p className="font-sans font-light text-cream/80 text-[0.9rem] leading-[1.8]">{msg}</p>
        </div>
      )
    }
    return (
      <div className="border border-amber/30 bg-amber/[0.06] p-6 text-left">
        <p className="font-sans font-semibold text-amber text-base mb-2">{t('confirm_title')}</p>
        <p className="font-sans font-light text-cream/70 text-[0.9rem] leading-[1.8] mb-5">{t('confirm_body')}</p>
        {confirmState === 'error' && (
          <p className="text-[0.82rem] text-red-400 mb-3" role="alert">{t('status_error')}</p>
        )}
        <Button
          type="button"
          variant="primary"
          className="w-full"
          disabled={confirmState === 'loading'}
          aria-busy={confirmState === 'loading'}
          onClick={handleConfirm}
        >
          {confirmState === 'loading' ? '…' : t('confirm_button')}
        </Button>
      </div>
    )
  }

  const handleSubmit = async () => {
    const parsed = emailSchema.safeParse(email)
    if (!parsed.success) {
      setEmailError(t('error_email'))
      return
    }
    setEmailError('')
    setState('loading')

    try {
      const res = await fetch('/api/privacy/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          email: parsed.data,
          request_type: requestType,
          locale,
          ...(turnstileToken ? { turnstile_token: turnstileToken } : {}),
        }),
      })
      setState(res.ok ? 'submitted' : 'error')
    } catch {
      setState('error')
    }
  }

  if (state === 'submitted') {
    return (
      <div className="border border-amber/30 bg-amber/[0.06] p-6" role="status" aria-live="polite">
        <p className="font-sans font-semibold text-amber text-base mb-2">{t('submitted_title')}</p>
        <p className="font-sans font-light text-cream/70 text-[0.9rem] leading-[1.8]">{t('submitted_body')}</p>
      </div>
    )
  }

  return (
    <div>
      {statusMessage && (
        <div
          className={`border p-4 mb-8 text-[0.9rem] font-light leading-[1.7] ${
            status === 'deleted' || status === 'objection'
              ? 'border-amber/30 bg-amber/[0.06] text-cream/80'
              : 'border-red-400/40 bg-red-400/[0.06] text-red-300'
          }`}
          role="status"
          aria-live="polite"
        >
          {statusMessage}
        </div>
      )}

      <div className="space-y-5 text-left">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="rights-type" className="text-[0.72rem] font-semibold tracking-[0.15em] uppercase text-cream/60">
            {t('type_label')}
          </label>
          <select
            id="rights-type"
            disabled={state === 'loading'}
            value={requestType}
            onChange={(e) => setRequestType(e.target.value as RequestType)}
            className="w-full px-4 py-3 bg-card-bg text-cream border border-cream/10 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber/40 transition-colors duration-200 appearance-none cursor-pointer"
          >
            <option value="deletion">{t('type_deletion')}</option>
            <option value="export">{t('type_export')}</option>
            <option value="objection">{t('type_objection')}</option>
          </select>
        </div>

        <Input
          id="rights-email"
          type="email"
          label={t('email_label')}
          placeholder={t('email_placeholder')}
          autoComplete="email"
          disabled={state === 'loading'}
          value={email}
          onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
          error={emailError}
        />

        {state === 'error' && (
          <p className="text-[0.82rem] text-red-400" role="alert" aria-live="assertive">{t('error_generic')}</p>
        )}

        {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
          <div className="flex justify-center">
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              onSuccess={setTurnstileToken}
              options={{ theme: 'dark', size: 'normal' }}
            />
          </div>
        )}

        <Button
          type="button"
          variant="primary"
          disabled={state === 'loading' || (!turnstileToken && !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)}
          className="w-full"
          aria-busy={state === 'loading'}
          onClick={handleSubmit}
        >
          {state === 'loading' ? '…' : t('submit')}
        </Button>
      </div>
    </div>
  )
}
