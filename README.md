# Charles License Key Generator

A TypeScript implementation of Charles Proxy license key generation and verification system with a modern web interface.

## 🚀 Features

- ✅ **License Key Generation**: Generate valid Charles Proxy license keys for any name
- ✅ **Key Verification**: Verify if a license key is valid for a given name
- ✅ **Modern Web Interface**: Beautiful, responsive web UI for easy key generation
- ✅ **Comprehensive Tests**: Full unit test coverage for all core functionality
- ✅ **TypeScript**: Type-safe implementation with modern ES2022 features
- ✅ **RC5-like Cipher**: Custom encryption algorithm ported from Go and Java

## 📋 Prerequisites

- Node.js v21.0.0 or higher
- npm

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

## 🎯 Usage

### Web Interface

Start the web server to use the browser-based interface:

```bash
npm start
```

Then open your browser and navigate to `http://localhost:3000`

The web interface allows you to:
1. Generate license keys by entering a name
2. Copy generated keys with one click
3. Verify existing name/key pairs

### Programmatic Usage

```typescript
import { generateLicenseKey, verifyLicenseKey } from './dist/index.js';

// Generate a license key
const name = 'Charles User';
const key = generateLicenseKey(name);
console.log(`License key for ${name}: ${key}`);

// Verify a license key
const isValid = verifyLicenseKey(name, key);
console.log(`Is valid: ${isValid}`); // true
```

## 📁 Project Structure

```
charles-crack/
├── src/
│   ├── cipher.ts          # RC5-like cipher implementation
│   ├── license.ts         # License generation and verification logic
│   ├── license.test.ts    # Unit tests
│   └── index.ts           # Main entry point
├── dist/                  # Compiled output
├── refs/                  # Reference implementations (Go & Java)
├── index.html             # Web interface
├── server.js              # Simple HTTP server
├── package.json
└── tsconfig.json
```

## 🧪 Testing

Run the comprehensive test suite:

```bash
npm test
```

The test suite includes:
- Key generation validation
- Key verification tests
- Unicode name support
- Edge cases (empty names, long names, etc.)
- Invalid key rejection tests

All 11 tests pass successfully! ✅

## 🔐 Algorithm Overview

The license key generation uses:

1. **Name Encoding**: Convert the name to UTF-8 bytes with a length prefix
2. **Encryption**: Encrypt the name using an RC5-like cipher with a predefined key
3. **Checksum Calculation**: Generate a checksum from the encrypted data
4. **Key Assembly**: Combine checksum and encrypted value into the final key

The verification process reverses this to validate name/key pairs.

## 📝 License Key Format

Generated keys are 18 hexadecimal characters in the format:

```
CCXXXXXXXXXXXXXXXX
││└─────────────┘
││ 16-char encrypted value
│└ 2-char checksum
```

## 🎨 Web Interface Features

- **Gradient Background**: Modern purple gradient design
- **Responsive Layout**: Works on desktop and mobile devices
- **Real-time Generation**: Instant key generation on button click
- **Copy to Clipboard**: One-click copy functionality
- **Key Verification**: Built-in verification tool
- **Smooth Animations**: Polished UI with fade-in effects

## 🚀 Development

### Build

```bash
npm run build
```

### Watch Mode

```bash
npm run dev
```

### Start Server

```bash
npm run serve
```

## 📦 Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Prerequisites

- GitHub CLI (`gh`) installed
- GitHub account

### Deploy to GitHub

1. **Initialize Git repository and commit files:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Charles License Generator"
   ```

2. **Create GitHub repository and push:**
   ```bash
   gh repo create charles-license-generator --public --source=. --remote=origin --push
   ```

3. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Set Source to "GitHub Actions"
   - The site will be automatically deployed on every push to main branch

4. **Access your site:**
   - Your site will be available at: `https://[username].github.io/charles-license-generator/`

### Manual Build for GitHub Pages

The `docs/` folder contains the production build:
- `docs/index.html` - The web interface
- `docs/bundle.js` - Minified JavaScript bundle
- `docs/bundle.js.map` - Source map for debugging

## 📚 API Reference

### `generateLicenseKey(name: string): string`

Generates a valid Charles Proxy license key for the given name.

- **Parameters**: 
  - `name` - The registered name (any string)
- **Returns**: An 18-character hexadecimal license key
- **Example**:
  ```typescript
  const key = generateLicenseKey('John Doe');
  // Returns: "5fc91b7d5f93855fb7"
  ```

### `verifyLicenseKey(name: string, key: string): boolean`

Verifies if a license key is valid for the given name.

- **Parameters**:
  - `name` - The registered name
  - `key` - The 18-character license key to verify
- **Returns**: `true` if valid, `false` otherwise
- **Example**:
  ```typescript
  const isValid = verifyLicenseKey('John Doe', '5fc91b7d5f93855fb7');
  // Returns: true or false
  ```

## ⚠️ Disclaimer

This project is for educational purposes only. It demonstrates cryptographic concepts and TypeScript development practices. Please support software developers by purchasing legitimate licenses.

## 🔧 Tech Stack

- **TypeScript** - Type-safe JavaScript
- **tsdown** - Fast TypeScript bundler
- **tsx** - TypeScript execution engine
- **Node.js** - Runtime environment
- **Vanilla JS** - No framework dependencies for web UI

## 📄 Reference

This implementation is based on reverse-engineered Charles Proxy license validation logic from:
- Go implementation (`refs/gen.go`)
- Java decompiled source (`refs/myLN.java`)

## 👨‍💻 Author

Created with ❤️ using TypeScript and modern web technologies.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Note**: Each time you generate a key, a unique valid key is created due to randomization in the algorithm. All generated keys are valid for the given name.
