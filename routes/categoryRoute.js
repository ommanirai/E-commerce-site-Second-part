const express = require('express')
const { addCategory, viewCategories, updatecategory, deleteCategory, findCategory } = require('../controllers/categoryController')
const { requireSignin } = require('../controllers/userController')
const { findById } = require('../models/categoryModel')
const { categoryCheck, validation } = require('../validation')
const router = express.Router()

router.post('/addcategory', categoryCheck, validation, requireSignin, addCategory)
router.get('/viewCategory', viewCategories)
router.put('/updatecategory/:id', requireSignin, updatecategory)
router.delete('/deletecategory/:id', requireSignin, deleteCategory)
router.get('/findcategory/:id', findCategory)


module.exports = router