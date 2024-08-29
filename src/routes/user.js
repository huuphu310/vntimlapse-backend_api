const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const { auth } = require('../middlewares/auth');
const {
  getUsersValidate,
  changeStatusValidate,
  changePasswordValidate,
  createUserValidate,
  updateUserValidate,
} = require('../validations/user');
const userController = require('../controllers/user');

/* eslint-disable prettier/prettier */
router.get('/users/me', auth, asyncMiddleware(userController.getMe));
router.get('/users', auth, getUsersValidate, asyncMiddleware(userController.getUsers));
router.post('/users', auth, createUserValidate, asyncMiddleware(userController.createUser));
router.put('/users/change-password', auth, changePasswordValidate, asyncMiddleware(userController.changePassword));
router.put('/users/:userId', auth, updateUserValidate, asyncMiddleware(userController.updateUser));
router.put('/users/:userId/change-status', auth, changeStatusValidate, asyncMiddleware(userController.changeStatus));
/* eslint-enable prettier/prettier */

module.exports = router;
