import { ArrowLeftIcon } from 'lucide-react'
import { Button, ButtonProps } from '../../ui/button'
import { cn } from '@/lib/utils'

export const BackButton = ({
  className,
  ...props
}: Omit<ButtonProps, 'children'>) => {
  return (
    <Button
      className={cn('text-sm text-foreground rounded-full', className)}
      variant="ghost"
      {...props}
    >
      <ArrowLeftIcon />
      Back
    </Button>
  )
}
