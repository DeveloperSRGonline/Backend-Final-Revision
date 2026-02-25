const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const authMiddleware = async (req,res,next)=>{
     const {token} = req.cookies;

     if(!token){
        return res.status(401).json({ message: 'Unauthorized access , please login first' });
     }
     try {
         const decoded = jwt.verify(token,process.env.JWT_SECRET)
         const user = await userModel.findOne({_id:decoded.id})
         console.log(user)
         req.user = user;
         next()
     } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
     }
}

module.exports = authMiddleware;