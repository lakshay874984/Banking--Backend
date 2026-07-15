# Banking Backend API

A secure and scalable backend API for a banking or fintech application built with Node.js, Express.js, and MongoDB. This project provides authentication, account management, money transfer workflows, ledger tracking, and email notifications for a realistic digital banking experience.

## Features

- User registration, login, and logout with JWT-based authentication
- Protected routes for account creation and balance lookup
- Money transfer transactions with idempotency support
- Ledger-based balance tracking for financial integrity
- Initial funds transaction support for system-level funding
- Email notifications for registration and transaction events
- MongoDB integration using Mongoose

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT for authentication
- Cookie-based token handling
- Nodemailer for email delivery

## Project Structure

```bash
src/
  controllers/
  middleware/
  models/
  routes/
  services/
  DB/
app.js
server.js
```

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add the following variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000

EMAIL_USER=your_email@gmail.com
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
REFRESH_TOKEN=your_google_refresh_token
```

4. Start the development server:

```bash
npm run dev
```

The server will run on port `3000` by default.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user
- `POST /api/auth/logout` - Log out a user

### Accounts

- `POST /api/accounts` - Create an account for the authenticated user
- `GET /api/accounts` - Get all accounts for the current user
- `GET /api/accounts/balance/:accountId` - Get account balance

### Transactions

- `POST /api/transactions` - Create a transfer transaction
- `POST /api/transactions/system/intial-funds` - Add initial funds via system user route

## Notes

- The transaction flow includes ledger entry creation and status handling for proper financial operations.
- Email delivery requires valid Gmail OAuth credentials configured in the environment variables.
- This project is intended as a backend foundation and can be extended with features such as role-based access control, payment limits, and transaction history dashboards.

