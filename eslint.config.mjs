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
				React: 'readonly',   // Ensure React can be used as a global
			},
		},
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
	{
		rules: {
			'react/react-in-jsx-scope': 'off', // Disable rule for React in JSX scope
			'react/no-unescaped-entities': 'off',
			'@typescript-eslint/no-require-imports': 'off',
			'indent': ['warn', 'tab'],
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					vars: 'all',
					args: 'after-used',
					ignoreRestSiblings: true,
				},
			],
			'no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					vars: 'all',
					args: 'after-used',
					varsIgnorePattern: '^_',
				},
			],
			// Suppress TypeScript-specific warning for React UMD global
			'react/jsx-uses-react': 'off',
			'react/jsx-uses-vars': 'warn',
			'no-console': [
				'warn',
				{
					allow: ['error', 'warn'], // Warn for console.log, but allow console.error and console.warn
				},
			],
		},
	},
];
