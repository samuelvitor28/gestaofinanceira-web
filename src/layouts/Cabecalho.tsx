import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { Moon, Sun, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTema } from "@/hooks/useTema"

interface CabecalhoProps {
  /** Ações exibidas à direita, antes do botão de tema (ex: Entrar / Criar conta). */
  children?: ReactNode
}

export function Cabecalho({ children }: CabecalhoProps) {
  const { tema, alternarTema } = useTema()

  return (
    <header className="cabecalho">
      <Link to="/" className="cabecalho__marca">
        <Wallet className="size-5" aria-hidden />
        <span>Gestão Financeira</span>
      </Link>
      <nav className="cabecalho__acoes">
        <Button
          variant="ghost"
          size="icon"
          onClick={alternarTema}
          aria-label={tema === "escuro" ? "Ativar modo claro" : "Ativar modo escuro"}
        >
          {tema === "escuro" ? (
            <Sun className="size-4" aria-hidden />
          ) : (
            <Moon className="size-4" aria-hidden />
          )}
        </Button>
        {children}
      </nav>
    </header>
  )
}