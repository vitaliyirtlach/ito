import CreateAccountContent from './contents/CreateAccountContent'
import SignInContent from './contents/SignInContent'
import ReferralContent from './contents/ReferralContent'
import DataControlContent from './contents/DataControlContent'
import PermissionsContent from './contents/PermissionsContent'
import MicrophoneTestContent from './contents/MicrophoneTestContent'
import KeyboardTestContent from './contents/KeyboardTestContent'
import GoodToGoContent from './contents/GoodToGoContent'
import AnyAppContent from './contents/AnyAppContent'
import TryItOutContent from './contents/TryItOutContent'
import { CSSProperties, useEffect } from 'react'
import { usePermissionsStore } from '../../store/usePermissionsStore'
import { useOnboardingStore } from '@/app/store/useOnboardingStore'
import { useAuthStore } from '@/app/store/useAuthStore'
import IntroducingIntelligentModeContent from './contents/IntroducingIntelligentModeContent'
import { useWindowContext } from '../window/WindowContext'
import '@fontsource-variable/geist'
import { AnimatePresence, motion } from 'framer-motion'

export default function WelcomeKit() {
  const { onboardingStep } = useOnboardingStore()
  const { isAuthenticated, user } = useAuthStore()
  const { setTitlebar } = useWindowContext()

  const onboardingStepOrder = [
    CreateAccountContent,
    ReferralContent,
    DataControlContent,
    PermissionsContent,
    MicrophoneTestContent,
    KeyboardTestContent,
    GoodToGoContent,
    IntroducingIntelligentModeContent,
    AnyAppContent,
    TryItOutContent,
  ]

  const { setAccessibilityEnabled, setMicrophoneEnabled } =
    usePermissionsStore()

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
    setTitlebar(titlebar => ({ ...titlebar, showTitlebar: false }))

    return () => {
      setTitlebar(titlebar => ({ ...titlebar, showTitlebar: true }))
    }
  }, [setTitlebar])

  const style = {
    '--font-sans': "'Geist Variable', sans-serif",
  } as CSSProperties

  if (!isAuthenticated && user) {
    return <SignInContent />
  }

  if (!isAuthenticated && !user) {
    return (
      <div className="w-screen h-screen" style={style}>
        <CreateAccountContent />
      </div>
    )
  }

  const CurrentComponent = onboardingStepOrder[onboardingStep]

  return (
    <AnimatePresence mode="wait">
      {CurrentComponent && (
        <motion.div
          key={onboardingStep > 2 ? onboardingStep : 'signin'}
          className="w-screen h-screen"
          style={style}
        >
          <CurrentComponent />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
