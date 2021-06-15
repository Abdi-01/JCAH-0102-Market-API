const express = require('express')
const route = express.Router()
const { userController } = require('../controllers')
const { auth } = require('../helpers/authDecode')

route.get('/get', userController.getUsers)
route.get('/getId', userController.getUserbyId)
route.delete('/del/:iduser', userController.deleteUser)

route.post('/regis', userController.register)
route.post('/login', userController.Login)
route.post('/reset', userController.reqPass)
route.patch('/resetPass', userController.resetPass)
route.patch('/verification', auth, userController.verification)
module.exports = route