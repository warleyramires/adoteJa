# External Integrations

**Analysis Date:** 2026-03-24

## APIs & External Services

**Authentication (Custom):**
- Custom JWT-based authentication - Internal implementation
  - JWT Generation: `com.adotejabackend.AdoteJaBackend.services.JwtTokenService`
  - JWT Verification: `com.adotejabackend.AdoteJaBackend.components.UserAuthenticationFilter`
  - Library: Auth0 java-jwt 4.4.0
  - Algorithm: HMAC256

## Data Storage

**Databases:**
- MySQL 8.0
  - Connection string: `jdbc:mysql://localhost:3306/db_adoteja`
  - User: `warley` (dev), `root` (default)
  - Password: `12345678` (dev), empty (default)
  - ORM: Hibernate via Spring Data JPA (`spring-boot-starter-data-jpa`)
  - Driver: MySQL Connector/J

**File Storage:**
- AWS S3 / LocalStack S3 (local development)
  - Bucket name: `adoteja-pets`
  - Region: `us-east-1`
  - Access: Public read (`ObjectCannedACL.PUBLIC_READ`)
  - Service: `com.adotejabackend.AdoteJaBackend.services.S3Service`
  - Upload endpoint: `PUT /pets` (multipart form with `dados` and optional `imagem` parts)
  - Development endpoint: `http://localhost:4566` (LocalStack)
  - Production endpoint: AWS S3 standard (`https://adoteja-pets.s3.us-east-1.amazonaws.com`)
  - Credentials (dev): Static credentials (`test`/`test`) via `application-dev.properties`
  - Credentials (prod): Environment variables `aws.s3.access-key` and `aws.s3.secret-key`

**Caching:**
- TanStack Query v5 (client-side only) - Frontend server state caching
  - No backend caching layer configured
  - Query keys: Pet listings, adoption requests, user profile

## Authentication & Identity

**Auth Provider:**
- Custom JWT-based system
  - Implementation location: `com.adotejabackend.AdoteJaBackend.services.JwtTokenService`
  - Token creation: HMAC256 signature
  - Token expiration: 4 hours from creation
  - Timezone: America/Recife (Brazil)
  - Token storage (frontend): localStorage as `token` key
  - Token transmission: Bearer token in `Authorization` header
  - Endpoints:
    - `POST /users` - User registration (public)
    - `POST /users/login` - User login (public, returns JWT token)
    - `GET /users/me` - Current user profile (authenticated)

**Roles/Authorization:**
- Role-based access control (RBAC) via Spring Security
  - Roles: CUSTOMER, MEMBER, ADMINISTRATOR
  - Configuration: `com.adotejabackend.AdoteJaBackend.config.SecurityConfiguration`
  - Public endpoints: Login, registration, pet listing, adoption detail
  - Customer-only: POST adoption requests, view own requests
  - Member/Admin: Create/update pets, manage adoption requests
  - Admin-only: Delete pets, manage employees

## Monitoring & Observability

**Error Tracking:**
- None configured (no Sentry, DataDog, etc.)
- Exception handling: `com.adotejabackend.AdoteJaBackend.config.GlobalExceptionHandler`
  - Errors sanitized: JWT errors return "Token inválido ou expirado."
  - RuntimeException errors return "Ocorreu um erro interno."

**Logs:**
- Frontend: console.log only (no structured logging framework)
- Backend: Spring Boot default logging
  - SQL query logging enabled: `spring.jpa.show-sql=true`
  - Configuration: `application.properties` and `application-dev.properties`

**Webhooks & Callbacks:**
- None configured
- No outbound event notifications to external systems

## CI/CD & Deployment

**Hosting:**
- Docker containers (development and production ready)
- Backend:
  - Image: Multi-stage Maven 3.9 → Eclipse Temurin JRE 17
  - Dockerfile: `AdoteJaBackend/Dockerfile`
  - Port: 8081
  - Entrypoint: `java -jar app.jar`
- Frontend:
  - Image: Multi-stage Node 20 Alpine → Nginx Alpine
  - Dockerfile: `AdoteJaFrontend/Dockerfile`
  - Port: 80
  - Nginx config: `AdoteJaFrontend/nginx.conf`
  - Static files: Built dist deployed to `/usr/share/nginx/html`

**CI Pipeline:**
- None detected (no GitHub Actions, GitLab CI, Jenkins, etc.)
- Manual Docker build and push required

**Local Development Stack:**
- Docker Compose: `docker-compose.yml`
  - MySQL 8.0 service: `adoteja-mysql`
    - Port: 3306
    - Root password: `root`
    - User: `warley`, password: `12345678`
    - Database: `db_adoteja`
    - Volume: `adoteja-mysql-data` (persistent)
  - LocalStack service: `localstack/localstack:3.8.0`
    - Port: 4566 (all AWS services)
    - Region: us-east-1
    - Init script: `localstack/init-aws.sh` (creates S3 bucket)

## Environment Configuration

**Required env vars (Production):**
- `JWT_SECRET` - Secret key for HMAC256 token signing (no default)
- `JWT_ISSUER` - Token issuer claim (default: `adoteja-api`)
- `spring.web.cors.allowed-origins` - Comma-separated CORS origins
- `aws.s3.access-key` - AWS or LocalStack access key
- `aws.s3.secret-key` - AWS or LocalStack secret key
- `spring.datasource.url` - MySQL JDBC URL
- `spring.datasource.username` - MySQL user
- `spring.datasource.password` - MySQL password

**Frontend Environment:**
- `VITE_API_URL` - Backend API URL (default: `http://localhost:8081`)

**Secrets Location:**
- Development: `AdoteJaBackend/src/main/resources/application-dev.properties` (in .gitignore)
- Production: Environment variables at container runtime
- Frontend: API token stored in localStorage (session-based)

## Database Schema

**Migrations:**
- Tool: Flyway
- Location: `AdoteJaBackend/src/main/resources/db/migration`
- Baseline on migrate: enabled
- Dialect: MySQL 8 (`org.hibernate.dialect.MySQL8Dialect`)
- DDL auto: disabled (`hibernate.ddl-auto=none`)
- Generate DDL: enabled (for schema generation)

**Key Models:**
- Usuario (user accounts with roles)
- Adotante (adoption applicant profile)
- Funcionario (staff/employee)
- Pet (animal listings)
- Saude (health records for pets)
- Caracteristica (animal traits)
- Endereco (address/location data)
- Solicitacao (adoption requests)
- Role (authorization roles)
- Enums: Especie, Porte, Sexo, RoleName, StatusSolicitacao

## Webhooks & Callbacks

**Incoming:**
- None configured
- All endpoints are REST HTTP, no webhook receivers

**Outgoing:**
- None configured
- No outbound API calls to third-party services
- No email/SMS notifications (no SendGrid, Twilio, etc.)

## Security Headers (Backend)

**Implemented:**
- `X-Frame-Options: deny` - Prevent clickjacking
- `X-Content-Type-Options: nosniff` - Prevent MIME sniffing
- Content Security Policy:
  ```
  default-src 'self'
  font-src 'self' https://fonts.gstatic.com
  style-src 'self' https://fonts.googleapis.com 'unsafe-inline'
  img-src 'self' data: https:
  script-src 'self'
  ```
  - Location: `SecurityConfiguration` beans, lines 55-61

**CORS Configuration:**
- Allowed origins: Configurable via `spring.web.cors.allowed-origins`
- Allowed methods: GET, POST, PUT, DELETE, OPTIONS
- Allowed headers: Content-Type, Authorization
- Credentials: Allowed (sameSite handling required at client)
- Location: `com.adotejabackend.AdoteJaBackend.config.SecurityConfiguration`

## Frontend API Communication

**HTTP Client Setup:**
- Library: Axios 1.13.6
- Base URL: Environment variable `VITE_API_URL` or default `http://localhost:8081`
- Default headers: `Content-Type: application/json`
- Location: `src/lib/api.ts`

**Interceptors:**
- Request: Inject JWT token from localStorage
  ```typescript
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  ```
- Response: Handle 401 (unauthorized) by clearing token and redirecting to `/login`

---

*Integration audit: 2026-03-24*
