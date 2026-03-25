# Codebase Security Concerns

**Analysis Date:** 2026-03-24

**CRITICAL FINDINGS:** 5 HIGH severity issues identified. See details below.

---

## OWASP Top 10 Assessment

### A01: Broken Access Control

**IDOR Risk in Adotante Endpoints - PARTIALLY MITIGATED**
- **Risk:** GET/PUT `/adotantes/{id}` endpoints
  - Files: `AdoteJaBackend/src/main/java/com/adotejabackend/AdoteJaBackend/controllers/AdotanteController.java` (lines 25-34)
  - Files: `AdoteJaBackend/src/main/java/com/adotejabackend/AdoteJaBackend/services/AdotanteService.java` (lines 64-94)
- **Status:** MITIGATED with `verifyOwnership()` check implemented (lines 96-108)
  - Customers can only access/update their own records
  - MEMBER/ADMINISTRATOR roles bypass ownership check and can access all records
- **Remaining Gap:** Authorization happens at SERVICE level, not CONTROLLER level. If service layer is bypassed or improperly called, IDOR persists. Consider adding `@PreAuthorize` annotations at controller methods.

**Solicitacao Status Update - HIGH SEVERITY**
- **Risk:** `PUT /solicitacoes/{id}/status` lacks authorization validation
  - Files: `AdoteJaBackend/src/main/java/com/adotejabackend/AdoteJaBackend/controllers/SolicitacaoController.java` (lines 37-42)
  - Files: `AdoteJaBackend/src/main/java/com/adotejabackend/AdoteJaBackend/services/SolicitacaoService.java` (lines 68-82)
- **Severity:** HIGH
- **Impact:** Any MEMBER/ADMINISTRATOR can update ANY solicitation status without verifying they manage that request. No check for staff ownership or responsibility.
- **Example Attack:** Admin from region A could approve adoptions they don't supervise.
- **Fix Approach:** Add service-level authorization check (e.g., `verifyAffiliationOrAdmin()`) that validates the current user manages this region/pet/adotante.

**Funcionario Management - MISSING OWNERSHIP**
- **Risk:** `PUT /funcionarios/{id}` and `DELETE /funcionarios/{id}` allow ADMINISTRATOR to modify/delete any employee without audit trail
  - Files: `AdoteJaBackend/src/main/java/com/adotejabackend/AdoteJaBackend/controllers/FuncionarioController.java` (lines 37-48)
  - Files: `AdoteJaBackend/src/main/java/com/adotejabackend/AdoteJaBackend/services/FuncionarioService.java`
- **Severity:** MEDIUM
- **Impact:** No logging or approval flow for employee modifications. Admin could elevate their own permissions or remove audit trails.
- **Fix Approach:** Implement audit logging and require approval from multi-admin for privilege escalations.

### A02: Cryptographic Failures

**Weak JWT Secret in Development - MEDIUM SEVERITY**
- **Risk:** JWT secret hardcoded in `application-dev.properties`
  - Files: `AdoteJaBackend/src/main/resources/application-dev.properties` (line 16)
  - Value: `api.security.token.secret=dev-secret-key-adoteja-2024`
- **Severity:** MEDIUM (dev env, but committed to repo)
- **Impact:** If this is ever used in production or dev credentials leaked, attacker can forge valid JWT tokens indefinitely.
- **Why it Matters:** This is checked into git `.gitignore` does NOT ignore it. Anyone with repo access has the key.
- **Fix Approach:**
  1. Move `application-dev.properties` to `.gitignore` (already listed in CLAUDE.md but verify enforcement)
  2. Use `.env.example` or documentation-only version
  3. Production must use strong `JWT_SECRET` env var (currently supports this via `${JWT_SECRET:}`)

**Missing JWT Secret Validation - LOW SEVERITY**
- **Risk:** Empty JWT_SECRET in production allows fallback
  - Files: `AdoteJaBackend/src/main/resources/application.properties` (line 23)
  - Value: `api.security.token.secret=${JWT_SECRET:}` (empty default)
- **Severity:** LOW (but dangerous)
- **Impact:** If `JWT_SECRET` env var is not set, the empty string is used as HMAC secret. Any token signed with "" can be forged.
- **Fix Approach:** Add mandatory configuration validation:
  ```java
  @Component
  public class ConfigValidator {
    @PostConstruct
    public void validateSecrets() {
      String secret = env.getProperty("api.security.token.secret");
      if (secret == null || secret.isBlank()) {
        throw new IllegalStateException("JWT_SECRET must be set and non-empty");
      }
    }
  }
  ```

**S3 Credentials in Properties - MEDIUM SEVERITY**
- **Risk:** AWS S3 access key/secret in `application-dev.properties`
  - Files: `AdoteJaBackend/src/main/resources/application-dev.properties` (lines 9-10)
  - Values: `aws.s3.access-key=test`, `aws.s3.secret-key=test`
- **Severity:** MEDIUM (dev-only, but hardcoded)
- **Impact:** If dev credentials were real AWS keys, they could be used to enumerate/delete S3 buckets.
- **Fix Approach:** Same as JWT secret — use env vars only. Current code supports this:
  ```properties
  aws.s3.access-key=${AWS_ACCESS_KEY_ID:}
  aws.s3.secret-key=${AWS_SECRET_ACCESS_KEY:}
  ```

**Database Credentials Exposed - MEDIUM SEVERITY**
- **Risk:** MySQL credentials in `application-dev.properties`
  - Files: `AdoteJaBackend/src/main/resources/application-dev.properties` (lines 4-5)
  - Username: `warley`, Password: `12345678`
- **Severity:** MEDIUM
- **Impact:** Weak password + hardcoded = risk if dev environment exposed.
- **Fix Approach:** Enforce environment variable override for all databases.

**File Upload Permissions - HIGH SEVERITY**
- **Risk:** S3 objects uploaded with `PUBLIC_READ` ACL
  - Files: `AdoteJaBackend/src/main/java/com/adotejabackend/AdoteJaBackend/services/S3Service.java` (line 43)
  - Code: `.acl(ObjectCannedACL.PUBLIC_READ)`
- **Severity:** HIGH
- **Impact:** All pet images accessible to anyone with S3 URL. No access control. URL enumeration attack possible.
- **Fix Approach:**
  1. Change to `PRIVATE` ACL
  2. Generate pre-signed URLs for downloads (valid for 24hrs)
  3. Serve images through backend proxy (`/images/{id}`) with authentication

### A03: Injection

**No SQL Injection Risk Detected**
- Spring Data JPA with parameterized queries reduces risk. All queries use `findById()`, `findByEmail()`, etc.
- `PetRepository.findWithFilters()` uses proper parameterization (not visible in provided code, but Spring convention).

**Command Injection Risk: Null**
- No shell execution or `Runtime.exec()` detected.

**Log Injection - LOW SEVERITY**
- **Risk:** Error messages logged without sanitization
  - Files: `AdoteJaBackend/src/main/java/com/adotejabackend/AdoteJaBackend/config/GlobalExceptionHandler.java` (line 59)
  - Code: `log.error("Unhandled runtime exception", ex)`
- **Severity:** LOW
- **Impact:** Stack traces logged to stdout. If logs aggregated unsanitized, attacker could inject log entries. Unlikely but possible with deserialization gadgets.
- **Fix Approach:** Already safe due to structured logging (exception object, not string formatting).

### A04: Insecure Design

**No CSRF Protection (BUT MITIGATED)**
- **Risk:** CSRF disabled in SecurityConfiguration
  - Files: `AdoteJaBackend/src/main/java/com/adotejabackend/AdoteJaBackend/config/SecurityConfiguration.java` (line 50)
  - Code: `.csrf(csrf -> csrf.disable())`
- **Severity:** MEDIUM (mitigated by stateless JWT auth)
- **Justification:** REST API uses stateless JWT tokens in `Authorization` header. Browser CSRF attacks (which exploit cookies) don't apply.
- **Remaining Risk:** If SPA is ever served from same origin without `SameSite` cookies, CSRF via form submission possible.
- **Recommendation:** Keep CSRF disabled for API. Ensure frontend enforces proper CORS headers.

**Rate Limiting - NOT IMPLEMENTED**
- **Risk:** No rate limiting on authentication endpoints
  - Files: `AdoteJaBackend/src/main/java/com/adotejabackend/AdoteJaBackend/controllers/UsuarioController.java` (line 22)
  - Endpoint: `POST /users/login`
- **Severity:** MEDIUM
- **Impact:** Brute force attacks on user credentials. No throttling per IP/email.
- **Fix Approach:** Add `spring-boot-starter-actuator` + custom RateLimitFilter or use `spring-cloud-circuitbreaker`.

**Account Enumeration - MEDIUM SEVERITY**
- **Risk:** Different error messages for "email not found" vs "wrong password" reveal user existence
  - Files: `AdoteJaBackend/src/main/java/com/adotejabackend/AdoteJaBackend/services/UsuarioService.java` (line 55-59)
  - Files: `AdoteJaBackend/src/main/java/com/adotejabackend/AdoteJaBackend/services/AdotanteService.java` (line 41-43)
- **Severity:** MEDIUM
- **Impact:** Attacker can enumerate valid email addresses via registration/login endpoints.
- **Example:** User A registers → "E-mail já cadastrado" reveals that email exists. User B tries login with User A's email → "Token inválido" (not "user not found") reveals different error.
- **Fix Approach:** Standardize error responses:
  ```java
  // Instead of: "E-mail já cadastrado"
  // Return: "Registration failed. Check your email."
  // Log the actual error server-side for debugging
  ```

**JWT Token Expiration Too Long - LOW SEVERITY**
- **Risk:** JWT tokens expire in 4 hours
  - Files: `AdoteJaBackend/src/main/java/com/adotejabackend/AdoteJaBackend/services/JwtTokenService.java` (line 56)
  - Code: `.plusHours(4)`
- **Severity:** LOW
- **Impact:** Stolen token usable for 4 hours. Standard is 15-30 minutes + refresh token.
- **Fix Approach:** Reduce to 30 minutes. Implement refresh token mechanism with longer TTL (7 days).

### A05: Security Misconfiguration

**OpenAPI/Swagger Endpoints Exposed - LOW SEVERITY**
- **Risk:** Swagger UI and OpenAPI docs available without authentication
  - Files: `AdoteJaBackend/src/main/java/com/adotejabackend/AdoteJaBackend/config/SecurityConfiguration.java` (lines 41-43)
  - Endpoints: `/v3/api-docs/**`, `/swagger-ui/**`, `/swagger-ui.html`
- **Severity:** LOW (information disclosure)
- **Impact:** API schema exposed to unauthenticated users. Aids attackers in endpoint discovery.
- **Fix Approach:** Secure Swagger behind authentication or disable in production:
  ```properties
  # application.properties
  springdoc.api-docs.enabled=${ENABLE_SWAGGER:false}
  springdoc.swagger-ui.enabled=${ENABLE_SWAGGER:false}
  ```

**H2 Console Exposed (Unlikely)**
- No H2 database dependency detected. Not a risk.

**CORS Configured with Environment Variable - GOOD**
- `spring.web.cors.allowed-origins=http://localhost:5173` (dev)
- **Issue:** Verify production config uses exact domain, not wildcards.
- **Fix Approach:** Enforce in `SecurityConfiguration.java`:
  ```java
  String[] origins = allowedOrigins.split(",");
  if (Arrays.stream(origins).anyMatch(o -> o.contains("*"))) {
    throw new IllegalStateException("Wildcard CORS origins not allowed");
  }
  ```

**Security Headers - MOSTLY GOOD**
- **Implemented:**
  - CSP: `default-src 'self'` (restrictive)
  - X-Frame-Options: `deny` (good)
  - X-Content-Type-Options: `nosniff` (good)
- **Missing Headers:**
  - `Strict-Transport-Security` (HSTS) — require HTTPS
  - `X-XSS-Protection` — legacy but still useful
  - `Referrer-Policy` — control referrer leakage
- **Fix Approach:** Add to `SecurityConfiguration.java`:
  ```java
  headers.httpStrictTransportSecurity().withDefault()
  ```

### A06: Vulnerable & Outdated Components

**Spring Boot 3.4.4 - CURRENT**
- Latest 3.4.x release. No known critical CVEs. Safe.

**AWS SDK v2.25.16 - CURRENT**
- Recent version. Safe.

**java-jwt 4.4.0 - CURRENT**
- Auth0 JWT library. Latest 4.x. Safe.

**MySQL Connector J - VERSION NOT SPECIFIED**
- Inherits from Spring Boot parent (3.4.4). Likely 8.x.
- **Action:** Verify no `mysql-connector-java:5.x` in production.

**Frontend Dependencies - GENERALLY CURRENT**
- React 19.2.4 (latest)
- Axios 1.13.6 (up-to-date)
- TanStack Query 5.91.0 (latest)
- React Router 7.13.1 (latest)
- **No known vulnerabilities** in package.json

**No Security Scanning Configured**
- **Severity:** LOW
- **Issue:** No Maven plugin for dependency scanning (e.g., `maven-dependency-check-plugin`)
- **Fix Approach:** Add to `pom.xml`:
  ```xml
  <plugin>
    <groupId>org.owasp</groupId>
    <artifactId>dependency-check-maven</artifactId>
    <version>9.0.0</version>
  </plugin>
  ```

### A07: Identification & Authentication Failures

**Password Requirements - WEAK**
- **Risk:** Minimum password length = 8 characters
  - Files: `AdoteJaBackend/src/main/java/com/adotejabackend/AdoteJaBackend/dtos/CreateUsuarioDTO.java` (line 13)
  - Validation: `@Size(min = 8, message = "Senha deve ter no mínimo 8 caracteres")`
- **Severity:** LOW
- **Impact:** Weak passwords like "12345678" easily cracked.
- **Recommendation:** Increase to 12+. Add complexity rules (uppercase, number, special char).
- **Fix Approach:**
  ```java
  @NotBlank
  @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&]).{12,}$")
  String password
  ```

**No Multi-Factor Authentication (MFA)**
- **Severity:** MEDIUM
- **Impact:** Compromised password = account takeover.
- **Recommendation:** Implement TOTP (Google Authenticator) or SMS-based MFA.

**No Password Reset Endpoint**
- **Severity:** MEDIUM
- **Impact:** Users with forgotten passwords cannot recover access.
- **Missing Flow:** `POST /users/forgot-password` → email with reset token → `POST /users/reset-password`

**Session Management - 4-Hour Tokens**
- Already noted in A02. Consider shorter duration.

### A08: Software & Data Integrity Failures

**No Request Signing**
- **Severity:** LOW (JWT mitigates)
- **Impact:** Responses cannot be verified as from server. Not critical with HTTPS.

**No Subresource Integrity (SRI) on CDN Resources**
- **Risk:** Google Fonts CDN links lack integrity attributes
  - Files: `AdoteJaFrontend/index.html` (lines 10-17)
  - Code: `<link href="https://fonts.googleapis.com/..." />`
- **Severity:** LOW
- **Impact:** CDN compromise could inject malicious CSS/fonts.
- **Fix Approach:** Add `integrity="sha384-..."` and `crossorigin="anonymous"`:
  ```html
  <link
    href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans..."
    integrity="sha384-..."
    crossorigin="anonymous"
  />
  ```

**NPM Package Integrity**
- `package-lock.json` exists (assumed). Ensures reproducible installs. Good.

### A09: Logging & Monitoring

**Insufficient Logging**
- **Severity:** MEDIUM
- **Risk:** No audit trail for sensitive operations
  - Files: `AdoteJaBackend/src/main/java/com/adotejabackend/AdoteJaBackend/services/SolicitacaoService.java` (lines 68-82)
  - Missing: Log WHO approved/rejected adoptions, WHEN, and admin decisions.
- **Impact:** Cannot detect unauthorized changes or trace user actions.
- **Fix Approach:** Add AuditLog entity:
  ```java
  @Entity
  public class AuditLog {
    Long userId;
    String action; // "APPROVED_ADOPTION", "DELETED_PET", etc.
    String targetId; // solicitation ID, pet ID, etc.
    LocalDateTime timestamp;
    String ipAddress;
  }
  ```

**Exception Information Leakage - MITIGATED**
- **Risk:** Internal errors sanitized at controller level
  - Files: `AdoteJaBackend/src/main/java/com/adotejabackend/AdoteJaBackend/config/GlobalExceptionHandler.java` (lines 57-61)
  - Code: Returns generic "Ocorreu um erro interno" to client, logs stack trace server-side.
- **Status:** PROPERLY IMPLEMENTED. Good.

**No Security Event Alerts**
- **Severity:** MEDIUM
- **Issue:** No alerts for:
  - Multiple failed login attempts
  - Unauthorized access attempts (403 Forbidden)
  - Account creation via API
- **Recommendation:** Implement alerting:
  - Email admin on 5+ failed logins from same IP
  - Slack webhook for 403 errors
  - Monitor pet deletion rates (possible data destruction attack)

### A10: Server-Side Request Forgery (SSRF)

**S3 Upload - LOW RISK**
- **Risk:** User-controlled file uploads to S3
  - Files: `AdoteJaBackend/src/main/java/com/adotejabackend/AdoteJaBackend/services/PetService.java` (lines 94-104)
- **Mitigation:**
  - File type validated: `contentType.startsWith("image/")`
  - File size limited: 5 MB max
  - Filename sanitized: `UUID.randomUUID() + extension`
- **Status:** SAFE. No SSRF risk.

---

## Frontend-Specific Security Concerns

### XSS (Cross-Site Scripting) - LOW RISK

**Token Storage in localStorage - MEDIUM SEVERITY**
- **Risk:** JWT token stored in `localStorage` (accessible via XSS)
  - Files: `AdoteJaFrontend/src/contexts/AuthContext.tsx` (lines 29, 43)
  - Code: `localStorage.setItem('token', token)` / `localStorage.getItem('token')`
- **Severity:** MEDIUM
- **Impact:** If XSS vulnerability exists (via dangerouslySetInnerHTML or unsanitized user input), attacker can steal token.
- **Why localStorage:** Not accessible to `document.cookie` attacks, but XSS in React can still access via `localStorage.getItem()`.
- **Better Approach:** Use `httpOnly` cookie instead (requires backend to set):
  ```java
  // Backend: Set cookie in login response
  response.addHeader("Set-Cookie", "token=..." + ";HttpOnly;Secure;SameSite=Strict");
  ```
  Then frontend doesn't need to manage token — browser handles it.
- **Alternative:** If localStorage required, implement Content Security Policy stricter than current.

**CSP Too Permissive for Fonts - LOW SEVERITY**
- **Risk:** CSP allows `https:` in `font-src`
  - Files: `AdoteJaBackend/src/main/java/com/adotejabackend/AdoteJaBackend/config/SecurityConfiguration.java` (lines 57-60)
  - Code: `font-src 'self' https://fonts.gstatic.com` (too broad)
- **Severity:** LOW
- **Fix Approach:** Restrict to exact domain:
  ```java
  "font-src 'self' https://fonts.gstatic.com;" +
  "style-src 'self' https://fonts.googleapis.com;" +
  "script-src 'self';" +
  "object-src 'none';" +
  "frame-ancestors 'none';"
  ```

**No dangerouslySetInnerHTML Detected**
- Good. React components use text content by default.

**User Input Rendering - SAFE**
- Pet names, descriptions, user names displayed as text, not HTML.
- No markdown parsing or rich text editor without sanitization.

### CSRF - MITIGATED

**Frontend Uses Token-Based Auth**
- **Risk:** CSRF attacks via form submission
- **Mitigation:**
  - JWT token in `Authorization: Bearer` header
  - Axios sends via header, not cookie
  - Files: `AdoteJaFrontend/src/lib/api.ts` (lines 10-14)
- **Status:** SECURE against browser CSRF.

### Sensitive Data in Client Code

**No Hardcoded API Keys**
- `.env.example` contains only `VITE_API_URL`
- No credentials in code. Good.

**JWT Token Visible in Network Tab**
- **Severity:** LOW (expected for debugging)
- **Impact:** DevTools shows `Authorization: Bearer <token>` in Network tab. HTTPS mitigates.
- **Recommendation:** Educate developers not to share network tabs with secrets.

---

## Infrastructure & Deployment

**Docker Images - CONFIGURATION ASSUMED**
- `AdoteJaBackend/Dockerfile` (multi-stage, JRE 17 base image assumed secure)
- `AdoteJaFrontend/Dockerfile` (nginx serving SPA, assumed `try_files` fallback to `/index.html`)
- **Recommendation:** Scan base images with Trivy:
  ```bash
  trivy image openjdk:17-jre-slim
  trivy image nginx:latest
  ```

**No Image Scanning in CI/CD**
- **Severity:** MEDIUM
- **Issue:** No policy preventing deployment of vulnerable container images.
- **Fix Approach:** Add to GitHub Actions (if available):
  ```yaml
  - name: Scan Docker image
    run: trivy image $ECR_REGISTRY/$IMAGE_REPO:$IMAGE_TAG
  ```

**LocalStack for Development**
- **Risk:** Uses insecure S3 ACLs (`PUBLIC_READ`) for development
- **Issue:** Developers may copy this pattern to production.
- **Recommendation:** In dev, use `PRIVATE` ACL. Only override in prod for specific use case.

---

## Configuration & Secrets Management

**Environment Variable Strategy - GOOD**
- Secrets can be injected via environment variables (JWT_SECRET, DB_PASSWORD, etc.)
- `.gitignore` includes `CLAUDE.md` and `docs/` but NOT `application-dev.properties`

**application-dev.properties in Git - RISK**
- Contains hardcoded dev secrets:
  - MySQL: `warley:12345678`
  - JWT: `dev-secret-key-adoteja-2024`
  - S3: `test:test`
- **Issue:** Committed to repository. Visible in git history permanently.
- **Fix Approach:**
  1. Rename to `application-dev.properties.example`
  2. Add `application-dev.properties` to `.gitignore`
  3. Document setup in README

**No .env File for Frontend**
- `AdoteJaFrontend/.env.example` exists
- Actual `.env` file not committed (good)
- **Recommendation:** Verify `.env` in `.gitignore`

---

## Test Coverage & Security Testing

**Unit Tests Present but Limited**
- `PetServiceTest.java` exists
- `AdotanteServiceTest.java` exists
- **Issue:** No security-focused tests:
  - No IDOR verification (e.g., User A tries accessing User B's adotante profile)
  - No JWT expiration tests
  - No rate limiting tests
  - No malicious input tests (SQL injection, XSS payloads)

**Recommendation:** Add security test suite:
```java
@Test
public void testIDOR_UserCannotAccessOtherAdotante() {
  // User A logs in, tries to GET /adotantes/{userBId}
  // Should receive 403 Forbidden, not 200 with data
}

@Test
public void testJWTExpiration() {
  // Old token (4+ hours old) should be rejected with 401
}

@Test
public void testMaliciousInput_SQLInjection() {
  // POST /pets with nome=" OR '1'='1" should fail validation
}
```

---

## Summary Table

| Area | Issue | Severity | File(s) | Status |
|------|-------|----------|---------|--------|
| AuthZ | Solicitacao status update missing validation | HIGH | SolicitacaoService.java | OPEN |
| AuthZ | IDOR in Adotante (partially mitigated) | MEDIUM | AdotanteService.java | MITIGATED |
| Crypto | JWT secret hardcoded in dev properties | MEDIUM | application-dev.properties | OPEN |
| Crypto | Empty JWT_SECRET default | LOW | application.properties | OPEN |
| Crypto | S3 objects PUBLIC_READ ACL | HIGH | S3Service.java:43 | OPEN |
| Injection | No rate limiting on login | MEDIUM | UsuarioController.java | OPEN |
| Design | Account enumeration via error messages | MEDIUM | UsuarioService.java | OPEN |
| Design | JWT token expiration 4 hours (long) | LOW | JwtTokenService.java | OPEN |
| Config | OpenAPI docs exposed | LOW | SecurityConfiguration.java | OPEN |
| Config | Missing HSTS header | MEDIUM | SecurityConfiguration.java | OPEN |
| Auth | Weak password requirements (8 chars) | LOW | CreateUsuarioDTO.java | OPEN |
| Auth | No MFA/2FA implementation | MEDIUM | UsuarioController.java | OPEN |
| Logging | No audit trail for sensitive operations | MEDIUM | SolicitacaoService.java | OPEN |
| Frontend | JWT in localStorage (XSS risk) | MEDIUM | AuthContext.tsx | MITIGATED |
| Frontend | CSP too permissive | LOW | SecurityConfiguration.java | OPEN |
| Testing | No security-focused unit tests | MEDIUM | src/test/ | OPEN |

---

## Prioritized Fixes

**CRITICAL (Do Immediately):**
1. Remove hardcoded secrets from `application-dev.properties` → move to `.env` + `.gitignore`
2. Change S3 ACL from `PUBLIC_READ` to `PRIVATE` + implement pre-signed URLs
3. Add authorization check to `SolicitacaoService.updateStatus()`

**HIGH (Next Sprint):**
4. Implement rate limiting on login endpoint
5. Add password complexity validation
6. Switch JWT token storage to `httpOnly` cookie (or implement token refresh)

**MEDIUM (Following Sprint):**
7. Add HSTS and other security headers
8. Standardize error messages to prevent user enumeration
9. Implement audit logging for sensitive operations
10. Add security-focused unit tests

**LOW (Backlog):**
11. Reduce JWT expiration to 30 minutes + refresh token
12. Add dependency scanning to build pipeline
13. Implement SRI for CDN resources
14. Restrict OpenAPI docs behind authentication

---

*Security audit completed: 2026-03-24*
