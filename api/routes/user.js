const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


//! **** Фікс багу з вверсіями ******
mongoose.set('useCreateIndex', true);
//! *********************************
router.get('/', (req, res, next) => {
    User.find()
        // .select('_id email password')
        .exec()
        .then(result => {
            const response = {
                count: result.length,
                product: result.map(result => {
                    return {
                        _id: result._id,
                        email: result.email,
                        password: result.password
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'error from uses/get',
                Error: err
            });
        });
});

router.get('/:item', (req, res, next) => {
    const id = req.params.item;
    User.findById(id)
        .exec()
        .then(result => {
            console.log(result);
            if(result){
                res.status(200).json({
                    _id: result._id,
                    email: result.email,
                    password: result.password
                });
            } else {
                res.status(404).json(result);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Error from user/get/:item',
                error: err
            });
        })
});

router.post('/login', (req, res, next) => {
    User.findOne({email: req.body.email})
        .exec()
        .then(user => {
            if(!user) {
                console.log(user);
                return res.status(404).json({
                    error: 'Auth error'
                });
            }
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if(err) {
                    return res.status(500).json({
                        error: 'Password is not defined'
                    });
                }
                if(result) {
                    const token = jwt.sign({
                        email: user.email,
                        userId: user._id
                     },
                     'my_private_JWT_KEY',
                     {
                        expiresIn: '1h'
                     }
                    );
                    return res.status(200).json({
                        message: 'login sucsessful',
                        token: token
                    });
                } else 
                    return res.status(500).json({
                        error: 'Auth error'
                    });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'Exists email'
            });
        });
});

router.post('/signup', (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length >= 1){
            console.log("Такий email вже існує");
            console.log();
            return res.status(409).json({
                message: 'Такий email вже існує'
            });
        } else {
            
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    return res.status(500).json({
                        message: 'error from hash',
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    //! User Save ***************************************** \\
                    user.save()
                        .then(result => {
                            console.log(result);
                            res.status(200).json({
                                _id: result._id,
                                email: result.email,
                                password: result.password
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                message: 'error from user/post/signup 1',
                                Error: err
                            });
                        });
                }  
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'error from user/post/signup 2',
            Error: err
        });
    });
});

router.delete('/', (req, res, next) => {
    User.remove()
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
});

router.delete('/:userId', (req, res, next) => {
    User.remove({_id: req.params.userId})
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
});

module.exports = router;