import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
		languageOptions: {
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
			globals: {
				...globals.browser,
				require: 'readonly', // Allow `require` as global (for CommonJS modules)
				process: 'readonly', // Allow `process` as global (commonly used in Node.js)
			},
		},
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
	{
		rules: {
			'react/react-in-jsx-scope': 'off',
			'react/no-unescaped-entities': 'off',
			'@typescript-eslint/no-require-imports': 'off',
			'indent': ['warn', 'tab'],
			'@typescript-eslint/no-unused-vars': ['off', { argsIgnorePattern: '^_' }]
		},
	},
];
