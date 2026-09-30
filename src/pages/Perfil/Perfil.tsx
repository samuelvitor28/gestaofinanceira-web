import { Mail, Phone, User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AppLayout } from "@/layouts/AppLayout"
import { obterIniciais, usuarioMock } from "@/utils/usuario"
import "./Perfil.css"

export function Perfil() {
  const usuario = usuarioMock

  return (
    <AppLayout title="Meu perfil" subtitle="Seus dados pessoais">
      <section className="perfil">
        <div className="perfil__cartao">
          <Avatar className="size-24">
            <AvatarImage src={usuario.urlAvatar} alt={usuario.nome} />
            <AvatarFallback className="text-2xl">
              {obterIniciais(usuario.nome)}
            </AvatarFallback>
          </Avatar>

          <div className="perfil__identificacao">
            <h2 className="perfil__nome">{usuario.nome}</h2>
            <p className="perfil__username">@{usuario.username}</p>
          </div>

          <dl className="perfil__lista">
            <div className="perfil__item">
              <dt>
                <User className="size-4" aria-hidden /> Usuário
              </dt>
              <dd>{usuario.username}</dd>
            </div>
            <div className="perfil__item">
              <dt>
                <Mail className="size-4" aria-hidden /> E-mail
              </dt>
              <dd>{usuario.email}</dd>
            </div>
            {usuario.telefone && (
              <div className="perfil__item">
                <dt>
                  <Phone className="size-4" aria-hidden /> Telefone
                </dt>
                <dd>{usuario.telefone}</dd>
              </div>
            )}
          </dl>
        </div>
      </section>
    </AppLayout>
  )
}