import { api } from "./api"
import type {
  NovaTransacaoPayload,
  TipoTransacao,
  Transacao,
} from "@/types/transacao"

export type CategoriaEnumBackend =
  | "ALIMENTACAO"
  | "TRANSPORTE"
  | "MORADIA"
  | "LAZER"
  | "SAUDE"
  | "EDUCACAO"
  | "COMPRAS"
  | "SERVICOS"
  | "INVESTIMENTOS"
  | "SALARIO"
  | "OUTROS"

export type TipoEnumBackend = "RECEITA" | "DESPESA"

export interface TransacaoApiDTO {
  id: string
  descricao: string
  valor: number
  categoria: CategoriaEnumBackend
  tipo: TipoEnumBackend
  data: string
  contaId: string
}

export interface TransacaoRequestApiDTO {
  descricao: string
  valor: number
  categoria: CategoriaEnumBackend
  tipo: TipoEnumBackend
  data: string
  contaId: string
}

const MAPA_CATEGORIA_PARA_UI: Record<CategoriaEnumBackend, string> = {
  ALIMENTACAO: "Alimentação",
  TRANSPORTE: "Transporte",
  MORADIA: "Moradia",
  LAZER: "Lazer",
  SAUDE: "Saúde",
  EDUCACAO: "Educação",
  COMPRAS: "Compras",
  SERVICOS: "Serviços",
  INVESTIMENTOS: "Investimentos",
  SALARIO: "Salário",
  OUTROS: "Outros",
}

const MAPA_CATEGORIA_PARA_API: Record<string, CategoriaEnumBackend> = {
  Alimentação: "ALIMENTACAO",
  Transporte: "TRANSPORTE",
  Moradia: "MORADIA",
  Lazer: "LAZER",
  Saúde: "SAUDE",
  Educação: "EDUCACAO",
  Compras: "COMPRAS",
  Serviços: "SERVICOS",
  Investimentos: "INVESTIMENTOS",
  Salário: "SALARIO",
  Outros: "OUTROS",
}

export const CATEGORIAS_DISPONIVEIS = Object.values(MAPA_CATEGORIA_PARA_UI)

function paraCategoriaEnum(categoriaUi: string): CategoriaEnumBackend {
  return MAPA_CATEGORIA_PARA_API[categoriaUi] ?? "OUTROS"
}

function paraCategoriaUi(categoriaApi: CategoriaEnumBackend): string {
  return MAPA_CATEGORIA_PARA_UI[categoriaApi] ?? "Outros"
}

function paraTipoEnum(tipoUi: TipoTransacao): TipoEnumBackend {
  return tipoUi === "receita" ? "RECEITA" : "DESPESA"
}

function paraTipoUi(tipoApi: TipoEnumBackend): TipoTransacao {
  return tipoApi === "RECEITA" ? "receita" : "despesa"
}

function mapearParaUi(dto: TransacaoApiDTO): Transacao {
  return {
    id: dto.id,
    descricao: dto.descricao,
    valor: Math.abs(dto.valor),
    categoria: paraCategoriaUi(dto.categoria),
    tipo: paraTipoUi(dto.tipo),
    data: dto.data,
    contaId: dto.contaId,
  }
}

export const transacaoService = {
  criar: async (payload: NovaTransacaoPayload): Promise<Transacao> => {
    const body: TransacaoRequestApiDTO = {
      descricao: payload.descricao,
      valor: payload.valor,
      categoria: paraCategoriaEnum(payload.categoria),
      tipo: paraTipoEnum(payload.tipo),
      data: payload.data,
      contaId: payload.contaId,
    }
    const resposta = await api.post<TransacaoApiDTO>("/transacoes", body)
    return mapearParaUi(resposta)
  },

  listarTodas: async (): Promise<Transacao[]> => {
    const lista = await api.get<TransacaoApiDTO[]>("/transacoes")
    return lista.map(mapearParaUi)
  },

  listarPorConta: async (contaId: string): Promise<Transacao[]> => {
    const lista = await api.get<TransacaoApiDTO[]>(`/transacoes/conta/${contaId}/`)
    return lista.map(mapearParaUi)
  },

  listarPorContas: async (contasIds: string[]): Promise<Transacao[]> => {
    if (contasIds.length === 0) return []
    const listas = await Promise.all(
      contasIds.map((id) => transacaoService.listarPorConta(id))
    )
    return listas.flat()
  },

  alterar: async (
    idTransacao: string,
    payload: Partial<NovaTransacaoPayload>
  ): Promise<Transacao> => {
    const body: Partial<TransacaoRequestApiDTO> = {
      ...(payload.descricao !== undefined && { descricao: payload.descricao }),
      ...(payload.valor !== undefined && { valor: payload.valor }),
      ...(payload.categoria !== undefined && {
        categoria: paraCategoriaEnum(payload.categoria),
      }),
      ...(payload.tipo !== undefined && { tipo: paraTipoEnum(payload.tipo) }),
      ...(payload.data !== undefined && { data: payload.data }),
      ...(payload.contaId !== undefined && { contaId: payload.contaId }),
    }
    const resposta = await api.patch<TransacaoApiDTO>(
      `/transacoes/${idTransacao}`,
      body
    )
    return mapearParaUi(resposta)
  },

  deletar: (idTransacao: string) => api.delete(`/transacoes/${idTransacao}`),
}
