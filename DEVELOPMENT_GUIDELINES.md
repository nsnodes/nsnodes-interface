# Development Guidelines

## ESLint Rules & Common Mistakes to Avoid

### 1. Unescaped Entities in JSX
**Problem:** Using unescaped apostrophes, quotes, or special characters in JSX text
```jsx
// ❌ WRONG - Will cause build failure
<p>Don't do this</p>
<p>He said "Hello"</p>

// ✅ CORRECT - Use HTML entities
<p>Don&apos;t do this</p>
<p>He said &quot;Hello&quot;</p>
```

**Common HTML Entities:**
- `'` → `&apos;` or `&#39;`
- `"` → `&quot;`
- `<` → `&lt;`
- `>` → `&gt;`
- `&` → `&amp;`

### 2. Unused Variables & Imports
**Problem:** Declaring variables or importing modules that are never used
```jsx
// ❌ WRONG - Will cause build failure
import { useState, useEffect } from 'react'; // useEffect not used
const unusedVar = 'hello';

// ✅ CORRECT - Only import/declare what you use
import { useState } from 'react';
```

### 3. VS Code Extensions to Install
Install these extensions to catch errors before build:

1. **ESLint** - Shows linting errors in real-time
2. **Prettier** - Code formatting
3. **TypeScript Importer** - Auto-imports
4. **Auto Rename Tag** - Helps with JSX

### 4. Pre-commit Hooks (Recommended)
Add this to `package.json` to run linting before commits:

```json
{
  "scripts": {
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit"
  },
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint && npm run type-check"
    }
  }
}
```

### 5. VS Code Settings
Add to `.vscode/settings.json`:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

### 6. Quick Fixes
- **Auto-fix on save:** Enable ESLint auto-fix in VS Code
- **Run before commit:** `npm run lint:fix`
- **Check types:** `npm run type-check`

### 7. Common Patterns to Remember

#### React/JSX:
```jsx
// Always escape special characters in text content
const message = "Don't forget to escape!";
return <p>{message.replace(/'/g, '&apos;')}</p>;

// Or use template literals with entities
return <p>Don&apos;t forget to escape!</p>;
```

#### TypeScript:
```typescript
// Remove unused imports immediately
// Use underscore prefix for intentionally unused vars
const _unusedButNeeded = someValue;
```

### 8. Build Check Commands
```bash
# Check for linting errors
npm run lint

# Fix auto-fixable errors
npm run lint:fix

# Type check
npm run type-check

# Full build check
npm run build
```

## Remember
- Always run `npm run lint` before committing
- Fix errors immediately, don't let them accumulate
- Use VS Code ESLint extension for real-time feedback
- When in doubt, escape special characters in JSX text content
