import { Button } from '@/app/components/ui/button'
import { useOnboardingStore } from '@/app/store/useOnboardingStore'
import { OnboardingStepHeader } from '../components/OnboardingStepHeader'
import { OnboardingScreenContainer } from '../components/OnboardingScreenContainer'
import { OnboardingStepCard } from '../components/OnboardingStepCard'
import { CheckIcon, GlobeIcon, SearchIcon } from 'lucide-react'
import { NewProUpgradePlanIcon } from '../../icons/NewProUpgradePlanIcon'
import { BackButton } from '../components/BackButton'
import { ItoReadyBadge } from '../components/ItoReadyBadge'
import { GradientCheckIcon } from '../components/GradientCheckIcon'
import { mediaAnimations, opacityAnimations } from '../constants/animations'
import { motion } from 'framer-motion'

const features = [
  'Unlimited words per week',
  'Ultra fast dictation as fast as 0.3 second',
  'Priority customer support',
  'Early access to new functionality',
]

export default function CongratsContent() {
  const { decrementOnboardingStep } = useOnboardingStore()

  return (
    <OnboardingScreenContainer className="pt-12 px-4 pb-4">
      <OnboardingStepCard>
        <OnboardingStepHeader
          title="Congrats! "
          subtitle="You have been upgraded to Ito Pro for free!"
          leftSide={<BackButton onClick={decrementOnboardingStep} />}
          rightSide={<ItoReadyBadge />}
        />

        <motion.div
          {...opacityAnimations}
          className="flex mt-6 w-125 border border-border rounded-2xl p-6 flex-col gap-4"
        >
          <p className="font-bold text-sm">
            Enjoy all Pro features for 14 days.
          </p>
          <div className="flex flex-col gap-3">
            {features.map(feature => (
              <div className="flex h-5 items-center gap-3" key={feature}>
                <GradientCheckIcon className="size-5" />
                <p className="text-sm">{feature}</p>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          {...opacityAnimations}
          className="flex h-10 mt-auto justify-between items-start"
        >
          <Button className="h-10 rounded-full !px-8">Start Using Ito</Button>
          <Button
            variant="outline"
            className="h-10 !px-8 rounded-full !bg-background"
          >
            Upgrade Now (20% off)
          </Button>
        </motion.div>
      </OnboardingStepCard>
      <motion.div
        {...mediaAnimations}
        className="flex z-50 justify-center absolute items-center bottom-0 top-0 right-0"
      >
        <NewProUpgradePlanIcon />
      </motion.div>
    </OnboardingScreenContainer>
  )
}
