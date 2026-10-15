# ShopKart

ShopKart is a full-stack e-commerce application. Shoppers can browse products, manage a cart and wishlist, check out, and view orders. Registered users can also list and manage their own products.

## Features

- Account registration and login with protected pages
- Product browsing and product details
- Wishlist and shopping cart
- Product listing, editing, and management
- Checkout and order history/details
- Razorpay payment integration
- Product image uploads through Cloudinary

## Tech stack

- **Frontend:** React, Vite, React Router, Redux Toolkit, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Integrations:** Razorpay and Cloudinary

## Project structure

```text
ShopKart/
├── client/
│   └── ShopKart/    # React/Vite frontend
└── server/          # Express API
```

## Prerequisites

- Node.js and npm
- A MongoDB database
- Cloudinary credentials for product image uploads
- Razorpay credentials for payment checkout

## Getting started

### 1. Configure the backend

Create `server/.env` with the following variables:

```env
PORT=8180
dbURL=mongodb://127.0.0.1:27017/shopkart
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

Use your own MongoDB connection string and service credentials. Keep secrets in environment files; do not commit them or expose secret keys in frontend variables.

Install dependencies and start the API:

```powershell
cd server
npm install
npm run dev
```

The API listens on `http://localhost:8180` by default. Its health check is available at `http://localhost:8180/health`.

### 2. Configure and start the frontend

Create `client/ShopKart/.env` if the API is not running at its default local address:

```env
VITE_API_URL=http://localhost:8180
```

Install dependencies and start the Vite development server in a second terminal:

```powershell
cd client/ShopKart
npm install
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`). The frontend defaults to the local API URL above when `VITE_API_URL` is not set.

## Available commands

Run these commands from the relevant application directory.

### Frontend (`client/ShopKart`)

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the production frontend |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

### Backend (`server`)

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with Nodemon |
| `npm start` | Start the API with Node.js |

## API overview

The backend exposes these route groups:

- `/customers` — user and authentication operations
- `/products` — product operations
- `/cart` — cart operations
- `/orders` — checkout and order operations
- `/health` — API health check

The API uses cookie credentials for browser requests. Local development is configured for a frontend at `http://localhost:5173`; set `CLIENT_URL` to the deployed frontend origin when hosting the API elsewhere.

## Deployment

The frontend includes a Vercel rewrite for client-side routes. Set `VITE_API_URL` to the deployed API URL in the frontend environment and configure the backend environment variables (including `CLIENT_URL`) in the backend hosting provider. Provide valid MongoDB, Cloudinary, and Razorpay credentials for the features that use those services.
