# QA Bootcamp – Week 2 Capstone

This repository contains automated UI and API tests written with Playwright and TypeScript for the Practice Software Testing Toolshop application.

During Week 2, I practised:
- TypeScript
- Playwright UI testing
- API testing
- Page Object Model (POM)
- Reading traces and diagnosing failures
- Fixing flaky tests

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

Run all Playwright tests:

```bash
npm test
```

Run the two capstone tests:

```bash
npx playwright test tests/search_ui.spec.ts
npx playwright test tests/add_to_cart_api.spec.ts
```

Run a test with the trace switched on:

```bash
npx playwright test tests/search_ui.spec.ts --trace on
npx playwright show-trace test-results/<test-folder>/trace.zip
```

## Capstone: the two cases I chose

I applied two gates to the six cases. Gate 1: can I automate it reliably (stable data, stable page, no timing dependency)? Gate 2: is it worth automating (how often it runs, what it costs to repeat by hand, how stable the page is, what it costs to maintain)?

I chose **C1 Search by name** (UI) and **C4 Add to a cart** (API).

| Case | Decision | Reason |
|---|---|---|
| C1 Search by name (UI) | Chosen | The products on the site stay the same, so the result is predictable. Search is something every shopper uses, and the test is short, so it is cheap to keep up. |
| C2 Filter by category (UI) | Left out | It is valuable, but it fails Gate 1. Ticking Hand Tools also ticks seven subcategories, the results reload on their own, and page 1 can look unchanged, so I would have to check the last page. That is the most timing risk of the six. |
| C3 Sort by price (UI) | Left out | The products stay the same, but I would have to turn price text into numbers and wait for the list to finish reordering. It takes more work than C1 for a similar kind of check. |
| C4 Add to a cart (API) | Chosen | The API gives the same answer every time. Checking that the cart contains the product proves the add worked, which status codes alone do not. The test creates its own cart, so it shows setup and cleanup. |
| C5 Unknown cart (API) | Extra check only | It is reliable, but it creates no data, so it cannot be my API case on its own. I kept it as an extra check. |
| C6 Missing quantity (API) | Left out | It is a quick, useful check, but it shows less than C4 because it only covers one bad request, not a full add-to-cart. |

### Tiebreaker

Four cases passed both gates, so I picked the two with the clearest expected result, the least timing risk and the most coverage per test.

## What each test checks

### C1 Search by name (`tests/search_ui.spec.ts`, page object `pages/homepage.ts`)

- **Steps:** open the home page, search for "pliers", read the product names.
- **Checks:** at least one product shows up, and every product name contains "pliers" (not case sensitive).
- **Why it exists:** search is a core shopper feature. If it returns the wrong products, shoppers cannot find what they want.
- **How it avoids fixed waits:** the page object waits for the search response before reading, and the test uses `expect(...).toContainText` which retries.
- **Could pass when it should fail:** an empty list makes "every name contains pliers" true by default, so the test also checks that the count is greater than 0.
- **Could fail when it should pass:** a name like "Combination Pliers" has a capital P, so the comparison is done in lowercase.

### C4 Add to a cart (`tests/add_to_cart_api.spec.ts`)

- **Steps:** create a cart, get a real product ID from the products endpoint, add that product with quantity 1, fetch the cart, then delete the cart.
- **Checks:** creating the cart returns 201 with an ID, adding the product returns 200, the cart contains exactly that product ID with quantity 1, and the delete returns 204.
- **Why it exists:** adding to a cart is the step before every purchase. The extra check of the cart contents proves the product was really added, not only that the API said yes.
- **Test data:** the test makes its own cart and deletes it in a `finally` block, so the cart is removed even if a check fails.
- **Headers:** every request sends `Accept: application/json`.
- **Host:** the API tests use the full API URL (`https://api.practicesoftwaretesting.com`). A relative path like `/carts` goes to the website instead, which returns HTML.

### C5 Unknown cart (extra check, `[file name]`)

- Requests a cart ID that does not exist and checks for 404. It creates no data, so it needs no cleanup.

## Failure diagnosed from the trace

I broke **C1** on purpose by changing the check in `search_ui.spec.ts`, line 18, from `toContain('pliers')` to `toContain('hammer')`, while the search still used "pliers".

- **Terminal:** `Expected substring: "hammer"`, `Received string: " combination pliers "`.
- **Trace, Network tab:** the search request returned status 200.
- **Trace, page screenshot:** "Searched for: pliers" and "4 products found for 'pliers'".
- **Trace, Actions list:** `Expect "toBeGreaterThan"` passed, so the results were not empty. The red step was `Expect "toContain"`.
- **Trace, Errors tab:** pointed to `search_ui.spec.ts:18` with the Expected and Received values above.
- **Classification: test.** The site and the network did the right thing. The expected word in my test was wrong.
- **Restored:** I changed the check back to `'pliers'` and reran: 1 passed.

## Flakiness drill (`tests/drill/`)

`index.html` shows "Saved" after a random delay of 0 to 1 second once Save is clicked.

| Version | File | Wait | Result over 20 runs |
|---|---|---|---|
| Unfixed | `tests/drill/unfixed.spec.ts` | Fixed 500 ms, then one plain read | 9 passed, 11 failed |
| Fixed | `tests/drill/fixed.spec.ts` | `toHaveText` (retries until the text appears) | 20 passed, 0 failed |

Every failure in the unfixed version said `Expected: "Saved"` and `Received: ""`.

**What made it flaky:** the test waited a fixed 500 ms and read the message once. When the random delay was longer than 500 ms, the paragraph was still empty.

**Evidence:** 11 failures out of 20, all with the same empty received value, with no code change between runs. The `Message read:` lines switched between "Saved" and an empty value.

**Why the fix worked:** `toHaveText` keeps checking until the text appears, so the test waits for the condition and not for a guess about time. It passed 20 out of 20 on the same page.

Commands used:

```bash
npx playwright test tests/drill/unfixed.spec.ts --repeat-each=20 --reporter=line
npx playwright test tests/drill/fixed.spec.ts --repeat-each=20 --reporter=line
```

## Decisions the requirement did not make for me

- **Which host the API tests call.** The website and the API are on different hosts. I used the full API URL in the API tests. Two of my early failures came from calling the website by mistake.
- **Where the product ID comes from.** The requirement does not say. I fetch one from the products endpoint so the test does not break if a product is removed.
- **What "contains that product" means.** I check the product ID and the quantity in the cart, not only the status codes.
- **Which waiting method to use for search.** The requirement does not say. I wait for the search response, then use retrying checks.

## Execution evidence

- [Screenshot: C1 passing]([link])
- [Screenshot: C4 passing]([link])
- [Screenshot: trace viewer, Errors tab]([link])
- [Screenshot: trace viewer, Network tab]([link])
- [Screenshot: C1 rerun after restoring]([link])
- [Screenshot: drill before the fix, 9 passed, 11 failed]([link])
- [Screenshot: drill after the fix, 20 passed]([link])

## Test Coverage

- Homepage title verification.
- Product search (C1, on a page object).
- Invalid login scenarios.
- Cart creation and product addition through the API (C4).
- Handling requests for non-existent carts (C5).
- Products API response verification.
- Flakiness drill, before and after the fix.

## Project Structure

| Folder | Description |
|---|---|
| `tests/` | Playwright UI and API test files. |
| `tests/drill/` | The flakiness drill: `index.html`, `unfixed.spec.ts`, `fixed.spec.ts`. |
| `pages/` | Page objects, including `homepage.ts`. |
| `scripts/` | Helper scripts, including the environment setup check. |

## Cucumber

The optional Cucumber.js scenario and connected step definitions were not completed as part of this submission.

## Security

Never commit your `.env` file. It contains environment configuration and may contain sensitive information such as API keys, tokens and passwords. It is included in `.gitignore`.
