import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { CadastroPage } from '../pages/CadastroPage'
import { PetsPage } from '../pages/PetsPage'
import { PetDetailPage } from '../pages/PetDetailPage'
import { MinhasSolicitacoesPage } from '../pages/MinhasSolicitacoesPage'
import { MinhaContaPage } from '../pages/MinhaContaPage'
import { AdminPetsPage } from '../pages/admin/AdminPetsPage'
import { AdminSolicitacoesPage } from '../pages/admin/AdminSolicitacoesPage'
import { AdminFuncionariosPage } from '../pages/admin/AdminFuncionariosPage'
import { SobrePage } from '../pages/SobrePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { PrivateRoute, AdminRoute } from './PrivateRoute'

export const router = createBrowserRouter([
  { path: '/',         element: <HomePage /> },
  { path: '/login',    element: <LoginPage /> },
  { path: '/cadastro', element: <CadastroPage /> },
  { path: '/pets',     element: <PetsPage /> },
  { path: '/pets/:id', element: <PetDetailPage /> },
  { path: '/sobre', element: <SobrePage /> },

  // Rotas que exigem login (qualquer usuário autenticado)
  {
    element: <PrivateRoute />,
    children: [
      { path: '/minhas-solicitacoes', element: <MinhasSolicitacoesPage /> },
      { path: '/minha-conta',         element: <MinhaContaPage /> },
    ],
  },

  // Rotas que exigem MEMBER ou ADMINISTRATOR
  {
    element: <AdminRoute />,
    children: [
      { path: '/admin/pets',          element: <AdminPetsPage /> },
      { path: '/admin/solicitacoes',  element: <AdminSolicitacoesPage /> },
      { path: '/admin/funcionarios',  element: <AdminFuncionariosPage /> },
    ],
  },

  { path: '*', element: <NotFoundPage /> },
])
