import { Snowflake, Sun, Thermometer } from 'lucide-react'
import { CONSERVATIONS, type Conservation } from '@/lib/catalogue'
import { cn } from '@/lib/utils'

export const CONSERVATION_STYLE: Record<
  Conservation,
  { icon: typeof Sun; className: string }
> = {
  ambiante: { icon: Sun, className: 'bg-amber-50 text-amber-800 ring-amber-200' },
  refrigere: { icon: Thermometer, className: 'bg-sky-50 text-sky-800 ring-sky-200' },
  congele: { icon: Snowflake, className: 'bg-indigo-50 text-indigo-800 ring-indigo-200' },
}

export function ConservationBadge({ value }: { value: Conservation }) {
  const { icon: Icon, className } = CONSERVATION_STYLE[value]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ring-1 ring-inset',
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {CONSERVATIONS[value].short}
    </span>
  )
}
