const express = require('express');
const router = express.Router();

module.exports = (db) => {
  const authController = require('../authController')(db);

  router.post('/login', authController.login);

  return router;
};
