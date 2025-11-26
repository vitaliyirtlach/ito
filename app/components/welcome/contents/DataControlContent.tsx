import { Button } from '@/app/components/ui/button'
import { EXTERNAL_LINKS } from '@/lib/constants/external-links'
import { useOnboardingStore } from '@/app/store/useOnboardingStore'
import { useSettingsStore } from '@/app/store/useSettingsStore'
import { HelpCenterButton } from '../components/HelpCenterButton'
import { OnboardingStepHeader } from '../components/OnboardingStepHeader'
import { ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import { CheckIcon } from 'lucide-react'
import { OnboardingScreenContainer } from '../components/OnboardingScreenContainer'
import { OnboardingStepCard } from '../components/OnboardingStepCard'
import { DataControlLockIcon } from '../../icons/DataControlLockIcon'
import { BackButton } from '../components/BackButton'
import { OnboardingStepper } from '../components/OnboardingStepper'
import { motion } from 'framer-motion'
import { mediaAnimations, opacityAnimations } from '../constants/animations'

interface ManageBlockProps extends ComponentProps<'div'> {
  isActive: boolean
  title: string
  description: string
}

const ManageBlock = ({
  isActive,
  title,
  description,
  className,
  ...props
}: ManageBlockProps) => {
  return (
    <div
      className={cn(
        `border flex flex-col border-input p-6 w-125 rounded-2xl cursor-pointer transition-colors`,
        isActive && 'border-2 border-foreground',
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between w-full">
        <div className="font-medium text-lg leading-7">{title}</div>
        {isActive && (
          <div className="rounded-full flex items-center justify-center bg-foreground size-6">
            <CheckIcon className="size-3.5 stroke-3 text-background" />
          </div>
        )}
      </div>
      <div className="text-sm text-muted-foreground">{description}</div>
    </div>
  )
}

export default function DataControlContent() {
  const { incrementOnboardingStep, decrementOnboardingStep } =
    useOnboardingStore()
  const { shareAnalytics, setShareAnalytics } = useSettingsStore()

  return (
    <OnboardingScreenContainer className="pt-12 px-4 pb-4">
      <OnboardingStepCard>
        <OnboardingStepHeader
          title="Manage Your Data"
          subtitle="Share or Stay Private"
          leftSide={<BackButton onClick={decrementOnboardingStep} />}
          rightSide={<OnboardingStepper title="Welcome!" index={0} />}
        />

        <motion.div {...opacityAnimations} className="flex mt-6 flex-col gap-4">
          <ManageBlock
            isActive={shareAnalytics}
            title="Help improve Ito"
            description="Share audio, transcripts, and edits to improve Ito’s features and AI models."
            onClick={() => setShareAnalytics(true)}
          />
          <ManageBlock
            isActive={!shareAnalytics}
            title="Enable Privacy Mode"
            description="Keep your data private and unused."
            onClick={() => setShareAnalytics(false)}
          />
          <div className="text-sm text-muted-foreground">
            You can change this anytime in Settings.{' '}
            <button
              onClick={() =>
                window.api?.invoke(
                  'web-open-url',
                  EXTERNAL_LINKS.PRIVACY_POLICY,
                )
              }
              className="underline cursor-pointer"
            >
              Read more.
            </button>
          </div>
        </motion.div>
        <div className="flex h-10 mt-auto justify-between items-start">
          <motion.div {...opacityAnimations}>
            <Button
              className="h-10 rounded-full w-31"
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
        <DataControlLockIcon />
      </motion.div>
    </OnboardingScreenContainer>
  )
}
