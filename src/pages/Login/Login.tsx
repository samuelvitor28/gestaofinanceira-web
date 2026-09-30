import { type FormEvent, useState } from "react"
import { Link } from "react-router-dom"
import { AlertCircle, Loader2, Wallet } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import "./Login.css"

export function Login() {
  const [username, setUsername] = useState("")
  const [senha, setSenha] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // TODO: integrar com o backend via services/authService.ts assim que o
      // endpoint de autenticação estiver definido. Ex:
      // await authService.login({ username, senha })
      // e então redirecionar para /dashboard.
    } catch {
      setError("Não foi possível entrar. Verifique suas credenciais e tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-cartao">
        <aside className="auth-painel">
          <div className="auth-logo">
            <Wallet className="auth-painel__icone" aria-hidden />
            <h2>Gestão Financeira</h2>
          </div>   
          <h2 className="auth-painel__titulo">Bem-vindo de volta!</h2>
          <p className="auth-painel__texto">
            Estamos felizes em te ver aqui novamente.
          </p>
        </aside>

        <div className="auth-formulario">
          <div className="auth-formulario__cabecalho">
            <h1 className="auth-formulario__titulo">Entrar</h1>
            <p className="auth-formulario__subtitulo">
              Acesse sua conta com seu usuário e senha.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" aria-hidden />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="auth-field">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                name="username"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                name="senha"
                type="password"
                autoComplete="current-password"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                required
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="size-4 animate-spin" aria-hidden />}
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <p className="auth-footer-text">
            Ainda não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
          </p>
        </div>
      </div>
    </div>
  )
}