'use client'

import { useReducer, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { AnimatePresence, motion } from 'framer-motion'
import useSWR from 'swr'
import { WaitlistSchema, type WaitlistInput } from '@/lib/validations'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

// ─── SWR fetcher ─────────────────────────────────────────────────────────────

const fetcher = (url: string) => fetch(url).then((r) => r.json())

// ─── State machine ────────────────────────────────────────────────────────────

type WaitlistState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; city: string }
  | { status: 'error'; message: string }

type WaitlistAction =
  | { type: 'SUBMIT' }
  | { type: 'SUCCESS'; city: string }
  | { type: 'ERROR'; message: string }
  | { type: 'RESET' }

function waitlistReducer(state: WaitlistState, action: WaitlistAction): WaitlistState {
  switch (action.type) {
    case 'SUBMIT':
      return { status: 'loading' }
    case 'SUCCESS':
      return { status: 'success', city: action.city }
    case 'ERROR':
      return { status: 'error', message: action.message }
    case 'RESET':
      return { status: 'idle' }
    default:
      return state
  }
}

// ─── Amber checkmark SVG ──────────────────────────────────────────────────────

function AmberCheckmark() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="28" cy="28" r="28" fill="var(--amber)" fillOpacity="0.15" />
      <circle cx="28" cy="28" r="20" fill="var(--amber)" fillOpacity="0.25" />
      <path
        d="M18 28.5L24.5 35L38 21"
        stroke="var(--amber)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function WaitlistSection() {
  const t = useTranslations('waitlist')
  const [state, dispatch] = useReducer(waitlistReducer, { status: 'idle' })

  const { data: countData } = useSWR<{ count: number }>(
    '/api/waitlist/count',
    fetcher,
    { refreshInterval: 60_000 }
  )

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<WaitlistInput>({
    resolver: zodResolver(WaitlistSchema),
  })

  const selectedType = watch('type')
  const isLoading = state.status === 'loading'

  // Listen for vendor pre-select event from hero CTA
  useEffect(() => {
    const handler = () => {
      setValue('type', 'vendor', { shouldValidate: false })
    }
    window.addEventListener('zanix:vendor-preselect', handler)
    return () => window.removeEventListener('zanix:vendor-preselect', handler)
  }, [setValue])

  const onSubmit = async (data: WaitlistInput) => {
    dispatch({ type: 'SUBMIT' })

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(data),
      })

      // Treat 201 and duplicate (200/409) as success — never reveal duplicate status
      if (response.status === 201 || response.status === 200 || response.status === 409) {
        dispatch({ type: 'SUCCESS', city: data.city })
        return
      }

      const json = await response.json().catch(() => ({}))

      if (response.status === 429) {
        dispatch({ type: 'ERROR', message: t('error_rate_limit') })
        return
      }

      dispatch({
        type: 'ERROR',
        message: (json as { error?: { message?: string } }).error?.message ?? t('error_generic'),
      })
    } catch {
      dispatch({ type: 'ERROR', message: t('error_generic') })
    }
  }

  const handleReset = () => {
    dispatch({ type: 'RESET' })
    reset()
  }

  // Personalised success message by city
  const successMessage =
    state.status === 'success'
      ? state.city === 'douala'
        ? t('success_douala')
        : state.city === 'yaounde'
          ? t('success_yaounde')
          : t('success_other')
      : ''

  return (
    <section
      id="waitlist"
      className="relative min-h-screen flex items-center py-20 px-4 sm:px-6 overflow-hidden"
      style={{ background: 'var(--deep)', borderTop: '1px solid var(--gold-line)' }}
      aria-labelledby="waitlist-heading"
    >
      {/* Background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(200,132,26,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(200,132,26,0.02) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 60% 65% at 50% 50%, black 25%, transparent 100%)',
        }}
      />
      {/* Radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(46,24,8,0.4) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 w-full max-w-lg mx-auto text-center px-2 sm:px-0">
        {/* Section tag */}
        <div className="inline-flex items-center gap-[10px] font-sans text-[0.62rem] font-bold tracking-[0.22em] uppercase mb-6" style={{ color: 'var(--amber)' }}>
          <span className="block w-7 h-px" style={{ background: 'var(--amber)' }} aria-hidden="true" />
          {t('tag')}
        </div>

        {/* Heading */}
        <h2
          id="waitlist-heading"
          className="font-serif font-light mb-5"
          style={{ fontSize: 'clamp(3.8rem, 10vw, 10.5rem)', lineHeight: '0.86', letterSpacing: '-0.025em', color: 'var(--cream)' }}
        >
          {t('heading').replace(t('heading_em'), '')}<em style={{ fontStyle: 'italic', color: 'var(--amber)' }}>{t('heading_em')}</em>
        </h2>

        {/* Description */}
        <p className="font-sans font-light text-cream/60 text-base leading-[1.8] mb-10">
          {t('description')}
        </p>

        {/* Form / Success state */}
        <AnimatePresence mode="wait" initial={false}>
          {state.status === 'success' ? (
            // ── Success state ──────────────────────────────────────────────
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex flex-col items-center gap-5 py-8"
              role="status"
              aria-live="polite"
            >
              <AmberCheckmark />
              <div>
                <p className="font-sans font-semibold text-amber text-lg mb-1">
                  {t('success_title')}
                </p>
                <p className="font-sans font-light text-cream/70 text-base leading-[1.8]">
                  {successMessage}
                </p>
              </div>
              <button
                onClick={handleReset}
                className="text-[0.78rem] font-medium tracking-[0.08em] uppercase text-cream/40 hover:text-amber transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
              >
                Register another
              </button>
            </motion.div>
          ) : (
            // ── Form state ─────────────────────────────────────────────────
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              aria-label="Waitlist signup form"
            >
              {/* Email input */}
              <div className="mb-5">
                <Input
                  id="waitlist-email"
                  type="email"
                  label="Email"
                  placeholder={t('email_placeholder')}
                  autoComplete="email"
                  disabled={isLoading}
                  error={errors.email?.message}
                  {...register('email')}
                />
              </div>

              {/* Type segmented control */}
              <div className="mb-5">
                <p
                  id="type-label"
                  className="text-[0.78rem] font-medium tracking-[0.1em] uppercase text-cream/60 mb-2 text-left"
                >
                  I am a
                </p>
                <div
                  role="group"
                  aria-labelledby="type-label"
                  className="grid grid-cols-2 gap-2"
                >
                  {(
                    [
                      { value: 'customer', label: t('type_customer') },
                      { value: 'vendor', label: t('type_vendor') },
                    ] as const
                  ).map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      role="button"
                      aria-pressed={selectedType === value}
                      disabled={isLoading}
                      onClick={() => setValue('type', value, { shouldValidate: true })}
                      className={[
                        'px-4 py-3 text-[0.82rem] font-semibold tracking-[0.06em] uppercase',
                        'border transition-all duration-200',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        selectedType === value
                          ? 'bg-amber text-espresso border-amber'
                          : 'bg-card-bg text-cream/70 border-cream/10 hover:border-amber/40',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {errors.type && (
                  <p className="text-[0.78rem] text-red-400 mt-1.5 text-left" role="alert">
                    {errors.type.message}
                  </p>
                )}
              </div>

              {/* City select — shown after type is selected */}
              <AnimatePresence>
                {selectedType && (
                  <motion.div
                    key="city-select"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="overflow-hidden mb-5"
                  >
                    <div className="flex flex-col gap-1.5 w-full">
                      <label
                        htmlFor="waitlist-city"
                        className="text-[0.78rem] font-medium tracking-[0.1em] uppercase text-cream/60"
                      >
                        City
                      </label>
                      <select
                        id="waitlist-city"
                        disabled={isLoading}
                        {...register('city')}
                        className={[
                          'w-full px-4 py-3',
                          'bg-card-bg text-cream',
                          'border',
                          errors.city ? 'border-red-400/60' : 'border-cream/10',
                          'focus:outline-none focus:border-l-2 focus:border-l-amber focus:ring-1 focus:ring-amber/40',
                          'transition-colors duration-200',
                          'disabled:opacity-50 disabled:cursor-not-allowed',
                          'appearance-none cursor-pointer',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        <option value="" disabled>
                          Select your city
                        </option>
                        <option value="douala">{t('city_douala')}</option>
                        <option value="yaounde">{t('city_yaounde')}</option>
                        <option value="other">{t('city_other')}</option>
                      </select>
                      {errors.city && (
                        <p className="text-[0.78rem] text-red-400" role="alert">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error message */}
              {state.status === 'error' && (
                <p
                  className="text-[0.82rem] text-red-400 mb-4 text-left"
                  role="alert"
                  aria-live="assertive"
                >
                  {state.message}
                </p>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                className="w-full"
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    <span>Submitting…</span>
                  </span>
                ) : (
                  t('submit_cta')
                )}
              </Button>

              {/* No spam note */}
              <p className="font-sans text-[0.72rem] text-cream/30 text-center mt-3">
                {t('no_spam')}
              </p>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Live waitlist count */}
        {countData && countData.count > 0 && (
          <p className="font-sans text-[0.78rem] text-cream/40 text-center mt-6">
            {t('count_label').replace('{count}', String(countData.count))}
          </p>
        )}
      </div>
    </section>
  )
}
