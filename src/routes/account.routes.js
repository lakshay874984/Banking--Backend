const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const { createAccountController ,getUserAccountsController,getBalanceAccountController} = require('../controllers/account.controller');
/**
 *  - POST /api/accounts
 *  - Create a new account for the authenticated user
 *  - protected route, requires authentication
 */

router.post('/', authMiddleware, createAccountController); 

/**
 * - GET /API/ACCOUNTS/
 * - get all accounts of the logged-in user
 * - protected route
 */

router.get("/",authMiddleware,getUserAccountsController)

/**
 * - GET / API/ACCOUNTS/BALANCE/:ACCOUNTID
 * 
 * - 
 */

router.get("/balance/:accountId",authMiddleware,getBalanceAccountController)
module.exports = router;