import { Button } from "@/components/ui/button"
import { Loader2, Save } from 'lucide-react'

interface BotaoSalvarProps {
  salvando?: boolean
  onClick?: () => void
  type?: "button" | "submit"
}

export function BotaoSalvar({
  salvando = false,
  onClick,
  type = "button",
}: BotaoSalvarProps) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={salvando}
    >
      {salvando ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Salvando...
        </>
      ) : (
        <>
          <Save className="size-4" aria-hidden />
          Salvar
        </>
      )}
    </Button>
  )
}