const mongoose = require('mongoose');

const search_Schema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    order_id: {
        type: String,
        required: true
    },
    transactionId: {
        type: String,
        required: false
    },
    WalletAddress: {
        type: String,
        required: false,
    },
    TransactionHash: {
        type: String,
        required: false,
    },
    TyraToken: {
        type: String,
        required: true,
    },
    Crypto: {
        type: String,
        required: true,
    },
    CryptoValue: {
        type: String,
        required: true,
    },
    Amount: {
        type: String,
        required: true,
    },
    status:{
        type: String,
        required: true,
        default:'purchase Pending'
    }
});

module.exports = mongoose.model('orders', search_Schema);