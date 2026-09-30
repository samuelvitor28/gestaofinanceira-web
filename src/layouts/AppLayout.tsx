import type { ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, ListTree, Wallet } from "lucide-react"

import { BotaoTema } from "@/components/BotaoTema/BotaoTema"
import { PerfilUsuario } from "@/components/PerfilUsuario/PerfilUsuario"
import { cn } from "@/lib/utils"
import "./AppLayout.css"

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transacoes", label: "Transações", icon: ListTree },
  { to: "/contas", label: "Contas", icon: Wallet },
]

interface AppLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
}

export function AppLayout({ title, subtitle, children }: AppLayoutProps) {
  const location = useLocation()

  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <div className="app-sidebar__brand">
          <Wallet className="size-5" aria-hidden />
          <span>Gestão Financeira</span>
        </div>
        <nav className="app-sidebar__nav">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "app-sidebar__link",
                  isActive && "app-sidebar__link--active"
                )}
              >
                <item.icon className="size-4" aria-hidden />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="app-sidebar__rodape">
          <PerfilUsuario />
        </div>
      </aside>

      <div className="app-content">
        <header className="app-content__header">
          <div className="app-content__titulos">
            <h1 className="app-content__title">{title}</h1>
            {subtitle && <p className="app-content__subtitle">{subtitle}</p>}
          </div>
          <BotaoTema />
        </header>
        {children}
      </div>
    </div>
  )
}