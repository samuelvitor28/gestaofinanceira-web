import { Route, Routes } from "react-router-dom"

import { Cadastro } from "@/pages/Cadastro/Cadastro"
import { Categorias } from "@/pages/Categorias/Categorias"
import { Contas } from "@/pages/Contas/Contas"
import { Dashboard } from "@/pages/Dashboard/Dashboard"
import { Landing } from "@/pages/Landing/Landing"
import { Login } from "@/pages/Login/Login"
import { Transacoes } from "@/pages/Transacoes/Transacoes"

// TODO: quando a autenticação com o backend estiver definida, envolver as
// rotas /dashboard, /transacoes, /contas e /categorias em um componente de
// rota protegida (ex: <RequireAuth>) que redireciona para /login se o
// usuário não estiver autenticado.
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/transacoes" element={<Transacoes />} />
      <Route path="/contas" element={<Contas />} />
      <Route path="/categorias" element={<Categorias />} />
    </Routes>
  )
}