import { useMemo, useState } from "react"
import { Loader2, Plus, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { AppLayout } from "@/layouts/AppLayout"
import { cn } from "@/lib/utils"
import "./Transacoes.css"

// TODO: substituir por dados vindos de services/transacaoService.ts.
// Os tipos de transação ("receita" | "despesa") devem respeitar o enum
// definido pelo backend — não inventar valores diferentes.
type TipoTransacao = "receita" | "despesa"

interface Transacao {
  id: string
  descricao: string
  categoria: string
  conta: string
  data: string
  valor: number
  tipo: TipoTransacao
}

interface Conta {
  id: string
  nome: string
}

interface NovaTransacaoPayload {
  descricao: string
  valor: number
  categoria: string
  tipo: TipoTransacao
  contaId: string
  data: string // formato ISO: yyyy-mm-dd
}

interface ErrosFormulario {
  descricao?: string
  valor?: string
  categoria?: string
  conta?: string
  data?: string
}

const transacoesMock: Transacao[] = [
  { id: "1", descricao: "Salário", categoria: "Salário", conta: "Conta salário", data: "05/09/2026", valor: 5200, tipo: "receita" },
  { id: "2", descricao: "Supermercado", categoria: "Alimentação", conta: "Nubank", data: "08/09/2026", valor: -412.3, tipo: "despesa" },
  { id: "3", descricao: "Uber", categoria: "Transporte", conta: "Nubank", data: "10/09/2026", valor: -58.9, tipo: "despesa" },
  { id: "4", descricao: "Freelance", categoria: "Investimentos", conta: "Inter", data: "12/09/2026", valor: 900, tipo: "receita" },
  { id: "5", descricao: "Aluguel", categoria: "Moradia", conta: "Banco do Brasil", data: "15/09/2026", valor: -1200, tipo: "despesa" },
]

// TODO: substituir por categorias vindas da API (ex.: categoriaService.listar()).
const categoriasMock = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Saúde",
  "Educação",
  "Lazer",
  "Salário",
  "Investimentos",
  "Outros",
]

// TODO: substituir pelas contas do usuário logado (ex.: contaService.listarDoUsuario()).
const contasMock: Conta[] = [
  { id: "1", nome: "Conta salário" },
  { id: "2", nome: "Nubank" },
  { id: "3", nome: "Inter" },
  { id: "4", nome: "Banco do Brasil" },
]

const DESCRICAO_MAX = 100

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
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

// Converte yyyy-mm-dd para dd/mm/yyyy sem passar por Date (evita bug de fuso).
function formatarDataIso(dataIso: string) {
  const [ano, mes, dia] = dataIso.split("-")
  return `${dia}/${mes}/${ano}`
}

// TODO: trocar por chamada real, ex.: transacaoService.criar(payload).
function criarTransacaoNaApi(payload: NovaTransacaoPayload): Promise<Transacao> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const conta = contasMock.find((item) => item.id === payload.contaId)
      resolve({
        id: crypto.randomUUID(),
        descricao: payload.descricao,
        categoria: payload.categoria,
        conta: conta?.nome ?? "Não informada",
        data: formatarDataIso(payload.data),
        tipo: payload.tipo,
        valor: payload.tipo === "despesa" ? -payload.valor : payload.valor,
      })
    }, 1200)
  })
}

export function Transacoes() {
  const [busca, setBusca] = useState("")
  const [transacoes, setTransacoes] = useState<Transacao[]>(transacoesMock)

  const [modalAberto, setModalAberto] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [descricao, setDescricao] = useState("")
  const [valor, setValor] = useState("")
  const [categoria, setCategoria] = useState("")
  const [contaId, setContaId] = useState("")
  const [data, setData] = useState(dataDeHojeIso())
  const [tipo, setTipo] = useState<TipoTransacao>("despesa")
  const [erros, setErros] = useState<ErrosFormulario>({})

  const contaSelecionada = contasMock.find((conta) => conta.id === contaId)

  const transacoesFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    if (!termo) return transacoes
    return transacoes.filter((transacao) =>
      [transacao.descricao, transacao.categoria, transacao.conta]
        .join(" ")
        .toLowerCase()
        .includes(termo)
    )
  }, [busca, transacoes])

  function limparFormulario() {
    setDescricao("")
    setValor("")
    setCategoria("")
    setContaId("")
    setData(dataDeHojeIso())
    setTipo("despesa")
    setErros({})
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

  async function salvarTransacao() {
    // Trava contra clique duplo antes mesmo do re-render do botão desabilitado.
    if (salvando) return
    if (!validarFormulario()) return

    setSalvando(true)
    try {
      const novaTransacao = await criarTransacaoNaApi({
        descricao: descricao.trim(),
        categoria,
        tipo,
        contaId,
        data,
        valor: converterValorParaNumero(valor),
      })
      setTransacoes((anteriores) => [novaTransacao, ...anteriores])
      setModalAberto(false)
      limparFormulario()
    } catch (erro) {
      // TODO: exibir feedback de erro (toast) quando a API estiver integrada.
      console.error("Erro ao salvar transação", erro)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <AppLayout title="Transações" subtitle="Visualize e gerencie suas transações">
      <div className="transacoes-toolbar">
        <div className="transacoes-search">
          <Search className="size-4" aria-hidden />
          <Input
            placeholder="Buscar por descrição, categoria ou conta"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
          />
        </div>

        <Button onClick={abrirModal}>
          <Plus className="size-4" aria-hidden />
          Nova transação
        </Button>
      </div>

      <Card>
        <CardContent>
          {transacoesFiltradas.length === 0 ? (
            <div className="transacoes-empty">
              <p>Nenhuma transação encontrada.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Conta</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transacoesFiltradas.map((transacao) => (
                  <TableRow key={transacao.id}>
                    <TableCell>{transacao.descricao}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{transacao.categoria}</Badge>
                    </TableCell>
                    <TableCell>{transacao.conta}</TableCell>
                    <TableCell>{transacao.data}</TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-medium",
                        transacao.tipo === "receita"
                          ? "transacoes-value--positive"
                          : "transacoes-value--negative"
                      )}
                    >
                      {transacao.valor > 0 ? "+" : ""}
                      {formatarMoeda(transacao.valor)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={modalAberto}
        onOpenChange={(aberto) => {
          if (!aberto) fecharModal()
        }}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader className="transacoes-modal-header">
            <DialogTitle>Nova transação</DialogTitle>
            <DialogDescription>
              Preencha os dados abaixo para registrar uma nova transação.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Tipo</Label>
              <RadioGroup
                value={tipo}
                onValueChange={(valorSelecionado) =>
                  setTipo(valorSelecionado as TipoTransacao)
                }
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
                onChange={(event) => setDescricao(event.target.value)}
              />
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-destructive">
                  {erros.descricao ?? ""}
                </p>
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
                  onChange={(event) =>
                    setValor(sanitizarValor(event.target.value))
                  }
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
                  onChange={(event) => setData(event.target.value)}
                />
                {erros.data && (
                  <p className="text-sm text-destructive">{erros.data}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select
                  value={categoria}
                  onValueChange={setCategoria}
                  disabled={salvando}
                >
                  <SelectTrigger
                    id="categoria"
                    className="w-full"
                    aria-invalid={!!erros.categoria}
                  >
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriasMock.map((nomeCategoria) => (
                      <SelectItem key={nomeCategoria} value={nomeCategoria}>
                        {nomeCategoria}
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
                <Select
                  value={contaId}
                  onValueChange={setContaId}
                  disabled={salvando}
                >
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
                    {contasMock.map((conta) => (
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
            <Button
              type="button"
              variant="outline"
              onClick={fecharModal}
              disabled={salvando}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={salvarTransacao} disabled={salvando}>
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
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}