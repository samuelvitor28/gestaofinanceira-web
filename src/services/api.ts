const API_BASE_URL = import.meta.env.VITE_API_URL ?? "/api"

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorMessage = `Erro na requisição (${response.status})`
    try {
      const errorData = await response.json()
      if (errorData?.message) {
        errorMessage = errorData.message
      } else if (typeof errorData === "string" && errorData.trim()) {
        errorMessage = errorData
      }
    } catch {
      const text = await response.text().catch(() => "")
      if (text.trim()) {
        errorMessage = text
      }
    }
    throw new ApiError(errorMessage, response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()
  if (!text) {
    return undefined as T
  }

  return JSON.parse(text) as T
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  delete: <T = void>(path: string) => request<T>(path, { method: "DELETE" }),
}
