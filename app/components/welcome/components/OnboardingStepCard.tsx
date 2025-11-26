import { cn } from '@/lib/utils'
import { ComponentProps } from 'react'

export const OnboardingStepCard = ({
  className,
  children,
  ...props
}: ComponentProps<'div'>) => {
  return (
    <div
      className={cn(
        'flex flex-col relative bg-card p-6 rounded-3xl w-200',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
