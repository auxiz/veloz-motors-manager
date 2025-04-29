
import * as React from "react"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

// Layout
import { MainLayout } from "./components/layout/MainLayout"

// Pages
import Auth from "./pages/Auth"
import Dashboard from "./pages/Dashboard"
import Estoque from "./pages/Estoque"
import Vendas from "./pages/Vendas"
import Clientes from "./pages/Clientes"
import Financeiro from "./pages/Financeiro"
import Relatorios from "./pages/Relatorios"
import Configuracoes from "./pages/Configuracoes"
import NotFound from "./pages/NotFound"
import { AuthGuard } from "./components/auth/AuthGuard"

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/auth" replace />} />
            <Route path="/auth" element={<Auth />} />
            
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={
                <AuthGuard>
                  <Dashboard />
                </AuthGuard>
              } />
              <Route path="/estoque" element={
                <AuthGuard>
                  <Estoque />
                </AuthGuard>
              } />
              <Route path="/vendas" element={
                <AuthGuard allowedRoles={['administrator', 'seller']}>
                  <Vendas />
                </AuthGuard>
              } />
              <Route path="/clientes" element={
                <AuthGuard>
                  <Clientes />
                </AuthGuard>
              } />
              <Route path="/financeiro" element={
                <AuthGuard allowedRoles={['administrator', 'financial']}>
                  <Financeiro />
                </AuthGuard>
              } />
              <Route path="/relatorios" element={
                <AuthGuard allowedRoles={['administrator', 'seller', 'financial']}>
                  <Relatorios />
                </AuthGuard>
              } />
              <Route path="/configuracoes" element={
                <AuthGuard>
                  <Configuracoes />
                </AuthGuard>
              } />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
