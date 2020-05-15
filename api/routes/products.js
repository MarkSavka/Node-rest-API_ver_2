const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const ProductController = require('../controllers/products');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cd) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cd(null, true);
    } else {
        cd(new Error('Photo will be in .jpeg or .png'), false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 25
    },
    fileFilter: fileFilter,
});


router.get('/', ProductController.product_get_all);

router.post('/', checkAuth, upload.single('productImage'), ProductController.product_post);

router.get('/:productId', ProductController.product_get_item);

router.patch('/:productId', checkAuth, ProductController.product_patch_item);

router.delete('/', checkAuth, ProductController.product_delete_all);

router.delete('/:productId', checkAuth, ProductController.product_delete_item);

module.exports = router;