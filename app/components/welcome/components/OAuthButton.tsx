import { cn } from '@/lib/utils'
import { Button, ButtonProps } from '../../ui/button'

export const OAuthButton = ({ children, className, ...props }: ButtonProps) => {
  return (
    <Button
      variant="outline"
      className={cn(
        'w-full h-9 rounded-full !bg-background border border-input flex justify-center gap-2 text-sm font-medium',
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  )
}
