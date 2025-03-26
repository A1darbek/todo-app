// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',     // so "document" is defined
        globals: true,            // allows use of describe/test/expect without imports
        setupFiles: ['setupTests.js'],           // optional: if you have global setup scripts
        // coverage, test match patterns, etc. can go here as well
    },
});
