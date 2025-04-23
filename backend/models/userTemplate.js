const { Schema, template} = require('../connection');

const mySchema = new Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    structure:{type:String,requied:true},
    createdAt:{type:Schema.Types.ObjectId,ref:'user'},
    updatedAt:{type:Date,default:Date.now}
    
})

module.exports =template('users', mySchema);