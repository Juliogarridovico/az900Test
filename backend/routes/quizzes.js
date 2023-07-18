const express = require('express');
const router = express.Router();
const quizzesController = require('../controllers/quizzesController');

router.post('/', quizzesController.createQuestion);
router.put('/:id', quizzesController.updateQuestion);
router.get('/', quizzesController.getQuestions);
module.exports = router;
