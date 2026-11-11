export interface Usuario {
  id: string
  nome: string
  username: string
  email: string
  criadoEm?: string
  telefone?: string
  urlAvatar?: string
}

const STORAGE_KEY_USUARIO = "gestaofinanceira:usuario"

export const usuarioMock: Usuario = {
  id: "",
  nome: "Samuel Vitor",
  username: "samuelvitor",
  email: "samuel@email.com",
  telefone: "(31) 99999-9999",
}

export function obterUsuarioSalvo(): Usuario | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USUARIO)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Usuario
    if (!parsed?.id) return null
    return parsed
  } catch {
    return null
  }
}

export function salvarUsuarioSessao(usuario: Usuario) {
  localStorage.setItem(STORAGE_KEY_USUARIO, JSON.stringify(usuario))
}

export function limparUsuarioSessao() {
  localStorage.removeItem(STORAGE_KEY_USUARIO)
}

export function obterIniciais(nome: string) {
  const partes = nome.trim().split(/\s+/)
  const primeira = partes[0]?.[0] ?? ""
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : ""
  return (primeira + ultima).toUpperCase()
}