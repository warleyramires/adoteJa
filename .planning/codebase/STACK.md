# Technology Stack

**Analysis Date:** 2026-03-24

## Languages

**Primary:**
- Java 17 - Backend application (`AdoteJaBackend`)
- TypeScript 5.9 - Frontend application (`AdoteJaFrontend`)
- JavaScript (ES2023+) - Node.js utilities and configuration

**Secondary:**
- HTML/CSS - Frontend UI (via Tailwind CSS)
- SQL - Database queries (MySQL 8.0)
- YAML/Properties - Configuration files

## Runtime

**Environment:**
- Java Runtime Environment (JRE) 17 - Backend execution
- Node.js 20 - Frontend development and build
- Nginx (Alpine) - Frontend production server

**Package Manager:**
- Maven 3.9 (Java) - Backend dependency management
  - Lockfile: `pom.xml`
- npm - Frontend dependency management
  - Lockfile: `package-lock.json` (present)

## Frameworks

**Core:**
- Spring Boot 3.4.4 - Backend web framework
- React 19.2.4 - Frontend UI library
- Vite 8.0.0 - Frontend build tool and dev server

**HTTP Client:**
- Axios 1.13.6 - Frontend HTTP requests

**Routing & State:**
- React Router v7.13.1 - Frontend routing
- TanStack Query v5.91.0 - Frontend server state management and caching

**Authentication:**
- Spring Security 6.x (via spring-boot-starter-security) - Backend auth framework
- Auth0 java-jwt 4.4.0 - JWT token generation and validation

**Database:**
- Spring Data JPA - ORM layer
- Hibernate 6.x (via Spring Boot) - Persistence provider
- Flyway 10.x - Database migration management

**Styling:**
- Tailwind CSS 3.4.19 - Utility-first CSS framework
- PostCSS 8.5.8 - CSS transformation tool
- Autoprefixer 10.4.27 - CSS vendor prefix addition

**API Documentation:**
- Springdoc OpenAPI 2.8.0 - Swagger/OpenAPI documentation (backend)

**Testing:**
- Vitest 4.1.0 - Frontend test runner
- Testing Library (React 16.3.2, User Event 14.6.1, Jest DOM 6.9.1) - Frontend testing utilities
- Spring Boot Test - Backend testing

**Build/Dev Tools:**
- TypeScript 5.9.3 - Type checking and compilation
- ESLint 9.39.4 - JavaScript/TypeScript linting
- ESLint plugins:
  - @eslint/js - JavaScript recommended rules
  - typescript-eslint 8.56.1 - TypeScript support
  - eslint-plugin-react-hooks 7.0.1 - React hooks rules
  - eslint-plugin-react-refresh 0.5.2 - React Fast Refresh support
- Spring Boot DevTools - Live reload for backend

**Code Generation/Reduction:**
- Lombok 1.18.x - Java annotation processing for boilerplate reduction

## Key Dependencies

**Security (Critical):**
- Auth0 java-jwt 4.4.0 - JWT creation and verification using HMAC256
  - Algorithms: HMAC256 with configurable secret key
  - Token claims: issuer, issuedAt, expiresAt, subject (email)
  - Expiration: 4 hours (configurable via code in `JwtTokenService`)
- Spring Security 6.x - Authentication filters, password encoding, authorization
  - Password encoder: BCryptPasswordEncoder
  - Session policy: STATELESS (JWT-based)

**Database (Critical):**
- MySQL Connector/J - MySQL JDBC driver
- Spring Data JPA - Entity management and repository pattern
- Flyway Core & MySQL - Database versioning and migrations
  - Migration scripts location: `src/main/resources/db/migration`
  - Baseline on migrate: enabled

**Cloud/Storage (Critical):**
- AWS SDK v2 (2.25.16 BOM) - AWS service client library
  - S3 client for file uploads and management
  - Endpoint override support for LocalStack (development)
  - Credentials: Static credentials provider (dev), IAM (prod)
- LocalStack 3.8.0 - AWS S3 emulation for local development

**Validation:**
- Spring Boot Starter Validation - Bean validation annotations
  - Uses Jakarta Validation (part of Spring Boot 3.4.4)

**Utilities:**
- Axios 1.13.6 - Promise-based HTTP client for frontend
  - Request/response interceptors for auth token injection
  - Automatic 401 redirect on token expiration

## Configuration

**Environment:**
- Maven profiles:
  - Default: `application.properties`
  - Dev: `application-dev.properties` (in .gitignore)
  - Production: Environment variables via `@Value` annotations

- Frontend environment variables:
  - `VITE_API_URL` - Backend API endpoint (defaults to `http://localhost:8081`)

**Security Configuration:**
- JWT secret: `api.security.token.secret` (env var: `JWT_SECRET`)
- JWT issuer: `api.security.token.issuer` (env var: `JWT_ISSUER`, defaults to `adoteja-api`)
- CORS allowed origins: `spring.web.cors.allowed-origins` (env var, comma-separated)
- Password encoding: BCrypt with default strength

**Build Configuration:**
- Frontend: `vite.config.ts` with React plugin, Vitest integration
- Backend: `pom.xml` with Maven Compiler and Spring Boot Maven plugins
- TypeScript: `tsconfig.json` (main), `tsconfig.app.json`, `tsconfig.node.json`
  - Strict mode enabled
  - Unused local/parameter detection enabled
  - JSX: react-jsx
  - Target: ES2023

**Linting & Formatting:**
- ESLint: `eslint.config.js` (flat config format)
  - Extends: @eslint/js, typescript-eslint, react-hooks, react-refresh
  - Ignores: `dist/`
- Prettier: Not configured (no `.prettierrc` found)
- Tailwind CSS: `tailwind.config.js` with custom color palette

## Platform Requirements

**Development:**
- Java 17 SDK (Maven will download dependencies automatically)
- Node.js 20.x (for npm and Vite)
- MySQL 8.0 (Docker: `adoteja-mysql` container)
- LocalStack 3.8.0 (Docker: `adoteja-localstack` container for S3)
- Docker & Docker Compose (for local infrastructure)

**Production:**
- Java 17 Runtime (JRE) - Backend container
- Nginx Alpine - Frontend static server
- MySQL 8.0 - Persistent database
- AWS S3 or compatible object storage
- Network access: Backend on port 8081, Frontend on port 80

**Build Requirements:**
- Backend: `mvn package -DskipTests` produces `AdoteJaBackend-0.0.1-SNAPSHOT.jar`
- Frontend: `npm run build` produces minified dist for Nginx serving

---

*Stack analysis: 2026-03-24*
