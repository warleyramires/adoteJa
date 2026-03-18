import type { Especie, Porte, Sexo } from '../types'

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export const especieLabel: Record<Especie, string> = {
  CAO: 'Cão',
  GATO: 'Gato',
  OUTRO: 'Outro',
}

export const porteLabel: Record<Porte, string> = {
  PEQUENO: 'Pequeno',
  MEDIO: 'Médio',
  GRANDE: 'Grande',
}

export const sexoLabel: Record<Sexo, string> = {
  MACHO: 'Macho',
  FEMEA: 'Fêmea',
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR')
}
