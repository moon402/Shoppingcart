const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')
const mongoose = require('mongoose')
const objectId = mongoose.Types.ObjectId

exports.authentication = function (req, res, next) {
    try {
        let token = req.headers.authorization
        if (!token) return res.status(400).send({ status: false, message: "Token is mandatory" })
        token = token.split(" ")
        jwt.verify(token[1], "project5", (error, decoded) => {
            if (error) return res.status(401).send({ status: false, message: error.message })
            req.id = decoded.userId
            next()
        })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


/***************************************autherization************************************************/

exports.autherization = async function (req, res, next) {
    let userid = req.params.userId
    if (!objectId.isValid(userid)) { return res.status(400).send({ status: false, msg: "please enter valide userid" }) }
    const userexit = await userModel.findById(userid)
    if (!userexit) { return res.status(404).send({ status: false, msg: "userid not found" }) }

    if (userid !== req.id) { return res.status(403).send({ status: false, msg: "unautherized user" }) }

    next()

}