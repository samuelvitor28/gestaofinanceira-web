import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'

interface BotaoCancelarProps {
  onClick: () => void
  disabled?: boolean
}

export function BotaoCancelar({ onClick, disabled = false }: BotaoCancelarProps) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={disabled}
    >
      <X className="size-4" aria-hidden />
      Cancelar
    </Button>
  )
}