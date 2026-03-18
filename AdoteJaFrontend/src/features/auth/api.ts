import { api } from '../../lib/api'
import type { LoginRequest, LoginResponse, MeResponse } from '../../types'

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/users/login', data)
  return response.data
}

export async function fetchMe(): Promise<MeResponse> {
  const response = await api.get<MeResponse>('/users/me')
  return response.data
}
