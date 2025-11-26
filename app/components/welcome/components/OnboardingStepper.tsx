import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface OnboardingStepperProps {
  index: number
  title: string
  shouldAnimate?: boolean
}

export const OnboardingStepper = ({
  index: stepIndex,
  title,
  shouldAnimate = true,
}: OnboardingStepperProps) => {
  return (
    <motion.div
      className="flex border border-gray-200 h-8 py-1.5 px-2 rounded-full items-center gap-3 overflow-hidden"
      initial={shouldAnimate ? { opacity: 0.6 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {Array.from({ length: 4 }).map((_, index) => {
        const isActive = index === stepIndex
        const baseDelay = index * 0.04

        return (
          <motion.div
            className="flex items-center gap-2"
            key={index}
            initial={
              shouldAnimate
                ? {
                    x: -4,
                    opacity: 0.5,
                  }
                : false
            }
            animate={{
              x: 0,
              opacity: 1,
            }}
            transition={{
              duration: 0.4,
              delay: baseDelay,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <motion.div
              className="size-5 flex justify-center items-center text-xs font-semibold rounded-full shrink-0"
              initial={
                shouldAnimate && isActive
                  ? {
                      background: 'rgb(243 244 246)',
                      color: 'rgb(17 24 39)',
                      scale: 0.95,
                    }
                  : false
              }
              animate={{
                background: isActive
                  ? 'linear-gradient(102.08deg, #00E5FF -101.44%, #9D00FF 3.79%, #FF06B7 72.6%)'
                  : 'rgb(243 244 246)',
                color: isActive ? 'rgb(255 255 255)' : 'rgb(17 24 39)',
                scale: 1,
              }}
              transition={{
                duration: 0.5,
                delay: shouldAnimate && isActive ? 0.15 : 0,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              {index + 1}
            </motion.div>

            {isActive && title && (
              <div className="overflow-hidden">
                <motion.div
                  initial={
                    shouldAnimate
                      ? {
                          width: 0,
                          opacity: 0,
                          x: -8,
                        }
                      : false
                  }
                  animate={{
                    width: 'auto',
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    width: {
                      type: 'spring',
                      stiffness: 300,
                      damping: 30,
                      delay: shouldAnimate ? 0.2 : 0,
                    },
                    opacity: {
                      duration: 0.4,
                      delay: shouldAnimate ? 0.3 : 0,
                      ease: 'easeOut',
                    },
                    x: {
                      type: 'spring',
                      stiffness: 300,
                      damping: 30,
                      delay: shouldAnimate ? 0.25 : 0,
                    },
                  }}
                >
                  <p className="text-sm font-medium whitespace-nowrap pr-0.5">
                    {title}
                  </p>
                </motion.div>
              </div>
            )}
          </motion.div>
        )
      })}
    </motion.div>
  )
}
