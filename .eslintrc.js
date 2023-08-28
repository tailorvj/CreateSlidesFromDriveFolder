module.exports = {
    env: {
        es6: false, // Enforce ES5 compatibility
        es2021: true, // Allow ES2021 features used by Google Apps Script
        node: true,
    },
    extends: 'eslint:recommended',
    rules: {
        // Add any specific rules or overrides here
        // For example:
        'indent': ['error', 4], // Use 4 spaces for indentation
        'quotes': ['error', 'single'], // Use single quotes for strings
        // ... other rules ...
    },
};
