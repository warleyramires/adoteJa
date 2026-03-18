import { useState } from 'react'
import { PageLayout } from '../../components/layout/PageLayout'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useFuncionarios, useCreateFuncionario } from '../../features/funcionario/hooks/useFuncionario'
import { useToast } from '../../contexts/ToastContext'
import { getApiError } from '../../lib/api'

export function AdminFuncionariosPage() {
  const { data: funcionarios, isLoading, isError } = useFuncionarios()
  const createMutation = useCreateFuncionario()
  const { showToast } = useToast()

  const [showForm, setShowForm] = useState(false)
  const [nome, setNome]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [cargo, setCargo]       = useState('')

  function handleCancel() {
    setShowForm(false)
    setNome(''); setEmail(''); setPassword(''); setCargo('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await createMutation.mutateAsync({ nome, email, password, cargo: cargo || undefined })
      showToast('Funcionário cadastrado!', 'success')
      setShowForm(false)
      setNome(''); setEmail(''); setPassword(''); setCargo('')
    } catch (err) {
      showToast(getApiError(err).message, 'error')
    }
  }

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="section-label mb-2">Painel</p>
          <h1 className="font-display text-5xl font-light text-carbon-800">Funcionários</h1>
        </div>
        <Button onClick={showForm ? handleCancel : () => setShowForm(true)}>
          {showForm ? 'Cancelar' : '+ Novo funcionário'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-6 mb-8 max-w-md flex flex-col gap-4">
          <h2 className="font-display text-2xl font-light text-carbon-800">Novo funcionário</h2>
          <Input label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
          <Input label="Cargo (opcional)" value={cargo} onChange={(e) => setCargo(e.target.value)} />
          <Button type="submit" loading={createMutation.isPending}>Cadastrar</Button>
        </form>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="card animate-pulse h-16" />)}
        </div>
      ) : isError ? (
        <div className="text-center py-24">
          <p className="font-display text-3xl font-light text-carbon-800/30">Erro ao carregar funcionários.</p>
        </div>
      ) : (funcionarios ?? []).length === 0 ? (
        <div className="text-center py-24">
          <p className="font-display text-3xl font-light text-carbon-800/30">Nenhum funcionário cadastrado.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {(funcionarios ?? []).map((f) => (
            <div key={f.id} className="card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-terracota-100 flex items-center justify-center">
                <span className="font-display text-lg font-medium text-terracota-500">
                  {f.nome.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-body text-base font-medium text-carbon-800">{f.nome}</p>
                <p className="font-body text-sm text-carbon-800/50">{f.email}{f.cargo ? ` · ${f.cargo}` : ''}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  )
}
