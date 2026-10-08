import { type FormEvent, useState } from "react"
import { Loader2, Plus, Trash2, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AppLayout } from "@/layouts/AppLayout"
import "./Contas.css"

// Uma "Conta" aqui é apenas uma origem financeira usada para organizar
// transações (ex: Nubank, Carteira) — nunca dados sensíveis como número de
// cartão, CVV, agência ou senha bancária.
interface Conta {
  id: string
  nome: string
  usuarioId: string
}

interface NovaContaPayload {
  nome: string
  usuarioId: string
}

// TODO: substituir pelo id do usuário logado (ex.: useAuth().usuario.id).
// Idealmente o backend também deve obter o usuário pelo token e ignorar
// o usuarioId vindo do cliente.
const USUARIO_ID_MOCK = "1"

const NOME_MAX = 50

const contasIniciais: Conta[] = [
  { id: "1", nome: "Nubank", usuarioId: USUARIO_ID_MOCK },
  { id: "2", nome: "Banco do Brasil", usuarioId: USUARIO_ID_MOCK },
  { id: "3", nome: "Carteira", usuarioId: USUARIO_ID_MOCK },
]

// TODO: trocar por chamada real, ex.: contaService.criar(payload) (POST /contas).
function criarContaNaApi(payload: NovaContaPayload): Promise<Conta> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: crypto.randomUUID(),
        nome: payload.nome,
        usuarioId: payload.usuarioId,
      })
    }, 1000)
  })
}

export function Contas() {
  const [contas, setContas] = useState<Conta[]>(contasIniciais)

  const [modalAberto, setModalAberto] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [nome, setNome] = useState("")
  const [erroNome, setErroNome] = useState("")

  function limparFormulario() {
    setNome("")
    setErroNome("")
  }

  function abrirModal() {
    limparFormulario()
    setModalAberto(true)
  }

  function fecharModal() {
    if (salvando) return
    setModalAberto(false)
    limparFormulario()
  }

  function validarFormulario() {
    const nomeLimpo = nome.trim()

    if (!nomeLimpo) {
      setErroNome("Informe o nome da conta.")
      return false
    }

    const nomeDuplicado = contas.some(
      (conta) => conta.nome.trim().toLowerCase() === nomeLimpo.toLowerCase()
    )
    if (nomeDuplicado) {
      setErroNome("Já existe uma conta com esse nome.")
      return false
    }

    setErroNome("")
    return true
  }

  async function handleSalvar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // Trava contra clique duplo antes mesmo do re-render do botão desabilitado.
    if (salvando) return
    if (!validarFormulario()) return

    setSalvando(true)
    try {
      const novaConta = await criarContaNaApi({
        nome: nome.trim(),
        usuarioId: USUARIO_ID_MOCK,
      })
      setContas((anteriores) => [...anteriores, novaConta])
      setModalAberto(false)
      limparFormulario()
    } catch (erro) {
      // TODO: exibir feedback de erro (toast) quando a API estiver integrada.
      console.error("Erro ao salvar conta", erro)
    } finally {
      setSalvando(false)
    }
  }

  function handleRemover(id: string) {
    // TODO: substituir por chamada a services/contaService.ts (DELETE /contas/:id).
    setContas((anteriores) => anteriores.filter((conta) => conta.id !== id))
  }

  return (
    <AppLayout title="Contas" subtitle="Origens financeiras usadas para organizar suas transações">
      <div className="flex justify-end">
        <Button onClick={abrirModal}>
          <Plus className="size-4" aria-hidden />
          Nova conta
        </Button>
      </div>

      {contas.length === 0 ? (
        <p className="contas-empty">Nenhuma conta cadastrada ainda.</p>
      ) : (
        <div className="contas-grid">
          {contas.map((conta) => (
            <div className="conta-card" key={conta.id}>
              <div className="conta-card__info">
                <span className="conta-card__icon">
                  <Wallet className="size-4" aria-hidden />
                </span>
                <span className="conta-card__name">{conta.nome}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Remover ${conta.nome}`}
                onClick={() => handleRemover(conta.id)}
              >
                <Trash2 className="size-4" aria-hidden />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={modalAberto}
        onOpenChange={(aberto) => {
          if (!aberto) fecharModal()
        }}
      >
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSalvar} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Nova conta</DialogTitle>
              <DialogDescription>
                Informe o nome da conta para usá-la ao registrar transações.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-2">
              <Label htmlFor="nomeConta">Nome da conta</Label>
              <Input
                id="nomeConta"
                placeholder="Ex: Nubank, Carteira, Conta salário"
                maxLength={NOME_MAX}
                value={nome}
                disabled={salvando}
                aria-invalid={!!erroNome}
                autoFocus
                onChange={(event) => setNome(event.target.value)}
              />
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-destructive">{erroNome}</p>
                <span className="text-xs text-muted-foreground">
                  {nome.length}/{NOME_MAX}
                </span>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={fecharModal}
                disabled={salvando}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={salvando}>
                {salvando ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Salvando...
                  </>
                ) : (
                  "Salvar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}