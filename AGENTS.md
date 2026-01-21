# Agent Guidelines for FroshJetpack

This document outlines the development guidelines, build processes, and code style for the FroshJetpack project. It is intended for both human developers and AI agents operating within this codebase.

## 1. Build, Lint, and Verify

This project uses `tshy` for building and standard TypeScript for type checking.

### Commands
- **Build Project:**
  ```bash
  npm run build
  ```
  This executes `tshy` to compile the TypeScript source into `dist/commonjs` and `dist/esm`.

- **Type Check:**
  ```bash
  npx tsc --noEmit
  ```
  Run this to ensure there are no TypeScript errors. This is crucial as there is no separate linter configuration; strict type checking serves as the primary code quality gate.

- **Tests:**
  *Status:* No automated test runner (like Jest or Vitest) is currently configured in `package.json`.
  *Action:* Verify changes by building the project (`npm run build`) and ensuring no type errors occur. Functional testing must be performed manually within a Shopware 6 environment unless a test framework is added.

## 2. Codebase Structure

- **`src/`**: The primary source directory.
  - **`entity-module/`**: Core logic for generic entity listings and detail views.
  - **`index.ts`**: Main entry point exporting the public API.
  - **`shopware.d.ts`**: TypeScript definitions for the global `Shopware` object and its APIs.
- **`dist/`**: Build artifacts. Do not modify files here directly.
- **`docs/`**: Documentation source files (Markdown), built via Zensical.

## 3. Code Style & Conventions

Adhere strictly to the following conventions to maintain consistency with existing files (e.g., `src/entity-module/list.ts`).

### Formatting
- **Indentation:** Use **4 spaces**. Do not use tabs or 2 spaces.
- **Semicolons:** Always use semicolons at the end of statements.
- **Quotes:** Use single quotes (`'`) for strings, except when avoiding escaping or in JSON.
- **Braces:** Open braces on the same line.

### TypeScript Rules
- **Imports:** You **MUST** include the `.js` extension for local relative imports.
  - **Correct:** `import { registerDetailComponent } from './entity-module/detail.js';`
  - **Incorrect:** `import { registerDetailComponent } from './entity-module/detail';`
- **Strict Typing:** Avoid `any` whenever possible. Use Generics to enforce type safety on configuration objects.
- **Twig Imports:** Twig templates are imported as default imports. Use `// @ts-ignore` above the import if TypeScript complains.
  ```typescript
  // @ts-ignore
  import template from './detail.html.twig';
  ```

### Naming Conventions
- **Files:** Use kebab-case (e.g., `list.ts`, `detail-component.ts`).
- **Functions & Methods:** Use camelCase (e.g., `registerListingComponent`, `getCriteria`).
- **Classes & Types:** Use PascalCase (e.g., `ListingOptions`, `DataGridColumn`).
- **Variables:** Use camelCase.
- **Shopware Components:** Component names registered with Shopware should use kebab-case and often include the namespace (e.g., `jetpack-product-list`).

### Shopware Integration
- **Globals:** The code relies on the global `Shopware` object.
- **APIs:**
  - Use `Shopware.Component.register` for defining components.
  - Use `Shopware.Mixin.getByName` for mixins (e.g., 'listing', 'notification').
  - Use `Shopware.Context.api` for API context.
  - Use `Shopware.Data.Criteria` for data fetching.

### Error Handling
- Validate user configurations early.
- Throw standard `Error` objects with a clear prefix (e.g., `[FroshJetpack]`) when mandatory configuration is missing.
  ```typescript
  if (Object.keys(userConfig.columns).length === 0) {
      throw new Error(`[FroshJetpack] Listing for entity "${userConfig.entity}" must have at least one column defined`);
  }
  ```

## 4. Implementation Patterns

### Registration Functions
The project follows a pattern of exporting "register" functions that take a configuration object and create a Shopware component dynamically.

**Template:**
```typescript
export function registerMyFeature<T>(config: MyConfig<T>): string {
    const componentName = `jetpack-${config.entity}-feature`;
    
    // Logic to merge config
    const mergedConfig = { ...config, ...defaults };

    Shopware.Component.register(componentName, {
        template, // imported from twig
        inject: ['repositoryFactory'],
        
        data() {
            return {
                config: mergedConfig,
                // ...
            };
        },
        // ... methods, computed
    });

    return componentName;
}
```

### Type Definitions
Define explicit types for configuration options to guide the developer usage.

```typescript
type ColumnOptions = {
    sortable?: boolean;
    visible?: boolean;
    // ...
}

type ListingOptions<K extends string> = {
    entity: string;
    columns: Record<K, ColumnOptions>;
}
```

## 5. Documentation (Zensical)

- If you modify the public API or add features, check `zensical.toml` and the `docs/` directory.
- `site_name` and navigation are defined in `zensical.toml`.

## 6. Important Reminders

- **No Framework Assumptions:** Do not assume React, Vue 3 (Composition API), or other frameworks unless explicitly imported. This is a Vue 2 based environment (standard for Shopware 6 Admin) using Options API.
- **Path Resolution:** Always resolve paths relative to the project root when using tools.
- **Safety:** Do not commit secrets or sensitive data.
