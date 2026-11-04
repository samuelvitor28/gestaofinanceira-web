import { CheckCircle2, Info, TriangleAlert, XCircle } from "lucide-react"
import { Toaster, toast } from "sonner"

// Renderize uma única vez na raiz da aplicação
export function AppToaster() {
  return (
    <Toaster
      position="bottom-right"
      duration={3500}
      icons={{
        success: <CheckCircle2 className="size-5 text-emerald-500" aria-hidden />,
        error: <XCircle className="size-5 text-red-500" aria-hidden />,
        warning: <TriangleAlert className="size-5 text-amber-500" aria-hidden />,
        info: <Info className="size-5 text-sky-500" aria-hidden />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "!flex !cursor-pointer !items-start !gap-3 !rounded-xl !border !border-l-4 !border-border !bg-card !p-4 !text-card-foreground !shadow-lg",
          title: "!text-sm !font-semibold",
          description: "!text-sm !text-muted-foreground",
          icon: "!mt-0.5 !size-5",
          success: "!border-l-emerald-500",
          error: "!border-l-red-500",
          warning: "!border-l-amber-500",
          info: "!border-l-sky-500",
        },
      }}
    />
  )
}

type ToastType = "success" | "error" | "warning" | "info"

function show(type: ToastType, message: string, description?: string) {
  // Fecha o toast ao clicar nele
  const id = toast[type](message, {
    description,
    onClick: () => toast.dismiss(id),
  })
  return id
}

// Funções para disparar o toast em qualquer lugar
export const showToast = {
  success: (message: string, description?: string) =>
    show("success", message, description),
  error: (message: string, description?: string) =>
    show("error", message, description),
  warning: (message: string, description?: string) =>
    show("warning", message, description),
  info: (message: string, description?: string) =>
    show("info", message, description),
}