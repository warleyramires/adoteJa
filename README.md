# AdoteJá

Plataforma de adoção de pets que conecta adotantes a animais disponíveis para adoção, com painel administrativo para gestão de pets, funcionários e solicitações.

## Stack

| Camada | Tecnologias |
|--------|-------------|
| Backend | Java 17, Spring Boot 3.4, Spring Security + JWT, Flyway, MySQL 8 |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS 3, TanStack Query v5 |
| Armazenamento | AWS S3 (prod) / LocalStack (dev) |
| Infra local | Docker Compose (MySQL + LocalStack) |

## Pré-requisitos

- Java 17+
- Node.js 20+
- Docker + Docker Compose

## Rodando localmente

### 1. Infra (banco + S3 local)

```bash
docker-compose up -d
```

- MySQL: `localhost:3306` — banco `db_adoteja`, user `warley`, senha `12345678`
- LocalStack S3: `localhost:4566` — bucket `adoteja-pets` criado automaticamente

### 2. Backend

```bash
cd AdoteJaBackend
./mvnw package -DskipTests -q
java -jar target/AdoteJaBackend-0.0.1-SNAPSHOT.jar
```

Disponível em `http://localhost:8081`

### 3. Frontend

```bash
cd AdoteJaFrontend
npm install
npm run dev
```

Disponível em `http://localhost:5173`

## Build com Docker

### Backend

```bash
docker build -t adoteja-backend ./AdoteJaBackend
docker run -p 8081:8081 adoteja-backend
```

### Frontend

```bash
docker build -t adoteja-frontend ./AdoteJaFrontend
docker run -p 80:80 adoteja-frontend
```

## Endpoints principais

| Método | Rota | Acesso |
|--------|------|--------|
| POST | `/users` | Público |
| POST | `/users/login` | Público |
| GET | `/users/me` | Autenticado |
| GET/PUT | `/adotantes/:id` | Dono ou Admin |
| GET | `/pets` | Público |
| POST/PUT/DELETE | `/pets/:id` | Admin |
| POST | `/solicitacoes` | Autenticado |
| GET | `/solicitacoes/minhas` | Autenticado |
| GET | `/solicitacoes` | Admin |
| PUT | `/solicitacoes/:id/status` | Admin |
| GET/POST | `/funcionarios` | Admin |

## Padrão de commits

```
<tipo>(<escopo>): <mensagem>
```

Tipos: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `perf`, `ci`, `build`, `chore`
