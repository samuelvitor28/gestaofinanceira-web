import { TrendingDown, TrendingUp } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatarDataIso, formatarMoeda } from "@/lib/transacoes"
import { cn } from "@/lib/utils"
import type { Transacao } from "@/types/transacao"

import { CategoriaBadge } from "./CategoriaBadge"

interface TabelaTransacoesProps {
  transacoes: Transacao[]
  nomesContas: Record<string, string> // id da conta -> nome
}

export function TabelaTransacoes({
  transacoes,
  nomesContas,
}: TabelaTransacoesProps) {
  return (
    <Card className="overflow-hidden py-0">
      <CardContent className="p-0">
        <div className="flex items-center justify-between border-b px-6 py-3 text-sm text-muted-foreground">
          <span>
            {transacoes.length}{" "}
            {transacoes.length === 1 ? "transação encontrada" : "transações encontradas"}
          </span>
        </div>

        {transacoes.length === 0 ? (
          <div className="px-4 py-16 text-center text-muted-foreground">
            Nenhuma transação encontrada.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="pl-6">Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Conta</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="pr-6 text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transacoes.map((transacao) => {
                const ehReceita = transacao.tipo === "receita"
                const IconeTendencia = ehReceita ? TrendingUp : TrendingDown

                return (
                  <TableRow key={transacao.id}>
                    <TableCell className="max-w-64 truncate pl-6 font-medium">
                      {transacao.descricao}
                    </TableCell>
                    <TableCell>
                      <CategoriaBadge categoria={transacao.categoria} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {nomesContas[transacao.contaId] ?? "Não informada"}
                    </TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">
                      {formatarDataIso(transacao.data)}
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <span
                        className={cn(
                          "inline-flex items-center justify-end gap-1.5 font-semibold tabular-nums",
                          ehReceita
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        )}
                      >
                        <IconeTendencia className="size-4" aria-hidden />
                        {ehReceita ? "+" : "-"} {formatarMoeda(transacao.valor)}
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}