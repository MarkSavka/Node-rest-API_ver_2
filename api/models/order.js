//! *?TODO          1111  1111        111111       1111111         11111111    11         111111111
//!* ?TODO         11   11   11     111    111     11    111       11          11         11
//!*? TODO         11   11   11    111      111    11      11      11111       11         111111111
//!*?TODO          11        11     111    111     11    111       11          11                11
//! ?*TODO         11        11       111111       1111111         11111111    11111111   111111111

const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
    quantity:{type: Number, default: 1}
});


module.exports = mongoose.model('Order', orderSchema);