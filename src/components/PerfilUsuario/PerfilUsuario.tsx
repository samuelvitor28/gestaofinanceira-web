import { ChevronsUpDown, LogOut, Mail, Phone, User, UserRound } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { obterIniciais, usuarioMock } from "@/utils/usuario"
import "./PerfilUsuario.css"

export function PerfilUsuario() {
  const navegar = useNavigate()
  const usuario = usuarioMock

  function sair() {
    // TODO: limpar token/sessão quando houver autenticação
    navegar("/login", { replace: true })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<button type="button" className="perfil-usuario__gatilho" />}
      >
        <Avatar className="size-9">
          <AvatarImage src={usuario.urlAvatar} alt={usuario.nome} />
          <AvatarFallback>{obterIniciais(usuario.nome)}</AvatarFallback>
        </Avatar>
        <div className="perfil-usuario__texto">
          <span className="perfil-usuario__nome">{usuario.nome}</span>
          <span className="perfil-usuario__username">@{usuario.username}</span>
        </div>
        <ChevronsUpDown className="size-4 shrink-0 opacity-60" aria-hidden />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="top"
        align="start"
        sideOffset={8}
        className="perfil-usuario__menu"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="perfil-usuario__cabecalho">
            <Avatar className="size-10">
              <AvatarImage src={usuario.urlAvatar} alt={usuario.nome} />
              <AvatarFallback>{obterIniciais(usuario.nome)}</AvatarFallback>
            </Avatar>
            <div className="perfil-usuario__texto">
              <span className="perfil-usuario__nome">{usuario.nome}</span>
              <span className="perfil-usuario__username">@{usuario.username}</span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navegar("/perfil")}>
            <UserRound className="size-4" />
            Meu perfil
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={sair} className="perfil-usuario__sair">
            <LogOut className="size-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}