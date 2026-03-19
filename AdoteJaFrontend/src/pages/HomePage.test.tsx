import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HomePage } from './HomePage'

vi.mock('../contexts/AuthContext', () => ({
  useAuthContext: vi.fn(),
}))

vi.mock('../assets/andrew-s-ouo1hbizWwo-unsplash.jpg', () => ({ default: 'img1.jpg' }))
vi.mock('../assets/veronika-jorjobert-27w3ULIIJfI-unsplash.jpg', () => ({ default: 'img2.jpg' }))
vi.mock('../assets/alvan-nee-T-0EW-SEbsE-unsplash.jpg', () => ({ default: 'img3.jpg' }))
vi.mock('../assets/mia-anderson-2k6v10Y2dIg-unsplash.jpg', () => ({ default: 'img4.jpg' }))
vi.mock('../assets/sebastian-coman-travel-Kt5tyYM_uas-unsplash.jpg', () => ({ default: 'img5.jpg' }))

import { useAuthContext } from '../contexts/AuthContext'

function renderHomePage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  )
}

describe('HomePage — botão Quero adotar', () => {
  beforeEach(() => vi.clearAllMocks())

  it('exibe "Quero adotar" quando usuário não está logado', () => {
    vi.mocked(useAuthContext).mockReturnValue({
      isAuthenticated: false, user: null, isAdmin: false, isMember: false,
      login: vi.fn(), logout: vi.fn(),
    })

    renderHomePage()

    expect(screen.getByText('Quero adotar')).toBeInTheDocument()
  })

  it('oculta "Quero adotar" quando usuário está logado', () => {
    vi.mocked(useAuthContext).mockReturnValue({
      isAuthenticated: true,
      user: { id: 1, nome: 'João', email: 'joao@test.com', role: 'ROLE_CUSTOMER' },
      isAdmin: false, isMember: false, login: vi.fn(), logout: vi.fn(),
    })

    renderHomePage()

    expect(screen.queryByText('Quero adotar')).not.toBeInTheDocument()
  })
})

describe('HomePage — CTA Criar minha conta', () => {
  beforeEach(() => vi.clearAllMocks())

  it('exibe "Criar minha conta" quando não logado', () => {
    vi.mocked(useAuthContext).mockReturnValue({
      isAuthenticated: false, user: null, isAdmin: false, isMember: false,
      login: vi.fn(), logout: vi.fn(),
    })

    renderHomePage()

    expect(screen.getByText('Criar minha conta')).toBeInTheDocument()
  })

  it('oculta "Criar minha conta" quando logado', () => {
    vi.mocked(useAuthContext).mockReturnValue({
      isAuthenticated: true,
      user: { id: 1, nome: 'João', email: 'joao@test.com', role: 'ROLE_CUSTOMER' },
      isAdmin: false, isMember: false, login: vi.fn(), logout: vi.fn(),
    })

    renderHomePage()

    expect(screen.queryByText('Criar minha conta')).not.toBeInTheDocument()
  })
})
