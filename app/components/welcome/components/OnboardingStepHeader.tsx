import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { opacityAnimations } from '../constants/animations'

interface OnboardingStepHeaderProps {
  title: string
  subtitle: string
  leftSide?: ReactNode
  rightSide?: ReactNode
}

export const OnboardingStepHeader = ({
  title,
  subtitle,
  leftSide,
  rightSide,
}: OnboardingStepHeaderProps) => {
  return (
    <div className="flex font-sans flex-col gap-4">
      <div className="flex items-center justify-between h-8">
        {leftSide || <div />}
        {rightSide}
      </div>
      <div className="font-semibold">
        <motion.h1
          {...opacityAnimations}
          className="leading-9 text-foreground text-3xl"
        >
          {title}
        </motion.h1>
        <motion.h2 {...opacityAnimations} className="mt-1 text-2xl text-ring">
          {subtitle}
        </motion.h2>
      </div>
    </div>
  )
}
