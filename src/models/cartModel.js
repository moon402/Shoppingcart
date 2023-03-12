const { type } = require("express/lib/response");
const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const cartSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  items: [{
    productId: {
      type: ObjectId,
      ref: "product",
      required: true

    },
    quantity: {
      type: Number,
      required: true
    }
  }],

  totalPrice: {
    type: Number,
    rquired: true,

  },
  totalItems: {
    type: Number,
    required: true,
    default: 1
  }
}, { timestamps: true });



module.exports = mongoose.model('Carts', cartSchema)
