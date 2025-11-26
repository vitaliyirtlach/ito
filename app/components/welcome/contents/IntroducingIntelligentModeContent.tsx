import { useOnboardingStore } from '@/app/store/useOnboardingStore'
import { OnboardingScreenContainer } from '../components/OnboardingScreenContainer'
import { OnboardingStepCard } from '../components/OnboardingStepCard'
import { OnboardingStepHeader } from '../components/OnboardingStepHeader'
import { BackButton } from '../components/BackButton'
import { OnboardingStepper } from '../components/OnboardingStepper'
import { IntelligentModeShortcutEditor } from '../components/IntelligentModeShortcutEditor'
import { DictateModeShortcutEditor } from '../components/DictateModeShortcutEditor'
import { HelpCenterButton } from '../components/HelpCenterButton'
import { SetupVoiceIntelligentModeShortcutIcon } from '../../icons/SetupVoiceIntelligentModeShortcutIcon'
import { mediaAnimations, opacityAnimations } from '../constants/animations'
import { motion } from 'framer-motion'

export default function IntroducingIntelligentMode() {
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
          <DictateModeShortcutEditor isEnabled={false} />
          <IntelligentModeShortcutEditor />
        </motion.div>
        <HelpCenterButton className="absolute bottom-6 right-6" />
      </OnboardingStepCard>
      <motion.div
        {...mediaAnimations}
        className="flex z-50 justify-center absolute items-center bottom-0 top-0 right-0"
      >
        <SetupVoiceIntelligentModeShortcutIcon />
      </motion.div>
    </OnboardingScreenContainer>
  )
}
