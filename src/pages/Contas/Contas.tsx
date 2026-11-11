import { type FormEvent, useEffect, useState } from "react"
import { Loader2, Plus, Trash2, Wallet } from "lucide-react"

import { showToast } from "@/components/Toast/Toast"
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
import { contaService, type Conta } from "@/services/contaService"
import { usuarioService } from "@/services/usuarioService"
import "./Contas.css"

const NOME_MAX = 50

export function Contas() {
  const [contas, setContas] = useState<Conta[]>([])
  const [carregando, setCarregando] = useState(true)
  const [usuarioId, setUsuarioId] = useState<string>("")

  const [modalAberto, setModalAberto] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [nome, setNome] = useState("")
  const [erroNome, setErroNome] = useState("")

  useEffect(() => {
    async function carregarContas() {
      setCarregando(true)
      try {
        const usuario = await usuarioService.obterUsuarioAtivo()
        if (usuario?.id) {
          setUsuarioId(usuario.id)
          const lista = await contaService.listarPorUsuario(usuario.id)
          setContas(lista)
        } else {
          const lista = await contaService.listarTodas()
          setContas(lista)
        }
      } catch (erro) {
        console.error("Erro ao carregar contas", erro)
        showToast.error("Erro ao carregar", "Não foi possível carregar suas contas.")
      } finally {
        setCarregando(false)
      }
    }

    carregarContas()
  }, [])

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

    if (!usuarioId) {
      showToast.error(
        "Usuário não identificado",
        "Cadastre ou entre com um usuário antes de criar uma conta."
      )
      return
    }

    setSalvando(true)
    try {
      const novaConta = await contaService.criar({
        nome: nome.trim(),
        usuarioId,
      })
      setContas((anteriores) => [...anteriores, novaConta])
      setModalAberto(false)
      limparFormulario()
      showToast.success("Conta criada", "A conta foi cadastrada com sucesso.")
    } catch (erro) {
      console.error("Erro ao salvar conta", erro)
      showToast.error("Erro ao salvar", "Não foi possível criar a conta.")
    } finally {
      setSalvando(false)
    }
  }

  async function handleRemover(id: string) {
    try {
      await contaService.deletar(id)
      setContas((anteriores) => anteriores.filter((conta) => conta.id !== id))
      showToast.success("Conta excluída", "A conta foi removida com sucesso.")
    } catch (erro) {
      console.error("Erro ao remover conta", erro)
      showToast.error(
        "Erro ao excluir",
        "Não foi possível remover a conta (verifique se há transações vinculadas)."
      )
    }
  }

  return (
    <AppLayout title="Contas" subtitle="Origens financeiras usadas para organizar suas transações">
      <div className="flex justify-end">
        <Button onClick={abrirModal}>
          <Plus className="size-4" aria-hidden />
          Nova conta
        </Button>
      </div>

      {carregando ? (
        <p className="contas-empty">Carregando contas...</p>
      ) : contas.length === 0 ? (
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