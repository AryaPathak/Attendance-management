const express = require('express');

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");



const router = express.Router();

router.post('/signup', authController.signup);

router.post('/login', authController.login);


router.post('/finishWork',authController.finishWork);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);


router
  .route('/:id')
 .get(userController.getUser)
 .patch(userController.updateUser)
 .delete(userController.deleteUser);


router
 .route('/:startWork')
 .post(userController.getUser)
 




module.exports = router;