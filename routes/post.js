const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const path = require('path')
const requireLogin = require('../middleware/requireLogin')
const { route } = require('./auth')
const Post = mongoose.model("Post")
const multer = require('multer')
router.use(express.static(__dirname+"./public/"))

var Storage = multer.diskStorage({
    destination:"./public/uploads/",
    filename:(req,file,cb)=>{
        cb(null,Date.now()+ "_" + file.originalname)  
    }
})

var upload = multer({
    storage:Storage
}).single('image');

router.post('/upload', upload,(req,res,next)=>{
    var success = req.file.filename + " uploaded successfully"
    res.json({success})
})

router.get('/allpost',(req,res)=>{
    Post.find()
    .populate("postedBy","_id name email")
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})


router.post('/createpost',requireLogin,upload ,(req,res)=>{
    const {title,body} = req.body
    if(!title || !body){
        return res.status(422).json({error:"Please add all the fields"})
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        image:req.file.filename,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/myposts',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name email")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})



router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name email")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})
module.exports = router