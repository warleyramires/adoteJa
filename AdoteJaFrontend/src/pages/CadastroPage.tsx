import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCadastro } from '../features/auth/hooks/useCadastro'
import { getApiError } from '../lib/api'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuthContext } from '../contexts/AuthContext'
import { login as loginApi } from '../features/auth/api'

type Step = 'conta' | 'endereco'

export function CadastroPage() {
  const navigate = useNavigate()
  const cadastroMutation = useCadastro()
  const { login } = useAuthContext()

  const [step, setStep] = useState<Step>('conta')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Dados pessoais
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [telefone1, setTelefone1] = useState('')
  const [cpf, setCpf] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')

  // Endereço
  const [cep, setCep] = useState('')
  const [logradouro, setLogradouro] = useState('')
  const [numero, setNumero] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')

  function handleContaSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStep('endereco')
  }

  async function handleEnderecoSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await cadastroMutation.mutateAsync({
        nome,
        email,
        password,
        telefone1,
        cpf,
        dataNascimento,
        enderecoDTO: { logradouro, numero, bairro, cidade, estado, cep },
      })
      const { token } = await loginApi({ email, password })
      login(token)
      navigate('/')
    } catch (err) {
      setError(getApiError(err).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-creme-100 flex">
      {/* Painel esquerdo — decorativo */}
      <div className="hidden lg:flex lg:w-1/2 bg-ambar-500 flex-col justify-between p-16">
        <Link to="/" className="font-display text-2xl font-medium text-creme-50">
          adote<span className="text-azul-200">já</span>
        </Link>

        {/* Steps indicator */}
        <div className="space-y-6">
          {(['conta', 'endereco'] as Step[]).map((s, i) => {
            const done = step === 'endereco' && s === 'conta'
            const active = step === s
            return (
              <div key={s} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-body font-medium transition-all ${
                  done    ? 'bg-creme-50 text-ambar-500' :
                  active  ? 'bg-creme-50 text-ambar-500' :
                            'border-2 border-ambar-300 text-ambar-200'
                }`}>
                  {done ? '✓' : i + 1}
                </div>
                <div>
                  <p className={`font-body text-sm font-medium ${active || done ? 'text-creme-50' : 'text-ambar-200'}`}>
                    {s === 'conta' ? 'Dados pessoais' : 'Endereço'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <p className="font-body text-sm text-ambar-200">
          © {new Date().getFullYear()} AdoteJá
        </p>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 overflow-y-auto">
        <div className="w-full max-w-sm mx-auto">
          <Link to="/" className="lg:hidden block mb-10 font-display text-2xl font-medium text-carbon-800">
            adote<span className="text-ambar-500">já</span>
          </Link>

          {step === 'conta' ? (
            <>
              <h1 className="font-display text-4xl font-normal text-carbon-800 mb-2">Criar conta</h1>
              <p className="font-body text-sm text-carbon-800/50 mb-8">
                Já tem conta?{' '}
                <Link to="/login" className="text-ambar-500 hover:underline">Entrar</Link>
              </p>

              <form onSubmit={handleContaSubmit} className="flex flex-col gap-4">
                <Input label="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" required />
                <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required />
                <Input label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" minLength={8} required />
                <Input label="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" required />
                <Input label="Telefone" type="tel" value={telefone1} onChange={(e) => setTelefone1(e.target.value)} placeholder="(11) 99999-9999" required />
                <Input label="Data de nascimento" type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} required />

                <Button type="submit" className="mt-2 w-full">
                  Continuar
                </Button>
              </form>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep('conta')}
                className="flex items-center gap-1 font-body text-sm text-carbon-800/50 hover:text-ambar-500 mb-6 transition-colors"
              >
                ← Voltar
              </button>
              <h1 className="font-display text-4xl font-normal text-carbon-800 mb-2">Endereço</h1>
              <p className="font-body text-sm text-carbon-800/50 mb-8">Quase lá! Informe seu endereço.</p>

              <form onSubmit={handleEnderecoSubmit} className="flex flex-col gap-4">
                <Input label="CEP" value={cep} onChange={(e) => setCep(e.target.value)} placeholder="00000-000" required />
                <Input label="Logradouro" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} placeholder="Rua, Av..." required />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Número" value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="123" />
                  <Input label="Bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} placeholder="Bairro" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Cidade" required />
                  <Input label="Estado" value={estado} onChange={(e) => setEstado(e.target.value)} placeholder="SP" maxLength={2} required />
                </div>

                {error && (
                  <p className="font-body text-sm text-red-500 bg-red-50 px-4 py-3 rounded-2xl">{error}</p>
                )}

                <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
                  Criar minha conta
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
