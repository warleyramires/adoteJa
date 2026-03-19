import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { usePet, usePets } from './usePets'
import * as petsApi from '../api'

vi.mock('../api')

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('usePets', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retorna lista de pets quando API responde com sucesso', async () => {
    const mockPage = {
      content: [{ id: 1, nome: 'Rex', disponivel: true }],
      totalElements: 1, totalPages: 1, number: 0, size: 10,
    }
    vi.mocked(petsApi.fetchPets).mockResolvedValue(mockPage as any)

    const { result } = renderHook(() => usePets(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.content[0].nome).toBe('Rex')
  })
})

describe('usePet', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retorna pet por id quando API responde com sucesso', async () => {
    const mockPet = { id: 1, nome: 'Rex', disponivel: true }
    vi.mocked(petsApi.fetchPetById).mockResolvedValue(mockPet as any)

    const { result } = renderHook(() => usePet(1), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.nome).toBe('Rex')
  })

  it('não dispara a query quando id é 0', () => {
    const { result } = renderHook(() => usePet(0), { wrapper: createWrapper() })

    expect(result.current.fetchStatus).toBe('idle')
    expect(petsApi.fetchPetById).not.toHaveBeenCalled()
  })

  it('fica em estado de erro quando API retorna erro', async () => {
    vi.mocked(petsApi.fetchPetById).mockRejectedValue(new Error('404'))

    const { result } = renderHook(() => usePet(99), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
