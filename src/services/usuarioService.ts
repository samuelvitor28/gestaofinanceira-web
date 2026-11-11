import { api } from "./api"
import {
  obterUsuarioSalvo,
  salvarUsuarioSessao,
  type Usuario,
} from "@/utils/usuario"

export interface UsuarioRequestPayload {
  nome: string
  email: string
  senha: string
  username: string
}

export interface UsuarioUpdatePayload {
  nome?: string
  email?: string
  username?: string
}

export const usuarioService = {
  criar: (payload: UsuarioRequestPayload) =>
    api.post<Usuario>("/usuarios", payload),

  buscarPorId: (id: string) => api.get<Usuario>(`/usuarios/${id}`),

  listarTodos: () => api.get<Usuario[]>("/usuarios"),

  atualizar: (id: string, payload: UsuarioUpdatePayload) =>
    api.patch<Usuario>(`/usuarios/${id}`, payload),

  deletar: (id: string) => api.delete(`/usuarios/${id}`),

  /**
   * Login provisório enquanto /auth não está implementado no backend:
   * busca o usuário pelo username (ou e-mail) na listagem de /usuarios.
   */
  loginProvisorio: async (identificador: string): Promise<Usuario> => {
    const usuarios = await api.get<Usuario[]>("/usuarios")
    const limpo = identificador.trim().toLowerCase()
    const encontrado = usuarios.find(
      (u) =>
        u.username.toLowerCase() === limpo || u.email.toLowerCase() === limpo
    )

    if (!encontrado) {
      throw new Error("Usuário não encontrado.")
    }

    salvarUsuarioSessao(encontrado)
    return encontrado
  },

  /**
   * Retorna o usuário salvo no localStorage ou, caso não exista (ou não exista mais no banco),
   * busca o primeiro usuário cadastrado na API para permitir testar as telas diretamente.
   */
  obterUsuarioAtivo: async (): Promise<Usuario | null> => {
    const salvo = obterUsuarioSalvo()
    if (salvo?.id) {
      try {
        const atualizado = await api.get<Usuario>(`/usuarios/${salvo.id}`)
        salvarUsuarioSessao(atualizado)
        return atualizado
      } catch {
        // Se o ID salvo não existir mais no banco, tenta buscar da lista geral
      }
    }

    const todos = await api.get<Usuario[]>("/usuarios")
    if (todos.length > 0) {
      salvarUsuarioSessao(todos[0])
      return todos[0]
    }

    return null
  },
}
