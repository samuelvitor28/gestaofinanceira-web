import { ArrowDownRight, ArrowUpRight, TrendingUp, Wallet } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AppLayout } from "@/layouts/AppLayout"
import { cn } from "@/lib/utils"
import "./Dashboard.css"

// TODO: substituir todos os dados abaixo por chamadas em services/, quando os
// endpoints de conta, transação e categoria estiverem disponíveis.

const resumo = {
  saldoTotal: 4230.5,
  receitas: 6100,
  despesas: 1869.5,
}

const ultimasTransacoes = [
  { descricao: "Salário", categoria: "Salário", data: "05/09", valor: 5200, tipo: "receita" },
  { descricao: "Supermercado", categoria: "Alimentação", data: "08/09", valor: -412.3, tipo: "despesa" },
  { descricao: "Uber", categoria: "Transporte", data: "10/09", valor: -58.9, tipo: "despesa" },
  { descricao: "Freelance", categoria: "Investimentos", data: "12/09", valor: 900, tipo: "receita" },
  { descricao: "Aluguel", categoria: "Moradia", data: "15/09", valor: -1200, tipo: "despesa" },
] as const

const resumoPorCategoria = [
  { categoria: "Moradia", valor: 1200, percentual: 64 },
  { categoria: "Alimentação", valor: 412.3, percentual: 22 },
  { categoria: "Transporte", valor: 58.9, percentual: 3 },
  { categoria: "Outros", valor: 198.3, percentual: 11 },
]

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export function Dashboard() {
  return (
    <AppLayout title="Dashboard" subtitle="Visão geral das suas finanças">
      <section className="dashboard-summary">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saldo total
            </CardTitle>
            <span className="dashboard-summary-card__icon dashboard-summary-card__icon--neutral">
              <Wallet className="size-4" aria-hidden />
            </span>
          </CardHeader>
          <CardContent>
            <p className="dashboard-summary-card__value">
              {formatarMoeda(resumo.saldoTotal)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receitas
            </CardTitle>
            <span className="dashboard-summary-card__icon dashboard-summary-card__icon--positive">
              <ArrowUpRight className="size-4" aria-hidden />
            </span>
          </CardHeader>
          <CardContent>
            <p className="dashboard-summary-card__value">
              {formatarMoeda(resumo.receitas)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Despesas
            </CardTitle>
            <span className="dashboard-summary-card__icon dashboard-summary-card__icon--negative">
              <ArrowDownRight className="size-4" aria-hidden />
            </span>
          </CardHeader>
          <CardContent>
            <p className="dashboard-summary-card__value">
              {formatarMoeda(resumo.despesas)}
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="dashboard-grid">
        <Card>
          <CardHeader>
            <CardTitle>Últimas transações</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ultimasTransacoes.map((transacao) => (
                  <TableRow key={transacao.descricao}>
                    <TableCell>{transacao.descricao}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{transacao.categoria}</Badge>
                    </TableCell>
                    <TableCell>{transacao.data}</TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-medium",
                        transacao.tipo === "receita"
                          ? "dashboard-value--positive"
                          : "dashboard-value--negative"
                      )}
                    >
                      {transacao.valor > 0 ? "+" : ""}
                      {formatarMoeda(transacao.valor)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader>
              <CardTitle>Resumo por categoria</CardTitle>
            </CardHeader>
            <CardContent>
              {resumoPorCategoria.map((item) => (
                <div className="dashboard-category-row" key={item.categoria}>
                  <div className="dashboard-category-row__labels">
                    <span>{item.categoria}</span>
                    <span className="dashboard-category-row__value">
                      {formatarMoeda(item.valor)}
                    </span>
                  </div>
                  <div className="dashboard-progress-track">
                    <div
                      className="dashboard-progress-fill"
                      style={{ width: `${item.percentual}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evolução financeira</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="dashboard-evolution-placeholder">
                <TrendingUp className="size-6" aria-hidden />
                <span>
                  Gráfico de evolução em breve. Para implementar, sugiro a
                  biblioteca Recharts — aviso antes de instalar.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </AppLayout>
  )
}
