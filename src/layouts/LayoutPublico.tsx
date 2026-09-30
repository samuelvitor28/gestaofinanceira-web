import { Link, Outlet } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Cabecalho } from "./Cabecalho"
import { Rodape } from "./Rodape"

export function LayoutPublico() {
  return (
    <div className="layout-publico">
      <Cabecalho>
        <Button variant="ghost" asChild>
          <Link to="/login">Entrar</Link>
        </Button>
        <Button asChild>
          <Link to="/cadastro">Criar conta</Link>
        </Button>
      </Cabecalho>

      <main className="layout-publico__conteudo">
        <Outlet />
      </main>

      <Rodape />
    </div>
  )
}