// ── Enums ────────────────────────────────────────────────────────────────────

export type Especie = 'CAO' | 'GATO' | 'OUTRO'
export type Porte = 'PEQUENO' | 'MEDIO' | 'GRANDE'
export type Sexo = 'MACHO' | 'FEMEA'
export type RoleName = 'ROLE_CUSTOMER' | 'ROLE_MEMBER' | 'ROLE_ADMINISTRATOR'
export type StatusSolicitacao = 'PENDENTE' | 'APROVADA' | 'RECUSADA'

// ── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

// ── Pet ──────────────────────────────────────────────────────────────────────

export interface SaudeDTO {
  vacinado: boolean | null
  castrado: boolean | null
  vermifugado: boolean | null
  historicoSaude: string | null
}

export interface CaracteristicaDTO {
  especie: Especie
  porte: Porte
  sexo: Sexo
  cor: string | null
  raca: string | null
}

export interface Pet {
  id: number
  nome: string
  descricao: string | null
  imagemUrl: string | null
  disponivel: boolean
  saude: SaudeDTO | null
  caracteristica: CaracteristicaDTO | null
}

export interface PetFilters {
  especie?: Especie
  porte?: Porte
  sexo?: Sexo
  disponivel?: boolean
  page?: number
  size?: number
}

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

// ── Adotante ─────────────────────────────────────────────────────────────────

export interface Adotante {
  id: number
  nome: string
  email: string
  telefone1: string | null
  telefone2: string | null
  cpf: string | null
  dataNascimento: string | null
}

// ── Solicitacao ───────────────────────────────────────────────────────────────

export interface Solicitacao {
  id: number
  status: StatusSolicitacao
  dataSolicitacao: string
  pet: Pet
  adotante: Adotante
}

// ── API Error ─────────────────────────────────────────────────────────────────

export interface ApiError {
  status: number
  message: string
  timestamp: string
}
