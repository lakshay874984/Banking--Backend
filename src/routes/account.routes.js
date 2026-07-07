const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const { createAccountController } = require('../controllers/account.controller');
/**
 *  - POST /api/accounts
 *  - Create a new account for the authenticated user
 *  - protected route, requires authentication
 */

router.post('/', authMiddleware, createAccountController);  

module.exports = router;