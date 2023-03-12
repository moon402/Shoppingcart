const cartmodel = require('../models/cartModel')
const mongoose = require('mongoose')
const userModel = require("../models/userModel")
const productModel = require("../models/productModel")
const objectId = mongoose.Types.ObjectId


//=======================cerate cart================================================================================//
exports.createcart = async function (req, res) {
  try {
    const data = req.body
    if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, msg: "Please enter data" }) }
    const userId = req.params.userId
    let obj = {}
    const { cartId, productId } = data

    if (!objectId.isValid(productId)) { return res.status(400).send({ status: false, msg: "Please enter valid productid" }) }

    const productexist = await productModel.findOne({ _id: productId, isDeleted: false })
    if (!productexist) { return res.status(404).send({ status: false, msg: "productid is not existing" }) }
    obj.userId = userId
    obj.items = { productId: productId, quantity: 1 }
    obj.totalPrice = productexist.price
    if (cartId) {
      if (!objectId.isValid(cartId)) { return res.status(400).send({ status: false, msg: "Please enter valid cartid" }) }
      const caridexist = await cartmodel.findOne({ _id: cartId })
      if (!caridexist) { return res.status(400).send({ status: false, msg: "cardid is not existing" }) }
      if (caridexist.userId != userId) { return res.status(400).send({ status: false, msg: "userid is not for this cart" }) }
      {
        let totalitem = 0
        let mg = 0
        let newabc = caridexist.items

        for (let i = 0; i < caridexist.totalItems; i++) {
          if (newabc[i].productId == productId) {
            newabc[i].quantity++
            mg++

          }
        }
        if (mg == 0) {
          newabc.push(obj.items)
          totalitem += caridexist.totalItems + 1
        }

        const newsavedata = await cartmodel.findOneAndUpdate({ _id: cartId, userId: userId }, { $set: { items: newabc, totalItems: newabc.length }, $inc: { totalPrice: +productexist.price } }, { new: true }).populate('items.productId', 'title productImage price')
        return res.status(200).send({ status: false, msg: "sucessfully added", data: newsavedata })
      }
    }

    const useridunique = await cartmodel.findOne({ userId: userId })
    if (useridunique) { return res.status(400).send({ status: false, msg: "userid is already exist" }) }
    const savedata = await cartmodel.create(obj)
    return res.status(201).send({ status: false, msg: "successfull", data: savedata })


  } catch (err) { return res.status(500).send({ status: false, msg: err.message }) }

}

//=====================update cart===============================================================================//
exports.updatecart = async function (req, res) {
  try {
    let data = req.body;
    if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, msg: "Please enter data" }) }
    let userId = req.params.userId;


    let { cartId, productId, removeProduct } = data;

    if (!productId) return res.status(400).send({ status: false, message: "Please Enter Product Id" })
    if (!objectId.isValid(productId)) return res.status(400).send({ status: false, message: "Please Enter valid Product Id" })

    let product = await productModel.findById(productId);
    if (!product) return res.status(404).send({ status: false, message: "Product not found" })

    if (!removeProduct) {
      return res.status(400).send({ status: false, message: "Provide the removeProduct Key" })
    }

    if (!(removeProduct == 1 || removeProduct == 0))
      return res.status(400).send({ status: false, message: "Please Enter RemoveProduct Key 0 Or 1" })


    if (!cartId) return res.status(400).send({ status: false, message: "Please Enter Cart Id" })
    if (!objectId.isValid(cartId)) return res.status(400).send({ status: false, message: "Please Enter valid cart Id" })
    let cartExist = await cartmodel.findById(cartId);


    if (cartExist) {
      if (cartExist.items.length == 0) { return res.status(400).send({ status: false, message: "NO Items Present In Cart" }) }
      for (let i = 0; i < cartExist.items.length; i++) {
        if (cartExist.items[i].productId == productId && cartExist.items[i].quantity > 0) {
          if (removeProduct == 1) {
            cartExist.items[i].quantity -= 1;
            cartExist.totalPrice -= product.price;
            if (cartExist.items[i].quantity == 0) {
              cartExist.items.splice(i, 1)
            }
          } else if (removeProduct == 0) {
            cartExist.totalPrice = cartExist.totalPrice - cartExist.items[i].quantity * product.price;
            cartExist.items.splice(i, 1)
          }


          cartExist.totalItems = cartExist.items.length;
          let final = await cartmodel.findOneAndUpdate({ _id: cartId }, { $set: cartExist }, { new: true })
          return res.status(200).send({ status: true, message: "Success", data: final });
        }
      }

      return res.status(404).send({ status: false, message: "No Product with this productId" })

    } else { return res.status(404).send({ status: false, message: "Cart Not Found With This CartId" }) }
  } catch (err) { return res.status(500).send({ status: false, message: err.message }) }
}

//==========================get cart================================================================================//
exports.getCartData = async function (req, res) {
  try {
    let userId = req.params.userId




    let findCart = await cartmodel.findOne({ userId: userId })
    if (findCart.items.length == 0) {
      return res.status(404).send({ status: false, message: "cart is not found" })
    }

    return res.status(200).send({ status: true, message: "Success", data: findCart })

  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message })
  }
}

//=============================delete cart========================================================================//
exports.deletecart = async function (req, res) {
  try {
    const userid = req.params.userId

    const deletecart = await cartmodel.findOneAndUpdate({ userId: userid }, { $set: { items: [], totalItems: 0, totalPrice: 0 } })
    if (deletecart.items.length == 0) { return res.status(404).send({ status: false, msg: "cart is not existing" }) }
    return res.status(204).send({ status: true, msg: "cart deleted successfully" })
  } catch (err) { return res.status(500).send({ status: false, msg: err.message }) }

}