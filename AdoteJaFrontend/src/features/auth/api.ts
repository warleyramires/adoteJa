import { api } from '../../lib/api'
import type { LoginRequest, LoginResponse } from '../../types'

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/users/login', data)
  return response.data
}
