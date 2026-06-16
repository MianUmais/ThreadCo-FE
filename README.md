# ThreadCo Frontend

React storefront and admin dashboard for ThreadCo. Built with Vite + React + React Router.

## Requirements

- Node.js 18+
- npm 9+

## Getting Started

```bash
# Install dependencies
npm install

# Copy env template
cp .env.example .env

# Start dev server (runs on http://localhost:5173)
npm run dev
```

The app runs standalone on mock data when `VITE_API_URL` is not set or the backend is unreachable.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Flask backend base URL | *(unset — uses mock data)* |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm test` | Run tests |
| `npm run lint` | Lint source files |
| `npm run format` | Format source files |

## Routes

| Path | Page |
|------|------|
| `/` | Storefront |
| `/products` | Product listing |
| `/product/:id` | Product detail |
| `/cart` | Shopping cart |
| `/login` | Sign in |
| `/account` | User account |
| `/admin` | Admin dashboard |

## Project Structure

```
src/
├── api/
│   ├── client.js     # Fetch wrapper — reads VITE_API_URL, injects JWT
│   └── mock.js       # Standalone mock data
├── components/
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── Layout.jsx
│   └── Header.test.jsx
└── pages/
    ├── Storefront.jsx
    ├── Products.jsx
    ├── ProductDetail.jsx
    ├── Cart.jsx
    ├── Login.jsx
    ├── Account.jsx
    └── Admin.jsx
```

## API Client

`src/api/client.js` exports an `api` object with `get`, `post`, `put`, `patch`, and `delete` methods.
Call `setAuthToken(token)` after login to attach `Authorization: Bearer <token>` to all subsequent requests.

```js
import { api, setAuthToken } from './api/client'

// After login:
setAuthToken(jwt)

// Make requests:
const products = await api.get('/products')
```
