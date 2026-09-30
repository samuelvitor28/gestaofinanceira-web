import { Route, Routes } from "react-router-dom"

import { Cadastro } from "@/pages/Cadastro/Cadastro"
import { Categorias } from "@/pages/Categorias/Categorias"
import { Contas } from "@/pages/Contas/Contas"
import { Dashboard } from "@/pages/Dashboard/Dashboard"
import { Landing } from "@/pages/Landing/Landing"
import { Login } from "@/pages/Login/Login"
import { Transacoes } from "@/pages/Transacoes/Transacoes"
import { LayoutPublico } from "@/layouts/LayoutPublico"

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<LayoutPublico />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Route>

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/transacoes" element={<Transacoes />} />
      <Route path="/contas" element={<Contas />} />
      <Route path="/categorias" element={<Categorias />} />
    </Routes>
  )
}