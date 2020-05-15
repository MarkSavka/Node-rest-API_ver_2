const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

//! BodyParser *************************************
app.use(express.json());                       //! *
app.use(express.urlencoded({extended: true})); //! *
//! ************************************************

//! Routes *******************************************
app.use('/uploads', express.static('uploads'));  //! *
app.use('/user', userRoutes);                    //! *
app.use('/products', productRoutes);             //! *
app.use('/orders', orderRoutes);                 //! *
//! Morgan / console.monitoring **********************
app.use(morgan('dev'));


//! MongoDB **********************************************
mongoose.connect('mongodb://127.0.0.1:27017/chat-ms', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


module.exports = app;