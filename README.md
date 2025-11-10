# Firelocks Service

A standalone NestJS + TypeScript service that acts as a proxy to the Fireblocks Create Transaction API.

## Overview

This service provides a REST API endpoint that forwards transaction creation requests to the Fireblocks API, handling authentication, validation, and error responses in a clean, well-structured manner.

## Features

- ✅ REST API endpoint: `POST /transactions`
- ✅ Input validation using `class-validator` and `class-transformer`
- ✅ Fireblocks API integration using official TypeScript SDK
- ✅ Automatic authentication handling (SDK manages JWT signing)
- ✅ Comprehensive error handling
- ✅ Environment variable configuration
- ✅ Unit tests with Jest
- ✅ TypeScript with strong typing throughout
- ✅ NestJS best practices (modules, controllers, services, DTOs)

## Tech Stack

- **Runtime**: Node.js LTS
- **Framework**: NestJS
- **Language**: TypeScript
- **Package Manager**: npm
- **Testing**: Jest
- **Fireblocks SDK**: @fireblocks/ts-sdk (Official Fireblocks TypeScript SDK)

## Project Structure

```
firelocks-service/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── config/
│   │   ├── config.module.ts
│   │   └── config.service.ts
│   └── transactions/
│       ├── dto/
│       │   └── create-transaction.dto.ts
│       ├── interfaces/
│       │   └── fireblocks-transaction.interface.ts
│       ├── transactions.controller.ts
│       ├── transactions.service.ts
│       ├── transactions.module.ts
│       └── fireblocks.client.ts
├── test/
│   └── transactions/
│       ├── transactions.controller.spec.ts
│       ├── transactions.service.spec.ts
│       └── fireblocks.client.spec.ts
├── package.json
├── tsconfig.json
├── .eslintrc.js
├── .prettierrc
├── .gitignore
├── .env.example
└── README.md
```

## Getting Started

### Prerequisites

- Node.js LTS (v18 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone git@github.com:nehilor/firelocks-service.git
cd firelocks-service
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
FIREBLOCKS_API_KEY=your-api-key-here
FIREBLOCKS_SECRET_KEY_PATH=./fireblocks_secret.key
FIREBLOCKS_BASE_URL=https://api.fireblocks.io
FIREBLOCKS_API_PATH=/v1
PORT=3000
```

5. Place your Fireblocks private key file in the project root:
   - Download the private key file (`.key` file) from Fireblocks Console for your API key
   - Save it as `fireblocks_secret.key` in the project root (or update `FIREBLOCKS_SECRET_KEY_PATH` in `.env`)
   - Ensure the file is in PEM format

### Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The service will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### POST /transactions

Creates a new transaction by proxying the request to Fireblocks API.

**Note**: Authentication is automatically handled by the Fireblocks SDK using credentials from your `.env` file. You only need to send `Content-Type` and `Accept` headers.

**Request Body:**
```json
{
  "assetId": "XLM_USDC_T_CEKS",
  "source": {
    "type": "EXCHANGE_ACCOUNT",
    "id": "300d1b9a-f46b-4ee6-be99-659fcd3cd802"
  },
  "destination": {
    "type": "EXTERNAL_WALLET",
    "id": "56216a51-5fad-4433-ac89-d4416fad7c0d"
  },
  "amount": "1",
  "feeLevel": "MEDIUM",
  "note": "",
  "operation": "TRANSFER",
  "customerRefId": "payoutCircleExternal",
  "externalTxId": "circleTest"
}
```

**Response (200 OK):**
```json
{
  "id": "transaction-id",
  "status": "SUBMITTED"
}
```

**Error Responses:**

- **400 Bad Request**: Validation errors
  ```json
  {
    "statusCode": 400,
    "message": ["property should not exist"],
    "error": "Bad Request"
  }
  ```

- **502 Bad Gateway**: Fireblocks API errors
  ```json
  {
    "message": "Fireblocks API error",
    "code": 1001
  }
  ```

- **500 Internal Server Error**: Internal errors
  ```json
  {
    "message": "Failed to create transaction",
    "code": "REQUEST_ERROR"
  }
  ```

## Testing

Run the test suite:

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## Authentication

The service uses the **official Fireblocks TypeScript SDK** (`@fireblocks/ts-sdk`) which handles all authentication automatically. The SDK manages JWT token generation, signing, and request authentication internally.

### SDK Initialization

The Fireblocks SDK is initialized in `FireblocksClient.onModuleInit()` with:

- **API Key**: From `FIREBLOCKS_API_KEY` environment variable
- **Secret Key**: Loaded from the file specified in `FIREBLOCKS_SECRET_KEY_PATH`
- **Base Path**: Automatically determined from `FIREBLOCKS_BASE_URL`:
  - `BasePath.US` for production (`https://api.fireblocks.io`)
  - `BasePath.Sandbox` for sandbox (`https://sandbox-api.fireblocks.io`)
  - `BasePath.EU` for EU production
  - `BasePath.EU2` for EU2 production

### Private Key Handling

The private key file is automatically processed:

- **BOM Removal**: Byte Order Mark is removed if present
- **Whitespace Normalization**: Extra whitespace trimmed, line endings normalized to `\n`
- **Format Validation**: Must be in PEM format with `-----BEGIN PRIVATE KEY-----` or `-----BEGIN RSA PRIVATE KEY-----` markers

### Error Handling

When Fireblocks returns an authentication error (code `-7` or `-1`), the service provides detailed troubleshooting information:

- Verification checklist for API key and private key pairing
- Format validation guidance
- Environment configuration checks

### Benefits of Using the Official SDK

- ✅ **Automatic Authentication**: JWT generation and signing handled internally
- ✅ **Type Safety**: Full TypeScript support with proper types
- ✅ **Error Handling**: Comprehensive error handling built-in
- ✅ **Maintenance**: Automatically updated with Fireblocks API changes
- ✅ **Best Practices**: Follows Fireblocks recommended implementation patterns

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `FIREBLOCKS_API_KEY` | Fireblocks API key (required) | - |
| `FIREBLOCKS_SECRET_KEY_PATH` | Path to your Fireblocks private key file (`.key` file) | `./fireblocks_secret.key` |
| `FIREBLOCKS_BASE_URL` | Fireblocks API base URL | `https://api.fireblocks.io` |
| `FIREBLOCKS_API_PATH` | Fireblocks API path | `/v1` |
| `PORT` | Server port | `3000` |

**Important**:
- Place your `fireblocks_secret.key` file in the project root (or specify the path in `FIREBLOCKS_SECRET_KEY_PATH`)
- Make sure the `.key` file is in your `.gitignore` to avoid committing it
- The private key file should be in PEM format (standard RSA private key format)

## Code Style

The project follows NestJS best practices:

- Strong typing throughout
- DTOs for validation
- Dependency injection
- Modular architecture
- Separation of concerns

## Development

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## License

MIT

## References

- [Fireblocks API Documentation](https://developers.fireblocks.com/reference/createtransaction)
- [Fireblocks TypeScript SDK](https://developers.fireblocks.com/reference/typescript-sdk)
- [NestJS Documentation](https://docs.nestjs.com)
