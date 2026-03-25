import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCadastro } from '../features/auth/hooks/useCadastro'
import { getApiError } from '../lib/api'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuthContext } from '../contexts/AuthContext'
import { login as loginApi } from '../features/auth/api'
import capaCadastro from '../assets/capa-cadastro.avif'

type Step = 'conta' | 'endereco'

export function CadastroPage() {
  const navigate = useNavigate()
  const cadastroMutation = useCadastro()
  const { login } = useAuthContext()

  const [step, setStep] = useState<Step>('conta')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [telefone1, setTelefone1] = useState('')
  const [cpf, setCpf] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')

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
        nome, email, password, telefone1, cpf, dataNascimento,
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
    <div className="min-h-screen flex">
      <div className="w-full flex flex-col lg:flex-row min-h-screen">

        {/* Painel de marca (esquerda) */}
        <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-primary flex-col justify-between p-12">
          <img src={capaCadastro} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/60 to-primary-container/40" />
          <div className="relative z-10">
            <Link to="/" className="font-headline text-2xl font-extrabold tracking-tight text-on-primary">
              adoteJá
            </Link>
          </div>
          <div className="relative z-10 space-y-6">
            <div className="bg-surface/80 backdrop-blur-md px-5 py-3 rounded-full inline-flex items-center gap-2 shadow-editorial">
              <span className="material-symbols-outlined text-primary text-base">pets</span>
              <span className="font-label font-semibold text-on-surface-variant uppercase tracking-wider text-xs">
                Junte-se à comunidade
              </span>
            </div>
            <h2 className="font-headline text-4xl font-extrabold text-on-primary leading-tight">
              Construindo lindas histórias de companheirismo.
            </h2>
            <p className="font-body text-on-primary/80 leading-relaxed">
              Encontre o companheiro perfeito e mude uma vida para sempre.
            </p>
            {/* Steps indicator */}
            <div className="space-y-3 pt-4">
              {(['conta', 'endereco'] as Step[]).map((s, i) => {
                const done = step === 'endereco' && s === 'conta'
                const active = step === s
                return (
                  <div key={s} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      done || active ? 'bg-on-primary text-primary' : 'border-2 border-on-primary/40 text-on-primary/40'
                    }`}>
                      {done ? '✓' : i + 1}
                    </div>
                    <span className={`font-body text-sm font-medium ${active || done ? 'text-on-primary' : 'text-on-primary/50'}`}>
                      {s === 'conta' ? 'Dados pessoais' : 'Endereço'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
          <p className="relative z-10 font-body text-sm text-on-primary/50">
            © {new Date().getFullYear()} AdoteJá
          </p>
        </div>

        {/* Painel do formulário (direita) */}
        <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center items-center overflow-y-auto">
          <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden block mb-8 font-headline text-2xl font-extrabold tracking-tight text-primary">
            adoteJá
          </Link>

          {step === 'conta' ? (
            <>
              <h1 className="font-headline text-3xl font-bold text-on-surface mb-2">Criar sua conta</h1>
              <p className="font-body text-on-surface-variant mb-8">
                Já tem conta?{' '}
                <Link to="/login" className="text-primary font-semibold hover:underline">Entrar</Link>
              </p>

              <form onSubmit={handleContaSubmit} className="space-y-5">
                <Input label="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" required />
                <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required />
                <Input label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" minLength={8} required />
                <Input label="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" required />
                <Input label="Telefone" type="tel" value={telefone1} onChange={(e) => setTelefone1(e.target.value)} placeholder="(11) 99999-9999" required />
                <Input label="Data de nascimento" type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} required />
                <Button type="submit" className="w-full justify-center mt-2">
                  Continuar
                </Button>
              </form>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep('conta')}
                className="flex items-center gap-1 font-body text-sm text-on-surface-variant hover:text-primary mb-6 transition-colors"
              >
                ← Voltar
              </button>
              <h1 className="font-headline text-3xl font-bold text-on-surface mb-2">Endereço</h1>
              <p className="font-body text-on-surface-variant mb-8">Quase lá! Informe seu endereço.</p>

              <form onSubmit={handleEnderecoSubmit} className="space-y-5">
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
                  <p className="font-body text-sm text-error bg-error-container px-4 py-3 rounded">{error}</p>
                )}
                <Button type="submit" loading={isSubmitting} className="w-full justify-center mt-2">
                  Criar minha conta
                </Button>
              </form>
            </>
          )}
          </div>
        </div>

      </div>
    </div>
  )
}
