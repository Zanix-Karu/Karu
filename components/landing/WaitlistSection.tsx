'use client'

import { useReducer, useEffect, useState, useCallback, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { AnimatePresence, motion } from 'framer-motion'
import useSWR from 'swr'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const emailSchema = z.string().email('Please enter a valid email address').max(254).toLowerCase().trim()

type FormStep = 'type' | 'details'

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

function AmberCheckmark() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <circle cx="28" cy="28" r="28" fill="#E8A020" fillOpacity="0.15" />
      <circle cx="28" cy="28" r="20" fill="#E8A020" fillOpacity="0.25" />
      <path d="M18 28.5L24.5 35L38 21" stroke="#E8A020" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const selectClass = (hasError: boolean) => [
  'w-full px-4 py-3 bg-card-bg text-cream border',
  hasError ? 'border-red-400/60' : 'border-cream/10',
  'focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber/40',
  'transition-colors duration-200',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  'appearance-none cursor-pointer',
].join(' ')

export function WaitlistSection() {
  const t = useTranslations('waitlist')
  const locale = useLocale()
  const [state, dispatch] = useReducer(waitlistReducer, { status: 'idle' })

  const { data: countData } = useSWR<{ count: number }>('/api/waitlist/count', fetcher, { refreshInterval: 60_000 })

  // Form state
  const [step, setStep] = useState<FormStep>('type')
  const [selectedType, setSelectedType] = useState<'customer' | 'vendor' | null>(null)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [city, setCity] = useState('')
  const [cityError, setCityError] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [businessNameError, setBusinessNameError] = useState('')
  const [businessEmail, setBusinessEmail] = useState('')
  const [businessEmailError, setBusinessEmailError] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [vehicleCount, setVehicleCount] = useState('')
  const [vehicleCountError, setVehicleCountError] = useState('')

  const isLoading = state.status === 'loading'
  const isVendor = selectedType === 'vendor'

  // Vendor pre-select from hero CTA
  const vendorPreSelectRef = useRef(false)
  useEffect(() => {
    const handler = () => { vendorPreSelectRef.current = true }
    window.addEventListener('karu:vendor-preselect', handler)
    return () => window.removeEventListener('karu:vendor-preselect', handler)
  }, [])

  // ── Step 1: Choose type ─────────────────────────────────────────────────────

  const handleTypeSelect = useCallback((type: 'customer' | 'vendor') => {
    setSelectedType(type)
    setStep('details')
    // Clear vendor fields when switching
    if (type === 'customer') {
      setBusinessName('')
      setBusinessNameError('')
      setBusinessEmail('')
      setBusinessEmailError('')
      setPhone('')
      setPhoneError('')
      setVehicleCount('')
      setVehicleCountError('')
    }
  }, [])

  // Apply vendor pre-select on mount
  useEffect(() => {
    if (vendorPreSelectRef.current) {
      handleTypeSelect('vendor')
      vendorPreSelectRef.current = false
    }
  }, [handleTypeSelect])

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleFormSubmit = useCallback(async () => {
    let hasError = false

    // Validate email
    const emailResult = emailSchema.safeParse(email)
    if (!emailResult.success) {
      setEmailError(emailResult.error.issues[0].message)
      hasError = true
    } else {
      setEmailError('')
    }

    // Validate city
    if (!city) {
      setCityError('Please select a city')
      hasError = true
    } else {
      setCityError('')
    }

    // Validate vendor fields
    if (isVendor) {
      if (!businessName || businessName.trim().length < 2) {
        setBusinessNameError('Business name is required')
        hasError = true
      } else {
        setBusinessNameError('')
      }
      if (businessEmail) {
        const bizEmailResult = emailSchema.safeParse(businessEmail)
        if (!bizEmailResult.success) {
          setBusinessEmailError('Please enter a valid business email')
          hasError = true
        } else {
          setBusinessEmailError('')
        }
      } else {
        setBusinessEmailError('')
      }
      if (!phone || phone.trim().length < 6) {
        setPhoneError('Phone number is required')
        hasError = true
      } else {
        setPhoneError('')
      }
      if (!vehicleCount) {
        setVehicleCountError('Please select an estimate')
        hasError = true
      } else {
        setVehicleCountError('')
      }
    }

    if (hasError) return

    dispatch({ type: 'SUBMIT' })

    const payload: Record<string, string> = {
      email: email.toLowerCase().trim(),
      type: selectedType!,
      city,
      locale,
    }
    if (isVendor) {
      payload.business_name = businessName.trim()
      payload.phone = phone.trim()
      payload.vehicle_count = vehicleCount
      if (businessEmail) {
        payload.business_email = businessEmail.toLowerCase().trim()
      }
    }

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(payload),
      })

      if (response.status === 201 || response.status === 200 || response.status === 409) {
        dispatch({ type: 'SUCCESS', city })
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
  }, [email, selectedType, city, isVendor, businessName, businessEmail, phone, vehicleCount, locale, t])

  const handleReset = () => {
    dispatch({ type: 'RESET' })
    setStep('type')
    setSelectedType(null)
    setEmail('')
    setEmailError('')
    setCity('')
    setCityError('')
    setBusinessName('')
    setBusinessNameError('')
    setBusinessEmail('')
    setBusinessEmailError('')
    setPhone('')
    setPhoneError('')
    setVehicleCount('')
    setVehicleCountError('')
  }

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
      className="relative min-h-screen flex items-center py-20 px-4 sm:px-6 bg-brown-mid overflow-hidden"
      aria-labelledby="waitlist-heading"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(232,160,32,0.06) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 w-full max-w-lg mx-auto text-center px-2 sm:px-0">
        <div className="inline-flex items-center gap-[10px] text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-amber mb-6">
          <span className="block w-7 h-px bg-amber" aria-hidden="true" />
          {t('tag')}
        </div>

        <h2
          id="waitlist-heading"
          className="font-serif font-normal text-white mb-5"
          style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5rem)' }}
        >
          {t('heading')}
        </h2>

        <p className="font-sans font-light text-cream/60 text-base leading-[1.8] mb-10">
          {t('description')}
        </p>

        <AnimatePresence mode="wait" initial={false}>
          {state.status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-5 py-8"
              role="status"
              aria-live="polite"
            >
              <AmberCheckmark />
              <div>
                <p className="font-sans font-semibold text-amber text-lg mb-1">{t('success_title')}</p>
                <p className="font-sans font-light text-cream/70 text-base leading-[1.8]">{successMessage}</p>
              </div>
              <button
                onClick={handleReset}
                className="text-[0.78rem] font-medium tracking-[0.08em] uppercase text-cream/40 hover:text-amber transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
              >
                Register another
              </button>
            </motion.div>
          ) : step === 'type' ? (
            /* ── Step 1: Choose type ─────────────────────────────────────── */
            <motion.div
              key="step-type"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="text-left"
            >
              <div className="grid grid-cols-2 gap-3">
                {([
                  { value: 'customer' as const, label: t('type_customer') },
                  { value: 'vendor' as const, label: t('type_vendor') },
                ]).map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleTypeSelect(value)}
                    className="px-4 py-4 text-[0.85rem] font-semibold tracking-[0.06em] uppercase border border-cream/10 bg-card-bg text-cream/70 hover:border-amber hover:text-amber transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            /* ── Step 2: Details ─────────────────────────────────────────── */
            <motion.div
              key="step-details"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="text-left"
            >
              {/* Type indicator with back button */}
              <div className="flex items-center justify-between mb-5 px-4 py-3 bg-card-bg border border-cream/10">
                <span className="text-cream text-[0.85rem] font-semibold uppercase tracking-[0.06em]">
                  {isVendor ? t('type_vendor') : t('type_customer')}
                </span>
                <button
                  type="button"
                  onClick={() => { setStep('type'); setSelectedType(null) }}
                  className="text-amber text-[0.72rem] font-semibold tracking-[0.1em] uppercase ml-3 shrink-0 hover:opacity-70 transition-opacity"
                >
                  Change
                </button>
              </div>

              {/* Email */}
              <div className="mb-5">
                <Input
                  id="waitlist-email"
                  type="email"
                  label="Email"
                  placeholder={t('email_placeholder')}
                  autoComplete="email"
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
                  error={emailError}
                />
              </div>

              {/* City */}
              <div className="mb-5">
                <div className="flex flex-col gap-1.5 w-full">
                  <label htmlFor="waitlist-city" className="text-[0.72rem] font-semibold tracking-[0.15em] uppercase text-cream/60">
                    City
                  </label>
                  <select
                    id="waitlist-city"
                    disabled={isLoading}
                    value={city}
                    onChange={(e) => { setCity(e.target.value); setCityError('') }}
                    className={selectClass(!!cityError)}
                  >
                    <option value="" disabled>Select your city</option>
                    <option value="douala">{t('city_douala')}</option>
                    <option value="yaounde">{t('city_yaounde')}</option>
                    <option value="other">{t('city_other')}</option>
                  </select>
                  {cityError && <p className="text-[0.78rem] text-red-400" role="alert">{cityError}</p>}
                </div>
              </div>

              {/* Vendor-only fields */}
              {isVendor && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5 mb-5"
                >
                  <Input
                    id="waitlist-business-name"
                    type="text"
                    label={t('vendor_business_name')}
                    placeholder={t('vendor_business_name_placeholder')}
                    autoComplete="organization"
                    disabled={isLoading}
                    value={businessName}
                    onChange={(e) => { setBusinessName(e.target.value); setBusinessNameError('') }}
                    error={businessNameError}
                  />

                  <Input
                    id="waitlist-business-email"
                    type="email"
                    label={t('vendor_business_email')}
                    placeholder={t('vendor_business_email_placeholder')}
                    autoComplete="email"
                    disabled={isLoading}
                    value={businessEmail}
                    onChange={(e) => { setBusinessEmail(e.target.value); setBusinessEmailError('') }}
                    error={businessEmailError}
                  />

                  <Input
                    id="waitlist-phone"
                    type="tel"
                    label={t('vendor_phone')}
                    placeholder={t('vendor_phone_placeholder')}
                    autoComplete="tel"
                    disabled={isLoading}
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setPhoneError('') }}
                    error={phoneError}
                  />

                  <div className="flex flex-col gap-1.5 w-full">
                    <label htmlFor="waitlist-vehicle-count" className="text-[0.72rem] font-semibold tracking-[0.15em] uppercase text-cream/60">
                      {t('vendor_vehicle_count')}
                    </label>
                    <select
                      id="waitlist-vehicle-count"
                      disabled={isLoading}
                      value={vehicleCount}
                      onChange={(e) => { setVehicleCount(e.target.value); setVehicleCountError('') }}
                      className={selectClass(!!vehicleCountError)}
                    >
                      <option value="">Select</option>
                      <option value="1-5">{t('vendor_vehicle_1_5')}</option>
                      <option value="6-20">{t('vendor_vehicle_6_20')}</option>
                      <option value="21+">{t('vendor_vehicle_21_plus')}</option>
                    </select>
                    {vehicleCountError && <p className="text-[0.78rem] text-red-400" role="alert">{vehicleCountError}</p>}
                  </div>
                </motion.div>
              )}

              {/* Error */}
              {state.status === 'error' && (
                <p className="text-[0.82rem] text-red-400 mb-4" role="alert" aria-live="assertive">{state.message}</p>
              )}

              {/* Submit */}
              <Button
                type="button"
                variant="primary"
                disabled={isLoading}
                className="w-full"
                aria-busy={isLoading}
                onClick={handleFormSubmit}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Submitting…</span>
                  </span>
                ) : (
                  t('submit_cta')
                )}
              </Button>

              <p className="font-sans text-[0.72rem] text-cream/30 text-center mt-3">{t('no_spam')}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {countData && countData.count > 0 && (
          <p className="font-sans text-[0.78rem] text-cream/40 text-center mt-6">
            {t('count_label').replace('{count}', String(countData.count))}
          </p>
        )}
      </div>
    </section>
  )
}
