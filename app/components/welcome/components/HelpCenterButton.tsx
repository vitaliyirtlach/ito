import { QuestionCircle } from '@mynaui/icons-react'
import { Button, ButtonProps } from '../../ui/button'
import { cn } from '@/lib/utils'

export const HelpCenterButton = ({
  className,
  ...props
}: Omit<ButtonProps, 'children'>) => {
  return (
    <Button
      variant="ghost"
      className={cn('rounded-full h-10 !px-8', className)}
      {...props}
    >
      <QuestionCircle className="size-5" />
      Help Center
    </Button>
  )
}
