/**
 * Project context template for React project generation
 * This provides reference files for the AI model
 */
export const getProjectContextTemplate = () => {
    return `
PROJECT CONTEXT:
- This is a modern React 19 project using Vite as the build tool
- TypeScript is configured and should be used for all files
- Tailwind CSS is already installed and configured
- React version: 19.1.0
- React DOM version: 19.1.0
- Tailwind CSS version: 4.1.7
- Vite version: 6.3.5

REQUIRED FILES:
The website must include ALL of the following files at minimum:
1. index.html
2. main.tsx
3. App.tsx
4. Header.tsx
5. Auth.tsx or Login.tsx
6. Dashboard.tsx or Home.tsx
7. App.css
8. types.ts (for TypeScript interfaces)
9. index.css
10. vite.config.ts
11. tsconfig.json

IMPORTANT NAMING CONVENTIONS:
- The main HTML file must be exactly named "index.html"
- The main entry point must be exactly named "main.tsx"
- The main component must be exactly named "App.tsx"
- Component files must use PascalCase (e.g., Header.tsx, Footer.tsx)
- Types and interfaces should be in a file named "types.ts"
- Style files should match their component names (e.g., App.css, Header.css)
- Do not use "file1.html" or numbered file names
- Always use proper file extensions (.tsx for React components, .ts for TypeScript files, .css for stylesheets)

REFERENCE FILES:

1. index.html:
\`\`\`html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
\`\`\`

2. src/main.tsx:
\`\`\`tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
\`\`\`

3. src/App.tsx:
\`\`\`tsx
import './App.css'

function App() {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold underline">
          Hello world!
        </h1>
      </div>
    </>
  )
}

export default App
\`\`\`

4. src/App.css:
\`\`\`css
/* App styles */
\`\`\`

5. src/index.css:
\`\`\`css
@import "tailwindcss";
\`\`\`

6. vite.config.ts:
\`\`\`typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),],
})
\`\`\`

7. tsconfig.json:
\`\`\`json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
\`\`\`

8. tsconfig.app.json:
\`\`\`json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
\`\`\`

9. eslint.config.js:
\`\`\`js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)
\`\`\`

10. package.json:
\`\`\`json
{
  "name": "example",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.1.7",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "tailwindcss": "^4.1.7"
  },
  "devDependencies": {
    "@eslint/js": "^9.25.0",
    "@types/react": "^19.1.2",
    "@types/react-dom": "^19.1.2",
    "@vitejs/plugin-react": "^4.4.1",
    "eslint": "^9.25.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.19",
    "globals": "^16.0.0",
    "typescript": "~5.8.3",
    "typescript-eslint": "^8.30.1",
    "vite": "^6.3.5"
  }
}
\`\`\`

EXAMPLE COMPONENT STRUCTURE:
Here are examples of the required component files that need to be included:

1. src/Header.tsx (Required):
\`\`\`tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">My App</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>
            <li><Link to="/login" className="hover:underline">Login</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
\`\`\`

2. src/Auth.tsx (Required):
\`\`\`tsx
import React, { useState } from 'react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password, isLogin });
    // Add authentication logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? 'Login' : 'Register'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="submit"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:underline"
          >
            {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
\`\`\`

3. src/Dashboard.tsx (Required):
\`\`\`tsx
import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Statistics</h2>
          <p className="text-gray-600">View your account statistics and activity.</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Profile</h2>
          <p className="text-gray-600">Manage your account details and preferences.</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Settings</h2>
          <p className="text-gray-600">Configure your application settings.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
\`\`\`

4. src/types.ts (Required):
\`\`\`ts
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface Route {
  path: string;
  name: string;
  component: React.ComponentType;
  exact?: boolean;
  protected?: boolean;
}
\`\`\`

COMPONENT STRUCTURE GUIDELINES:
- Ensure the App.tsx component includes proper routing using react-router-dom
- Make all components reusable with appropriate props
- Use TypeScript interfaces for all props in a dedicated types.ts file
- Implement responsive designs using Tailwind CSS classes
- Use React hooks for state management (useState, useEffect, etc.)
- Provide error handling and loading states where appropriate
`;
};
