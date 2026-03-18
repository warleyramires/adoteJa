import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { CadastroPage } from '../pages/CadastroPage'
import { PetsPage } from '../pages/PetsPage'
import { NotFoundPage } from '../pages/NotFoundPage'

export const router = createBrowserRouter([
  { path: '/',         element: <HomePage /> },
  { path: '/login',    element: <LoginPage /> },
  { path: '/cadastro', element: <CadastroPage /> },
  { path: '/pets',     element: <PetsPage /> },
  { path: '*',         element: <NotFoundPage /> },
])
