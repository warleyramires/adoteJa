import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { PetDetailPage } from './PetDetailPage'

vi.mock('../contexts/AuthContext', () => ({
  useAuthContext: vi.fn(),
}))

vi.mock('../features/pets/hooks/usePets', () => ({
  usePet: vi.fn(),
}))

vi.mock('../features/adocao/hooks/useSolicitacoes', () => ({
  useCriarSolicitacao: vi.fn(),
}))

vi.mock('../contexts/ToastContext', () => ({
  useToast: () => ({ showToast: vi.fn() }),
}))

vi.mock('../lib/api', () => ({
  api: {},
  getApiError: vi.fn(() => ({ status: 500, message: 'Erro inesperado.', timestamp: '' })),
}))

import { useAuthContext } from '../contexts/AuthContext'
import { usePet } from '../features/pets/hooks/usePets'
import { useCriarSolicitacao } from '../features/adocao/hooks/useSolicitacoes'

const mockPetDisponivel = {
  id: 1, nome: 'Rex', descricao: 'Cão amigável', imagemUrl: null, disponivel: true,
  saude: { vacinado: true, castrado: false, vermifugado: true, historicoSaude: null },
  caracteristica: { especie: 'CAO', porte: 'MEDIO', sexo: 'MACHO', cor: null, raca: null },
}

function renderPetDetail(petId = '1') {
  return render(
    <MemoryRouter initialEntries={[`/pets/${petId}`]}>
      <Routes>
        <Route path="/pets/:id" element={<PetDetailPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('PetDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useCriarSolicitacao).mockReturnValue({
      mutateAsync: vi.fn(), isPending: false, isSuccess: false, isError: false,
    } as any)
  })

  it('exibe botão "Solicitar adoção" quando logado e pet disponível', () => {
    vi.mocked(useAuthContext).mockReturnValue({
      isAuthenticated: true,
      user: { id: 1, nome: 'João', email: 'joao@test.com', role: 'ROLE_CUSTOMER' },
      isAdmin: false, isMember: false, login: vi.fn(), logout: vi.fn(),
    })
    vi.mocked(usePet).mockReturnValue({
      data: mockPetDisponivel, isLoading: false, isError: false,
    } as any)

    renderPetDetail()

    expect(screen.getByText('Solicitar adoção')).toBeInTheDocument()
    expect(screen.queryByText('Entrar')).not.toBeInTheDocument()
  })

  it('exibe "Entrar" e "Criar conta" quando não logado e pet disponível', () => {
    vi.mocked(useAuthContext).mockReturnValue({
      isAuthenticated: false, user: null, isAdmin: false, isMember: false,
      login: vi.fn(), logout: vi.fn(),
    })
    vi.mocked(usePet).mockReturnValue({
      data: mockPetDisponivel, isLoading: false, isError: false,
    } as any)

    renderPetDetail()

    // O header também exibe "Entrar", por isso esperamos 2 ocorrências (Header + CTA do pet)
    expect(screen.getAllByText('Entrar')).toHaveLength(2)
    expect(screen.getByText('Criar conta')).toBeInTheDocument()
    expect(screen.queryByText('Solicitar adoção')).not.toBeInTheDocument()
  })

  it('não exibe CTA quando pet está indisponível', () => {
    vi.mocked(useAuthContext).mockReturnValue({
      isAuthenticated: true,
      user: { id: 1, nome: 'João', email: 'joao@test.com', role: 'ROLE_CUSTOMER' },
      isAdmin: false, isMember: false, login: vi.fn(), logout: vi.fn(),
    })
    vi.mocked(usePet).mockReturnValue({
      data: { ...mockPetDisponivel, disponivel: false }, isLoading: false, isError: false,
    } as any)

    renderPetDetail()

    expect(screen.queryByText('Solicitar adoção')).not.toBeInTheDocument()
    expect(screen.queryByText('Entrar')).not.toBeInTheDocument()
  })
})
