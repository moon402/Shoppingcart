const mongoose=require('mongoose')

const productSchema=new mongoose.Schema({
    title: {type:String, required:true, unique:true,trim: true},
     description: {type:String,required:true,trim: true},
     price: {type:Number, required:true,trim: true},
     currencyId: {type:String, required:true,trim: true,default:'INR'},//INR
     currencyFormat: {type:String,required:true,Symbol:'₹'},
     isFreeShipping: {type:Boolean, default: false},
     productImage: {type:String, required:true,trim: true},  // s3 link
     style: {type:String,trim: true},
     availableSizes: {type:[String],default:['XS']},
     installments: {type:Number},
     deletedAt: {type:Date}, 
     isDeleted: {type:Boolean, default: false}
  
},{timestamps: true})

module.exports=mongoose.model('product',productSchema)