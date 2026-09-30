import { type FormEvent, useState } from "react"
import { Link } from "react-router-dom"
import { AlertCircle, Loader2, Wallet } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CadastroForm {
  nome: string
  username: string
  email: string
  telefone: string
  senha: string
  confirmarSenha: string
}

const initialForm: CadastroForm = {
  nome: "",
  username: "",
  email: "",
  telefone: "",
  senha: "",
  confirmarSenha: "",
}

export function Cadastro() {
  const [form, setForm] = useState<CadastroForm>(initialForm)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function updateField<K extends keyof CadastroForm>(field: K, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (form.senha !== form.confirmarSenha) {
      setError("As senhas não coincidem.")
      return
    }

    setIsLoading(true)
    try {
      // TODO: integrar com o backend via services/authService.ts assim que o
      // endpoint de cadastro estiver definido. Ex:
      // await authService.cadastrar(form)
      // e então redirecionar para /login ou autenticar direto.
    } catch {
      setError("Não foi possível concluir o cadastro. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-cartao auth-cartao--largo">
        <aside className="auth-painel">
          <div className="auth-logo">
            <Wallet className="auth-painel__icone" aria-hidden />
            <h2>Gestão Financeira</h2>
          </div> 
          <h2 className="auth-painel__titulo">Comece agora!</h2>
          <p className="auth-painel__texto">
            Crie sua conta e organize sua vida financeira em um só lugar.
          </p>
        </aside>

        <div className="auth-formulario">
          <div className="auth-formulario__cabecalho">
            <h1 className="auth-formulario__titulo">Criar conta</h1>
            <p className="auth-formulario__subtitulo">
              Preencha os dados abaixo para se cadastrar.
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
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                autoComplete="name"
                value={form.nome}
                onChange={(event) => updateField("nome", event.target.value)}
                required
              />
            </div>

            <div className="auth-form-row">
              <div className="auth-field">
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  autoComplete="username"
                  value={form.username}
                  onChange={(event) => updateField("username", event.target.value)}
                  required
                />
              </div>
              <div className="auth-field">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  type="tel"
                  autoComplete="tel"
                  value={form.telefone}
                  onChange={(event) => updateField("telefone", event.target.value)}
                />
              </div>
            </div>

            <div className="auth-field">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                required
              />
            </div>

            <div className="auth-form-row">
              <div className="auth-field">
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  autoComplete="new-password"
                  value={form.senha}
                  onChange={(event) => updateField("senha", event.target.value)}
                  required
                />
              </div>
              <div className="auth-field">
                <Label htmlFor="confirmarSenha">Confirmar senha</Label>
                <Input
                  id="confirmarSenha"
                  type="password"
                  autoComplete="new-password"
                  value={form.confirmarSenha}
                  onChange={(event) =>
                    updateField("confirmarSenha", event.target.value)
                  }
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="size-4 animate-spin" aria-hidden />}
              {isLoading ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>

          <p className="auth-footer-text">
            Já tem uma conta? <Link to="/login">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  )
}