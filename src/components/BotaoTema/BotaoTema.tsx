import { Moon, Sun } from "lucide-react"

import { useTema } from "@/hooks/useTema"
import "./BotaoTema.css"

export function BotaoTema() {
  const { tema, alternarTema } = useTema()
  const temaEscuro = tema === "escuro"

  return (
    <button
      type="button"
      className="botao-tema"
      onClick={alternarTema}
      aria-label={temaEscuro ? "Mudar para tema azul claro" : "Mudar para tema azul escuro"}
      title={temaEscuro ? "Tema azul claro" : "Tema azul escuro"}
    >
      {temaEscuro ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  )
}