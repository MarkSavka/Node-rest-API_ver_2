//! *?TODO          1111  1111        111111       1111111         11111111    11         111111111
//! *?TODO         11   11   11     111    111     11    111       11          11         11
//! *?TODO         11   11   11    111      111    11      11      11111       11         111111111
//! *?TODO         11        11     111    111     11    111       11          11                11
//! ?*TODO         11        11       111111       1111111         11111111    11111111   111111111

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true, 
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {type: String, required: true}

});

module.exports = mongoose.model('User', userSchema);