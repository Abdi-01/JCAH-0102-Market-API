const express = require('express')
const { productController } = require('../controllers')
const route = express.Router()

route.get('/leafCat', productController.getLeafCat)
route.post('/add/:leafnode', productController.addProduct)

route.get('/category-parent', productController.getCategoryParent)

route.get('/get', productController.getProducts)

module.exports = route