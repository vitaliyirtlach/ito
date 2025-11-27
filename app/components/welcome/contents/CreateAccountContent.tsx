import { Button } from '@/app/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogProps,
  DialogTitle,
} from '@/app/components/ui/dialog'
import { useOnboardingStore } from '@/app/store/useOnboardingStore'
import EmailSignupContent from './EmailSignupContent'
import EmailLoginContent from './EmailLoginContent'
import CheckEmailContent from './CheckEmailContent'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../auth/useAuth'
import { checkLocalServerHealth } from '@/app/utils/healthCheck'
import { useDictionaryStore } from '@/app/store/useDictionaryStore'
import { EXTERNAL_LINKS } from '@/lib/constants/external-links'
import { isValidEmail } from '@/app/utils/utils'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ItoLogo } from '../../icons/ItoLogo'
import { OnboardingScreenContainer } from '../components/OnboardingScreenContainer'
import { FileTextIcon, GithubIcon, ServerIcon, UserCogIcon } from 'lucide-react'
import { OAuthButton } from '../components/OAuthButton'
import { GoogleOAuthButton } from '../components/GoogleOAuthButton'
import { MicrosoftOAuthButton } from '../components/MicrosoftOAuthButton'
import { AppleOAuthButton } from '../components/AppleOAuthButton'
import { GitHubOAuthButton } from '../components/GitHubOAuthButton'

const SelfHostedDialog = (props: Omit<DialogProps, 'children'>) => {
  return (
    <Dialog {...props}>
      <DialogContent
        showCloseButton
        onOpenAutoFocus={event => event.preventDefault()}
        className="border font-sans outline-none sm:max-w-md border-border rounded-lg bg-background p-6"
      >
        <div className="size-12 shadow-xs border border-border flex items-center justify-center bg-card rounded-md">
          <ServerIcon className="size-6" />
        </div>
        <DialogHeader className="gap-1.5">
          <DialogTitle>Self-Hosted</DialogTitle>
          <DialogDescription>
            Local server must be running to use self-hosted option
          </DialogDescription>
        </DialogHeader>

        <div className="border border-input rounded-2xl p-6">
          <p className="text-sm text-foreground">
            Running Ito locally requires additional setup. Please refer to our
            Github and Documentation
          </p>
          <div className="mt-4 flex w-full gap-4">
            <Button
              variant="outline"
              className="h-10 rounded-full !px-4 !bg-background border-border"
            >
              <GithubIcon />
              <a href={EXTERNAL_LINKS.GITHUB} target="_blank" rel="noreferrer">
                Github
              </a>
            </Button>
            <Button
              variant="outline"
              className="h-10 rounded-full !px-4 !bg-background border-border"
            >
              <FileTextIcon />
              <a href={EXTERNAL_LINKS.WEBSITE} target="_blank" rel="noreferrer">
                Documentation
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function CreateAccountContent() {
  const { incrementOnboardingStep, initializeOnboarding } = useOnboardingStore()
  const [isServerHealthy, setIsServerHealthy] = useState(true)
  const [isSelfHostedModalOpen, setIsSelfHostedModalOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const isDictInitialized = useRef(false)
  const [showEmailPassword, setShowEmailPassword] = useState(false)
  const [showEmailLogin, setShowEmailLogin] = useState(false)
  const [showCheckEmail, setShowCheckEmail] = useState(false)
  const [checkEmailDbUserId, setCheckEmailDbUserId] = useState<string | null>(
    null,
  )
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [checkError, setCheckError] = useState<string | null>(null)

  const { user, isAuthenticated, loginWithSelfHosted, signupWithEmail } =
    useAuth()
  const userName = user?.name

  const addEntry = useDictionaryStore(state => state.addEntry)

  // If user is authenticated, proceed to next step
  useEffect(() => {
    if (isAuthenticated && user) {
      incrementOnboardingStep()
    }
  }, [isAuthenticated, user, incrementOnboardingStep])

  useEffect(() => {
    if (userName && !isDictInitialized.current) {
      console.log('Adding user name to dictionary:', userName)
      addEntry(userName)
      isDictInitialized.current = true
    }
  }, [userName, isDictInitialized, addEntry])

  useEffect(() => {
    initializeOnboarding()
  }, [initializeOnboarding])

  // Check server health on component mount and every 5 seconds
  useEffect(() => {
    const checkHealth = async () => {
      const { isHealthy } = await checkLocalServerHealth()
      setIsServerHealthy(isHealthy)
    }

    // Initial check
    checkHealth()

    // Set up periodic checks every 5 seconds
    const intervalId = setInterval(checkHealth, 5000)

    // Cleanup interval on unmount
    return () => {
      clearInterval(intervalId)
    }
  }, [])

  const handleSelfHosted = async () => {
    try {
      await loginWithSelfHosted()
    } catch (error) {
      console.error('Self-hosted authentication failed:', error)
    }
  }

  const onClickSelfHosted = async () => {
    if (!isServerHealthy) {
      setIsSelfHostedModalOpen(true)
      return
    }
    await handleSelfHosted()
  }

  const handleContinueWithEmail = async () => {
    if (!emailOk) {
      setEmailTouched(true)
      return
    }
    try {
      setIsCheckingEmail(true)
      setCheckError(null)
      const res = await window.api.invoke('auth0-check-email', { email })
      if (!res?.success) {
        setCheckError(res?.error || 'Unable to check email')
        return
      }
      if (res.exists) {
        if (res.verified) {
          setShowEmailLogin(true)
        } else {
          setCheckEmailDbUserId(res.dbUserId || null)
          setShowCheckEmail(true)
        }
      } else {
        setShowEmailPassword(true)
      }
    } finally {
      setIsCheckingEmail(false)
    }
  }

  if (showEmailPassword) {
    return (
      <EmailSignupContent
        initialEmail={email}
        onBack={() => setShowEmailPassword(false)}
        onContinue={em => signupWithEmail(em)}
      />
    )
  }

  if (showEmailLogin) {
    return (
      <EmailLoginContent
        initialEmail={email}
        onBack={() => setShowEmailLogin(false)}
        onContinue={() => {}}
      />
    )
  }

  if (showCheckEmail) {
    return (
      <CheckEmailContent
        email={email}
        dbUserId={checkEmailDbUserId}
        onUseAnotherEmail={() => setShowCheckEmail(false)}
        onRequireLogin={() => {
          setShowCheckEmail(false)
          setShowEmailLogin(true)
        }}
        password={null}
      />
    )
  }

  const emailOk = isValidEmail(email)

  return (
    <OnboardingScreenContainer className="flex-col justify-end items-center">
      <motion.div
        className="absolute flex justify-center h-16"
        initial={{
          top: '50%',
          left: '50%',
          x: '-50%',
          y: '-50%',
          scale: 2,
          opacity: 1,
        }}
        animate={{
          top: '40px',
          left: '50%',
          x: '-50%',
          y: 0,
          scale: 1,
          transition: {
            delay: 1,
            duration: 0.725,
            stiffness: 80,
            damping: 20,
          },
        }}
        transition={{ duration: 0.5 }}
      >
        <ItoLogo className="w-35 h-16" />
      </motion.div>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.725, delay: 1 }} // плавное движение
        className="bg-card p-6 rounded-t-3xl w-150"
      >
        <div className="text-center pt-4 font-semibold">
          <h1 className="text-4xl leading-9 text-foreground">
            VibeType Anywhere
          </h1>
          <p className="text-ring mt-2 text-2xl">Say it, Send it</p>
        </div>

        <div className="w-75 pb-5 mt-12 flex flex-col gap-6 mx-auto">
          <div className="flex flex-col gap-4">
            <div className="text-center text-xs text-muted-foreground">
              Continue with
            </div>
            <div className="grid grid-cols-2 gap-2">
              <GoogleOAuthButton />
              <MicrosoftOAuthButton />
              <AppleOAuthButton />
              <GitHubOAuthButton />
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-1 border-t border-border"></div>
            <span className="px-4 text-xs text-muted-foreground">or</span>
            <div className="flex-1 border-t border-border"></div>
          </div>
          <div className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Type your email"
              onChange={e => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleContinueWithEmail()
                }
              }}
              aria-invalid={emailTouched && !emailOk}
              aria-describedby={
                emailTouched && !emailOk ? 'signup-email-error' : undefined
              }
              className={cn(
                'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input h-9 w-full min-w-0 border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm rounded-lg',
                'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
              )}
            />
            {emailTouched && !emailOk && (
              <p id="signup-email-error" className="text-xs text-destructive">
                Please enter a valid email address
              </p>
            )}
            <Button
              className="w-full rounded-full h-9 text-sm font-medium"
              disabled={!emailOk || isCheckingEmail}
              aria-busy={isCheckingEmail}
              onClick={handleContinueWithEmail}
            >
              {isCheckingEmail ? 'Checking…' : 'Continue'}
            </Button>
            {checkError && (
              <p className="text-xs text-destructive">{checkError}</p>
            )}
            <OAuthButton
              className="border-0 !bg-card"
              variant="ghost"
              onClick={onClickSelfHosted}
            >
              <UserCogIcon className="size-4" />
              <span className="text-sm">Self-Hosted</span>
            </OAuthButton>
          </div>
        </div>
        <div className="mt-6 text-center text-muted-foreground">
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

        <SelfHostedDialog
          open={isSelfHostedModalOpen}
          onOpenChange={setIsSelfHostedModalOpen}
        />
      </motion.div>
    </OnboardingScreenContainer>
  )
}
