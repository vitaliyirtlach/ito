import { useMemo, useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { isValidEmail, isStrongPassword } from '@/app/utils/utils'
import { useAuth } from '@/app/components/auth/useAuth'
import CheckEmailContent from './CheckEmailContent'
import { EXTERNAL_LINKS } from '@/lib/constants/external-links'
import { OnboardingScreenContainer } from '../components/OnboardingScreenContainer'
import { OnboardingStepCard } from '../components/OnboardingStepCard'
import { OnboardingStepHeader } from '../components/OnboardingStepHeader'
import { AppsOrbitIcon } from '../../icons/AppsOrbitIcon'
import { BackButton } from '../components/BackButton'
import { motion } from 'framer-motion'
import { mediaAnimations, opacityAnimations } from '../constants/animations'

type Props = {
  initialEmail?: string
  onBack: () => void
  onContinue: (email: string, password?: string) => void
}

export default function EmailSignupContent({
  initialEmail = '',
  onBack,
}: Props) {
  const email = initialEmail
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')

  const emailOk = useMemo(() => isValidEmail(email), [email])

  const isValid = useMemo(() => {
    const passwordOk = isStrongPassword(password)
    const nameOk = fullName.trim().length > 0
    return emailOk && passwordOk && nameOk
  }, [emailOk, password, fullName])

  const { createDatabaseUser } = useAuth()
  const [showCheckEmail, setShowCheckEmail] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [dbUserId, setDbUserId] = useState<string | null>(null)

  const handleCreate = async () => {
    if (!emailOk || !isStrongPassword(password) || !fullName.trim()) return
    try {
      setIsCreating(true)
      setErrorMessage(null)
      const res = await createDatabaseUser(email, password, fullName.trim())
      setDbUserId(`auth0|${res._id}`)
      setShowCheckEmail(true)
    } finally {
      setIsCreating(false)
    }
  }

  const handleCreateSafe = async () => {
    try {
      await handleCreate()
    } catch (e: any) {
      const msg = typeof e?.message === 'string' ? e.message : 'Signup failed.'
      console.error('Signup error:', e)
      setErrorMessage(msg)
    }
  }

  if (showCheckEmail) {
    return (
      <CheckEmailContent
        email={email}
        password={password}
        dbUserId={dbUserId}
        onUseAnotherEmail={onBack}
      />
    )
  }

  return (
    <OnboardingScreenContainer className="pt-12 px-4 pb-4">
      <OnboardingStepCard>
        <OnboardingStepHeader
          title="Create Your Email"
          subtitle="Quick and easy setup"
          leftSide={<BackButton onClick={onBack} />}
        />
        <motion.div
          {...opacityAnimations}
          className="flex mt-6 flex-col gap-4 p-6 w-125 border border-border rounded-2xl"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-foreground">Email</label>
              <input
                className="h-9 w-full rounded-lg border border-border shadow-xs bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground outline-none font-sans disabled:opacity-50"
                disabled
                value={email}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-foreground">Full name</label>
              <input
                type="text"
                placeholder="Enter your Full name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="h-9 w-full rounded-lg border border-border shadow-xs bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground outline-none font-sans"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-foreground">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleCreate()
                  }
                }}
                onChange={e => setPassword(e.target.value)}
                className="h-9 w-full rounded-lg border border-border shadow-xs bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground outline-none font-sans"
              />
              <p className="text-xs text-muted-foreground">
                Must be 8+ chars, include upper, lower, and number
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              className="h-10 w-full rounded-full"
              disabled={!isValid || isCreating}
              aria-busy={isCreating}
              onClick={handleCreateSafe}
            >
              {isCreating && (
                <span className="mr-2 inline-block size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              )}
              {isCreating ? 'Creating…' : 'Create Account'}
            </Button>
            {errorMessage && (
              <p className="mt-2 text-sm text-destructive">{errorMessage}</p>
            )}
            <p className="text-center text-xs text-muted-foreground">
              By continuing, you agree to our{' '}
              <a
                href={EXTERNAL_LINKS.WEBSITE}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Terms
              </a>{' '}
              and{' '}
              <a
                href={EXTERNAL_LINKS.PRIVACY_POLICY}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Privacy Policy
              </a>
            </p>
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
