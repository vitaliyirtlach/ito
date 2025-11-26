import { useEffect, useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { useAuth } from '../../auth/useAuth'
import { OnboardingStepCard } from '../components/OnboardingStepCard'
import { AppsOrbitIcon } from '../../icons/AppsOrbitIcon'
import { OnboardingScreenContainer } from '../components/OnboardingScreenContainer'
import { OnboardingStepHeader } from '../components/OnboardingStepHeader'
import { BackButton } from '../components/BackButton'
import { ItoLogo } from '../../icons/ItoLogo'
import ItoIcon from '../../icons/ItoIcon'
import { motion } from 'framer-motion'
import { mediaAnimations, opacityAnimations } from '../constants/animations'

type Props = {
  email: string
  password: string | null
  dbUserId: string | null
  onUseAnotherEmail: () => void
  onRequireLogin?: () => void
}

export default function CheckEmailContent({
  email,
  password,
  dbUserId,
  onUseAnotherEmail,
  onRequireLogin = () => {},
}: Props) {
  const [seconds, setSeconds] = useState(30)
  const [isResending, setIsResending] = useState(false)
  const [pollError, setPollError] = useState<string | null>(null)
  const [resendError, setResendError] = useState<string | null>(null)
  const { loginWithEmailPassword } = useAuth()

  useEffect(() => {
    if (seconds <= 0) return
    const id = setInterval(() => setSeconds(s => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [seconds])

  const handleResend = async () => {
    if (seconds > 0 || isResending) return
    try {
      setIsResending(true)
      setResendError(null)
      let success = true
      console.log('Resending verification email for', email, dbUserId)
      const res = await window.api.invoke('auth0-send-verification', {
        dbUserId,
      })
      if (!res?.success) {
        success = false
        setResendError(res?.error || 'Failed to resend verification email')
      } else if (!res?.jobId) {
        setResendError(
          'Verification email requested but no job id was returned',
        )
      }
      if (success) setSeconds(30)
    } finally {
      setIsResending(false)
    }
  }

  // Poll for verification status every 4 seconds
  useEffect(() => {
    let mounted = true
    const poll = async () => {
      try {
        console.log('Polling for email verification')
        const res = await window.api.invoke('auth0-check-email', {
          email,
        })
        if (mounted && res?.success && res.verified) {
          console.log('Email verified')
          if (password) {
            await loginWithEmailPassword(email, password, {
              skipNavigate: true,
            })
          } else {
            onRequireLogin()
          }
        }
        if (mounted && !res?.success) {
          setPollError(res?.error || null)
        }
      } catch (e: any) {
        if (mounted) setPollError(e?.message || 'Polling error')
      }
    }
    const id = setInterval(poll, 2000)
    poll()
    return () => {
      mounted = false
      clearInterval(id)
    }
  }, [email, dbUserId, loginWithEmailPassword, onRequireLogin, password])

  return (
    <OnboardingScreenContainer className="pt-12 px-4 pb-4">
      <OnboardingStepCard>
        <OnboardingStepHeader
          title="Create Your Email"
          subtitle="Check your inbox"
          leftSide={<ItoIcon className="size-6" />}
        />
        <motion.div
          {...opacityAnimations}
          className="flex mt-6 h-full flex-1 flex-col gap-4 p-6 w-125 border border-border rounded-2xl"
        >
          <p className="text-sm">We've sent a message to {email}.</p>
          <div className="flex items-center gap-2">
            <div className="flex justify-center items-center size-5 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
              1
            </div>
            <p>
              Open the email and click{' '}
              <span className="font-semibold">Confirm email</span> to activate
              your account.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex justify-center items-center size-5 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
              2
            </div>
            <p>
              Once verified, return here - this page will refresh automatically.
            </p>
          </div>
          <div className="mt-10 flex flex-col gap-2">
            <Button
              variant="secondary"
              disabled={seconds > 0 || isResending}
              onClick={handleResend}
              className="h-10 rounded-full w-full justify-center shadow-none !bg-secondary"
            >
              {seconds > 0
                ? `Resend email (${seconds} Sec)`
                : isResending
                  ? 'Resending…'
                  : 'Resend email'}
            </Button>
            {resendError && (
              <p className="text-center text-xs text-destructive">
                {resendError}
              </p>
            )}
            <Button
              className="h-10 rounded-full"
              onClick={onUseAnotherEmail}
              variant="ghost"
            >
              Use another email
            </Button>
            <p className="text-center px-16 text-xs text-muted-foreground">
              If you don't see it, check your Spam or Promotions folder for a
              message from support@ito.ai
            </p>
            {pollError && (
              <p className="text-center text-xs text-muted-foreground">
                {pollError}
              </p>
            )}
          </div>
        </motion.div>
      </OnboardingStepCard>
      <motion.div
        {...mediaAnimations}
        className="flex z-50 justify-center absolute items-center bottom-0 top-0 right-0"
      >
        <AppsOrbitIcon />
      </motion.div>
    </OnboardingScreenContainer>
  )
}
