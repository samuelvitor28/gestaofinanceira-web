import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react"

export type Tema = "claro" | "escuro"

const CHAVE_TEMA = "tema"

interface ContextoTemaValor {
  tema: Tema
  alternarTema: () => void
}

const ContextoTema = createContext<ContextoTemaValor | null>(null)

function obterTemaInicial(): Tema {
  try {
    const salvo = localStorage.getItem(CHAVE_TEMA)
    if (salvo === "claro" || salvo === "escuro") return salvo
  } catch {
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "escuro"
    : "claro"
}

export function ProvedorTema({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>(obterTemaInicial)

  useLayoutEffect(() => {
    const raiz = document.documentElement
    raiz.dataset.tema = tema
    raiz.classList.toggle("dark", tema === "escuro")
    try {
      localStorage.setItem(CHAVE_TEMA, tema)
    } catch {
    }
  }, [tema])

  function alternarTema() {
    setTema((atual) => (atual === "escuro" ? "claro" : "escuro"))
  }

  return (
    <ContextoTema.Provider value={{ tema, alternarTema }}>
      {children}
    </ContextoTema.Provider>
  )
}

export function useTema() {
  const contexto = useContext(ContextoTema)
  if (!contexto) {
    throw new Error("useTema deve ser usado dentro de ProvedorTema")
  }
  return contexto
}