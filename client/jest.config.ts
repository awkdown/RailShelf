export default {
    preset: 'ts-jest',

    // 'jsdom' simulates a browser DOM inside Node.js so React
    // components can render without opening a real browser
    testEnvironment: 'jsdom',

    roots: ['<rootDir>/src'],

    // Note: .test.tsx (not .test.ts) because React tests contain JSX
    testMatch: ['**/*.test.tsx'],

    // When Jest encounters a CSS import, replace it with a dummy object.
    // React components import CSS files, but Jest cannot process CSS —
    // this avoids 'unexpected token' errors.
    moduleNameMapper: {
        '\\.(css|less|scss)$': 'identity-obj-proxy',
    },

    // Load extra matchers like .toBeInTheDocument() before each test
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

    // Tell ts-jest how to compile TypeScript for tests.
    // We override the app's tsconfig because Vite uses modern ES modules
    // for the browser, but Jest runs in Node.js and needs CommonJS.
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: {
                // Enable JSX syntax in .tsx files (required for React)
                jsx: 'react-jsx',

                // Allow 'import X from ...' for CommonJS modules
                esModuleInterop: true,

                // Compile imports to CommonJS so Node.js can run them
                module: 'CommonJS',
                moduleResolution: 'node',

                // Disable Vite's strict ES module syntax rules for tests
                verbatimModuleSyntax: false,

                // Treat each file as a separate module (faster compilation)
                isolatedModules: true,
            },
        }],
    },
};