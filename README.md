# QA Bootcamp – Week 2

This repository contains automated UI and API tests written using Playwright and TypeScript for the Practice Software Testing Toolshop application.

During Week 2, I practised:
- TypeScript
- Playwright UI testing
- API testing
- Page Object Model (POM)
- Automated test execution

## Prerequisites

Install the following before getting started:

- [Node.js](https://nodejs.org/) (current LTS version)
- [Git](https://git-scm.com/)
- [VS Code](https://code.visualstudio.com/)

## Setup

### Step 1: Clone the repository

```bash
git clone <repo-url>
cd qa-bootcamp-week2-starter
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Install the Chromium browser

```bash
npx playwright install chromium
```

### Step 4: Configure environment variables

Copy `.env.example` to `.env`.

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

The `.env` file contains the Toolshop website URL (`TOOLSHOP_URL`) and API URL (`TOOLSHOP_API_URL`).

### Step 5: Check the setup

```bash
npm run check
```

This checks the environment configuration and verifies that the Toolshop API is accessible.

## Running Tests

To run all Playwright tests:

```bash
npm test
```

To run a specific test file:

```bash
npx playwright test tests/homepage.spec.ts
```

## Test Coverage

The automated test suite includes:

- Homepage title verification.
- Product search.
- Invalid login scenarios.
- Page Object Model search test.
- Cart creation and product addition through the API.
- Handling requests for non-existent carts.
- Products API response verification.

## Project Structure

| Folder | Description |
|---|---|
| `tests/` | Playwright UI and API test files. |
| `scripts/` | Helper scripts, including the environment setup check. |

## Cucumber

The optional Cucumber.js scenario and connected step definitions were not completed as part of this submission.

## Security

Never commit your `.env` file. It contains environment configuration and may contain sensitive information such as API keys, tokens and passwords. It is included in `.gitignore`.
