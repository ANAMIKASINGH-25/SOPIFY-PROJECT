const { Schema, review } = require('../connection');

const mySchema = new Schema({
    sopId:{type:Schema.Types.ObjecteId,ref:'sop',required:true},
    reviewId:{type:Schema.Types.ObjecteId,ref:'users',required:true},
    comments:{type:String,required:true},
    rating:{type:Number,min:1,max:5},
    createdAt:{type:Date,default:Date.now},
})

module.exports = review('users', mySchema);