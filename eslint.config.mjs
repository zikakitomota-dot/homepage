import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

export default defineConfig([
  ...nextVitals,
  {
    rules: {
      // Next 16 enables React Compiler advisory rules that were not part of the
      // project's previous lint contract. Keep this compatibility upgrade
      // focused; these can be adopted in a dedicated component refactor.
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  globalIgnores([
    '.next/**',
    '.open-next/**',
    'public/health/**',
    'qa/**',
    'artifacts/**',
    'next-env.d.ts',
  ]),
]);
