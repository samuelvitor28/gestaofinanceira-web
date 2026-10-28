import {
  Car,
  GraduationCap,
  Gamepad2,
  HeartPulse,
  Home,
  PiggyBank,
  Tag,
  UtensilsCrossed,
  Wallet,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

interface EstiloCategoria {
  icone: LucideIcon
  classe: string
}

const ESTILOS_CATEGORIA: Record<string, EstiloCategoria> = {
  Alimentação: {
    icone: UtensilsCrossed,
    classe: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
  },
  Transporte: {
    icone: Car,
    classe: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  },
  Moradia: {
    icone: Home,
    classe: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  },
  Saúde: {
    icone: HeartPulse,
    classe: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  },
  Educação: {
    icone: GraduationCap,
    classe: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
  },
  Lazer: {
    icone: Gamepad2,
    classe: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300",
  },
  Salário: {
    icone: Wallet,
    classe: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
  },
  Investimentos: {
    icone: PiggyBank,
    classe: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  },
  Outros: {
    icone: Tag,
    classe: "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300",
  },
}

const ESTILO_PADRAO = ESTILOS_CATEGORIA.Outros

export function CategoriaBadge({ categoria }: { categoria: string }) {
  const { icone: Icone, classe } = ESTILOS_CATEGORIA[categoria] ?? ESTILO_PADRAO

  return (
    <span
      className={cn(
        "inline-flex min-w-36 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        classe
      )}
    >
      {/* Todos os ícones com o mesmo tamanho */}
      <Icone className="size-3.5 shrink-0" aria-hidden />
      {categoria}
    </span>
  )
}