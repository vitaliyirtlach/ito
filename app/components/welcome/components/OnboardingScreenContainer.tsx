import { cn } from '@/lib/utils'
import { ComponentProps } from 'react'

export const OnboardingScreenContainer = ({
  children,
  className,
  ...props
}: ComponentProps<'div'>) => {
  return (
    <div
      className={cn(
        'flex relative overflow-hidden h-full w-full onboarding-background font-sans',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
