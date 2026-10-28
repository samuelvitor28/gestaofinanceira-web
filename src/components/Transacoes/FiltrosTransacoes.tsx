import { FilterX, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  TODOS,
  criarFiltrosVazios,
  formatarMoeda,
  temFiltrosAtivos,
} from "@/lib/transacoes"
import type { Conta, FiltrosTransacao } from "@/types/transacao"

interface FiltrosTransacoesProps {
  filtros: FiltrosTransacao
  aoMudar: (filtros: FiltrosTransacao) => void
  categorias: string[]
  contas: Conta[]
  valorMaximo: number // valor da maior transação existente
}

export function FiltrosTransacoes({
  filtros,
  aoMudar,
  categorias,
  contas,
  valorMaximo,
}: FiltrosTransacoesProps) {
  function atualizar(parcial: Partial<FiltrosTransacao>) {
    aoMudar({ ...filtros, ...parcial })
  }

  const [minimoFaixa, maximoFaixa] = filtros.faixaValor ?? [0, valorMaximo]
  const valorSlider: [number, number] = [
    Math.min(minimoFaixa, valorMaximo),
    Math.min(maximoFaixa, valorMaximo),
  ]
  const passo = Math.max(1, Math.round(valorMaximo / 200))

  return (
    <Card>
      <CardContent className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="grid gap-2 lg:col-span-2">
            <Label htmlFor="filtro-busca">Descrição</Label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id="filtro-busca"
                className="pl-9"
                placeholder="Buscar por descrição"
                value={filtros.busca}
                onChange={(evento) => atualizar({ busca: evento.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="filtro-tipo">Tipo</Label>
            <Select
              value={filtros.tipo}
              onValueChange={(selecionado) =>
                atualizar({ tipo: selecionado as FiltrosTransacao["tipo"] })
              }
            >
              <SelectTrigger id="filtro-tipo" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TODOS}>Todos</SelectItem>
                <SelectItem value="receita">Receitas</SelectItem>
                <SelectItem value="despesa">Despesas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={!temFiltrosAtivos(filtros)}
              onClick={() => aoMudar(criarFiltrosVazios())}
            >
              <FilterX className="size-4" aria-hidden />
              Limpar filtros
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="grid gap-2">
            <Label htmlFor="filtro-categoria">Categoria</Label>
            <Select
              value={filtros.categoria}
              onValueChange={(selecionada) => atualizar({ categoria: selecionada })}
            >
              <SelectTrigger id="filtro-categoria" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TODOS}>Todas as categorias</SelectItem>
                {categorias.map((categoria) => (
                  <SelectItem key={categoria} value={categoria}>
                    {categoria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="filtro-conta">Conta</Label>
            <Select
              value={filtros.contaId}
              onValueChange={(selecionada) => atualizar({ contaId: selecionada })}
            >
              <SelectTrigger id="filtro-conta" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TODOS}>Todas as contas</SelectItem>
                {contas.map((conta) => (
                  <SelectItem key={conta.id} value={conta.id}>
                    {conta.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="filtro-data-inicio">De</Label>
            <Input
              id="filtro-data-inicio"
              type="date"
              value={filtros.dataInicio}
              max={filtros.dataFim || undefined}
              onChange={(evento) => atualizar({ dataInicio: evento.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="filtro-data-fim">Até</Label>
            <Input
              id="filtro-data-fim"
              type="date"
              value={filtros.dataFim}
              min={filtros.dataInicio || undefined}
              onChange={(evento) => atualizar({ dataFim: evento.target.value })}
            />
          </div>
        </div>

        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <Label>Faixa de valor</Label>
            <span className="text-sm font-medium tabular-nums text-muted-foreground">
              {formatarMoeda(valorSlider[0])} – {formatarMoeda(valorSlider[1])}
            </span>
          </div>
          <Slider
            min={0}
            max={valorMaximo}
            step={passo}
            value={valorSlider}
            disabled={valorMaximo === 0}
            onValueChange={(faixa) => atualizar({ faixaValor: [faixa[0], faixa[1]] })}
          />
        </div>
      </CardContent>
    </Card>
  )
}