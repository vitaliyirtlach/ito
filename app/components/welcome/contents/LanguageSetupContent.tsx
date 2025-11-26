import { Button } from '@/app/components/ui/button'
import { useOnboardingStore } from '@/app/store/useOnboardingStore'
import { HelpCenterButton } from '../components/HelpCenterButton'
import { OnboardingStepHeader } from '../components/OnboardingStepHeader'
import { OnboardingScreenContainer } from '../components/OnboardingScreenContainer'
import { OnboardingStepCard } from '../components/OnboardingStepCard'
import { CheckIcon, GlobeIcon, MicIcon, SearchIcon } from 'lucide-react'
import { GlobeLanguageSetupIcon } from '../../icons/GlobeLanguageSetupIcon'
import { OnboardingStepper } from '../components/OnboardingStepper'
import { BackButton } from '../components/BackButton'
import { mediaAnimations, opacityAnimations } from '../constants/animations'
import { motion } from 'framer-motion'

export default function LanguageSetupContent() {
  const { incrementOnboardingStep, decrementOnboardingStep } =
    useOnboardingStore()

  return (
    <OnboardingScreenContainer className="pt-12 px-4 pb-4">
      <OnboardingStepCard>
        <OnboardingStepHeader
          title="Language"
          subtitle="Select the language you speak"
          leftSide={<BackButton onClick={decrementOnboardingStep} />}
          rightSide={<OnboardingStepper title="Setup" index={2} />}
        />
        <motion.div
          {...opacityAnimations}
          className="flex mt-6 w-125 border border-border rounded-2xl p-6 flex-col gap-2"
        >
          <div className="flex items-center text-sm px-3 py-2 h-9 rounded-lg shadow-xs border border-input gap-2">
            <SearchIcon className="size-4 text-muted-foreground" />
            <input
              placeholder="Search"
              className="w-full h-full outline-none"
            />
          </div>
          <div className="h-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GlobeIcon className="size-4 stroke-1" />
              Auto-detect
            </div>
            <CheckIcon className="size-4" />
          </div>
          <div className="bg-border h-px w-full" />
          <div className="overflow-y-auto max-h-56">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="h-8 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <GlobeIcon className="size-4 stroke-1" />
                  English (British)
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          {...opacityAnimations}
          className="flex h-10 mt-auto justify-between items-start"
        >
          <div className="flex items-center gap-2">
            <Button
              className="h-10 rounded-full w-31"
              onClick={incrementOnboardingStep}
            >
              Continue
            </Button>
            <Button
              variant="outline"
              className="h-10 !px-8 rounded-full !bg-background"
            >
              <MicIcon />
              Auto-Detect
            </Button>
          </div>
          <HelpCenterButton />
        </motion.div>
      </OnboardingStepCard>
      <motion.div
        {...mediaAnimations}
        className="flex z-50 justify-center absolute items-center bottom-0 top-0 right-0"
      >
        <GlobeLanguageSetupIcon />
      </motion.div>
    </OnboardingScreenContainer>
  )
}
