# Coding Conventions

**Analysis Date:** 2025-03-24

## Naming Patterns

**Files:**
- Backend Java files: PascalCase (`UsuarioService.java`, `CreateUsuarioDTO.java`, `GlobalExceptionHandler.java`)
- Frontend TypeScript/React files: PascalCase for components (`HomePage.tsx`, `Button.tsx`, `AuthContext.tsx`), camelCase for utilities and hooks (`api.ts`, `utils.ts`, `usePets.ts`)
- Test files: Match source file name with `.test.ts`, `.test.tsx`, `.spec.ts` suffix (`UsuarioServiceTest.java`, `useSolicitacoes.test.ts`, `HomePage.test.tsx`)

**Functions:**
- Backend: camelCase (`authenticateUsuario()`, `createUsuario()`, `uploadIfPresent()`)
- Frontend: camelCase for utility functions and hooks (`usePets()`, `fetchPets()`, `getApiError()`)
- React components: PascalCase (`HomePage`, `Button`, `PetFormModal`)

**Variables:**
- Backend: camelCase (`usuarioRepository`, `imagemUrl`, `passwordEncoder`)
- Frontend: camelCase (`isAuthenticated`, `showToast`, `isPending`)
- Type/interface names: PascalCase (`Pet`, `AuthUser`, `ButtonProps`)

**Types:**
- TypeScript interfaces: PascalCase (`AuthContextValue`, `PetFilters`, `LoginRequest`)
- Type unions/literals: UPPERCASE or PascalCase (`'PENDENTE' | 'APROVADA' | 'RECUSADA'`, `Especie = 'CAO' | 'GATO'`)
- Record types: Use `Record<Key, Value>` pattern (see `variantClasses: Record<Variant, string>` in `Button.tsx`)

## Code Style

**Formatting:**
- Backend: No explicit formatter configured (IntelliJ defaults assumed)
- Frontend: No Prettier config detected, but code follows 2-space indentation and standard TypeScript formatting
- Line length: Not strictly enforced, but generally stays under 120 characters

**Linting:**
- Backend: No ESLint (Java)
- Frontend: ESLint configured in `eslint.config.js` with:
  - `@eslint/js` recommended rules
  - `typescript-eslint` recommended rules
  - `eslint-plugin-react-hooks` recommended rules
  - `eslint-plugin-react-refresh` rules
  - Ignores `dist` directory

## Import Organization

**Backend Order:**
1. Java standard library imports (`java.util.`, `java.time.`, etc.)
2. Jakarta/Spring Framework imports (`jakarta.persistence.`, `org.springframework.`, etc.)
3. Project package imports (`com.adotejabackend.AdoteJaBackend.`)

Example from `UsuarioService.java`:
```java
import com.adotejabackend.AdoteJaBackend.config.SecurityConfiguration;
import com.adotejabackend.AdoteJaBackend.dtos.*;
import com.adotejabackend.AdoteJaBackend.models.Usuario;
import com.adotejabackend.AdoteJaBackend.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
```

**Frontend Order:**
1. React/third-party imports (React, TanStack Query, Axios, React Router)
2. Project absolute imports with type imports
3. Local relative imports

Example from `AuthContext.tsx`:
```typescript
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { fetchMe } from '../features/auth/api'
import type { MeResponse, RoleName } from '../types'
```

**Path Aliases:**
- Backend: Uses full package structure (`com.adotejabackend.AdoteJaBackend.*`)
- Frontend: No explicit path aliases configured (uses relative imports with `../`)

## Error Handling

**Backend Patterns:**
- Controller/Service level: Use specific exception types (`EntityNotFoundException`, `IllegalArgumentException`, `RuntimeException`)
- Global exception handler: `GlobalExceptionHandler.java` catches and formats all exceptions
- HTTP status mapping: NOT_FOUND (404), BAD_REQUEST (400), CONFLICT (409), FORBIDDEN (403), INTERNAL_SERVER_ERROR (500)
- Error response format: `ErrorResponseDTO` with `status`, `message`, `timestamp`
- Sanitization: RuntimeException is caught and returns generic "Ocorreu um erro interno." message (server logs actual error)
- Validation errors: Caught by `MethodArgumentNotValidException`, returns field names and default messages concatenated with commas

Example from `GlobalExceptionHandler.java`:
```java
@ExceptionHandler(RuntimeException.class)
public ResponseEntity<ErrorResponseDTO> handleRuntime(RuntimeException ex) {
    log.error("Unhandled runtime exception", ex);
    return build(HttpStatus.INTERNAL_SERVER_ERROR, "Ocorreu um erro interno.");
}
```

**Frontend Patterns:**
- API errors extracted via `getApiError()` utility: Returns `{ status, message, timestamp }` or default 500 error
- Validation at form level before submission
- Toast notifications for user feedback (success/error/info)
- Automatic 401 handling: API interceptor redirects to `/login` and clears token
- Try-catch in mutation handlers with toast error display

Example from `PetFormModal.tsx`:
```typescript
try {
  await updateMutation.mutateAsync({ id: pet.id, data, imagem })
  showToast('Pet atualizado!', 'success')
} catch (err) {
  showToast(getApiError(err).message, 'error')
}
```

## Logging

**Framework:** Backend uses SLF4J with `org.slf4j.Logger`

**Patterns:**
- Backend: Errors logged at ERROR level in exception handlers (`log.error("Unhandled runtime exception", ex)`)
- Frontend: No explicit logging framework; uses browser console (handled by vitest/jsdom in tests)

## Comments

**When to Comment:**
- Backend: Comments are minimal; code structure is self-documenting through Java conventions
- Frontend: Comments are minimal; prefer clear function/variable names

**JSDoc/TSDoc:**
- Backend: No JSDoc annotations observed
- Frontend: No TSDoc annotations observed; types are explicit through TypeScript

## Function Design

**Size:**
- Backend services: Methods typically 10-50 lines (UsuarioService methods are 15-20 lines)
- Frontend hooks: Very concise, often 5-10 lines (usePets is 9 lines)

**Parameters:**
- Backend: Use DTOs for multiple related parameters (CreateUsuarioDTO, UpdatePetDTO)
- Frontend: Single object parameter for multiple values, type-safe via TypeScript
- Backend: Multipart file uploads use `MultipartFile` parameter separately from DTO data

**Return Values:**
- Backend: Return DTOs from service/controller layer, not entities
- Frontend: Return promises from async API functions, use TanStack Query hooks for state management
- Consistent null handling: Optional types and null checks before use

Example pattern from PetService:
```java
public RecoveryPetDTO create(CreatePetDTO dto, MultipartFile imagem) {
    String imagemUrl = uploadIfPresent(imagem);  // Returns null if not present
    Pet pet = Pet.builder()
            .nome(dto.nome())
            .imagemUrl(imagemUrl)
            .build();
    return toRecoveryDTO(petRepository.save(pet));
}
```

## Module Design

**Exports:**
- Backend: Spring beans via `@Service`, `@Controller`, `@Repository` annotations; DTOs via `record` declarations
- Frontend: Named exports preferred (`export function`, `export const`, `export type`)

**Barrel Files:**
- Backend: Not used; imports are direct from source file
- Frontend: Not used; imports are direct from source file (each component/hook in its own file)

## Validation Patterns

**Backend DTO Validation:**
- Use Jakarta Validation annotations on `record` fields
- Common constraints: `@NotBlank`, `@NotNull`, `@Email`, `@Size(min=X, max=Y)`
- Nested validation: `@Valid` on nested DTOs (e.g., `@NotNull @Valid EnderecoDTO enderecoDTO`)
- Size constraints on nested fields:
  - `CreateUsuarioDTO`: nome max 100, password min 8
  - `CreatePetDTO`: nome max 100, descricao max 1000
  - `EnderecoDTO`: logradouro max 200, numero max 20, bairro max 100, cidade max 100, estado max 2, cep max 9

Example from `CreateUsuarioDTO.java`:
```java
public record CreateUsuarioDTO(
    @NotBlank @Size(max = 100) String nome,
    @NotBlank @Email String email,
    @NotBlank @Size(min = 8, message = "Senha deve ter no mínimo 8 caracteres") String password,
    @NotNull RoleName role,
    @NotNull @Valid EnderecoDTO enderecoDTO
) {}
```

**Backend Service-level Validation:**
- File upload validation: Check file size (5 MB max) and content type (image/* only)
- Entity existence checks: Use Optional and throw `EntityNotFoundException` if missing
- Custom business logic: Throw `RuntimeException` with descriptive message

Example from `PetService.uploadIfPresent()`:
```java
private String uploadIfPresent(MultipartFile imagem) {
    if (imagem == null || imagem.isEmpty()) return null;
    if (imagem.getSize() > MAX_FILE_SIZE) {
        throw new IllegalArgumentException("Arquivo excede o tamanho máximo de 5 MB.");
    }
    String contentType = imagem.getContentType();
    if (contentType == null || !contentType.startsWith("image/")) {
        throw new IllegalArgumentException("Tipo de arquivo inválido: apenas imagens são aceitas.");
    }
    return s3Service.uploadFile(imagem, "pets");
}
```

**Frontend Form Validation:**
- Required fields checked before form submission
- File/image validation handled at component level
- API response errors displayed via toast notifications

## Multipart Upload Pattern

**Backend (PetService):**
- Request receives two parts: `dados` (JSON blob with CreatePetDTO) and `imagem` (optional file)
- Part names matter: `@RequestPart(name = "dados") CreatePetDTO dto`
- File validation happens in service layer before S3 upload

**Frontend (PetFormModal):**
- Create FormData object, append JSON data as string: `formData.append("dados", JSON.stringify(data))`
- Append file if present: `formData.append("imagem", imagem)`
- Set headers to allow boundary auto-generation: `headers: { 'Content-Type': undefined }`
- Use axios for request

---

*Convention analysis: 2025-03-24*
