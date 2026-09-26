import { Tag } from "lucide-react"

import { AppLayout } from "@/layouts/AppLayout"
import "./Categorias.css"

const categoriasMock = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Lazer",
  "Salário",
  "Investimentos",
  "Saúde",
  "Educação",
]

export function Categorias() {
  return (
    <AppLayout title="Categorias" subtitle="Categorias usadas para classificar suas transações">
      <p className="categorias-note">
        Lista de exemplo — em breve virá da API.
      </p>
      <div className="categorias-grid">
        {categoriasMock.map((categoria) => (
          <div className="categoria-card" key={categoria}>
            <span className="categoria-card__icon">
              <Tag className="size-4" aria-hidden />
            </span>
            <span className="categoria-card__name">{categoria}</span>
          </div>
        ))}
      </div>
    </AppLayout>
  )
}
