const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');
const fs = require('fs');

//! ****************************************************

const multer = require('multer');



//! ****************************************************

exports.product_get_all = (req, res, next) => {
    Product.find()
        .select('name _id price productImage productImageUrl')
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json({
                count: docs.length,
                response: docs
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err});
        });
}

exports.product_get_item = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            if(doc){
                res.status(200).json({
                    product: {
                        id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        productImage: 'localhost:3100/' + doc.productImage
                    },
                    request: {
                        type: 'GET',
                        url: 'https://localhost:3100/products',
                        description: "Click HERE",
                        autor: "Mark Savka <marekmen.yt@gmail.com>"                    
                    }
                });
            } else {
                res.status(404).json({
                    'message': 'Product not found'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({
                error: err
            });

        });
}

exports.product_post = (req, res, next) => {

    
    if(req.file){ 
        // ?! На випадок якщо зображення є 
        console.log('Спрацював перший випадок');
        
        var product = new Product({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price,
            productImage: req.file.path,
            productImageUrl: 'http://localhost:3100' + req.file.path
        });
    } else {
        // ?! На випадок якщо зображення немає
        console.log('Спрацював другий випадок');

        var product = new Product({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price,
        });
    }
    
    product.save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                name: result.name,
                price: result.price,
                productImage: result.productImage
            });
        })
        .catch(err => {
            console.log('Error from post/ : ' + err);
            res.status(500).json(err);
        })
}

exports.product_patch_item = (req, res, next) => {
    const id = req.params.productId;
    Product.update({_id: id}, { $set: {name: req.body.name, price: req.body.price}})
        .exec()
        .then(update => {
            console.log("Update : " + update);
            res.status(200).json({
                result: "Product updated",
                response: {
                    type: 'GET',
                    url: 'http://localhost:3100/products/' + id
                }
            });
        })
        .catch(err => {
            console.log("Error : " + err);
            res.status(500).json({
                Error: err
            });
        });
}

exports.product_delete_all = (req, res, next) => {
    Product.find()
        .exec()
        .then(result => {
            console.log({Res: result});
            for(let i = 0; i <= result.length; i++){
                if(result[i].productImage)
                    fs.unlinkSync(result[i].productImage);
            }
            console.log({Res: result});
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({
                message: 'Already deleted'
            });
        })
    Product.remove()
    .exec()
    .then(docs => {
        //Перевірка чи існує об'єкт
        if(docs.n){ 
            console.log("DELETE");
            res.status(200).json({result: "Was DELETED"});
        } else {
            console.log("Error for Delete");
            res.status(200).json({result: "Error delete"});
        }
    })
    .catch(err => {
        console.log("Error" + err);
        res.status(500).json({
            Err: err
        })
    });
}

exports.product_delete_item = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(result => {
            fs.unlinkSync(result.productImage)
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({
                message: 'Already deleted'
            });
        })
    
    Product.remove({_id: id})
    .exec()
    .then(result => {
        // Тест чи існує такий ідентифікатор
        if(result.n){ 
            console.log("DELETE");
            res.status(200).json({result: "Was DELETED"});
        } else {
            console.log("Error for Delete");
            res.status(200).json({result: "Error delete"});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}