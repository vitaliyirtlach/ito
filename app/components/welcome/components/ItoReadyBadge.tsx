import { CheckIcon } from 'lucide-react'

export const ItoReadyBadge = () => {
  return (
    <div className="flex border border-border h-8 py-1.5 px-2 rounded-full items-center gap-2">
      <div className="size-5 bg-secondary rounded-full flex items-center justify-center">
        <CheckIcon className="size-3 stroke-3" />
      </div>
      <p className="text-sm text-foreground font-medium">Ito is ready!</p>
    </div>
  )
}
