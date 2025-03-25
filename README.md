# 📌 Padrão de Commits

Para manter um histórico **organizado, padronizado e fácil de entender**, utilizamos um **padrão semântico de commits**, inspirado no [Conventional Commits](https://www.conventionalcommits.org/).

## 🛠️ Estrutura do Commit
Cada commit deve seguir esta estrutura:

```bash
<icon> <tipo>(<escopo>): <mensagem>
```

- **`<icon>`** → Representa visualmente o tipo de commit.
- **`<tipo>`** → O que foi feito no código.
- **`<escopo>`** → Qual parte do sistema foi afetada (opcional, mas recomendado).
- **`<mensagem>`** → Descrição breve e clara da mudança.

---

## 🚀 Tipos de Commits

| 🚀 Tipo        | 🔍 Descrição |
|--------------|-------------|
| ✨ **`feat`** | Adição de nova funcionalidade |
| 🐛 **`fix`** | Correção de bug |
| 🔧 **`refactor`** | Refatoração sem mudança de funcionalidade |
| 📄 **`docs`** | Atualizações na documentação |
| 🎨 **`style`** | Ajustes visuais ou formatação de código |
| 🧪 **`test`** | Adição ou modificação de testes |
| ⚡ **`perf`** | Melhorias de performance |
| 🔄 **`ci`** | Ajustes em CI/CD (ex: GitHub Actions) |
| 🏗️ **`build`** | Alterações na build (ex: dependências) |
| 🔨 **`chore`** | Alterações menores (ex: configurações) |

---

## 📌 Exemplos de Commits
✅ **Adicionando uma nova funcionalidade**
```bash
✨ feat(usuário): adicionar endpoint para cadastro de adotantes
```

✅ **Corrigindo um bug**
```bash
🐛 fix(visita): corrigir erro ao agendar visita para múltiplos pets
```

✅ **Refatorando código**
```bash
🔧 refactor(pet): melhorar a lógica de busca por pets disponíveis
```

✅ **Ajustando documentação**
```bash
📄 docs: adicionar instruções de configuração do ambiente no README
```

✅ **Alterando configurações do projeto**
```bash
🔨 chore: adicionar application-dev.properties no .gitignore
```

✅ **Ajustando estilização do código (sem mudar lógica)**
```bash
🎨 style: padronizar indentação e remover espaços em branco
```

✅ **Adicionando testes**
```bash
🧪 test(pet): criar testes unitários para serviço de listagem de pets
```

---
