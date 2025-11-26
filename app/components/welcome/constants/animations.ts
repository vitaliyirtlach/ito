export const opacityAnimations = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.5, stiffness: 80, damping: 20 },
} as const

export const mediaAnimations = {
  initial: { y: '10%', opacity: 0 },
  animate: { y: 0, opacity: 100 },
  exit: { y: '-10%', opacity: 0 },
  transition: { duration: 0.5, damping: 20, stiffness: 80 },
} as const
