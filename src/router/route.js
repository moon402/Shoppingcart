const express=require('express')
const router=express.Router()
let{create,login, getuser, updateuser}=require("../controller/user")

let { createproduct, getproduct, getProductbyid, updateProduct, deleteProductById }=require('../controller/product')

let{authentication,autherization} = require('../middleware/authentication')
let { createcart, updatecart, getCartData, deletecart }=require('../controller/cart')
let { createorder, updateorder }=require('../controller/order')



router.post("/register",create)
router.post('/login',login)
router.get("/user/:userId/profile",authentication,getuser)
router.put("/user/:userId/profile",authentication,autherization,updateuser)

router.post("/products",createproduct)
router.get('/products',getproduct)
router.get("/products/:productId",getProductbyid)
router.put("/products/:productId",updateProduct)
router.delete("/products/:productId",deleteProductById)

router.post("/users/:userId/cart",authentication,autherization,createcart)
router.put("/users/:userId/cart",authentication,autherization,updatecart)
router.get("/users/:userId/cart",authentication,autherization,getCartData)
router.delete("/users/:userId/cart",authentication,autherization,deletecart)

router.post("/users/:userId/orders",authentication,autherization,createorder)
router.put("/users/:userId/orders",authentication,autherization,updateorder)


router.all("/*", function (req, res) {
    res.status(404).send({ status: false, message: "Incorrect URL" });
})

module.exports=router

