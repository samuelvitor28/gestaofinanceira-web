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
import { BotaoDeletar } from "../BotaoDeletar/BotaoDeletar"
import { Paginacao } from "../Paginacao/Paginacao"

interface TabelaTransacoesProps {
  transacoes: Transacao[] // apenas as transações da página atual
  nomesContas: Record<string, string> // id da conta -> nome
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onDelete: (id: string) => void
}

export function TabelaTransacoes({
  transacoes,
  nomesContas,
  page,
  totalPages,
  onPageChange,
  onDelete,
}: TabelaTransacoesProps) {
  return (
    <Card className="overflow-hidden py-0">
      <CardContent className="p-0">
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
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="w-16 pr-6 text-right">
                  <span className="sr-only">Ações</span>
                </TableHead>
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
                    <TableCell className="text-right">
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
                    <TableCell className="pr-6 text-right">
                      <BotaoDeletar
                        description={transacao.descricao}
                        onConfirm={() => onDelete(transacao.id)}
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}

        {totalPages > 1 && (
          <div className="border-t px-6 py-3">
            <Paginacao
              page={page}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}