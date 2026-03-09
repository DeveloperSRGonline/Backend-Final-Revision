const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')


async function authUser(req,res,next){
    // extracting token first
    const {token} = req.cookies;

    // if no token found
    if(!token){
        return res.status(401).json({message: 'Unauthorized'});
    }

    // varifying token
    try {
        // verifying token
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        
        // finding user of that id
        const user = await userModel.findById(decoded.id);

        // finally attaching user to request object
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({message: 'Unauthorized'});
    }
}

module.exports = authUser;