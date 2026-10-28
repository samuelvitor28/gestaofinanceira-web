import { useMemo, useState } from "react"
import { Plus } from "lucide-react"

import { FiltrosTransacoes } from "@/components/Transacoes/FiltrosTransacoes"
import { NovaTransacaoDialog } from "@/components/Transacoes/NovaTransacaoDialog"
import { TabelaTransacoes } from "@/components/Transacoes/TabelaTransacoes"
import { Button } from "@/components/ui/button"
import { AppLayout } from "@/layouts/AppLayout"
import { aplicarFiltros, criarFiltrosVazios } from "@/lib/transacoes"
import type {
  Conta,
  FiltrosTransacao,
  NovaTransacaoPayload,
  Transacao,
} from "@/types/transacao"

// TODO: substituir por dados vindos de services/transacaoService.ts.
const transacoesMock: Transacao[] = [
  { id: "1", descricao: "Salário", categoria: "Salário", contaId: "1", data: "2026-09-05", valor: 5200, tipo: "receita" },
  { id: "2", descricao: "Supermercado", categoria: "Alimentação", contaId: "2", data: "2026-09-08", valor: 412.3, tipo: "despesa" },
  { id: "3", descricao: "Uber", categoria: "Transporte", contaId: "2", data: "2026-09-10", valor: 58.9, tipo: "despesa" },
  { id: "4", descricao: "Freelance", categoria: "Investimentos", contaId: "3", data: "2026-09-12", valor: 900, tipo: "receita" },
  { id: "5", descricao: "Aluguel", categoria: "Moradia", contaId: "4", data: "2026-09-15", valor: 1200, tipo: "despesa" },
]

// TODO: substituir por categorias vindas da API (ex.: categoriaService.listar()).
const categoriasMock = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Saúde",
  "Educação",
  "Lazer",
  "Salário",
  "Investimentos",
  "Outros",
]

// TODO: substituir pelas contas do usuário logado (ex.: contaService.listarDoUsuario()).
const contasMock: Conta[] = [
  { id: "1", nome: "Conta salário" },
  { id: "2", nome: "Nubank" },
  { id: "3", nome: "Inter" },
  { id: "4", nome: "Banco do Brasil" },
]

// TODO: trocar por chamada real, ex.: transacaoService.criar(payload).
function criarTransacaoNaApi(payload: NovaTransacaoPayload): Promise<Transacao> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: crypto.randomUUID(), ...payload })
    }, 1200)
  })
}

export function Transacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>(transacoesMock)
  const [filtros, setFiltros] = useState<FiltrosTransacao>(criarFiltrosVazios())
  const [dialogAberto, setDialogAberto] = useState(false)

  const valorMaximo = useMemo(
    () => Math.ceil(Math.max(0, ...transacoes.map((item) => item.valor))),
    [transacoes]
  )

  const nomesContas = useMemo(
    () => Object.fromEntries(contasMock.map((conta) => [conta.id, conta.nome])),
    []
  )

  const transacoesFiltradas = useMemo(
    () => aplicarFiltros(transacoes, filtros),
    [transacoes, filtros]
  )

  async function lidarComCriacao(payload: NovaTransacaoPayload) {
    const criada = await criarTransacaoNaApi(payload)
    setTransacoes((anteriores) => [criada, ...anteriores])
  }

  return (
    <AppLayout title="Transações" subtitle="Visualize e gerencie suas transações">
      <div className="grid gap-4">
        <div className="flex justify-end">
          <Button onClick={() => setDialogAberto(true)}>
            <Plus className="size-4" aria-hidden />
            Nova transação
          </Button>
        </div>

        <FiltrosTransacoes
          filtros={filtros}
          aoMudar={setFiltros}
          categorias={categoriasMock}
          contas={contasMock}
          valorMaximo={valorMaximo}
        />

        <TabelaTransacoes
          transacoes={transacoesFiltradas}
          nomesContas={nomesContas}
        />
      </div>

      <NovaTransacaoDialog
        aberto={dialogAberto}
        aoMudarAberto={setDialogAberto}
        categorias={categoriasMock}
        contas={contasMock}
        aoCriar={lidarComCriacao}
      />
    </AppLayout>
  )
}