import { Button } from '@/app/components/ui/button'
import { useOnboardingStore } from '@/app/store/useOnboardingStore'
import { OnboardingStepHeader } from '../components/OnboardingStepHeader'
import { cn } from '@/lib/utils'
import { HelpCenterButton } from '../components/HelpCenterButton'
import { TellUsAboutYourselfIcon } from '../../icons/TellUsAboutYourselfIcon'
import { OnboardingScreenContainer } from '../components/OnboardingScreenContainer'
import { OnboardingStepCard } from '../components/OnboardingStepCard'
import { BackButton } from '../components/BackButton'
import { OnboardingStepper } from '../components/OnboardingStepper'
import { motion } from 'framer-motion'
import { mediaAnimations, opacityAnimations } from '../constants/animations'

const sources = [
  'Twitter',
  'TikTok',
  'Instagram',
  'Discord',
  'YouTube',
  'Reddit',
  'Friend',
  'Google Search',
  'Product Hunt',
  'Other',
]

export default function ReferralContent() {
  const {
    incrementOnboardingStep,
    referralSource,
    setReferralSource,
    decrementOnboardingStep,
  } = useOnboardingStore()

  return (
    <OnboardingScreenContainer className="pt-12 px-4 pb-4">
      <OnboardingStepCard>
        <OnboardingStepHeader
          title="Let’s Begin"
          subtitle="Tell Us Where You Found Ito."
          leftSide={<BackButton onClick={decrementOnboardingStep} />}
          rightSide={
            <OnboardingStepper
              shouldAnimate={false}
              title="Welcome!"
              index={0}
            />
          }
        />
        <motion.div
          {...opacityAnimations}
          className="rounded-2xl mt-6 w-125 p-6 flex flex-col gap-4 border border-border"
        >
          <h3 className="text-lg leading-7 font-medium">Choose a source</h3>
          <div className="flex flex-wrap gap-2">
            {sources.map(source => {
              const isActive = source === referralSource
              return (
                <Button
                  key={source}
                  className={cn(
                    'h-9 border cursor-pointer rounded-lg',
                    isActive
                      ? 'border-transparent'
                      : '!bg-background dark:bg-input/30',
                  )}
                  variant={isActive ? 'default' : 'outline'}
                  onClick={() => setReferralSource(source)}
                >
                  {source}
                </Button>
              )
            })}
          </div>
        </motion.div>
        <div className="flex h-10 mt-auto justify-between items-start">
          <motion.div {...opacityAnimations}>
            <Button
              className="h-10 rounded-full w-31"
              onClick={incrementOnboardingStep}
              disabled={!referralSource}
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
        <TellUsAboutYourselfIcon />
      </motion.div>
    </OnboardingScreenContainer>
  )
}
