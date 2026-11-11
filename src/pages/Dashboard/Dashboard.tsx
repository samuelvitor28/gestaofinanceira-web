import { useEffect, useMemo, useState } from "react"
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
import { formatarDataIso, formatarMoeda } from "@/lib/transacoes"
import { cn } from "@/lib/utils"
import { contaService } from "@/services/contaService"
import { transacaoService } from "@/services/transacaoService"
import { usuarioService } from "@/services/usuarioService"
import type { Transacao } from "@/types/transacao"
import "./Dashboard.css"

export function Dashboard() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregarDashboard() {
      setCarregando(true)
      try {
        const usuario = await usuarioService.obterUsuarioAtivo()
        if (usuario?.id) {
          const contas = await contaService.listarPorUsuario(usuario.id)
          const lista = await transacaoService.listarPorContas(
            contas.map((c) => c.id)
          )
          setTransacoes(lista)
        } else {
          const lista = await transacaoService.listarTodas()
          setTransacoes(lista)
        }
      } catch (erro) {
        console.error("Erro ao carregar dados do dashboard", erro)
      } finally {
        setCarregando(false)
      }
    }

    carregarDashboard()
  }, [])

  const resumo = useMemo(() => {
    let receitas = 0
    let despesas = 0

    for (const transacao of transacoes) {
      if (transacao.tipo === "receita") {
        receitas += transacao.valor
      } else {
        despesas += transacao.valor
      }
    }

    return {
      saldoTotal: receitas - despesas,
      receitas,
      despesas,
    }
  }, [transacoes])

  const ultimasTransacoes = useMemo(() => {
    return [...transacoes]
      .sort((a, b) => b.data.localeCompare(a.data))
      .slice(0, 5)
  }, [transacoes])

  const resumoPorCategoria = useMemo(() => {
    const despesasPorCategoria = new Map<string, number>()
    let totalDespesas = 0

    for (const transacao of transacoes) {
      if (transacao.tipo !== "despesa") continue
      totalDespesas += transacao.valor
      despesasPorCategoria.set(
        transacao.categoria,
        (despesasPorCategoria.get(transacao.categoria) ?? 0) + transacao.valor
      )
    }

    if (totalDespesas === 0) return []

    return Array.from(despesasPorCategoria.entries())
      .map(([categoria, valor]) => ({
        categoria,
        valor,
        percentual: Math.round((valor / totalDespesas) * 100),
      }))
      .sort((a, b) => b.valor - a.valor)
  }, [transacoes])

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
            {carregando ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Carregando transações...
              </p>
            ) : ultimasTransacoes.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Nenhuma transação registrada ainda.
              </p>
            ) : (
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
                    <TableRow key={transacao.id}>
                      <TableCell>{transacao.descricao}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{transacao.categoria}</Badge>
                      </TableCell>
                      <TableCell>{formatarDataIso(transacao.data)}</TableCell>
                      <TableCell
                        className={cn(
                          "text-right font-medium",
                          transacao.tipo === "receita"
                            ? "dashboard-value--positive"
                            : "dashboard-value--negative"
                        )}
                      >
                        {transacao.tipo === "receita" ? "+" : "-"}
                        {formatarMoeda(transacao.valor)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader>
              <CardTitle>Resumo por categoria</CardTitle>
            </CardHeader>
            <CardContent>
              {resumoPorCategoria.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Sem despesas registradas para calcular categorias.
                </p>
              ) : (
                resumoPorCategoria.map((item) => (
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
                ))
              )}
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
                  Gráfico de evolução em breve.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </AppLayout>
  )
}
