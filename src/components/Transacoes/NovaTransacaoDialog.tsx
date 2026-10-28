import { useState } from "react"
import { Loader2 } from "lucide-react"

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type {
  Conta,
  NovaTransacaoPayload,
  TipoTransacao,
} from "@/types/transacao"

const DESCRICAO_MAX = 100

interface ErrosFormulario {
  descricao?: string
  valor?: string
  categoria?: string
  conta?: string
  data?: string
}

// Mantém apenas dígitos e uma vírgula, com no máximo 2 casas decimais.
function sanitizarValor(entrada: string) {
  const limpo = entrada.replace(/[^\d,]/g, "")
  const [parteInteira, ...resto] = limpo.split(",")
  if (resto.length === 0) return parteInteira
  return `${parteInteira},${resto.join("").slice(0, 2)}`
}

function converterValorParaNumero(valor: string) {
  return Number(valor.replace(",", "."))
}

// Data local de hoje no formato yyyy-mm-dd (padrão do input type="date").
function dataDeHojeIso() {
  return new Date().toLocaleDateString("sv-SE")
}

interface NovaTransacaoDialogProps {
  aberto: boolean
  aoMudarAberto: (aberto: boolean) => void
  categorias: string[]
  contas: Conta[]
  aoCriar: (payload: NovaTransacaoPayload) => Promise<void>
}

export function NovaTransacaoDialog({
  aberto,
  aoMudarAberto,
  categorias,
  contas,
  aoCriar,
}: NovaTransacaoDialogProps) {
  const [salvando, setSalvando] = useState(false)

  async function lidarComEnvio(payload: NovaTransacaoPayload) {
    // Trava contra clique duplo antes mesmo do re-render do botão desabilitado.
    if (salvando) return

    setSalvando(true)
    try {
      await aoCriar(payload)
      aoMudarAberto(false)
    } catch (erro) {
      // TODO: exibir feedback de erro (toast) quando a API estiver integrada.
      console.error("Erro ao salvar transação", erro)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Dialog
      open={aberto}
      onOpenChange={(proximo) => {
        if (!salvando) aoMudarAberto(proximo)
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="mb-2 border-b pb-4">
          <DialogTitle>Nova transação</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para registrar uma nova transação.
          </DialogDescription>
        </DialogHeader>

        {/* O formulário só existe com o modal aberto, então o estado reseta a cada abertura. */}
        <FormularioTransacao
          salvando={salvando}
          categorias={categorias}
          contas={contas}
          aoEnviar={lidarComEnvio}
          aoCancelar={() => aoMudarAberto(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

interface FormularioTransacaoProps {
  salvando: boolean
  categorias: string[]
  contas: Conta[]
  aoEnviar: (payload: NovaTransacaoPayload) => void
  aoCancelar: () => void
}

function FormularioTransacao({
  salvando,
  categorias,
  contas,
  aoEnviar,
  aoCancelar,
}: FormularioTransacaoProps) {
  const [descricao, setDescricao] = useState("")
  const [valor, setValor] = useState("")
  const [categoria, setCategoria] = useState("")
  const [contaId, setContaId] = useState("")
  const [data, setData] = useState(dataDeHojeIso())
  const [tipo, setTipo] = useState<TipoTransacao>("despesa")
  const [erros, setErros] = useState<ErrosFormulario>({})

  const contaSelecionada = contas.find((conta) => conta.id === contaId)

  function validar() {
    const novosErros: ErrosFormulario = {}

    if (!descricao.trim()) {
      novosErros.descricao = "Informe a descrição."
    }

    const valorNumerico = converterValorParaNumero(valor)
    if (!valor || Number.isNaN(valorNumerico) || valorNumerico <= 0) {
      novosErros.valor = "Informe um valor maior que zero."
    }

    if (!categoria) {
      novosErros.categoria = "Selecione uma categoria."
    }

    if (!contaId) {
      novosErros.conta = "Selecione uma conta."
    }

    if (!data || Number.isNaN(new Date(`${data}T00:00:00`).getTime())) {
      novosErros.data = "Informe uma data válida."
    }

    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  function lidarComSalvar() {
    if (salvando || !validar()) return

    aoEnviar({
      descricao: descricao.trim(),
      categoria,
      tipo,
      contaId,
      data,
      valor: converterValorParaNumero(valor),
    })
  }

  return (
    <>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label>Tipo</Label>
          <RadioGroup
            value={tipo}
            onValueChange={(selecionado) => setTipo(selecionado as TipoTransacao)}
            disabled={salvando}
            className="flex gap-6"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="despesa" id="tipo-despesa" />
              <Label htmlFor="tipo-despesa">Despesa</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="receita" id="tipo-receita" />
              <Label htmlFor="tipo-receita">Receita (ganho)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea
            id="descricao"
            placeholder="Ex.: Compras do mês no supermercado"
            maxLength={DESCRICAO_MAX}
            rows={6}
            className="resize-none"
            value={descricao}
            disabled={salvando}
            aria-invalid={!!erros.descricao}
            onChange={(evento) => setDescricao(evento.target.value)}
          />
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm text-destructive">{erros.descricao ?? ""}</p>
            <span className="text-xs text-muted-foreground">
              {descricao.length}/{DESCRICAO_MAX}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="valor">Valor (R$)</Label>
            <Input
              id="valor"
              inputMode="decimal"
              placeholder="0,00"
              className="w-full"
              value={valor}
              disabled={salvando}
              aria-invalid={!!erros.valor}
              onChange={(evento) => setValor(sanitizarValor(evento.target.value))}
            />
            {erros.valor && (
              <p className="text-sm text-destructive">{erros.valor}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="data">Data da transação</Label>
            <Input
              id="data"
              type="date"
              className="w-full"
              value={data}
              disabled={salvando}
              aria-invalid={!!erros.data}
              onChange={(evento) => setData(evento.target.value)}
            />
            {erros.data && (
              <p className="text-sm text-destructive">{erros.data}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="categoria">Categoria</Label>
            <Select value={categoria} onValueChange={setCategoria} disabled={salvando}>
              <SelectTrigger
                id="categoria"
                className="w-full"
                aria-invalid={!!erros.categoria}
              >
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((nome) => (
                  <SelectItem key={nome} value={nome}>
                    {nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {erros.categoria && (
              <p className="text-sm text-destructive">{erros.categoria}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="conta">Conta</Label>
            <Select value={contaId} onValueChange={setContaId} disabled={salvando}>
              <SelectTrigger
                id="conta"
                className="w-full"
                aria-invalid={!!erros.conta}
              >
                <SelectValue placeholder="Selecione uma conta">
                  {contaSelecionada?.nome}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {contas.map((conta) => (
                  <SelectItem key={conta.id} value={conta.id}>
                    {conta.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {erros.conta && (
              <p className="text-sm text-destructive">{erros.conta}</p>
            )}
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={aoCancelar} disabled={salvando}>
          Cancelar
        </Button>
        <Button type="button" onClick={lidarComSalvar} disabled={salvando}>
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
    </>
  )
}