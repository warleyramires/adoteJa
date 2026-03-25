# Codebase Structure

**Analysis Date:** 2026-03-24

## Directory Layout

```
adoteJa/
├── AdoteJaBackend/             # Spring Boot REST API (Java 17)
│   ├── src/main/java/com/adotejabackend/AdoteJaBackend/
│   │   ├── AdoteJaBackendApplication.java
│   │   ├── components/         # Filter chains and cross-cutting concerns
│   │   ├── config/             # Spring configuration beans
│   │   ├── controllers/        # HTTP endpoint handlers
│   │   ├── dtos/               # API request/response contracts
│   │   ├── enums/              # Domain enums
│   │   ├── models/             # JPA entities
│   │   ├── repositories/       # Spring Data JPA interfaces
│   │   └── services/           # Business logic and transactions
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   ├── application-dev.properties
│   │   ├── application-prod.properties
│   │   └── db/migration/       # Flyway database migrations
│   ├── src/test/java/
│   ├── pom.xml
│   └── Dockerfile
├── AdoteJaFrontend/            # React + Vite SPA
│   ├── src/
│   │   ├── main.tsx            # Entry point
│   │   ├── App.tsx             # Root component wrapper
│   │   ├── pages/              # Full-page components
│   │   ├── pages/admin/        # Admin panel pages
│   │   ├── features/           # Feature-based modules
│   │   ├── components/         # Shared UI components
│   │   ├── contexts/           # Global state (Auth, Toast)
│   │   ├── router/             # Route definitions and guards
│   │   ├── lib/                # Utilities (axios, helpers)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── types/              # TypeScript type definitions
│   │   ├── assets/             # Images, SVGs
│   │   └── test/               # Test setup and mocks
│   ├── public/                 # Static assets (favicon, etc.)
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── nginx.conf              # Production nginx config
├── docker-compose.yml          # Local dev infrastructure (MySQL, LocalStack)
├── .gitignore
└── CLAUDE.md                   # Project context (DO NOT COMMIT)
```

## Directory Purposes

### Backend Structure

**`src/main/java/com/adotejabackend/AdoteJaBackend/`** - Application code root

**`components/`** - Filters and middleware
- Purpose: Spring Security filters and cross-cutting concerns
- Contains: `UserAuthenticationFilter.java` (JWT extraction and validation)
- Stateless request inspection; does not modify data

**`config/`** - Spring configuration
- Purpose: Bean definitions and infrastructure setup
- Key files:
  - `SecurityConfiguration.java`: Spring Security filter chain, CORS, JWT validation flow
  - `S3Config.java`: AWS SDK v2 client initialization (LocalStack dev, AWS prod)
  - Any other @Configuration classes

**`controllers/`** - HTTP endpoint handlers
- Purpose: Request routing, parameter binding, response marshaling
- Pattern: One @RestController per domain (Usuario, Pet, Adotante, etc.)
- Files:
  - `UsuarioController.java`: POST /users (register), POST /users/login, GET /users/me
  - `PetController.java`: CRUD /pets with multipart image upload
  - `AdotanteController.java`: GET/PUT /adotantes/:id with ownership verification
  - `SolicitacaoController.java`: POST/GET/PUT /solicitacoes for adoption requests
  - `FuncionarioController.java`: GET/POST /funcionarios (admin only)

**`dtos/`** - API contracts
- Purpose: Request/response DTOs; separates API shape from domain models
- Naming:
  - `Create[Entity]DTO.java`: Input for POST endpoints
  - `Update[Entity]DTO.java`: Input for PUT endpoints
  - `Recovery[Entity]DTO.java`: Output for GET endpoints
- Validation: @NotBlank, @Size, @Valid annotations

**`enums/`** - Domain enumerations
- Purpose: Strongly-typed enum values
- Files:
  - `Especie.java`: CAO, GATO, OUTRO
  - `Porte.java`: PEQUENO, MEDIO, GRANDE
  - `Sexo.java`: MACHO, FEMEA
  - `RoleName.java`: ROLE_CUSTOMER, ROLE_MEMBER, ROLE_ADMINISTRATOR
  - `StatusSolicitacao.java`: PENDENTE, APROVADA, RECUSADA

**`models/`** - JPA entities
- Purpose: Database-mapped domain objects
- Strategy: Single-table inheritance for Usuario hierarchy (Usuario → Adotante, Funcionario)
- Key entities:
  - `Usuario.java`: Base user entity with @ManyToMany Role relationship
  - `Adotante.java`: Adopter subclass
  - `Funcionario.java`: Staff subclass
  - `Pet.java`: Pet data with cascaded Saude and Caracteristica (OneToOne)
  - `Saude.java`: Health information (vaccination, spaying, deworming)
  - `Caracteristica.java`: Physical attributes (breed, color, species, size, sex)
  - `Endereco.java`: Address linked to Usuario
  - `Role.java`: Authority definition
  - `Solicitacao.java`: Adoption request
  - `UsuarioDetailsImpl.java`: Spring Security UserDetails adapter

**`repositories/`** - Data access layer
- Purpose: Spring Data JPA repository interfaces
- Pattern: Extend JpaRepository<Entity, ID> and add custom query methods
- Files:
  - `UsuarioRepository.java`: findByEmail(), findById()
  - `PetRepository.java`: findWithFilters() using Specification pattern for especie/porte/sexo/disponivel
  - `AdotanteRepository.java`: Standard CRUD
  - `SolicitacaoRepository.java`: findByAdotanteId(), findByStatus()
  - `FuncionarioRepository.java`: CRUD
  - `RoleRepository.java`: findByName()

**`services/`** - Business logic layer
- Purpose: Transaction management, data transformation, validation
- Pattern: @Service with @Transactional methods; delegate to repositories
- Key services:
  - `UsuarioService.java`: Registration, authentication, JWT generation; calls AuthenticationManager
  - `PetService.java`: Create/read/update/delete; image upload validation (5MB max, MIME type check)
  - `AdotanteService.java`: Profile CRUD; IDOR protection via verifyOwnership()
  - `SolicitacaoService.java`: Request creation/status updates
  - `JwtTokenService.java`: Token generation/validation using Auth0 java-jwt library
  - `S3Service.java`: File upload abstraction
  - `UserDetailsServiceImpl.java`: Spring Security UserDetailsService implementation
  - `FuncionarioService.java`: Staff management

**`src/main/resources/`**
- `application.properties`: Default configuration
- `application-dev.properties`: Local development overrides (in .gitignore)
- `application-prod.properties`: Production overrides
- `db/migration/`: Flyway SQL migration scripts (versioned V001__, V002__, etc.)

**`src/test/java/`**
- Unit and integration tests mirroring src/main structure
- Examples: `AdotanteServiceTest.java` (IDOR verification), `PetServiceTest.java`

**`Dockerfile`** - Multi-stage production build
- Stage 1: Maven build
- Stage 2: JRE 17 runtime; copies JAR from stage 1
- Exposes port 8081

### Frontend Structure

**`src/main.tsx`** - Application entry
- Purpose: React app initialization
- Creates QueryClient, mounts App to #root
- Applies global providers: QueryClientProvider, AuthProvider, ToastProvider

**`src/App.tsx`** - Root component
- Purpose: Wraps entire app with essential providers
- Imports: RouterProvider from React Router v6

**`src/pages/`** - Full-page components
- Purpose: Top-level route components
- Public pages:
  - `HomePage.tsx`: Welcome page with hero, featured pets
  - `LoginPage.tsx`: Email/password form
  - `CadastroPage.tsx`: Adopter registration form
  - `PetsPage.tsx`: Pet listing with filters (especie, porte, sexo, disponivel)
  - `PetDetailPage.tsx`: Single pet view with adoption request form
  - `SobrePage.tsx`: About/info page
  - `NotFoundPage.tsx`: 404 catch-all
- Private pages (requires PrivateRoute):
  - `MinhasSolicitacoesPage.tsx`: My adoption requests (ROLE_CUSTOMER)
  - `MinhaContaPage.tsx`: My profile/account management
- Admin pages (requires AdminRoute):
  - `admin/AdminPetsPage.tsx`: Pet CRUD with image upload modal
  - `admin/AdminSolicitacoesPage.tsx`: Request approval/rejection
  - `admin/AdminFuncionariosPage.tsx`: Staff management

**`src/features/`** - Feature modules (domain-organized)
- Pattern: Each feature is self-contained with api.ts, hooks/, components/
- Folders:
  - **`auth/`** - Authentication
    - `api.ts`: login(), fetchMe()
    - `hooks/`: useLogin, useCadastro
    - `components/`: LoginForm, CadastroForm
  - **`pets/`** - Pet management
    - `api.ts`: fetchPets(), fetchPetById()
    - `adminApi.ts`: createPet(), updatePet(), deletePet()
    - `hooks/`: usePets, usePet, useAdminPets
    - `components/`: PetFormModal (image upload, form fields)
  - **`adocao/`** - Adoption requests
    - `api.ts`: createSolicitacao(), fetchSolicitacoes(), updateSolicitacaoStatus()
    - `hooks/`: useSolicitacoes
    - `components/`: SolicitacaoForm, SolicitacaoList
  - **`adotante/`** - Adopter profiles
    - `api.ts`: fetchAdotante(), updateAdotante()
    - `hooks/`: useAdotante
  - **`funcionario/`** - Staff management
    - `api.ts`: createFuncionario(), fetchFuncionarios()
    - `hooks/`: useFuncionario

**`src/components/`** - Shared UI components
- **`layout/`**:
  - `Header.tsx`: Top navigation bar with logo, nav links, user menu (shows name if authenticated)
  - `PageLayout.tsx`: Wrapper providing Header + footer structure
- **`ui/`** - Reusable styled components:
  - `Button.tsx`: Primary action button (Tailwind: bg-ambar-500, text-white)
  - `Input.tsx`: Text input with Tailwind styling
  - `Badge.tsx`: Status/tag labels
  - `Toast.tsx`: Notification popup (success/error)

**`src/contexts/`** - Global state
- `AuthContext.tsx`:
  - Manages: user (name, email, id, role), token (localStorage), isAdmin, isMember flags
  - Init: Calls fetchMe() on mount to restore session
  - Exports: useAuthContext() hook
  - Methods: login(token), logout()
- `ToastContext.tsx`:
  - Manages: Array of toast notifications
  - Methods: showToast(message, type)
  - Exports: useToastContext() hook

**`src/router/`** - Routing configuration
- `index.tsx`:
  - Exports: router object from createBrowserRouter()
  - Routes:
    - Public: /, /login, /cadastro, /pets, /pets/:id, /sobre, *
    - Protected by PrivateRoute: /minhas-solicitacoes, /minha-conta
    - Protected by AdminRoute: /admin/pets, /admin/solicitacoes, /admin/funcionarios
- `PrivateRoute.tsx`:
  - `PrivateRoute`: Checks isAuthenticated, redirects unauthenticated to /login
  - `AdminRoute`: Checks isMember, redirects non-admin to /

**`src/lib/`** - Shared utilities
- `api.ts`:
  - Creates Axios instance with baseURL from VITE_API_URL env var
  - Request interceptor: Injects `Authorization: Bearer <token>` from localStorage
  - Response interceptor: Handles 401 (clears token, navigates to /login)
  - Exports: api instance, getApiError() helper
- `utils.ts`: General-purpose helpers (formatting, validation, etc.)

**`src/hooks/`** - Custom hooks (not feature-specific)
- Reusable hooks for common patterns (e.g., useFetch, useForm)

**`src/types/`** - TypeScript definitions
- `index.ts`: Central type definitions mirroring backend DTOs
  - Enums: Especie, Porte, Sexo, RoleName, StatusSolicitacao
  - Interfaces: Pet, Adotante, Solicitacao, User, etc.
  - Request/Response types (LoginRequest, CreatePetRequest, etc.)

**`src/assets/`** - Static images
- Pet photos used in listings/details
- Logo/branding images

**`src/test/`** - Testing infrastructure
- `setup.ts`: Vitest configuration, mocks, test utilities

**Configuration files:**
- `vite.config.ts`: Vite build configuration; React plugin; alias paths
- `tsconfig.json`: TypeScript strict mode; module resolution
- `tailwind.config.js`: Custom Tailwind colors (azul, ambar, pedra, creme, carbon)
- `package.json`: Dependencies, scripts (npm run dev, npm run build, npm run test)

**`public/`** - Static assets served as-is
- `index.html`: HTML template (React mounts to #root)
- `vite.svg`: Current favicon (should be replaced with pet icon)
- Other favicons if needed

**`Dockerfile`** - Multi-stage production build
- Stage 1: Node 20 builds React/Vite app
- Stage 2: nginx serves dist/ folder on port 80
- nginx.conf: try_files with fallback to /index.html (React Router compatibility)

**`nginx.conf`** - Production web server
- Serves static files from /usr/share/nginx/html/dist/
- Proxy not needed; frontend makes direct API calls to backend
- SPA fallback: try_files directive routes all non-file requests to /index.html

## Naming Conventions

### Backend

**Files:**
- Controllers: `[Entity]Controller.java` (UsuarioController, PetController)
- Services: `[Entity]Service.java` (PetService, AdotanteService)
- Repositories: `[Entity]Repository.java` (PetRepository, UsuarioRepository)
- DTOs: `[Action][Entity]DTO.java` (CreatePetDTO, UpdateAdotanteDTO, RecoveryPetDTO)
- Models: `[Entity].java` (Pet, Usuario, Adotante)
- Enums: `[EnumName].java` (Especie, RoleName, StatusSolicitacao)

**Classes:**
- Entities: PascalCase, singular (Pet, Usuario, Solicitacao)
- DTOs: PascalCase with suffix DTO (CreatePetDTO)
- Services: PascalCase with suffix Service
- Repositories: PascalCase with suffix Repository

**Methods:**
- Getters/Setters: Generated by Lombok (@Data)
- Custom finders: findBy[Property], findWithFilters()
- Transformers: to[Entity]DTO(), to[Entity]Entity()
- Validators: verify[Condition]() (e.g., verifyOwnership())

**Constants:**
- MAX_FILE_SIZE, ENDPOINTS_WITH_AUTHENTICATION_NOT_REQUIRED

### Frontend

**Files:**
- Pages: `[PageName]Page.tsx` (LoginPage, AdminPetsPage)
- Components: `[ComponentName].tsx` (Header, Button, PetFormModal)
- Hooks: `use[HookName].ts` (usePets, useLogin)
- API files: `api.ts` (one per feature)
- Types: `index.ts` (central types file)

**Directories:**
- Features: Lowercase plural nouns (pets, auth, adocao, adotante, funcionario)
- UI components: Lowercase (ui, layout)
- Non-feature hooks: `hooks/` (not feature-scoped)

**Variables & Functions:**
- camelCase for functions and variables
- UPPER_SNAKE_CASE for constants (e.g., ROLE_CUSTOMER in types)
- React components: PascalCase
- Custom hooks: Prefix with `use` (useQuery, useSolicitacoes)

**TypeScript:**
- Interfaces over types (except unions like Especie = 'CAO' | 'GATO')
- Generic types for reusable patterns (Page<T>, ApiError)
- Explicit return types for functions

## Where to Add New Code

### New Feature (Backend)

1. **Entity Model:**
   - Create `src/main/java/com/adotejabackend/AdoteJaBackend/models/[Entity].java`
   - Annotate with @Entity, @Table, Lombok decorators

2. **Database Migration:**
   - Create `src/main/resources/db/migration/V[Number]__[description].sql`
   - Flyway auto-runs on startup

3. **DTOs:**
   - Create `src/main/java/com/adotejabackend/AdoteJaBackend/dtos/Create[Entity]DTO.java`
   - Create `src/main/java/com/adotejabackend/AdoteJaBackend/dtos/Update[Entity]DTO.java` (if needed)
   - Create `src/main/java/com/adotejabackend/AdoteJaBackend/dtos/Recovery[Entity]DTO.java`
   - Add @Valid, @Size, @NotBlank validation annotations

4. **Repository:**
   - Create `src/main/java/com/adotejabackend/AdoteJaBackend/repositories/[Entity]Repository.java`
   - Extend JpaRepository<[Entity], Long>
   - Add custom query methods if needed

5. **Service:**
   - Create `src/main/java/com/adotejabackend/AdoteJaBackend/services/[Entity]Service.java`
   - Annotate with @Service
   - Inject @Autowired repositories and other services
   - Implement business logic and transformations (to/from DTOs)

6. **Controller:**
   - Create `src/main/java/com/adotejabackend/AdoteJaBackend/controllers/[Entity]Controller.java`
   - Annotate with @RestController, @RequestMapping("/[entities]")
   - Define endpoint methods (@GetMapping, @PostMapping, etc.)
   - Inject @Autowired service
   - Route to service methods and return ResponseEntity with DTOs

7. **Security:**
   - Update `SecurityConfiguration.java` if new endpoints need authorization rules
   - Add `.requestMatchers(HttpMethod.*, "/[path]").hasRole(...)` or `.permitAll()`

8. **Testing:**
   - Create `src/test/java/com/adotejabackend/AdoteJaBackend/services/[Entity]ServiceTest.java`
   - Use @SpringBootTest for integration tests
   - Mock repositories with @MockBean
   - Test business logic and error cases

### New Feature (Frontend)

1. **Feature Folder Structure:**
   - Create `src/features/[feature]/`
   - Create `src/features/[feature]/api.ts` (Axios calls)
   - Create `src/features/[feature]/hooks/` directory
   - Create `src/features/[feature]/components/` directory

2. **API Integration:**
   - Write `src/features/[feature]/api.ts` with async functions
   - Import `api` from `lib/api`
   - Return typed promises (e.g., `Promise<Pet>`)

3. **Hooks:**
   - Create `src/features/[feature]/hooks/use[FeatureHook].ts`
   - Use `useQuery()` from TanStack Query for fetching
   - Use `useMutation()` for mutations (POST/PUT/DELETE)
   - Export hook for use in pages/components

4. **Components:**
   - Create `src/features/[feature]/components/[Component].tsx`
   - Keep feature-specific components in feature folder
   - Use shared UI components from `src/components/ui/`

5. **Pages:**
   - Create `src/pages/[FeatureName]Page.tsx`
   - Call feature hooks (usePets, useSolicitacoes, etc.)
   - Render layout + feature components
   - Wrap with PageLayout for consistent header/footer

6. **Routing:**
   - Add route to `src/router/index.tsx`
   - Use `PrivateRoute` or `AdminRoute` if authentication required
   - Example: `{ path: '/[feature]', element: <[Feature]Page /> }`

7. **Types:**
   - Add TypeScript interfaces to `src/types/index.ts`
   - Follow naming: Request/Response suffixes, interfaces for objects

8. **Testing:**
   - Create `src/features/[feature]/hooks/use[Hook].test.ts`
   - Mock Axios responses in test setup
   - Test hook behavior with Vitest

### New UI Component (Frontend)

1. **Reusable Component:**
   - Create `src/components/ui/[Component].tsx`
   - Accept props for content, styling, behavior
   - Use Tailwind CSS classes
   - Export named function

2. **Example Structure:**
   ```typescript
   interface [Component]Props {
     variant?: 'primary' | 'secondary'
     size?: 'sm' | 'md' | 'lg'
     children: ReactNode
   }

   export function [Component]({ variant = 'primary', size = 'md', children }: [Component]Props) {
     return (
       <div className={`px-4 py-2 ${/* tailwind classes */}`}>
         {children}
       </div>
     )
   }
   ```

## Special Directories

**Backend:**

**`.gitignore` (root level):**
- Ignores: docs/, CLAUDE.md, node_modules/, target/, .env, .env.local
- Does NOT ignore: Dockerfile, docker-compose.yml, README.md

**`application-dev.properties`:**
- Generated: No (user creates locally)
- Committed: No (in .gitignore)
- Purpose: Local overrides for database, S3 endpoint, JWT secret (if applicable)

**`db/migration/`:**
- Generated: No (manually written SQL)
- Committed: Yes
- Purpose: Version-controlled database schema evolution (Flyway)

**Frontend:**

**`.vite/`:**
- Generated: Yes (Vite cache directory)
- Committed: No (in .gitignore)

**`dist/`:**
- Generated: Yes (npm run build output)
- Committed: No
- Purpose: Production-ready JavaScript bundles and assets

**`node_modules/`:**
- Generated: Yes (npm install)
- Committed: No
- Lock file: package-lock.json IS committed

**`src/assets/`:**
- Generated: No
- Committed: Yes
- Purpose: Images, SVGs, static files bundled by Vite

**`public/`:**
- Generated: No (user-managed)
- Committed: Yes
- Purpose: Files served as-is by Vite dev server; copied to dist/ in production

---

*Structure analysis: 2026-03-24*
