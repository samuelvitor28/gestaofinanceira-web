// Os valores devem respeitar o enum definido pelo backend.
export type TipoTransacao = "receita" | "despesa"

export interface Transacao {
  id: string
  descricao: string
  categoria: string
  contaId: string
  data: string // formato ISO: yyyy-mm-dd
  valor: number // sempre positivo; o sinal vem do tipo
  tipo: TipoTransacao
}

export interface Conta {
  id: string
  nome: string
}

export interface NovaTransacaoPayload {
  descricao: string
  valor: number
  categoria: string
  tipo: TipoTransacao
  contaId: string
  data: string
}

export interface FiltrosTransacao {
  busca: string
  tipo: "todos" | TipoTransacao
  categoria: string // "todos" ou nome da categoria
  contaId: string // "todos" ou id da conta
  dataInicio: string
  dataFim: string
  faixaValor: [number, number] | null // null = sem filtro de valor
}