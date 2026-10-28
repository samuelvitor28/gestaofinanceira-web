import type { FiltrosTransacao, Transacao } from "@/types/transacao"

export const TODOS = "todos"

export function criarFiltrosVazios(): FiltrosTransacao {
  return {
    busca: "",
    tipo: TODOS,
    categoria: TODOS,
    contaId: TODOS,
    dataInicio: "",
    dataFim: "",
    faixaValor: null,
  }
}

export function temFiltrosAtivos(filtros: FiltrosTransacao) {
  return (
    filtros.busca.trim() !== "" ||
    filtros.tipo !== TODOS ||
    filtros.categoria !== TODOS ||
    filtros.contaId !== TODOS ||
    filtros.dataInicio !== "" ||
    filtros.dataFim !== "" ||
    filtros.faixaValor !== null
  )
}

export function aplicarFiltros(
  transacoes: Transacao[],
  filtros: FiltrosTransacao
) {
  const termo = filtros.busca.trim().toLowerCase()

  return transacoes
    .filter((transacao) => {
      if (termo && !transacao.descricao.toLowerCase().includes(termo)) {
        return false
      }
      if (filtros.tipo !== TODOS && transacao.tipo !== filtros.tipo) {
        return false
      }
      if (filtros.categoria !== TODOS && transacao.categoria !== filtros.categoria) {
        return false
      }
      if (filtros.contaId !== TODOS && transacao.contaId !== filtros.contaId) {
        return false
      }
      // Datas ISO (yyyy-mm-dd) podem ser comparadas como string.
      if (filtros.dataInicio && transacao.data < filtros.dataInicio) return false
      if (filtros.dataFim && transacao.data > filtros.dataFim) return false

      if (filtros.faixaValor) {
        const [minimo, maximo] = filtros.faixaValor
        if (transacao.valor < minimo || transacao.valor > maximo) return false
      }
      return true
    })
    .sort((a, b) => b.data.localeCompare(a.data))
}

export function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

// Converte yyyy-mm-dd para dd/mm/yyyy sem passar por Date (evita bug de fuso).
export function formatarDataIso(dataIso: string) {
  const [ano, mes, dia] = dataIso.split("-")
  return `${dia}/${mes}/${ano}`
}
