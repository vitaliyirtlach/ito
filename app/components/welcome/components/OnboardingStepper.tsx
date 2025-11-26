import { cn } from '@/lib/utils'

interface OnboardingStepperProps {
  index: number
  title: string
}

export const OnboardingStepper = ({
  index: stepIndex,
  title,
}: OnboardingStepperProps) => {
  return (
    <div className="flex border border-border h-8 py-1.5 px-2 rounded-full items-center gap-3">
      {Array.from({ length: 4 }).map((_, index) => {
        const isActive = index === stepIndex
        return (
          <div className="flex items-center gap-2" key={index}>
            <div
              key={index}
              className={cn(
                'size-5 flex justify-center items-center text-xs font-semibold rounded-full',
                isActive
                  ? 'text-white bg-[linear-gradient(102.08deg,_#00E5FF_-101.44%,_#9D00FF_3.79%,_#FF06B7_72.6%)]'
                  : 'bg-secondary text-foreground',
              )}
            >
              {index + 1}
            </div>
            {isActive && title && (
              <p className="text-sm font-medium">{title}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
