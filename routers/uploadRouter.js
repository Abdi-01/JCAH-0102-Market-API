const express = require('express')
const { uploadController } = require('../controllers')
const route = express.Router()

route.post('/upload', uploadController.uploadFile)

module.exports = route