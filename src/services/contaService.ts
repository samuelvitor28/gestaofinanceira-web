import { api } from "./api"

export interface Conta {
  id: string
  nome: string
  usuarioId: string
}

export interface NovaContaPayload {
  nome: string
  usuarioId: string
}

export interface AtualizarContaPayload {
  nome: string
}

export const contaService = {
  criar: (payload: NovaContaPayload) => api.post<Conta>("/contas", payload),

  listarTodas: () => api.get<Conta[]>("/contas"),

  listarPorUsuario: (usuarioId: string) =>
    api.get<Conta[]>(`/contas/usuario/${usuarioId}`),

  alterarNome: (idConta: string, payload: AtualizarContaPayload) =>
    api.patch<Conta>(`/contas/${idConta}`, payload),

  deletar: (idConta: string) => api.delete(`/contas/${idConta}`),

  deletarTodasPorUsuario: (usuarioId: string) =>
    api.delete(`/contas/usuario/${usuarioId}`),
}
