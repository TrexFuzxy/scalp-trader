# Free Scalp Trading Analyzer

A complete client-side scalp trading analysis tool that can be hosted for free on GitHub Pages.

## Features

- Risk parameter calculator
- Basic chart pattern detection
- User authentication
- Settings storage

## Setup Instructions

1. **Create a Firebase Project**

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Google sign-in)
   - Enable Realtime Database
   - Copy your config to `firebase-config.js`

2. **Upload to GitHub**

   - Create a new repository
   - Upload all files
   - Enable GitHub Pages in repository settings

3. **Using the App**
   - Sign in with Google
   - Set your risk parameters
   - Upload trading charts for analysis

## Limitations

- Image processing happens in browser (limited capabilities)
- No server-side processing
- Basic pattern detection only
