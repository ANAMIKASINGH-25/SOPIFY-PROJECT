const { Schema, model } = require('../connection');

const mySchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { 
        filename: String,
        path: String,
        contentType: String,
        size: Number
    },
    fromExtension: { type: Boolean, default: false },
    url: { type: String },
    timestamp: { type: Number },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users' }
})

module.exports = model('sops', mySchema);