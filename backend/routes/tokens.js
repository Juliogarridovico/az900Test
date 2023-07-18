const express = require('express');
const router = express.Router();

const tokensController = require('../controllers/tokensController');


router.delete('/:id', tokensController.deleteToken);
router.get('/', tokensController.getTokens);

module.exports = router;
