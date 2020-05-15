const Order = require('../models/order');
const Product = require('../models/product');

exports.orders_get_all = (req, res, next) => {
    Order.find()
    .exec()
    .then(order => {
        console.log('Result: ' + order);
        const responce = {
            _id: order._id,
            product: order.map(order => {
                return {
                    productId: order.product,
                    orderId: order._id,
                    quantity: order.quantity,
                    request: {
                        type: 'GET',
                        url: 'https://localhost:3100' + order.product
                    }
                }
            })
           
        };
        res.status(201).json({count: order.length, responce});

    })
    .catch(err => {
        console.log("Error: " + err);
        res.status(500).json(err)
    });
}

exports.orders_get_item = (req, res, next) => {
    const item = req.params.item;

    if(item){
        Order.findById(item)
        .exec()
        .then(order => {
            console.log(order);

            const Order = {
                Order: {
                    Id: order._id,
                    ProductId: order.product,
                    Quantity: order.quantity,
                },
                Request: {
                    type: 'GET',
                    url: 'http://localhost:3100/orders/'
                }
            };


            res.status(200).json(Order);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    } else {
        console.log('ID is not defined');
        res.status(500).json({Result: 'ID is`nt defined'});
    }
    
}

exports.order_post = (req, res, next) => {

    Product.findById(req.body.productId)
        .then(product => {
            if(!product){
                return res.status(404).json({
                    message: 'Product is not found'
                });
            } 
            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            const order = new Order({                                              //!
                _id: mongoose.Types.ObjectId(),                                    //!
                product: req.body.productId,                                       //!
                quantity: req.body.quantity                                        //!
            });                                                                    //!
            return order.save()                                                    //!
            .then(result => {                                                      //!
                console.log("Order was 'POST' : " + result );                      //!
                res.status(201).json({message: "Order wad POST", Result: result}); //!
            })                                                                     //!
            .catch(err => {                                                        //!
                console.log(err);                                                  //!
                res.status(500).json(err);                                         //!
            });                                                                    //!
        })                                                                         //!
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        .catch(err => {
            res.status(500).json({
                message: 'Product not found',
                Error: err
            });
        });
}

exports.order_delete_all = (req, res, next) => {
    Order.remove()
        .exec()
        .then(result => {
            if(result.n){
                console.log("Order was DELETE!");
                res.status(200).json({'Result': 'Order was Deleted'});
            } else
            console.log('Order not found');
            res.status(500).json({'Result': 'Order not found'});
        })
        .catch(err => {
            console.log({Errro: err});
            res.status(500).json({'The BiG Error': err});
        });
}

exports.order_delete_item = (req, res, next) => {
    const item = req.params.item;
    Order.remove({_id: item})
        .exec()
        .then(result => {
            if(result.n){
                console.log('Order ' + item.orderId + ' was DELETE');
                res.status(200).json({
                    'message': 'Order was delete',
                    'OrderID': item.orderId,
                    'url': 'http://localhost:3100/orders'
                });
            } else 
            console.log('Order not found');
            res.status(200).json({result: 'Order not found, because was deleted in past'});
            
        })
        .catch(err => {
            console.log({Errro: err});
            res.status(500).json({'The BiG Error': err});
        });
}