import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useCriarSolicitacao } from './useSolicitacoes'
import * as adocaoApi from '../api'

vi.mock('../api')

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useCriarSolicitacao', () => {
  beforeEach(() => vi.clearAllMocks())

  it('chama criarSolicitacao com o petId correto', async () => {
    const mockSolicitacao = { id: 1, petId: 10, status: 'PENDENTE' }
    vi.mocked(adocaoApi.criarSolicitacao).mockResolvedValue(mockSolicitacao as any)

    const { result } = renderHook(() => useCriarSolicitacao(), { wrapper: createWrapper() })

    act(() => {
      result.current.mutate(10)
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(adocaoApi.criarSolicitacao).toHaveBeenCalledWith(10, expect.objectContaining({ client: expect.anything() }))
  })

  it('fica em estado de erro quando a API falha', async () => {
    vi.mocked(adocaoApi.criarSolicitacao).mockRejectedValue(new Error('Pet indisponível'))

    const { result } = renderHook(() => useCriarSolicitacao(), { wrapper: createWrapper() })

    act(() => {
      result.current.mutate(10)
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
