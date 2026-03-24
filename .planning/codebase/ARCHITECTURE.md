# Architecture

**Analysis Date:** 2026-03-24

## Pattern Overview

**Overall:** Layered REST API with Role-Based Access Control (RBAC), paired with stateless SPA frontend consuming the API via TanStack Query. Monorepo structure with separate backend (Spring Boot) and frontend (React + Vite) applications.

**Key Characteristics:**
- Clean separation of concerns: Controllers → Services → Repositories
- Stateless JWT authentication with Spring Security filter chain
- Role-based authorization on endpoints (ROLE_CUSTOMER, ROLE_MEMBER, ROLE_ADMINISTRATOR)
- DTO layer for API contracts; Domain models for persistence
- Feature-based frontend organization (auth, pets, adocao, adotante, funcionario)
- CORS restricted to Content-Type and Authorization headers only
- Multipart form handling for pet image uploads

## Layers

### Backend

**Controller Layer:**
- Purpose: HTTP request/response handling, validation, routing
- Location: `com.adotejabackend.AdoteJaBackend.controllers`
- Contains: REST endpoint definitions (@RestController, @RequestMapping)
- Depends on: Services for business logic
- Used by: HTTP clients (frontend, external APIs)
- Examples:
  - `UsuarioController`: Authentication endpoints (/users/login, /users, /users/me)
  - `PetController`: Pet CRUD with multipart image upload
  - `AdotanteController`: Adopter profile management
  - `SolicitacaoController`: Adoption request handling
  - `FuncionarioController`: Staff management (admin only)

**Service Layer:**
- Purpose: Business logic, transaction management, data transformation
- Location: `com.adotejabackend.AdoteJaBackend.services`
- Contains: @Service classes with @Transactional methods
- Depends on: Repositories, external services (S3Service, JwtTokenService)
- Used by: Controllers
- Key implementations:
  - `PetService`: Create, read, update, delete pets; image upload via S3; file size validation (5MB max)
  - `UsuarioService`: User registration, authentication, JWT token generation
  - `AdotanteService`: Adopter profile CRUD with IDOR protection via `verifyOwnership()`
  - `SolicitacaoService`: Adoption request creation and status management
  - `JwtTokenService`: Token generation and validation using Auth0 java-jwt
  - `S3Service`: File upload to LocalStack (dev) or AWS S3 (prod)

**Repository Layer:**
- Purpose: Database access abstraction
- Location: `com.adotejabackend.AdoteJaBackend.repositories`
- Contains: Spring Data JPA repositories with custom queries
- Depends on: Domain models, JPA
- Used by: Services
- Examples: `PetRepository.findWithFilters()` for pagination with especie/porte/sexo/disponivel filters

**Domain Models:**
- Purpose: JPA entity definitions
- Location: `com.adotejabackend.AdoteJaBackend.models`
- Contains:
  - `Usuario`: Base entity with JOINED inheritance; email unique constraint; 1:N to Role
  - `Adotante`: User subclass for adopters
  - `Funcionario`: User subclass for staff
  - `Pet`: Complete pet data with cascaded Saude and Caracteristica (OneToOne)
  - `Saude`: Vaccination, spaying/neutering, deworming, health history
  - `Caracteristica`: Species, size, sex, color, breed
  - `Endereco`: Address (cascaded from Usuario)
  - `Solicitacao`: Adoption requests linking Pet → Adopter with status

**DTO Layer:**
- Purpose: API request/response contracts
- Location: `com.adotejabackend.AdoteJaBackend.dtos`
- Naming pattern: Create[Entity]DTO, Update[Entity]DTO, Recovery[Entity]DTO
- Includes validation annotations (@Valid, @Size, @NotBlank)
- Examples:
  - `CreatePetDTO`: Multipart "dados" part with nested saude/caracteristica
  - `CreateFuncionarioDTO`: Requires telefone1, matricula, cargo, role, enderecoDTO
  - `RecoverySolicitacaoDTO`: Flat structure with nomePet, nomeAdotante, imagemUrl (denormalized for API convenience)

### Frontend

**Page Layer:**
- Purpose: Full-page components that compose features and layout
- Location: `src/pages` and `src/pages/admin`
- Contains:
  - Public: HomePage, LoginPage, CadastroPage, PetsPage, PetDetailPage, SobrePage
  - Private (authenticated): MinhasSolicitacoesPage, MinhaContaPage
  - Admin (MEMBER/ADMINISTRATOR): AdminPetsPage, AdminSolicitacoesPage, AdminFuncionariosPage
- Depends on: Feature hooks, Layout components, Router

**Feature Layer:**
- Purpose: Domain-specific API calls, hooks, and components
- Location: `src/features/{auth,pets,adocao,adotante,funcionario}`
- Structure per feature:
  - `api.ts`: Axios calls to backend endpoints (e.g., `fetchPets()`, `login()`)
  - `hooks/`: Custom React hooks using TanStack Query (e.g., `usePets`, `useSolicitacoes`)
  - `components/`: Feature-specific UI (e.g., `PetFormModal` in pets)
- Examples:
  - `auth/api.ts`: /users/login, /users/me
  - `pets/api.ts`: GET /pets, GET /pets/:id
  - `pets/adminApi.ts`: POST, PUT, DELETE /pets (admin operations)
  - `adocao/api.ts`: POST /solicitacoes, GET /solicitacoes, GET /solicitacoes/minhas

**Layout Components:**
- Purpose: Shared page structure and navigation
- Location: `src/components/layout`
- Contains:
  - `Header.tsx`: Navigation menu, user display, admin nav links
  - `PageLayout.tsx`: Wraps page content with header and footer

**UI Components:**
- Purpose: Reusable styled buttons, inputs, badges, toasts
- Location: `src/components/ui`
- Contains: Button, Input, Badge, Toast

**Context Layer:**
- Purpose: Global state management
- Location: `src/contexts`
- Contains:
  - `AuthContext.tsx`: User state, JWT token, isAdmin/isMember flags; restores session on mount via /users/me
  - `ToastContext.tsx`: Toast notifications (success/error messages)

**Router:**
- Purpose: Route definitions and protected route wrappers
- Location: `src/router`
- Contains:
  - `index.tsx`: createBrowserRouter configuration; public, private, and admin routes
  - `PrivateRoute.tsx`: Redirects unauthenticated users to /login; AdminRoute redirects non-members to /

**Lib & Utilities:**
- Purpose: Shared utilities
- Location: `src/lib`, `src/hooks`, `src/types`
- Contains:
  - `api.ts`: Axios instance with interceptors for JWT injection and 401 handling
  - `utils.ts`: Helper functions
  - `types/index.ts`: TypeScript interfaces for all DTOs and API contracts

## Data Flow

### Authentication & JWT Flow

1. **Login:**
   - User submits `LoginRequest` { email, password } to `POST /users/login`
   - `UsuarioService.authenticateUsuario()` validates credentials via Spring Security's AuthenticationManager
   - JWT token generated via `JwtTokenService.generateToken(email)` using Auth0 java-jwt
   - Frontend stores token in localStorage
   - AuthContext calls `GET /users/me` to fetch user profile and set isAdmin/isMember flags

2. **Request Authorization:**
   - Axios interceptor injects `Authorization: Bearer <token>` header
   - Backend `UserAuthenticationFilter` extracts token from Authorization header
   - `JwtTokenService.getSubjectFromToken()` validates signature; returns email
   - `UsuarioRepository.findByEmail()` loads Usuario entity
   - `SecurityContextHolder` populated with UsuarioDetailsImpl (includes roles)
   - Spring Security filter chain checks @hasAnyRole/@hasRole annotations

3. **Session Restore:**
   - On app mount, AuthProvider checks localStorage for token
   - If present, calls `GET /users/me` to populate user context
   - If 401, clears token and redirects to /login (via axios interceptor)

### Pet Listing & Detail Flow

1. User navigates to `/pets`
2. `PetsPage` calls `usePets(filters)` hook
3. Hook executes `fetchPets(filters)` from `features/pets/api.ts`
4. Axios calls `GET /pets?especie=CAO&porte=GRANDE&page=0&size=10`
5. `PetController.findAll()` routes to `PetService.findAll()`
6. `PetRepository.findWithFilters()` queries database with Specification pattern
7. Results mapped to `RecoveryPetDTO` and returned as `Page<RecoveryPetDTO>`
8. TanStack Query caches response; UI renders pet cards
9. User clicks pet card → `/pets/:id`
10. `PetDetailPage` fetches single pet via `usePet(id)` hook
11. User can request adoption: form submits to `POST /solicitacoes` via `features/adocao/api.ts`

### Adoption Request Flow

1. Authenticated ROLE_CUSTOMER submits adoption request
2. `POST /solicitacoes` { petId, observacao } routed to `SolicitacaoController`
3. `SolicitacaoService.create()` validates pet exists and is available
4. Solicitacao entity created with status=PENDENTE
5. Admin views requests at `/admin/solicitacoes`
6. Admin updates status via `PUT /solicitacoes/:id/status` { status: "APROVADA"|"RECUSADA" }
7. Frontend refetches via `useSolicitacoes()` hook (invalidated by mutation)

### Image Upload Flow (Pets)

1. User uploads pet image from `AdminPetsPage`
2. `PetFormModal` creates FormData with two parts:
   - `dados`: JSON blob { nome, descricao, saude, caracteristica, ... }
   - `imagem`: File object (optional)
3. Axios POST to `/pets` with `headers: { 'Content-Type': undefined }` (removes boundary override)
4. `PetController.create()` receives @RequestPart("dados") and @RequestPart(value="imagem", required=false)
5. `PetService.uploadIfPresent()` validates:
   - File size ≤ 5MB
   - Content-Type starts with "image/"
6. `S3Service.uploadFile()` uploads to LocalStack (dev) or AWS S3 (prod)
7. S3 returns signed URL; stored in Pet.imagemUrl
8. User sees image in pet list

## State Management

**Backend:**
- Stateless HTTP; no session affinity required
- JWT contains only email (subject); user profile fetched per-request via email lookup
- Security context populated fresh per request by `UserAuthenticationFilter`

**Frontend:**
- Global state: `AuthContext` (user, token, isAdmin/isMember)
- Request cache: `TanStack Query` with 5-minute staleness
- Local state: Individual component useState for forms, modals
- No Redux/Zustand; Context + Query Client sufficient for this scope

## Key Abstractions

**JWT Token Service:**
- Purpose: Generate and validate JWT tokens
- Location: `com.adotejabackend.AdoteJaBackend.services.JwtTokenService`
- Pattern: Claims include email (subject) and 24-hour expiration
- Used by: UsuarioService (generation), UserAuthenticationFilter (validation)

**S3 File Upload:**
- Purpose: Abstract cloud/local file storage
- Location: `com.adotejabackend.AdoteJaBackend.services.S3Service`
- Pattern: Configurable endpoint (LocalStack dev, AWS prod via environment)
- Used by: PetService for pet images

**IDOR Protection:**
- Purpose: Prevent user tampering with others' data
- Location: `com.adotejabackend.AdoteJaBackend.services.AdotanteService.verifyOwnership()`
- Pattern: Check if authenticated user is resource owner OR has MEMBER/ADMINISTRATOR role
- Applied to: GET and PUT /adotantes/:id

**DTO Mapping:**
- Purpose: Decouple API contracts from domain models
- Pattern: Manual mapping in services (e.g., `toRecoveryDTO()`, `toCaracteristicaEntity()`)
- Benefit: Allows independent evolution of entities and APIs

## Entry Points

**Backend:**
- Location: `com.adotejabackend.AdoteJaBackend.AdoteJaBackendApplication`
- Triggers: Spring Boot application startup on port 8081
- Responsibilities:
  - Enable Spring Boot component scanning
  - Initialize application context
  - Activate all @Configuration beans (SecurityConfiguration, S3Config)

**Frontend:**
- Location: `src/main.tsx`
- Triggers: Vite dev server or production nginx
- Responsibilities:
  - Mount React app to #root DOM element
  - Wrap App with QueryClientProvider, AuthProvider, ToastProvider
  - Initialize router

**Request Entry Points:**

Backend:
- Public: `POST /users` (register), `POST /users/login` (auth)
- Public: `GET /pets`, `GET /pets/:id` (browse)
- Authenticated: `GET /users/me` (fetch profile)
- Authenticated: `POST /solicitacoes`, `GET /solicitacoes/minhas` (customer)
- Admin: `POST /pets`, `PUT /pets/:id`, `DELETE /pets/:id` (MEMBER/ADMINISTRATOR)
- Admin: `POST /funcionarios`, `GET /funcionarios` (ADMINISTRATOR only)

Frontend:
- App root at `/` (HomePage)
- Catch-all 404 at `*` (NotFoundPage)

## Error Handling

**Strategy:** Centralized exception handling with sanitization; no internal implementation details leaked to client

**Backend Patterns:**

Global handler at `com.adotejabackend.AdoteJaBackend.config.GlobalExceptionHandler`:
- `@ExceptionHandler(EntityNotFoundException.class)` → 404 with entity name
- `@ExceptionHandler(UsernameNotFoundException.class)` → 404 (generic)
- `@ExceptionHandler(DataIntegrityViolationException.class)` → 409 with generic message ("Conflito de dados")
- `@ExceptionHandler(MethodArgumentNotValidException.class)` → 400 with field-level validation messages
- `@ExceptionHandler(IllegalArgumentException.class)` → 400 (custom validations)
- `@ExceptionHandler(AccessDeniedException.class)` → 403 with generic message
- `@ExceptionHandler(RuntimeException.class)` → 500 with generic message ("Ocorreu um erro interno.") + server-side logging

JWT error in `UserAuthenticationFilter`:
- `JWTVerificationException` → 401 with message "Token inválido ou expirado."
- No stack trace or key details exposed

Error Response DTO: `ErrorResponseDTO` { status, message, timestamp }

**Frontend Patterns:**

Axios error handling in `src/lib/api.ts`:
- 401 response → localStorage token cleared, router redirects to /login
- All errors → wrapped in `getApiError()` helper returning normalized ApiError interface
- Components display `error.message` or fallback "Erro inesperado."

## Cross-Cutting Concerns

**Logging:**
- Backend: SLF4J (preconfigured by Spring Boot); GlobalExceptionHandler logs RuntimeException stack trace
- Frontend: Browser console; no structured logging

**Validation:**
- Backend:
  - DTO-level: @Valid, @Size, @NotBlank annotations
  - Service-level: Explicit checks (e.g., file size in PetService)
  - Database: Unique constraints on email, NOT NULL on required fields
- Frontend:
  - Form fields: HTML5 validation attributes
  - API interceptor: Axios request/response validation

**Authentication:**
- Method: JWT tokens via Authorization header
- Backend filter: `UserAuthenticationFilter` runs before Spring Security filter chain
- Frontend guard: `PrivateRoute`, `AdminRoute` wrappers check AuthContext state

**Authorization (RBAC):**
- Roles: ROLE_CUSTOMER (adopters), ROLE_MEMBER (staff), ROLE_ADMINISTRATOR (full admin)
- Backend: @hasRole/@hasAnyRole on SecurityFilterChain
- Frontend: AuthContext.isAdmin, AuthContext.isMember flags; routes conditionally render

**CORS:**
- Allowed origins: Configurable via `spring.web.cors.allowed-origins` property
- Allowed methods: GET, POST, PUT, DELETE, OPTIONS
- Allowed headers: Content-Type, Authorization only
- Credentials: true (cookies allowed if needed)
- Configured in: `com.adotejabackend.AdoteJaBackend.config.SecurityConfiguration.corsConfigurationSource()`

**Security Headers:**
- CSP (Content Security Policy): Restricts script execution; allows Google Fonts
- X-Frame-Options: deny (prevents clickjacking)
- X-Content-Type-Options: nosniff (prevents MIME-type sniffing)

**Multipart Handling:**
- Backend: Spring's built-in multipart support; part names must match @RequestPart annotations
- Frontend: FormData API; Axios configured to NOT set Content-Type header (preserves boundary)

---

*Architecture analysis: 2026-03-24*
