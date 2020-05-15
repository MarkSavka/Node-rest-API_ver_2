const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const OrderController = require('../controllers/orders');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', checkAuth, OrderController.orders_get_all);

router.get('/:item', checkAuth, OrderController.orders_get_item);

router.post('/', checkAuth, OrderController.order_post);

router.delete('/', checkAuth, OrderController.order_delete_all);

router.delete('/:item', checkAuth, OrderController.order_delete_item );

module.exports = router;