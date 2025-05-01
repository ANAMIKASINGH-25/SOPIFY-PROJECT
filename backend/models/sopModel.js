const { Schema, model } = require('../connection');

const mySchema = new Schema({
    title: String,
   description: { type: String, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})

module.exports =model('sops', mySchema);