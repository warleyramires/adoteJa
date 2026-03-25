# Testing Patterns

**Analysis Date:** 2025-03-24

## Test Framework

**Backend Runner:**
- JUnit 5 (Jupiter) - included in `spring-boot-starter-test`
- Config: Default Spring Boot test configuration
- Maven command: `./mvnw test`

**Frontend Runner:**
- Vitest v4.1.0
- Config: `vite.config.ts` with `environment: 'jsdom'` and `setupFiles: ['./src/test/setup.ts']`
- Run Commands:
  ```bash
  npm run test          # Run all tests once
  npm run test:watch   # Watch mode
  ```

**Assertion Libraries:**
- Backend: AssertJ (fluent assertions), Mockito matchers
- Frontend: Vitest assertions, `@testing-library/react` (render, screen, waitFor, userEvent)

## Test File Organization

**Backend Location:**
- Path pattern: `src/test/java/com/adotejabackend/AdoteJaBackend/services/`
- Naming: `{ClassName}Test.java` (e.g., `UsuarioServiceTest.java`)
- Structure: One test class per service class

**Frontend Location:**
- Path pattern: `src/features/{feature}/hooks/`, `src/pages/`, `src/components/`
- Naming: `{filename}.test.ts` or `.test.tsx` (e.g., `useSolicitacoes.test.ts`, `HomePage.test.tsx`)
- Structure: Test file co-located with source file

## Test Structure

**Backend Pattern (Unit Tests):**

```java
@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock private UsuarioRepository usuarioRepository;
    @Mock private RoleRepository roleRepository;
    @Mock private SecurityConfiguration securityConfiguration;
    @Mock private JwtTokenService jwtTokenService;
    @Mock private AuthenticationManager authenticationManager;

    @InjectMocks
    private UsuarioService usuarioService;

    @Test
    void methodName_scenario_expectedBehavior() {
        // Arrange
        when(mockRepo.method()).thenReturn(value);

        // Act
        Type result = service.method(params);

        // Assert
        assertThat(result).isEqualTo(expected);
        verify(mockRepo).method();
    }
}
```

**Key patterns:**
- Use `@ExtendWith(MockitoExtension.class)` for dependency injection
- Declare mocks with `@Mock`, inject with `@InjectMocks`
- Test method naming: `{methodName}_{scenario}_{expectedBehavior}()`
- Setup method: No explicit `@BeforeEach` (use setUp() in test methods if needed)
- Teardown: `@AfterEach` methods clear security context (`SecurityContextHolder.clearContext()`)
- Arrange-Act-Assert pattern within each test

**Frontend Pattern (Unit/Integration Tests):**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

vi.mock('../api')

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('hookName', () => {
  beforeEach(() => vi.clearAllMocks())

  it('describes expected behavior', async () => {
    vi.mocked(api.method).mockResolvedValue(data)

    const { result } = renderHook(() => useHook(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(api.method).toHaveBeenCalledWith(expectedArgs)
  })
})
```

**Key patterns:**
- Global test setup: `describe()`, `it()`, `expect()`, `vi()`, `beforeEach()`
- Mock management: `vi.mock()`, `vi.clearAllMocks()`, `vi.mocked()`
- Hook testing: `renderHook()` with custom `wrapper` for providers
- Async handling: `waitFor()` with `expect()` for state checks
- Action wrapping: `act()` for state updates outside render
- Query client setup: Retry disabled for tests to fail fast

## Mocking

**Backend Mocking:**
- Framework: Mockito
- Setup: `@Mock` annotations and `lenient().when()` for optional mocks
- Return values: `when(mock.method()).thenReturn(value)` or `mockRejectedValue(exception)`
- Verification: `verify(mock).method()`, `verify(mock, never()).method()`, `verify(mock, times(2)).method()`
- Argument capture: `ArgumentCaptor.forClass(Type.class)` to verify method was called with specific args
- Security mocking: Create `Authentication` mock and set via `SecurityContextHolder.getContext().setAuthentication(auth)`

Example from `AdotanteServiceTest.java`:
```java
private void mockAuth(String email, String role) {
    Authentication auth = new UsernamePasswordAuthenticationToken(
            email, null, List.of(new SimpleGrantedAuthority(role)));
    SecurityContextHolder.getContext().setAuthentication(auth);
}
```

**Frontend Mocking:**
- Framework: Vitest
- Module mocks: `vi.mock('../module')` at top of file
- Function mocks: `vi.mocked(apiFunction).mockResolvedValue(data)` or `.mockRejectedValue(error)`
- Context mocks: `vi.mock('../contexts/AuthContext')` then `vi.mocked(useAuthContext).mockReturnValue({...})`
- Image/asset mocks: `vi.mock('../assets/image.jpg', () => ({ default: 'mock-url.jpg' }))`
- Cleanup: `vi.clearAllMocks()` in `beforeEach()`

Example from `HomePage.test.tsx`:
```typescript
vi.mock('../contexts/AuthContext', () => ({
  useAuthContext: vi.fn(),
}))

import { useAuthContext } from '../contexts/AuthContext'

vi.mocked(useAuthContext).mockReturnValue({
  isAuthenticated: false, user: null, isAdmin: false, isMember: false,
  login: vi.fn(), logout: vi.fn(),
})
```

**What to Mock:**
- Backend: External dependencies (repositories, services, configuration)
- Frontend: API calls, context hooks, asset imports, timers

**What NOT to Mock:**
- Backend: The service being tested; business logic
- Frontend: Custom hooks being tested (but mock their dependencies); actual component rendering

## Fixtures and Factories

**Test Data:**
Backend uses builder pattern for entity construction:

```java
@BeforeEach
void setUp() {
    SaudeDTO saudeDTO = new SaudeDTO(true, false, true, null);
    CaracteristicaDTO caracDTO = new CaracteristicaDTO("SRD", "Caramelo", Especie.CAO, Porte.MEDIO, Sexo.MACHO);
    createDto = new CreatePetDTO("Rex", "Cão amigável", saudeDTO, caracDTO);

    Saude saude = Saude.builder().vacinado(true).castrado(false).vermifugado(true).build();
    Caracteristica carac = Caracteristica.builder()
            .raca("SRD").cor("Caramelo").especie(Especie.CAO).porte(Porte.MEDIO).sexo(Sexo.MACHO).build();
    savedPet = Pet.builder()
            .id(1L).nome("Rex").descricao("Cão amigável")
            .imagemUrl(null).disponivel(true).saude(saude).caracteristica(carac).build();
}
```

Frontend uses constant objects or factory functions:

```typescript
const mockPetDisponivel = {
  id: 1, nome: 'Rex', descricao: 'Cão amigável', imagemUrl: null, disponivel: true,
  saude: { vacinado: true, castrado: false, vermifugado: true, historicoSaude: null },
  caracteristica: { especie: 'CAO', porte: 'MEDIO', sexo: 'MACHO', cor: null, raca: null },
}

function createWrapper() {
  const queryClient = new QueryClient({...})
  return ({ children }) => React.createElement(QueryClientProvider, { client: queryClient }, children)
}
```

**Location:**
- Backend: Defined in `@BeforeEach` methods or as private helper methods
- Frontend: Defined at top of test file or imported from separate test utilities

## Coverage

**Requirements:**
- Backend: No explicit coverage requirements
- Frontend: No explicit coverage requirements
- Both: Coverage tracking available via `npm run test:coverage` (frontend) and Maven Surefire (backend)

**View Coverage:**
```bash
# Frontend (if configured)
npm run test -- --coverage
```

## Test Types

**Backend Unit Tests:**
- Scope: Test individual service methods in isolation
- Approach: Mock all dependencies, test business logic
- Examples: `UsuarioServiceTest`, `PetServiceTest`, `SolicitacaoServiceTest`
- Coverage: Input validation, error handling, state changes

Example from `PetServiceTest.java`:
```java
@Test
void create_comImagemMaiorQue5MB_lancaIllegalArgumentException() {
    MultipartFile imagem = mock(MultipartFile.class);
    when(imagem.isEmpty()).thenReturn(false);
    when(imagem.getSize()).thenReturn(6L * 1024 * 1024); // 6 MB

    CreatePetDTO dto = new CreatePetDTO("Rex", null,
            new SaudeDTO(true, true, true, null),
            new CaracteristicaDTO(null, null, Especie.CAO, Porte.MEDIO, Sexo.MACHO));

    assertThatThrownBy(() -> petService.create(dto, imagem))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("5 MB");
}
```

**Frontend Unit Tests (Hooks):**
- Scope: Test React hooks and their state management
- Approach: Use `renderHook()` with mocked API dependencies
- Examples: `useSolicitacoes.test.ts`, `usePets.test.ts`
- Coverage: Hook behavior with different API responses, error states

Example from `useSolicitacoes.test.ts`:
```typescript
it('fica em estado de erro quando a API falha', async () => {
  vi.mocked(adocaoApi.criarSolicitacao).mockRejectedValue(new Error('Pet indisponível'))

  const { result } = renderHook(() => useCriarSolicitacao(), { wrapper: createWrapper() })

  act(() => {
    result.current.mutate(10)
  })

  await waitFor(() => expect(result.current.isError).toBe(true))
})
```

**Frontend Integration Tests (Components):**
- Scope: Test React components with mocked contexts and hooks
- Approach: Use `render()` with `MemoryRouter` and mocked context providers
- Examples: `HomePage.test.tsx`, `PetDetailPage.test.tsx`
- Coverage: Component rendering based on auth state, user interactions, prop changes

Example from `HomePage.test.tsx`:
```typescript
it('exibe "Quero adotar" quando usuário não está logado', () => {
  vi.mocked(useAuthContext).mockReturnValue({
    isAuthenticated: false, user: null, isAdmin: false, isMember: false,
    login: vi.fn(), logout: vi.fn(),
  })

  renderHomePage()

  expect(screen.getByText('Quero adotar')).toBeInTheDocument()
})
```

**E2E Tests:**
- Framework: Not used
- Potential: Could use Playwright or Cypress for full-stack testing

## Security-Related Tests

**Backend Security Tests (IDOR Prevention):**

Tests verify that unauthorized users cannot access other users' resources. Implemented in `AdotanteServiceTest.java`:

```java
@Test
void findById_outroUsuario_lancaAccessDeniedException() {
    mockAuth("invasor@email.com", "ROLE_CUSTOMER");
    when(adotanteRepository.findById(1L))
            .thenReturn(Optional.of(adotanteComEmail(1L, "dono@email.com")));

    assertThatThrownBy(() -> adotanteService.findById(1L))
            .isInstanceOf(AccessDeniedException.class);
}

@Test
void findById_admin_bypassOwnership() {
    mockAuth("admin@email.com", "ROLE_ADMINISTRATOR");
    when(adotanteRepository.findById(1L))
            .thenReturn(Optional.of(adotanteComEmail(1L, "outro@email.com")));

    RecoveryAdotanteDTO result = adotanteService.findById(1L);
    assertThat(result).isNotNull();
}

@Test
void findById_semAutenticacao_lancaAccessDeniedException() {
    SecurityContextHolder.clearContext();
    when(adotanteRepository.findById(1L))
            .thenReturn(Optional.of(adotanteComEmail(1L, "dono@email.com")));

    assertThatThrownBy(() -> adotanteService.findById(1L))
            .isInstanceOf(AccessDeniedException.class);
}
```

**Security Coverage:**
- CUSTOMER users can only access their own data (verified by ownership check)
- MEMBER/ADMIN users bypass ownership checks
- Unauthenticated requests throw `AccessDeniedException`
- File upload validation: Type and size checks prevent malicious uploads
- Error responses sanitized: No internal details leaked (RuntimeException returns generic message)

## Common Patterns

**Async Testing (Frontend):**

Use `waitFor()` for assertions that depend on state updates:

```typescript
const { result } = renderHook(() => useCriarSolicitacao(), { wrapper: createWrapper() })

act(() => {
  result.current.mutate(10)
})

await waitFor(() => expect(result.current.isSuccess).toBe(true))
```

Wrap mutations in `act()` to signal state changes to testing library.

**Error Testing (Backend):**

Use AssertJ for fluent exception assertions:

```java
assertThatThrownBy(() -> petService.findById(99L))
        .isInstanceOf(EntityNotFoundException.class)
        .hasMessageContaining("99");
```

**Optional Return Handling:**

Test both present and empty Optional states:

```java
@Test
void getMe_usuarioExistente_retornaDTO() {
    when(usuarioRepository.findByEmail("joao@test.com")).thenReturn(Optional.of(usuario));
    MeResponseDTO result = usuarioService.getMe("joao@test.com");
    assertThat(result.nome()).isEqualTo("João");
}

@Test
void getMe_usuarioInexistente_lancaResponseStatusException() {
    when(usuarioRepository.findByEmail("nao@existe.com")).thenReturn(Optional.empty());
    assertThatThrownBy(() -> usuarioService.getMe("nao@existe.com"))
            .isInstanceOf(ResponseStatusException.class);
}
```

---

*Testing analysis: 2025-03-24*
