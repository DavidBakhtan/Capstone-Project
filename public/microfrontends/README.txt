Angular Login Micro-frontend Setup
=====================================

This directory is where you should place your built Angular login micro-frontend files.

REQUIRED FILES:
- main.js (or your Angular bundle)
- Any additional Angular runtime files
- styles.css (optional, for Angular-specific styles)

ANGULAR ELEMENT REQUIREMENTS:
Your Angular component must be built as an Angular Element with the tag name: <angular-login-app>

AUTHENTICATION EVENT:
When login is successful, your Angular component must dispatch this event:

```javascript
window.dispatchEvent(new CustomEvent('auth:login', {
  detail: {
    token: 'your-jwt-token',
    user: {
      id: 'user-id',
      email: 'user@example.com',
      name: 'User Name',
      role: 'user-role'
    }
  }
}));
```

DEVELOPMENT:
During development, the placeholder.js file simulates this behavior.
Remove or replace placeholder.js when you deploy your actual Angular build.

BUILD COMMAND (example):
ng build --output-hashing=none --single-bundle=true

Then copy the built files from your Angular dist/ folder to this directory.