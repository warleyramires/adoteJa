import { useState } from 'react'
import { PageLayout } from '../../components/layout/PageLayout'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useFuncionarios, useCreateFuncionario } from '../../features/funcionario/hooks/useFuncionario'
import { useToast } from '../../contexts/ToastContext'
import { getApiError } from '../../lib/api'
import type { RoleName } from '../../types'

const emptyForm = {
  nome: '', email: '', password: '',
  telefone1: '', telefone2: '',
  matricula: '', cargo: '',
  role: 'ROLE_MEMBER' as RoleName,
  logradouro: '', numero: '', bairro: '', cidade: '', estado: '', cep: '',
}

export function AdminFuncionariosPage() {
  const { data: funcionarios, isLoading, isError } = useFuncionarios()
  const createMutation = useCreateFuncionario()
  const { showToast } = useToast()

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)

  function set(field: keyof typeof emptyForm) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function handleCancel() {
    setShowForm(false)
    setForm(emptyForm)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await createMutation.mutateAsync({
        nome: form.nome,
        email: form.email,
        password: form.password,
        telefone1: form.telefone1,
        telefone2: form.telefone2 || undefined,
        matricula: form.matricula,
        cargo: form.cargo,
        role: form.role,
        enderecoDTO: {
          logradouro: form.logradouro,
          numero: form.numero || undefined,
          bairro: form.bairro || undefined,
          cidade: form.cidade,
          estado: form.estado,
          cep: form.cep,
        },
      })
      showToast('Funcionário cadastrado!', 'success')
      handleCancel()
    } catch (err) {
      showToast(getApiError(err).message, 'error')
    }
  }

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="section-label mb-2">Painel</p>
          <h1 className="font-display text-5xl font-normal text-carbon-800">Funcionários</h1>
        </div>
        <Button onClick={showForm ? handleCancel : () => setShowForm(true)}>
          {showForm ? 'Cancelar' : '+ Novo funcionário'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-6 mb-8 max-w-lg flex flex-col gap-4">
          <h2 className="font-display text-2xl font-normal text-carbon-800">Novo funcionário</h2>

          <Input label="Nome" value={form.nome} onChange={set('nome')} required />
          <Input label="E-mail" type="email" value={form.email} onChange={set('email')} required />
          <Input label="Senha" type="password" value={form.password} onChange={set('password')} required minLength={8} />

          <div className="grid grid-cols-2 gap-3">
            <Input label="Telefone" value={form.telefone1} onChange={set('telefone1')} required placeholder="(11) 99999-9999" />
            <Input label="Telefone 2 (opcional)" value={form.telefone2} onChange={set('telefone2')} placeholder="(11) 99999-9999" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Matrícula" value={form.matricula} onChange={set('matricula')} required />
            <Input label="Cargo" value={form.cargo} onChange={set('cargo')} required />
          </div>

          <label className="flex flex-col gap-1">
            <span className="font-body text-sm text-carbon-800/70">Perfil de acesso</span>
            <select value={form.role} onChange={set('role')} className="input-base">
              <option value="ROLE_MEMBER">Funcionário</option>
              <option value="ROLE_ADMINISTRATOR">Administrador</option>
            </select>
          </label>

          <p className="font-body text-sm font-medium text-carbon-800/70 -mb-1">Endereço</p>

          <Input label="Logradouro" value={form.logradouro} onChange={set('logradouro')} required />

          <div className="grid grid-cols-2 gap-3">
            <Input label="Número (opcional)" value={form.numero} onChange={set('numero')} />
            <Input label="Bairro (opcional)" value={form.bairro} onChange={set('bairro')} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input label="Cidade" value={form.cidade} onChange={set('cidade')} required className="col-span-1" />
            <Input label="Estado" value={form.estado} onChange={set('estado')} required placeholder="SP" maxLength={2} />
            <Input label="CEP" value={form.cep} onChange={set('cep')} required placeholder="00000-000" />
          </div>

          <Button type="submit" loading={createMutation.isPending}>Cadastrar</Button>
        </form>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="card animate-pulse h-16" />)}
        </div>
      ) : isError ? (
        <div className="text-center py-24">
          <p className="font-display text-3xl font-normal text-carbon-800/30">Erro ao carregar funcionários.</p>
        </div>
      ) : (funcionarios ?? []).length === 0 ? (
        <div className="text-center py-24">
          <p className="font-display text-3xl font-normal text-carbon-800/30">Nenhum funcionário cadastrado.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {(funcionarios ?? []).map((f) => (
            <div key={f.id} className="card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-ambar-100 flex items-center justify-center">
                <span className="font-display text-lg font-medium text-ambar-500">
                  {f.nome.charAt(0).toUpperCase() || '?'}
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
