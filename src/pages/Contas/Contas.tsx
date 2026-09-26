import { type FormEvent, useState } from "react"
import { Trash2, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
}

const contasIniciais: Conta[] = [
  { id: "1", nome: "Nubank" },
  { id: "2", nome: "Banco do Brasil" },
  { id: "3", nome: "Carteira" },
]

export function Contas() {
  const [contas, setContas] = useState<Conta[]>(contasIniciais)
  const [novaConta, setNovaConta] = useState("")

  function handleAdicionar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nome = novaConta.trim()
    if (!nome) return

    // TODO: substituir por chamada a services/contaService.ts (POST /contas)
    // quando o endpoint estiver disponível. Por ora, apenas atualiza o
    // estado local.
    setContas((prev) => [...prev, { id: crypto.randomUUID(), nome }])
    setNovaConta("")
  }

  function handleRemover(id: string) {
    // TODO: substituir por chamada a services/contaService.ts (DELETE /contas/:id).
    setContas((prev) => prev.filter((conta) => conta.id !== id))
  }

  return (
    <AppLayout title="Contas" subtitle="Origens financeiras usadas para organizar suas transações">
      <Card className="contas-form-card">
        <CardHeader>
          <CardTitle>Nova conta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdicionar}>
            <div className="contas-form-field">
              <Label htmlFor="nomeConta">Nome da conta</Label>
              <Input
                id="nomeConta"
                placeholder="Ex: Nubank, Carteira, Conta salário"
                value={novaConta}
                onChange={(event) => setNovaConta(event.target.value)}
              />
            </div>
            <Button type="submit">Salvar</Button>
          </form>
        </CardContent>
      </Card>

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
    </AppLayout>
  )
}
