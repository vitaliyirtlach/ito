import { useMemo, useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { isValidEmail, isStrongPassword } from '@/app/utils/utils'
import { useAuth } from '@/app/components/auth/useAuth'
import { OnboardingScreenContainer } from '../components/OnboardingScreenContainer'
import { OnboardingStepCard } from '../components/OnboardingStepCard'
import { OnboardingStepHeader } from '../components/OnboardingStepHeader'
import { AppsOrbitIcon } from '../../icons/AppsOrbitIcon'
import { EXTERNAL_LINKS } from '@/lib/constants/external-links'
import { AppleOAuthButton } from '../components/AppleOAuthButton'
import { GitHubOAuthButton } from '../components/GitHubOAuthButton'
import { GoogleOAuthButton } from '../components/GoogleOAuthButton'
import { MicrosoftOAuthButton } from '../components/MicrosoftOAuthButton'
import { BackButton } from '../components/BackButton'
import { mediaAnimations, opacityAnimations } from '../constants/animations'
import { motion } from 'framer-motion'

type Props = {
  initialEmail?: string
  onBack: () => void
  onContinue: (email: string, password?: string) => void
}

export default function EmailLoginContent({
  initialEmail = '',
  onBack,
}: Props) {
  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState('')

  const emailOk = useMemo(() => isValidEmail(email), [email])

  const isValid = useMemo(() => {
    const passwordOk = isStrongPassword(password)
    return emailOk && passwordOk
  }, [emailOk, password])

  const { loginWithEmailPassword } = useAuth()
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleLogin = async () => {
    if (!emailOk || !isStrongPassword(password)) return
    try {
      setIsLoggingIn(true)
      setErrorMessage(null)
      await loginWithEmailPassword(email, password, { skipNavigate: true })
    } catch (e: any) {
      const msg = typeof e?.message === 'string' ? e.message : 'Login failed.'
      console.error('Login error:', e)
      setErrorMessage(msg)
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <OnboardingScreenContainer className="pt-12 px-4 pb-4">
      <OnboardingStepCard>
        <OnboardingStepHeader
          title="Welcome back!"
          subtitle="Log in to get started"
          leftSide={<BackButton onClick={onBack} />}
        />
        <motion.div
          {...opacityAnimations}
          className="flex mt-6 h-full flex-1 flex-col gap-4 p-6 w-100 border border-border rounded-2xl"
        >
          <div className="flex flex-col gap-2">
            <label className="text-sm text-foreground">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="h-9 w-full rounded-lg border border-border shadow-xs bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground outline-none font-sans disabled:opacity-50"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex text-sm justify-between items-center">
              <label className="text-foreground">Password</label>
              <p className="text-muted-foreground">Forgot password?</p>
            </div>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleLogin()
                }
              }}
              onChange={e => setPassword(e.target.value)}
              className="h-9 w-full rounded-lg border border-border shadow-xs bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground outline-none font-sans disabled:opacity-50"
            />
          </div>
          <Button
            className="h-10 rounded-full w-full"
            disabled={!isValid || isLoggingIn}
            aria-busy={isLoggingIn}
            onClick={handleLogin}
          >
            {isLoggingIn && (
              <span className="mr-2 inline-block size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            )}
            {isLoggingIn ? 'Logging in…' : 'Log In'}
          </Button>

          {errorMessage && (
            <p className="mt-2 text-sm text-destructive">{errorMessage}</p>
          )}
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <div className="flex-1 border-t border-border"></div>
              <span className="px-4 text-xs text-muted-foreground">or</span>
              <div className="flex-1 border-t border-border"></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <GoogleOAuthButton />
              <MicrosoftOAuthButton />
              <AppleOAuthButton />
              <GitHubOAuthButton />
            </div>
          </div>

          <div className="mt-auto text-center text-muted-foreground">
            <a href={EXTERNAL_LINKS.WEBSITE} target="_blank" rel="noreferrer">
              Terms of Use
            </a>
            <span className="mx-2">•</span>
            <a
              href={EXTERNAL_LINKS.PRIVACY_POLICY}
              target="_blank"
              rel="noreferrer"
            >
              Privacy Policy
            </a>
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
