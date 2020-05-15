//!*?          1111  1111        111111       1111111         11111111    11         111111111
//!*?         11   11   11     111    111     11    111       11          11         11
//!*?         11   11   11    111      111    11      11      11111       11         111111111
//!*?TODO     11        11     111    111     11    111       11          11                11
//!*?TODO     11        11       111111       1111111         11111111    11111111   111111111
const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    price: { type: Number, required: true},
    productImage: String,
    productImageUrl: String
});

module.exports = mongoose.model('Product', productSchema);