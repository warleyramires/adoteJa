import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLogin } from '../features/auth/hooks/useLogin'
import { useAuthContext } from '../contexts/AuthContext'
import { getApiError } from '../lib/api'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import capaLogin from '../assets/capa-login.avif'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthContext()
  const loginMutation = useLogin()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const { token } = await loginMutation.mutateAsync({ email, password })
      login(token)
      navigate('/')
    } catch (err) {
      setError(getApiError(err).message)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-full flex flex-col md:flex-row min-h-screen">

        {/* Painel do formulário */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center items-center">
          <div className="w-full max-w-md">
          <div className="mb-10">
            <Link to="/" className="font-headline text-2xl font-extrabold tracking-tight text-primary">
              adoteJá
            </Link>
            <p className="text-on-surface-variant mt-1 font-body">Bem-vindo de volta.</p>
          </div>

          <div className="space-y-8">
            <header>
              <h1 className="font-headline text-4xl font-bold text-on-surface leading-tight">
                Entre na sua <br />conta.
              </h1>
              <p className="text-on-surface-variant mt-3 max-w-sm font-body">
                Acesse seu painel para gerenciar adoções e descobrir novos companheiros.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
              <Input
                label="Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              {error && (
                <p className="font-body text-sm text-error bg-error-container px-4 py-3 rounded">
                  {error}
                </p>
              )}

              <div className="pt-2 space-y-3">
                <Button type="submit" loading={loginMutation.isPending} className="w-full justify-center">
                  Entrar
                </Button>
                <Link to="/cadastro" className="block">
                  <Button variant="secondary" className="w-full justify-center">
                    Não tem conta? Cadastre-se
                  </Button>
                </Link>
              </div>
            </form>
          </div>
          </div>
        </div>

        {/* Painel editorial */}
        <div className="hidden md:flex flex-1 relative overflow-hidden bg-primary-fixed items-end">
          <img src={capaLogin} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-primary/50" />
          <div className="relative z-10 p-8 pb-12 w-full">
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-lg shadow-editorial max-w-xs border border-white/20">
              <span className="inline-block px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold tracking-widest uppercase rounded-full mb-3">
                Destaque
              </span>
              <h3 className="font-headline text-lg font-bold text-on-surface mb-1">
                "Uma combinação perfeita para nossa família."
              </h3>
              <p className="text-on-surface-variant text-sm italic font-body">— Ana & Rex, adotados em 2024</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
