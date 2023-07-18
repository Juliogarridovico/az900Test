const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.post('/register', usersController.register);
router.delete('/:id', usersController.deleteUser);
router.put('/password', usersController.updatePassword);
router.get('/mostrarregistros', usersController.mostrarRegistros);
router.post('/login', usersController.login);

module.exports = router;
