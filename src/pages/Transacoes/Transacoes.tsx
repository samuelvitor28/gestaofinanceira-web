import { useMemo, useState } from "react"
import { Plus, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import "./Transacoes.css"

// TODO: substituir por dados vindos de services/transacaoService.ts.
// Os tipos de transação ("receita" | "despesa") devem respeitar o enum
// definido pelo backend — não inventar valores diferentes.
interface Transacao {
  id: string
  descricao: string
  categoria: string
  conta: string
  data: string
  valor: number
  tipo: "receita" | "despesa"
}

const transacoesMock: Transacao[] = [
  { id: "1", descricao: "Salário", categoria: "Salário", conta: "Conta salário", data: "05/09/2026", valor: 5200, tipo: "receita" },
  { id: "2", descricao: "Supermercado", categoria: "Alimentação", conta: "Nubank", data: "08/09/2026", valor: -412.3, tipo: "despesa" },
  { id: "3", descricao: "Uber", categoria: "Transporte", conta: "Nubank", data: "10/09/2026", valor: -58.9, tipo: "despesa" },
  { id: "4", descricao: "Freelance", categoria: "Investimentos", conta: "Inter", data: "12/09/2026", valor: 900, tipo: "receita" },
  { id: "5", descricao: "Aluguel", categoria: "Moradia", conta: "Banco do Brasil", data: "15/09/2026", valor: -1200, tipo: "despesa" },
]

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export function Transacoes() {
  const [busca, setBusca] = useState("")

  const transacoesFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    if (!termo) return transacoesMock
    return transacoesMock.filter((transacao) =>
      [transacao.descricao, transacao.categoria, transacao.conta]
        .join(" ")
        .toLowerCase()
        .includes(termo)
    )
  }, [busca])

  return (
    <AppLayout title="Transações" subtitle="Visualize e gerencie suas transações">
      <div className="transacoes-toolbar">
        <div className="transacoes-search">
          <Search className="size-4" aria-hidden />
          <Input
            placeholder="Buscar por descrição, categoria ou conta"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
          />
        </div>
        
        <Button>
          <Plus className="size-4" aria-hidden />
          Nova transação
        </Button>
      </div>

      <Card>
        <CardContent>
          {transacoesFiltradas.length === 0 ? (
            <div className="transacoes-empty">
              <p>Nenhuma transação encontrada.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Conta</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transacoesFiltradas.map((transacao) => (
                  <TableRow key={transacao.id}>
                    <TableCell>{transacao.descricao}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{transacao.categoria}</Badge>
                    </TableCell>
                    <TableCell>{transacao.conta}</TableCell>
                    <TableCell>{transacao.data}</TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-medium",
                        transacao.tipo === "receita"
                          ? "transacoes-value--positive"
                          : "transacoes-value--negative"
                      )}
                    >
                      {transacao.valor > 0 ? "+" : ""}
                      {formatarMoeda(transacao.valor)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  )
}
