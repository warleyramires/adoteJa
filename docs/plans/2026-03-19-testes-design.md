# Testes Backend e Frontend — Design

## Objetivo

Adicionar cobertura de testes ao projeto AdoteJá: unit tests com Mockito no backend, e Vitest + React Testing Library no frontend.

---

## Backend

**Stack de teste:** JUnit 5 + Mockito (já incluídos via `spring-boot-starter-test`). Zero dependências novas.

**Padrão:** `@ExtendWith(MockitoExtension.class)` + `@InjectMocks` no service + `@Mock` nas dependências. Sem Spring context, sem banco.

**Arquivos:** `AdoteJaBackend/src/test/java/com/adotejabackend/AdoteJaBackend/services/`

### PetServiceTest
- `create_semImagem_salvaPetComImagemUrlNull`
- `create_comImagemValida_chamS3EsalvaPetComUrl`
- `create_comImagemInvalida_lancaIllegalArgumentException`
- `findById_petExistente_retornaDTO`
- `findById_petInexistente_lancaEntityNotFoundException`
- `update_camposParciais_atualizaApenasOsEnviados`
- `update_comNovaImagem_fazUploadEAtualiza`
- `update_petInexistente_lancaEntityNotFoundException`
- `delete_petExistente_deletaComSucesso`
- `delete_petInexistente_lancaEntityNotFoundException`

### SolicitacaoServiceTest
- `create_petDisponivel_criaSolicitacaoComStatusPendente`
- `create_petIndisponivel_lancaRuntimeException`
- `create_adotanteNaoEncontrado_lancaEntityNotFoundException`
- `findMinhas_retornaListaDoAdotanteLogado`
- `updateStatus_aprovado_marcaPetComoIndisponivel`
- `updateStatus_recusado_naoAlteraPet`
- `updateStatus_solicitacaoInexistente_lancaEntityNotFoundException`

### UsuarioServiceTest
- `createUsuario_emailNovo_salvaCom Sucesso`
- `createUsuario_emailDuplicado_lancaRuntimeException`
- `getMe_usuarioExistente_retornaDTO`
- `getMe_usuarioInexistente_lancaResponseStatusException`

---

## Frontend

**Stack de teste:** Vitest + React Testing Library + jsdom.

**Dependências novas (devDependencies):**
- `vitest`
- `@vitest/ui`
- `jsdom`
- `@testing-library/react`
- `@testing-library/user-event`
- `@testing-library/jest-dom`

**Configuração:**
- `vitest.config.ts` — `environment: 'jsdom'`, `setupFiles: ['./src/test/setup.ts']`
- `src/test/setup.ts` — `import '@testing-library/jest-dom'`
- Script `"test": "vitest"` no `package.json`

### Hooks — `src/features/**/hooks/*.test.ts`

Usar `renderHook` com wrapper `QueryClient`. Mockar axios com `vi.mock('../../../lib/api')`.

- `usePets` — retorna lista de pets quando API responde com sucesso
- `usePet` — retorna pet por id; trata erro 404
- `useCriarSolicitacao` — chama `POST /solicitacoes` com petId correto

### Componentes — `src/pages/*.test.tsx`

Mockar `useAuthContext` com `vi.mock('../contexts/AuthContext')`.

- `HomePage`:
  - botão "Quero adotar" visível quando `isAuthenticated=false`
  - botão "Quero adotar" oculto quando `isAuthenticated=true`
  - CTA "Criar minha conta" visível quando não logado
  - CTA "Criar minha conta" oculto quando logado

- `PetDetailPage`:
  - exibe "Solicitar adoção" quando logado e pet disponível
  - exibe "Entrar" e "Criar conta" quando não logado e pet disponível
  - não exibe CTA quando pet indisponível
