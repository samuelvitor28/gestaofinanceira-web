export interface Usuario {
  nome: string
  username: string
  email: string
  telefone?: string
  urlAvatar?: string
}

export const usuarioMock: Usuario = {
  nome: "Samuel Vitor",
  username: "samuelvitor",
  email: "samuel@email.com",
  telefone: "(31) 99999-9999",
}

export function obterIniciais(nome: string) {
  const partes = nome.trim().split(/\s+/)
  const primeira = partes[0]?.[0] ?? ""
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : ""
  return (primeira + ultima).toUpperCase()
}