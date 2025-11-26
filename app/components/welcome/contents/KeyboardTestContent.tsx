import { useOnboardingStore } from '@/app/store/useOnboardingStore'
import React from 'react'
import { OnboardingScreenContainer } from '../components/OnboardingScreenContainer'
import { OnboardingStepCard } from '../components/OnboardingStepCard'
import { OnboardingStepHeader } from '../components/OnboardingStepHeader'
import { BackButton } from '../components/BackButton'
import { OnboardingStepper } from '../components/OnboardingStepper'
import { HelpCenterButton } from '../components/HelpCenterButton'
import { SetupVoiceShortcutIcon } from '../../icons/SetupVoiceShortcutIcon'
import { DictateModeShortcutEditor } from '../components/DictateModeShortcutEditor'
import { IntelligentModeShortcutEditor } from '../components/IntelligentModeShortcutEditor'
import { motion } from 'framer-motion'
import { mediaAnimations, opacityAnimations } from '../constants/animations'

export default function KeyboardTestContent() {
  const { decrementOnboardingStep } = useOnboardingStore()

  return (
    <OnboardingScreenContainer className="pt-12 px-4 pb-4">
      <OnboardingStepCard>
        <OnboardingStepHeader
          title="Voice Shortcuts"
          subtitle="Assign Keys for Voice Control"
          leftSide={<BackButton onClick={decrementOnboardingStep} />}
          rightSide={<OnboardingStepper title="Setup" index={2} />}
        />

        <motion.div {...opacityAnimations} className="flex mt-6 flex-col gap-2">
          <DictateModeShortcutEditor />
          <IntelligentModeShortcutEditor isEnabled={false} />
        </motion.div>
        <HelpCenterButton className="absolute bottom-6 right-6" />
      </OnboardingStepCard>
      <motion.div
        {...mediaAnimations}
        className="flex z-50 justify-center absolute items-center bottom-0 top-0 right-0"
      >
        <SetupVoiceShortcutIcon />
      </motion.div>
    </OnboardingScreenContainer>
  )
}
