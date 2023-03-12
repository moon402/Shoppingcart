const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const orderschema = new mongoose.Schema({
  userId: { type: ObjectId, ref: 'user', required: true },
  items: [{
    productId: { type: ObjectId, ref: 'product', required: true },
    quantity: { type: Number, required: true, }
  }],
  totalPrice: { type: Number, required: true },
  totalItems: { type: Number, required: true, comment: "Holds total number of items in the cart" },
  totalQuantity: { type: Number, required: true, comment: "Holds total number of quantity in the cart" },
  cancellable: { type: Boolean, default: true },
  status: { type: String, default: 'pending', enum: ["pending", "completed", "cancled"] },
  deletedAt: { type: Date, default: null },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true })



module.exports = mongoose.model('order', orderschema)