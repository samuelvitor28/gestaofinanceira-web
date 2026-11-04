import { buttonVariants } from "@/components/ui/button"
import { AlertDialogAction } from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"

interface BotaoExcluirProps {
  onClick: () => void
  disabled?: boolean
}

export function BotaoExcluir({ onClick, disabled = false }: BotaoExcluirProps) {
  return (
    // AlertDialogAction fecha o dialog e chama o onClick
    <AlertDialogAction
      className={buttonVariants({ variant: "destructive" })}
      onClick={onClick}
      disabled={disabled}
    >
      <Trash2 className="size-4" aria-hidden />
      Excluir
    </AlertDialogAction>
  )
}