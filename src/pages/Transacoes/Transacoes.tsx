import { useEffect, useMemo, useState } from "react"
import { Plus } from "lucide-react"

import { FiltrosTransacoes } from "@/components/Transacoes/FiltrosTransacoes"
import { NovaTransacaoDialog } from "@/components/Transacoes/NovaTransacaoDialog"
import { TabelaTransacoes } from "@/components/Transacoes/TabelaTransacoes"
import { showToast } from "@/components/Toast/Toast"
import { Button } from "@/components/ui/button"
import { AppLayout } from "@/layouts/AppLayout"
import { aplicarFiltros, criarFiltrosVazios } from "@/lib/transacoes"
import { contaService } from "@/services/contaService"
import {
  CATEGORIAS_DISPONIVEIS,
  transacaoService,
} from "@/services/transacaoService"
import { usuarioService } from "@/services/usuarioService"
import type {
  Conta,
  FiltrosTransacao,
  NovaTransacaoPayload,
  Transacao,
} from "@/types/transacao"

// Itens por página
const PAGE_SIZE = 10

export function Transacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [contas, setContas] = useState<Conta[]>([])
  const [filtros, setFiltros] = useState<FiltrosTransacao>(criarFiltrosVazios())
  const [dialogAberto, setDialogAberto] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    async function carregarDados() {
      try {
        const usuario = await usuarioService.obterUsuarioAtivo()
        let contasCarregadas: Conta[] = []

        if (usuario?.id) {
          contasCarregadas = await contaService.listarPorUsuario(usuario.id)
        } else {
          contasCarregadas = await contaService.listarTodas()
        }
        setContas(contasCarregadas)

        if (usuario?.id) {
          const transacoesDoUsuario = await transacaoService.listarPorContas(
            contasCarregadas.map((c) => c.id)
          )
          setTransacoes(transacoesDoUsuario)
        } else {
          const todasTransacoes = await transacaoService.listarTodas()
          setTransacoes(todasTransacoes)
        }
      } catch (erro) {
        console.error("Erro ao carregar transações", erro)
        showToast.error(
          "Erro ao carregar",
          "Não foi possível carregar as transações da API."
        )
      }
    }

    carregarDados()
  }, [])

  const valorMaximo = useMemo(
    () => Math.ceil(Math.max(0, ...transacoes.map((item) => item.valor))),
    [transacoes]
  )

  const nomesContas = useMemo(
    () => Object.fromEntries(contas.map((conta) => [conta.id, conta.nome])),
    [contas]
  )

  const transacoesFiltradas = useMemo(
    () => aplicarFiltros(transacoes, filtros),
    [transacoes, filtros]
  )

  // Paginação
  const totalPages = Math.max(1, Math.ceil(transacoesFiltradas.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages) // evita página inválida após excluir/filtrar
  const paginatedTransactions = transacoesFiltradas.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  // Ao mudar os filtros, volta para a primeira página
  function handleFiltersChange(novosFiltros: FiltrosTransacao) {
    setFiltros(novosFiltros)
    setPage(1)
  }

  async function lidarComCriacao(payload: NovaTransacaoPayload) {
    try {
      const criada = await transacaoService.criar(payload)
      setTransacoes((anteriores) => [criada, ...anteriores])
      showToast.success("Transação criada", "A transação foi salva com sucesso.")
    } catch (erro) {
      showToast.error("Erro ao salvar", "Não foi possível salvar a transação.")
      throw erro
    }
  }

  async function handleDelete(id: string) {
    try {
      await transacaoService.deletar(id)
      setTransacoes((anteriores) =>
        anteriores.filter((transacao) => transacao.id !== id)
      )
      showToast.success("Transação excluída", "A transação foi removida com sucesso.")
    } catch {
      showToast.error("Erro ao excluir", "Não foi possível excluir a transação.")
    }
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
          aoMudar={handleFiltersChange}
          categorias={CATEGORIAS_DISPONIVEIS}
          contas={contas}
          valorMaximo={valorMaximo}
        />

        <TabelaTransacoes
          transacoes={paginatedTransactions}
          nomesContas={nomesContas}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          onDelete={handleDelete}
        />
      </div>

      <NovaTransacaoDialog
        aberto={dialogAberto}
        aoMudarAberto={setDialogAberto}
        categorias={CATEGORIAS_DISPONIVEIS}
        contas={contas}
        aoCriar={lidarComCriacao}
      />
    </AppLayout>
  )
}