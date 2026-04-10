const ProductModel = require('../models/product.model')

async function createProduct(req,res){
    const {title,image,description,price:{amount,currency}} = req.body;
    
    try {
        const product = await ProductModel.create({
            title,
            image,
            description,
            price:{
                amount,
                currency
            }
        })
        return res.status(200).json({
            message:"Product created successfully",
            product
        })
    } catch (error) {
        return res.status(500).json({
            message:"Internal server error",
            error
        })
    }
}

async function getItem(req,res){
    try {
        const product = await ProductModel.findOne();
        return res.status(200).json({
            message:"Product fetched successfully",
            product
        })
    } catch (error) {
        return res.status(500).json({
            message:"Internal server error",
            error
        })
    }
}

module.exports = {
    createProduct,
    getItem
}
