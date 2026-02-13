const express = require('express')

const router = express.Router()

// middleware between router and api
router.use((req,res,next)=>{
    console.log('This is middleware between router and api')
    next()
})

router.get('/',(req,res)=>{
    res.send('Hello Shivam')
})


module.exports = router;