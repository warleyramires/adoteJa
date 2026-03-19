import { useState, useEffect } from 'react'
import { PageLayout } from '../components/layout/PageLayout'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useAuthContext } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { useAdotante, useUpdateAdotante } from '../features/adotante/hooks/useAdotante'
import { getApiError } from '../lib/api'

export function MinhaContaPage() {
  const { user } = useAuthContext()
  const { showToast } = useToast()
  const adotanteId = user?.id ?? 0

  const { data: adotante, isLoading, isError } = useAdotante(adotanteId)
  const updateMutation = useUpdateAdotante(adotanteId)

  const [nome, setNome]           = useState('')
  const [telefone1, setTelefone1] = useState('')
  const [telefone2, setTelefone2] = useState('')

  useEffect(() => {
    if (adotante) {
      setNome(adotante.nome ?? '')
      setTelefone1(adotante.telefone1 ?? '')
      setTelefone2(adotante.telefone2 ?? '')
    }
  }, [adotante])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await updateMutation.mutateAsync({ nome, telefone1, telefone2: telefone2 || undefined })
      showToast('Perfil atualizado com sucesso!', 'success')
    } catch (err) {
      showToast(getApiError(err).message, 'error')
    }
  }

  if (isLoading) {
    return (
      <PageLayout>
        <div className="animate-pulse space-y-4 max-w-md">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-pedra-200 rounded-2xl" />
          ))}
        </div>
      </PageLayout>
    )
  }

  if (isError) {
    return (
      <PageLayout>
        <div className="text-center py-24">
          <p className="font-display text-3xl font-normal text-carbon-800/30">
            Não foi possível carregar seus dados
          </p>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="mb-10">
        <p className="section-label mb-2">Configurações</p>
        <h1 className="font-display text-5xl font-normal text-carbon-800">Minha conta</h1>
      </div>

      <div className="max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} required />
          <Input label="E-mail" value={user?.email ?? ''} disabled />
          <Input label="Telefone principal" value={telefone1} onChange={(e) => setTelefone1(e.target.value)} />
          <Input label="Telefone secundário" value={telefone2} onChange={(e) => setTelefone2(e.target.value)} />

          <Button type="submit" loading={updateMutation.isPending} className="mt-2">
            Salvar alterações
          </Button>
        </form>
      </div>
    </PageLayout>
  )
}
