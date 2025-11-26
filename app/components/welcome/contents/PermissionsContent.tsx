import { Button } from '@/app/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/app/components/ui/tooltip'
import { useState, useEffect, useRef, ComponentProps, ReactNode } from 'react'
import { Spinner } from '@/app/components/ui/spinner'
import { usePermissionsStore } from '@/app/store/usePermissionsStore'
import { useOnboardingStore } from '@/app/store/useOnboardingStore'
import accessibilityVideo from '@/app/assets/accesssibility.webm'
import microphoneVideo from '@/app/assets/microphone.webm'
import { HelpCenterButton } from '../components/HelpCenterButton'
import { OnboardingStepHeader } from '../components/OnboardingStepHeader'
import { cn } from '@/lib/utils'
import { CheckIcon, InfoIcon } from 'lucide-react'
import { OnboardingScreenContainer } from '../components/OnboardingScreenContainer'
import { OnboardingStepCard } from '../components/OnboardingStepCard'
import { PermissionCheckIcon } from '../../icons/PermissionCheckIcon'
import { BackButton } from '../components/BackButton'
import { OnboardingStepper } from '../components/OnboardingStepper'
import { AnimatePresence, motion } from 'framer-motion'
import { mediaAnimations, opacityAnimations } from '../constants/animations'

interface PermissionBlockProps extends ComponentProps<typeof motion.div> {
  isActive: boolean
  title: string
  tooltip: ReactNode
  description: string
  children?: ReactNode
  isEnabled: boolean
}

const PermissionBlock = ({
  isActive,
  title,
  tooltip,
  description,
  className,
  children,
  isEnabled,
  ...props
}: PermissionBlockProps) => {
  return (
    <motion.div
      className={cn(
        'border flex flex-col gap-4 border-input p-6 w-140 rounded-2xl transition-colors',
        className,
        !isActive && 'cursor-pointer',
      )}
      {...opacityAnimations}
      {...props}
    >
      <div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="font-medium text-lg leading-7">{title}</div>
            {!isActive && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="size-4" />
                </TooltipTrigger>
                <TooltipContent
                  className="max-w-60"
                  sideOffset={8}
                  side="bottom"
                >
                  {tooltip}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          {isActive && (
            <div className="rounded-full flex items-center justify-center bg-foreground size-6">
              <CheckIcon className="size-3.5 stroke-3 text-background" />
            </div>
          )}
        </div>
        {!isActive && (
          <div className="text-sm text-muted-foreground">{description}</div>
        )}
      </div>
      {!isActive && isEnabled && children}
    </motion.div>
  )
}

interface AllowButtonProps extends ComponentProps<'button'> {
  isLoading?: boolean
}

const AllowButton = ({
  className,
  isLoading,
  children,
  ...props
}: AllowButtonProps) => {
  return (
    <Button
      className={cn(
        'h-9 w-17.5 rounded-full',
        isLoading ? 'w-9' : 'px-4',
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <Spinner className="text-foreground size-4" size="small" />
      ) : (
        children
      )}
    </Button>
  )
}

const PermissionRightPanel = () => {
  const { isAccessibilityEnabled, isMicrophoneEnabled } = usePermissionsStore()

  if (isAccessibilityEnabled && isMicrophoneEnabled) {
    return (
      <motion.div key="check" {...mediaAnimations}>
        <PermissionCheckIcon />
      </motion.div>
    )
  }

  if (isAccessibilityEnabled) {
    return (
      <motion.div key="microphone" {...mediaAnimations} className="pr-15">
        <video
          src={microphoneVideo}
          autoPlay
          loop
          muted
          className="w-120 h-80 object-cover rounded-2xl"
        />
      </motion.div>
    )
  }

  return (
    <motion.div key="accessability" {...mediaAnimations} className="pr-15">
      <video
        src={accessibilityVideo}
        autoPlay
        loop
        muted
        className="w-120 h-80 object-cover rounded-2xl"
      />
    </motion.div>
  )
}

export default function PermissionsContent() {
  const { incrementOnboardingStep, decrementOnboardingStep } =
    useOnboardingStore()

  const {
    isAccessibilityEnabled,
    isMicrophoneEnabled,
    setAccessibilityEnabled,
    setMicrophoneEnabled,
  } = usePermissionsStore()
  const [checkingAccessibility, setCheckingAccessibility] = useState(false)
  const [checkingMicrophone, setCheckingMicrophone] = useState(false)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)
  const microphonePollingRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
      }
      if (microphonePollingRef.current) {
        clearInterval(microphonePollingRef.current)
      }
    }
  }, [])

  useEffect(() => {
    window.api
      .invoke('check-accessibility-permission', false)
      .then((enabled: boolean) => {
        setAccessibilityEnabled(enabled)
      })

    window.api
      .invoke('check-microphone-permission', false)
      .then((enabled: boolean) => {
        setMicrophoneEnabled(enabled)
      })
  }, [setAccessibilityEnabled, setMicrophoneEnabled])

  useEffect(() => {
    if (isAccessibilityEnabled) {
      console.log(
        'Accessibility permission granted. Starting key listener service...',
      )
      window.api.invoke('start-key-listener-service')
    }
  }, [isAccessibilityEnabled])

  const pollAccessibility = () => {
    pollingRef.current = setInterval(() => {
      window.api
        .invoke('check-accessibility-permission', false)
        .then((enabled: boolean) => {
          if (enabled) {
            setAccessibilityEnabled(true)
            setCheckingAccessibility(false)
            if (pollingRef.current) {
              clearInterval(pollingRef.current)
              pollingRef.current = null
            }
          }
        })
    }, 2000)
  }

  const pollMicrophone = () => {
    microphonePollingRef.current = setInterval(() => {
      window.api
        .invoke('check-microphone-permission', false)
        .then((enabled: boolean) => {
          if (enabled) {
            setMicrophoneEnabled(true)
            setCheckingMicrophone(false)
            if (microphonePollingRef.current) {
              clearInterval(microphonePollingRef.current)
              microphonePollingRef.current = null
            }
          }
        })
    }, 2000)
  }

  const handleAllowAccessibility = () => {
    setCheckingAccessibility(true)
    window.api
      .invoke('check-accessibility-permission', true)
      .then((enabled: boolean) => {
        setAccessibilityEnabled(enabled)
        if (!enabled) {
          pollAccessibility()
        } else {
          setCheckingAccessibility(false)
        }
      })
  }

  const handleAllowMicrophone = () => {
    setCheckingMicrophone(true)
    window.api
      .invoke('check-microphone-permission', true)
      .then((enabled: boolean) => {
        setMicrophoneEnabled(enabled)
        if (!enabled) {
          pollMicrophone()
        } else {
          setCheckingMicrophone(false)
        }
      })
  }

  return (
    <OnboardingScreenContainer className="pt-12 px-4 pb-4">
      <OnboardingStepCard>
        <OnboardingStepHeader
          title="App Permissions"
          subtitle="Allow Mic and Text Access"
          leftSide={<BackButton onClick={decrementOnboardingStep} />}
          rightSide={<OnboardingStepper title="Permissions" index={1} />}
        />

        <motion.div {...opacityAnimations} className="flex mt-6 flex-col gap-4">
          <PermissionBlock
            isEnabled
            title={
              isAccessibilityEnabled
                ? 'Ito can insert and edit text.'
                : 'Text editing access'
            }
            description="Allow Ito to insert and edit text using your voice."
            isActive={isAccessibilityEnabled}
            tooltip={
              <p>
                Ito uses this to gather context based on the application you're
                using, and to access your clipboard temporarily to paste text.
              </p>
            }
          >
            <AllowButton
              isLoading={checkingAccessibility}
              onClick={handleAllowAccessibility}
            >
              Allow
            </AllowButton>
          </PermissionBlock>

          <PermissionBlock
            title={
              isMicrophoneEnabled
                ? 'Ito can use your microphone.'
                : 'Microphone access'
            }
            description="Allow Ito to use your microphone to hear and transcribe your speech."
            isEnabled={isAccessibilityEnabled}
            isActive={isMicrophoneEnabled}
            tooltip={
              <p>
                Ito will show an animation when the mic is active and only
                listen when you activate it.
              </p>
            }
          >
            <AllowButton
              isLoading={checkingMicrophone}
              onClick={handleAllowMicrophone}
            >
              Allow
            </AllowButton>
          </PermissionBlock>
        </motion.div>
        <div className="flex h-10 mt-auto justify-between items-start">
          <motion.div {...opacityAnimations}>
            <Button
              className="h-10 rounded-full w-31"
              disabled={!(isAccessibilityEnabled && isMicrophoneEnabled)}
              onClick={incrementOnboardingStep}
            >
              Continue
            </Button>
          </motion.div>
          <HelpCenterButton />
        </div>
      </OnboardingStepCard>
      <motion.div
        {...mediaAnimations}
        className="flex z-50 justify-center absolute items-center bottom-0 top-0 right-0"
      >
        <AnimatePresence mode="wait">
          <PermissionRightPanel />
        </AnimatePresence>
      </motion.div>
    </OnboardingScreenContainer>
  )
}
